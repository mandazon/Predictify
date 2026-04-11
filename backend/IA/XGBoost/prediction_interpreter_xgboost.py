# ================================================================
# 🔍 INTERPRÉTATEUR DE PRÉDICTIONS XGBoost
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import json
import logging
import pandas as pd
import numpy as np
from pathlib import Path

# === Chapitre 2 : Définition des chemins de fichiers ===
PREDICTIONS_DIR = "xgboost_model/predictions/"
OUTPUT_DIR = "xgboost_model/interpreted/"
LOG_FILE = "prediction_interpreter_xgboost.log"
DATA_DIR = "xgboost_model/tmp_prepared/"  # Dossier pour données supplémentaires (ex. : CSV)

# === Chapitre 3 : Constantes pour validation ===
MAX_PRICE = 50.0  # Prix recommandé maximum
MAX_STOCK = 10.0  # Stock recommandé maximum pour 30 jours

# === Chapitre 4 : Configuration du système de logs ===
def init_logging():
    logging.basicConfig(
        filename=LOG_FILE,
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    logging.info("🎯 Initialisation du système de logs pour l'interprétation")

# === Chapitre 5 : Chargement des données supplémentaires ===
def load_product_metrics(product_name):
    """Charge ou simule des métriques pour le scoring (à remplacer par source réelle)."""
    try:
        # Charger un fichier CSV "product_metrics.csv" avec colonnes :
        # 'product_name', 'sales_growth', 'margin', 'stability', 'ad_cost_ratio'
        metrics_path = os.path.join(DATA_DIR, "product_metrics.csv")
        if os.path.exists(metrics_path):
            metrics_df = pd.read_csv(metrics_path)
            metrics = metrics_df[metrics_df['product_name'] == product_name]
            if not metrics.empty:
                sales_growth = float(metrics['sales_growth'].iloc[0])
                margin = float(metrics['margin'].iloc[0])
                stability = float(metrics['stability'].iloc[0])
                ad_cost_ratio = float(metrics['ad_cost_ratio'].iloc[0])
                logging.info(f"Métriques chargées pour {product_name}: growth={sales_growth}, margin={margin}, stability={stability}, ad_cost={ad_cost_ratio}")
                return sales_growth, margin, stability, ad_cost_ratio
            else:
                logging.warning(f"Aucune métrique trouvée pour {product_name} dans CSV")
        
        # Simulation temporaire si le CSV n'existe pas
        sales_growth = np.random.uniform(0.2, 1.0)
        margin = np.random.uniform(0.3, 0.9)
        stability = np.random.uniform(0.4, 1.0)
        ad_cost_ratio = np.random.uniform(0.0, 0.8)
        logging.info(f"Métriques simulées pour {product_name}: growth={sales_growth}, margin={margin}, stability={stability}, ad_cost={ad_cost_ratio}")
        return sales_growth, margin, stability, ad_cost_ratio
    except Exception as e:
        logging.error(f"Erreur lors du chargement des métriques pour {product_name}: {e}")
        return 0.5, 0.5, 0.5, 0.5  # Valeurs par défaut en cas d'erreur

# === Chapitre 6 : Algorithme de scoring ===
def calculate_score(prediction, sales_growth, margin, stability, ad_cost_ratio):
    """Calcule un score pour un produit basé sur plusieurs critères."""
    try:
        # Poids ajustables pour chaque critère
        w_growth = 0.4  # Croissance des ventes
        w_margin = 0.3  # Marge estimée
        w_stability = 0.2  # Stabilité de la tendance
        w_ad_cost = 0.1  # Ratio coût pub / CA
        
        # Normalisation simple (valeurs supposées entre 0 et 1)
        score = (w_growth * sales_growth + 
                 w_margin * margin + 
                 w_stability * stability + 
                 w_ad_cost * (1 - ad_cost_ratio))  # Inverse pour valoriser faible coût
        return round(score, 3)
    except Exception as e:
        logging.error(f"Erreur lors du calcul du score : {e}")
        return 0.0

# === Chapitre 7 : Interprétation des prédictions ===
def interpret_predictions(file_path):
    """Interprète les prédictions XGBoost pour un produit et agrège les résultats."""
    try:
        # Extraire le nom du produit
        product_name = os.path.basename(file_path).replace('predictions_', '').replace('.json', '')
        logging.info(f"Interprétation des prédictions pour : {product_name}")
        print(f"➡️ Traitement de : {product_name}")

        # Charger le fichier JSON (output de xgboost_predictor.py)
        with open(file_path, 'r', encoding='utf-8') as f:
            predictions = json.load(f)
        
        if not predictions:
            raise ValueError("Fichier de prédictions vide")

        # Charger les métriques pour le scoring
        sales_growth, margin, stability, ad_cost_ratio = load_product_metrics(product_name)

        # Agréger les prédictions pour ce produit
        quantities = []
        stocks = []
        prices = []
        for pred in predictions:
            # Vérifier les clés attendues
            if not all(k in pred for k in ["nom_produit", "quantité_prévue", "stock_recommandé", "prix_ajusté"]):
                logging.warning(f"Clés manquantes dans prédiction pour {product_name}")
                continue
            quantities.append(pred["quantité_prévue"])
            stocks.append(pred["stock_recommandé"])
            prices.append(pred["prix_ajusté"])

        if not quantities:
            logging.warning(f"Aucune donnée valide pour {product_name}")
            return None

        # Calculer des valeurs moyennes
        avg_quantity = np.mean(quantities)
        avg_stock = np.mean(stocks)
        avg_price = np.mean(prices)

        # Vérifier les valeurs brutes avant seuils
        if avg_stock > MAX_STOCK or avg_price > MAX_PRICE:
            logging.warning(f"Valeurs brutes élevées pour {product_name}: prix={avg_price}, stock={avg_stock}")

        # Appliquer des seuils pour éviter des valeurs aberrantes
        avg_stock = min(avg_stock, MAX_STOCK)
        avg_price = min(avg_price, MAX_PRICE)

        # Calculer le score
        score = calculate_score(avg_quantity, sales_growth, margin, stability, ad_cost_ratio)

        # Structurer l'entrée interprétée
        interpreted = {
            "nom_produit": product_name,
            "score_performance": score,
            "prix_recommandé": round(avg_price, 2),
            "stock_recommandé_30j": round(avg_stock, 2),
            "avg_quantity": avg_quantity  # Stocké pour départager en cas d'égalité
        }
        return interpreted

    except Exception as e:
        print(f"❌ Erreur lors de l'interprétation de {file_path} : {e}")
        logging.error(f"Erreur pour {file_path} : {e}")
        return None

# === Chapitre 8 : Sélection des six meilleurs produits ===
def select_top_six_products():
    """Sélectionne les 6 meilleurs produits distincts parmi tous les fichiers de prédictions."""
    try:
        if not os.path.exists(PREDICTIONS_DIR):
            raise FileNotFoundError(f"Dossier introuvable : {PREDICTIONS_DIR}")

        files = [f for f in os.listdir(PREDICTIONS_DIR) if f.startswith("predictions_") and f.endswith(".json")]
        if not files:
            raise ValueError("Aucun fichier de prédictions trouvé")

        all_interpreted = []
        for f in files:
            file_path = os.path.join(PREDICTIONS_DIR, f)
            interpreted = interpret_predictions(file_path)
            if interpreted:
                all_interpreted.append(interpreted)

        # Trier par score, puis par quantité moyenne pour départager en cas d'égalité
        all_interpreted = sorted(
            all_interpreted,
            key=lambda x: (x["score_performance"], x["avg_quantity"]),
            reverse=True
        )
        
        # Sélectionner les 6 meilleurs (diversité garantie par une entrée par produit)
        top_six = all_interpreted[:6]
        
        # Supprimer avg_quantity des résultats finaux
        for product in top_six:
            del product["avg_quantity"]
        
        # Sauvegarder les 6 meilleurs produits
        output_path = os.path.join(OUTPUT_DIR, "top_six_products.json")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(top_six, f, indent=4)
        print(f"🏆 Top 6 produits sauvegardés : {output_path}")
        logging.info(f"Top 6 produits sélectionnés et sauvegardés : {output_path}")

        return top_six

    except Exception as e:
        print(f"❌ Erreur lors de la sélection des top produits : {e}")
        logging.error(f"Erreur lors de la sélection des top produits : {e}")
        return None

# === Chapitre 9 : Point d'entrée du programme ===
def main():
    init_logging()
    print(f"🔍 Interprétation des prédictions depuis {PREDICTIONS_DIR}...")
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        print(f"📁 Dossier créé : {OUTPUT_DIR}")
        logging.info(f"Dossier créé : {OUTPUT_DIR}")

    top_six = select_top_six_products()
    if top_six:
        print("\n📤 Résultat final : Top 6 produits")
        for product in top_six:
            print(f"🏷️ Nom du produit : {product['nom_produit']}")
            print(f"🔢 Score de performance : {product['score_performance']}")
            print(f"💸 Prix recommandé : {product['prix_recommandé']}")
            print(f"📦 Stock recommandé pour les 30 prochains jours : {product['stock_recommandé_30j']} unités")
            print("---")

# === Chapitre 10 : Exécution directe ===
if __name__ == "__main__":
    main()



# Actuel    

# 🌟 Objectif :  
# Analyser les données de vente historiques et les prédictions de vente pour calculer un score de performance, recommander un prix ajusté, estimer le stock nécessaire et identifier les six meilleurs produits à prioriser  

# 📥 Input :  
# - Un DataFrame par produit contenant des colonnes comme "prix_unitaire" et "quantite_vendue"  
# - Une liste de prédictions contenant le nom du produit, les dates et les quantités prévues pour les 30 prochains jours  

# ⚙️ Traitement :  
# - **Score de performance** :  
#   - Calcule la croissance des ventes (comparaison des 30 derniers jours aux 30 premiers) 📈  
#   - Estime une marge brute (30 % du prix unitaire) 💰  
#   - Évalue la stabilité des ventes via l’écart-type sur les 30 derniers jours 📊  
#   - Combine ces critères (croissance × 0.4, marge × 0.3, volatilité × -0.3) pour obtenir un score global 🔢  
# - **Recommandation de prix** :  
#   - Calcule le revenu (prix × quantité) et estime l’élasticité via la corrélation prix-ventes 📉  
#   - Ajuste le prix moyen en fonction de l’élasticité si négative (réduction proportionnelle) 💸  
# - **Recommandation de stock** : Multiplie les ventes prévues par un facteur de sécurité (1.2) pour estimer le stock nécessaire 📦  
# - **Interprétation des prédictions** :  
#   - Pour chaque produit, agrège les ventes prévues, calcule le score de performance, le prix recommandé et le stock conseillé 🧮  
#   - Regroupe ces informations dans un dictionnaire par produit 📋  
# - **Sélection des meilleurs produits** : Trie les produits par score de performance et sélectionne les six premiers pour priorisation 🏆  

# 📤 Output :  
# - Une liste des six meilleurs produits, chaque entrée contenant :  
#   - Nom du produit 🏷️  
#   - Score de performance 🔢  
#   - Prix recommandé 💸  
#   - Stock conseillé 📦  
#   - Ventes prévues sur 30 jours 📈  
# - Pour chaque produit analysé, un dictionnaire avec les mêmes informations détaillées 📋