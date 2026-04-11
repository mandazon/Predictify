# ================================================================
# 📝 EXPLICATEUR DES RÉSULTATS XGBoost
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import json
import logging
import re
from pathlib import Path
from datetime import datetime

# === Chapitre 2 : Définition des chemins ===
PREDICTIONS_DIR = "xgboost_model/predictions/"
LOG_FILE = "xgboost_predictor.log"
OUTPUT_FILE = "xgboost_result_explainer.txt"

# === Chapitre 3 : Configuration des logs ===
def init_logging():
    """Configure le système de logs pour enregistrer les étapes."""
    logging.basicConfig(
        filename="xgboost_result_explainer.log",
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    logging.info("🎯 Initialisation du système de logs pour l'explicateur")

# === Chapitre 4 : Extraction des métriques depuis le log ===
def extract_metrics_from_log():
    """Extrait les métriques RMSE et R² depuis xgboost_predictor.log."""
    metrics = {}
    try:
        if not os.path.exists(LOG_FILE):
            logging.warning(f"Fichier de log {LOG_FILE} introuvable.")
            return metrics

        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            log_content = f.readlines()

        for line in log_content:
            # Recherche des lignes contenant RMSE et R²
            match = re.search(r"Évaluation pour (.+?) - RMSE: ([\d.]+), R²: ([\d.]+)", line)
            if match:
                product_name = match.group(1).strip()
                rmse = float(match.group(2))
                r2 = float(match.group(3))
                metrics[product_name] = {'rmse': rmse, 'r2': r2}
                logging.info(f"Métriques extraites pour {product_name}: RMSE={rmse}, R²={r2}")

        return metrics
    except Exception as e:
        logging.error(f"Erreur lors de l'extraction des métriques : {e}")
        return metrics

# === Chapitre 5 : Analyse des prédictions ===
def analyze_predictions(file_path):
    """Analyse un fichier de prédictions JSON et retourne une explication."""
    try:
        # Extraire le nom du produit
        product_name = os.path.basename(file_path).replace('predictions_', '').replace('.json', '')
        logging.info(f"Analyse des prédictions pour : {product_name}")

        # Charger le fichier JSON
        with open(file_path, 'r', encoding='utf-8') as f:
            predictions = json.load(f)

        if not predictions:
            logging.warning(f"Fichier vide : {file_path}")
            return None

        # Agréger les données
        quantities = []
        prices = []
        stocks = []
        for pred in predictions:
            if not all(k in pred for k in ["nom_produit", "quantité_prévue", "stock_recommandé", "prix_ajusté"]):
                logging.warning(f"Clés manquantes dans prédiction pour {product_name}")
                continue
            quantities.append(pred["quantité_prévue"])
            prices.append(pred["prix_ajusté"])
            stocks.append(pred["stock_recommandé"])

        if not quantities:
            logging.warning(f"Aucune donnée valide pour {product_name}")
            return None

        # Calculer les moyennes
        avg_quantity = round(sum(quantities) / len(quantities), 2)
        avg_price = round(sum(prices) / len(prices), 2)
        avg_stock = round(sum(stocks) / len(stocks), 2)

        return {
            "product_name": product_name,
            "avg_quantity": avg_quantity,
            "avg_price": avg_price,
            "avg_stock": avg_stock
        }

    except Exception as e:
        logging.error(f"Erreur lors de l'analyse de {file_path} : {e}")
        return None

# === Chapitre 6 : Génération de l'explication ===
def generate_explanation():
    """Génère une explication vulgarisée des prédictions."""
    init_logging()
    print("📝 Génération de l'explication des prédictions...")

    # Vérifier le dossier des prédictions
    if not os.path.exists(PREDICTIONS_DIR):
        error_msg = f"❌ Dossier introuvable : {PREDICTIONS_DIR}"
        print(error_msg)
        logging.error(error_msg)
        return

    # Lister les fichiers JSON
    files = [f for f in os.listdir(PREDICTIONS_DIR) if f.startswith("predictions_") and f.endswith(".json")]
    if not files:
        error_msg = "⚠️ Aucun fichier de prédictions trouvé."
        print(error_msg)
        logging.warning(error_msg)
        return

    # Extraire les métriques du log
    metrics = extract_metrics_from_log()

    # Analyser les prédictions
    explanations = []
    for f in files:
        file_path = os.path.join(PREDICTIONS_DIR, f)
        result = analyze_predictions(file_path)
        if result:
            explanations.append(result)

    if not explanations:
        error_msg = "❌ Aucune prédiction valide trouvée."
        print(error_msg)
        logging.error(error_msg)
        return

    # Générer le texte d'explication
    output_lines = []
    output_lines.append("==============================================================")
    output_lines.append(f"📊 EXPLICATION DES PRÉDICTIONS POUR VOTRE BOUTIQUE")
    output_lines.append(f"Date : {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    output_lines.append("==============================================================")
    output_lines.append("\nBonjour,")
    output_lines.append("Ce rapport vous explique les recommandations de vente pour vos produits, basées sur une analyse intelligente des données passées.")
    output_lines.append("\n### Que signifient ces recommandations ?")
    output_lines.append("- **Quantité prévue** : Le nombre d'unités que vous pourriez vendre chaque jour, en moyenne.")
    output_lines.append("- **Prix recommandé** : Une suggestion de prix pour chaque unité, calculée pour maximiser vos profits.")
    output_lines.append("- **Stock recommandé** : La quantité à avoir en stock pour les 30 prochains jours, pour éviter les ruptures.")
    output_lines.append("\n### Vos produits analysés")
    output_lines.append("Voici ce que nous recommandons pour chaque produit :\n")

    for exp in explanations:
        product_name = exp["product_name"]
        avg_quantity = exp["avg_quantity"]
        avg_price = exp["avg_price"]
        avg_stock = exp["avg_stock"]

        output_lines.append(f"**Produit : {product_name}**")
        output_lines.append(f"- Quantité prévue par jour : environ {avg_quantity} unités")
        output_lines.append(f"- Prix recommandé : {avg_price} € par unité")
        output_lines.append(f"- Stock pour 30 jours : environ {avg_stock} unités")
        output_lines.append(f"  Conseil : Commandez {int(avg_stock)} unités pour ce produit et fixez son prix autour de {avg_price} € pour optimiser vos ventes.")

        # Ajouter des métriques si disponibles
        if product_name in metrics:
            rmse = metrics[product_name]['rmse']
            r2 = metrics[product_name]['r2']
            reliability = "très fiable" if r2 >= 0.9 else "fiable" if r2 >= 0.7 else "à prendre avec prudence"
            output_lines.append(f"  Fiabilité : Cette prédiction est {reliability} (score technique : {r2*100:.0f}%).")
        output_lines.append("---")

    output_lines.append("\n### Que faire maintenant ?")
    output_lines.append("1. Vérifiez les stocks actuels et commandez les quantités recommandées.")
    output_lines.append("2. Ajustez les prix de vos produits selon nos suggestions.")
    output_lines.append("3. Suivez les ventes réelles et contactez-nous si les chiffres diffèrent beaucoup.")
    output_lines.append("\n### Note sur la fiabilité")
    output_lines.append("Ces recommandations sont basées sur un modèle intelligent qui analyse vos données passées. Plus vos données sont complètes, plus les prédictions sont précises. Si un produit a un score de fiabilité faible, surveillez ses ventes de près.")
    output_lines.append("\nMerci d'utiliser Predictify ! Si vous avez des questions, contactez notre équipe.")
    output_lines.append("==============================================================")

    # Afficher dans la console
    for line in output_lines:
        print(line)

    # Sauvegarder dans un fichier texte
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))
    print(f"\n💾 Explication sauvegardée dans : {OUTPUT_FILE}")
    logging.info(f"Explication sauvegardée dans : {OUTPUT_FILE}")

