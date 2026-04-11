# ================================================================
# 📊 INTERPRÉTEUR DES PRÉDICTIONS COMBINÉES
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import json
import pandas as pd
from pathlib import Path
import logging

# Configuration des logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# === Chapitre 2 : Définition des chemins et données fixes ===
COMBINED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "hybrid", "combined_predictions")

# Grille de prix recommandés fixes pour la version MVP
pricing_recommande = {
    "Forever Aloe Vera Gel": 39.58,
    "Forever Arctic Sea": 45.83,
    "Forever Clean9": 183.33,
    "Forever Active Pro-B": 43.33,
    "Forever Argi+": 84.38,
    "Forever Bee Honey": 27.08,
    "Forever Freedom": 115.38,
    "Aloe Berry Nectar": 91.35,
    "Forever Bright Toothgel": 31.25,
    "Forever Aloe Lips": 14.42,
    "Aloe Vera Gelly": 62.50,
    "Forever Therm": 105.77,
}
# ⚠️ Ces prix sont définis manuellement pour cette version MVP. Ils seront mis à jour dynamiquement dans la version 2.

# === Chapitre 3 : Fonctions utilitaires ===
def normalize_product_name(name):
    """Normalise les noms de produits en remplaçant les underscores par des espaces."""
    return name.replace("_", " ")

def interpret_product_predictions(product_name, predictions):
    """Interprète les prédictions pour un produit sur 30 jours."""
    try:
        # Convertir en DataFrame
        df = pd.DataFrame(predictions)
        
        # Vérifier les colonnes nécessaires
        required_columns = ['ds', 'combined_quantity', 'prix_ajusté']
        if not all(col in df.columns for col in required_columns):
            logger.warning(f"Colonnes manquantes pour {product_name}. Colonnes trouvées : {list(df.columns)}")
            return None
        
        # Extraire les 30 premiers jours
        df_30_days = df.head(30)
        if len(df_30_days) < 30:
            logger.warning(f"Moins de 30 jours de données pour {product_name} ({len(df_30_days)} jours).")
        
        # Calculer le stock recommandé total
        stock_recommande = df_30_days['combined_quantity'].sum()
        
        # Déterminer le prix
        normalized_name = normalize_product_name(product_name)
        if normalized_name in pricing_recommande:
            prix = pricing_recommande[normalized_name]
            logger.info(f"Prix fixe utilisé pour {normalized_name} : {prix}€")
        else:
            prix = df_30_days['prix_ajusté'].mean()
            logger.info(f"Prix moyen calculé pour {product_name} : {prix:.2f}€")
        
        return {
            "nom_produit": normalized_name,
            "prix": round(prix, 2),
            "stock_recommande": round(stock_recommande, 2)
        }
    
    except Exception as e:
        logger.error(f"Erreur lors de l'interprétation pour {product_name} : {e}")
        return None

# === Chapitre 4 : Fonction pour exporter les résultats ===
def export_to_json():
    """Interprète les prédictions combinées et exporte les résultats dans final_result_1.0.json."""
    try:
        input_file = os.path.join(COMBINED_DIR, "combined_summary.json")
        output_file = os.path.join(COMBINED_DIR, "final_result_1.0.json")
        
        # Vérifier l'existence du répertoire et du fichier d'entrée
        if not os.path.exists(COMBINED_DIR):
            logger.error(f"❌ Erreur : Le dossier {COMBINED_DIR} n'existe pas.")
            return False
        
        if not os.path.exists(input_file):
            logger.error(f"❌ Erreur : Le fichier {input_file} n'existe pas.")
            return False
        
        # Lire le fichier combined_summary.json
        with open(input_file, 'r', encoding='utf-8') as f:
            combined_data = json.load(f)
        
        if not combined_data:
            logger.warning(f"⚠️ Le fichier {input_file} est vide.")
            return False
        
        # Interpréter les prédictions pour chaque produit
        results = {}
        for product_name, predictions in combined_data.items():
            if not predictions:
                logger.warning(f"⚠️ Aucune donnée pour {product_name}.")
                continue
            
            result = interpret_product_predictions(product_name, predictions)
            if result:
                results[product_name] = result
                logger.info(f"✅ Résultat généré pour {product_name}")
        
        if not results:
            logger.warning("⚠️ Aucun résultat valide à exporter.")
            return False
        
        # Exporter vers final_result_1.0.json
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=4, ensure_ascii=False)
        logger.info(f"✅ Fichier JSON généré : {output_file}")
        return True
    
    except json.JSONDecodeError:
        logger.error(f"❌ Erreur : Le fichier {input_file} n'est pas un JSON valide.")
        return False
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'exportation : {e}")
        return False

# === Chapitre 5 : Point d'entrée du programme ===
def main():
    """Point d'entrée principal pour interpréter les prédictions combinées."""
    logger.info(f"🔍 Interprétation des prédictions combinées depuis {COMBINED_DIR}...")
    success = export_to_json()
    if success:
        logger.info("📤 Interprétation terminée avec succès.")
    else:
        logger.error("📤 Échec de l'interprétation.")

# === Chapitre 6 : Exécution directe ===
if __name__ == "__main__":
    main()

# ================================================================
# 🌟 Objectif :
# Interpréter les prédictions combinées générées par combine_read.py pour fournir des recommandations de stock et de prix sur 30 jours.

# 📥 Input :
# Fichier JSON combined_summary.json dans "hybrid/combined_predictions/" contenant les prédictions combinées pour chaque produit.

# 📖 Traitement :
# - Lit le fichier combined_summary.json.
# - Pour chaque produit :
#   - Extrait les prévisions sur 30 jours.
#   - Calcule le stock recommandé total (somme des combined_quantity).
#   - Associe un prix (prix fixe de pricing_recommande si disponible, sinon moyenne des prix_ajusté).
# - Gère les erreurs (fichier manquant, données invalides) et continue le traitement.
# - Exporte les résultats dans final_result_1.0.json.

# 📤 Output :
# - Fichier JSON final_result_1.0.json dans "hybrid/combined_predictions/" contenant pour chaque produit :
#   - Nom du produit
#   - Prix (fixe ou moyen)
#   - Stock recommandé (somme sur 30 jours)
# - Messages de log pour chaque étape.

# 🔧 Gestion des erreurs :
# - Vérifie l’existence du dossier et du fichier d’entrée.
# - Gère les fichiers JSON vides ou mal formatés.
# - Continue le traitement en cas d’erreur sur un produit.

# 🗂️ Chemin :
# - Fichiers lus et générés dans :
#   C:\Users\TOSHIBA\Desktop\Predictify\3-Backend\1-Python\predictify\IA\hybrid\combined_predictions
# ================================================================