# === Chapitre 7 : Exécution directe ===
if __name__ == "__main__":
    generate_explanation()

# =============================================================================
# 🌟 Objectif :
# Expliquer les prédictions générées par xgboost_predictor.py de manière simple et claire
# pour un utilisateur non technique, comme un gérant de boutique dropshipping.

# 📥 Input :
# - Fichiers JSON dans "xgboost_model/predictions/" (ex. : predictions_Aloe_Berry_Nectar.json).
# - Fichier de log "xgboost_predictor.log" pour extraire les métriques RMSE et R².

# ⚙️ Traitement :
# - Liste les fichiers JSON de prédictions.
# - Analyse chaque fichier pour calculer les moyennes des quantités, prix et stocks.
# - Extrait les métriques de performance (RMSE, R²) depuis le log.
# - Génère une explication texte vulgarisée avec :
#   - Introduction expliquant les termes (quantité, prix, stock).
#   - Recommandations par produit avec conseils pratiques.
#   - Note sur la fiabilité basée sur R².
#   - Résumé des actions à entreprendre.
# - Sauvegarde l’explanation dans un fichier texte (xgboost_result_explainer.txt).

# 📤 Output :
# - Texte affiché dans la console, clair et accessible.
# - Fichier texte (xgboost_result_explainer.txt) contenant l’explication.
# - Logs dans xgboost_result_explainer.log pour le suivi.

# 🔧 Gestion des erreurs :
# - Vérifie l’existence des dossiers et fichiers.
# - Gère les fichiers JSON vides ou mal formatés.
# - Continue le traitement en cas d’erreur sur un fichier.
# =============================================================================