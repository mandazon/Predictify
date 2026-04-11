# ================================================================
# 📝 EXPLICATEUR DES RÉSULTATS PROPHET
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import pandas as pd
import logging
from pathlib import Path
from datetime import datetime

# === Chapitre 2 : Définition des chemins ===
FORECASTS_DIR = "prophet_model/forecasts/"
OUTPUT_FILE = "prophet_result_explainer.txt"

# === Chapitre 3 : Configuration des logs ===
def init_logging():
    """Configure le système de logs pour enregistrer les étapes."""
    logging.basicConfig(
        filename="prophet_result_explainer.log",
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    logging.info("🎯 Initialisation du système de logs pour l'explicateur")

# === Chapitre 4 : Analyse des prévisions ===
def analyze_forecast(file_path):
    """Analyse un fichier de prévisions CSV et retourne une explication."""
    try:
        # Extraire le nom du produit
        product_name = os.path.basename(file_path).replace('forecast_', '').replace('.csv', '')
        logging.info(f"Analyse des prévisions pour : {product_name}")

        # Lire le fichier CSV
        df = pd.read_csv(file_path)
        if df.empty:
            logging.warning(f"Fichier vide : {file_path}")
            return None

        # Vérifier les colonnes attendues
        required_columns = ['ds', 'yhat', 'yhat_lower', 'yhat_upper']
        if not all(col in df.columns for col in required_columns):
            logging.warning(f"Colonnes manquantes dans {file_path}")
            return None

        # Convertir les dates
        df['ds'] = pd.to_datetime(df['ds'])

        # Séparer les prévisions futures (30 derniers jours)
        future_df = df.tail(30).copy()

        if len(future_df) < 30:
            logging.warning(f"Moins de 30 jours de prévisions pour {product_name}")
            return None

        # Calculer les métriques
        avg_sales = round(future_df['yhat'].mean(), 2)
        total_sales = round(future_df['yhat'].sum(), 2)
        avg_lower = round(future_df['yhat_lower'].mean(), 2)
        avg_upper = round(future_df['yhat_upper'].mean(), 2)
        zero_days = (future_df['yhat'] <= 0).sum()
        low_forecast = avg_sales < 10  # Seuil d'anomalie

        # Stock recommandé (hypothèse : 10% de marge)
        stock_recommended = round(total_sales * 1.1, 2)

        return {
            "product_name": product_name,
            "avg_sales": avg_sales,
            "total_sales": total_sales,
            "avg_lower": avg_lower,
            "avg_upper": avg_upper,
            "stock_recommended": stock_recommended,
            "zero_days": zero_days,
            "low_forecast": low_forecast
        }

    except FileNotFoundError:
        logging.error(f"Fichier introuvable : {file_path}")
        return None
    except Exception as e:
        logging.error(f"Erreur lors de l'analyse de {file_path} : {e}")
        return None

# === Chapitre 5 : Génération de l'explication ===
def generate_explanation():
    """Génère une explication vulgarisée des prévisions."""
    init_logging()
    print("📝 Génération de l'explication des prévisions Prophet...")

    # Vérifier le dossier des prévisions
    if not os.path.exists(FORECASTS_DIR):
        error_msg = f"❌ Dossier introuvable : {FORECASTS_DIR}"
        print(error_msg)
        logging.error(error_msg)
        return

    # Lister les fichiers CSV
    files = [f for f in os.listdir(FORECASTS_DIR) if f.startswith("forecast_") and f.endswith(".csv")]
    if not files:
        error_msg = "⚠️ Aucun fichier de prévisions trouvé."
        print(error_msg)
        logging.warning(error_msg)
        return

    # Analyser les prévisions
    explanations = []
    for f in files:
        file_path = os.path.join(FORECASTS_DIR, f)
        result = analyze_forecast(file_path)
        if result:
            explanations.append(result)

    if not explanations:
        error_msg = "❌ Aucune prévision valide trouvée."
        print(error_msg)
        logging.error(error_msg)
        return

    # Générer le texte d'explication
    output_lines = []
    output_lines.append("==============================================================")
    output_lines.append(f"📊 PRÉVISIONS DE VENTES POUR VOTRE BOUTIQUE")
    output_lines.append(f"Date : {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    output_lines.append("==============================================================")
    output_lines.append("\nBonjour,")
    output_lines.append("Ce rapport vous explique combien d’unités de chaque produit vous pourriez vendre dans les 30 prochains jours, selon nos prévisions intelligentes.")
    output_lines.append("\n### Que signifient ces prévisions ?")
    output_lines.append("- **Ventes prévues** : Le nombre d’unités que vous devriez vendre en moyenne chaque jour.")
    output_lines.append("- **Fourchette possible** : Une estimation basse et haute pour tenir compte des incertitudes.")
    output_lines.append("- **Stock recommandé** : La quantité à commander pour couvrir les ventes des 30 prochains jours, avec une petite marge.")
    output_lines.append("- **Alertes** : Si un produit risque de ne pas se vendre ou a des ventes très faibles, nous vous avertissons.")
    output_lines.append("\n### Vos produits analysés")
    output_lines.append("Voici nos recommandations pour chaque produit :\n")

    for exp in explanations:
        product_name = exp["product_name"]
        avg_sales = exp["avg_sales"]
        total_sales = exp["total_sales"]
        avg_lower = exp["avg_lower"]
        avg_upper = exp["avg_upper"]
        stock_recommended = exp["stock_recommended"]
        zero_days = exp["zero_days"]
        low_forecast = exp["low_forecast"]

        output_lines.append(f"**Produit : {product_name}**")
        output_lines.append(f"- Ventes prévues par jour : environ {avg_sales} unités")
        output_lines.append(f"- Fourchette possible : entre {avg_lower} et {avg_upper} unités par jour")
        output_lines.append(f"- Total prévu sur 30 jours : environ {total_sales} unités")
        output_lines.append(f"- Stock recommandé : {stock_recommended} unités")
        output_lines.append(f"  Commandez {int(stock_recommended)} unités pour éviter les ruptures de stock.")  # Correction ici

        # Ajouter des alertes si détectées
        if zero_days > 5:
            output_lines.append(f"  [⚠️ Attention] Ce produit pourrait ne pas se vendre pendant {zero_days} jours. Vérifiez vos stocks et promotions.")
        if low_forecast:
            output_lines.append(f"  [⚠️ Note] Les ventes prévues sont faibles. Un graphique a été sauvegardé pour ce produit (voir plots/). Surveillez ses performances.")
        output_lines.append("---")

    output_lines.append("\n### Que faire maintenant ?")
    output_lines.append("1. Commandez les quantités recommandées pour chaque produit.")
    output_lines.append("2. Surveillez les produits avec des alertes (ventes nulles ou faibles).")
    output_lines.append("3. Comparez ces prévisions avec vos ventes réelles et contactez-nous si elles diffèrent beaucoup.")
    output_lines.append("\n### Note sur les prévisions")
    output_lines.append("Ces prévisions sont basées sur vos données de ventes passées, analysées par un modèle intelligent. Elles tiennent compte des tendances saisonnières (ex. : Noël, promotions). Les fourchettes basses et hautes montrent les variations possibles.")
    output_lines.append("\nMerci d'utiliser Predictify ! Pour toute question, contactez notre équipe.")
    output_lines.append("==============================================================")

    # Afficher dans la console
    for line in output_lines:
        print(line)

    # Sauvegarder dans un fichier texte
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))
    print(f"\n💾 Explication sauvegardée dans : {OUTPUT_FILE}")
    logging.info(f"Explication sauvegardée dans : {OUTPUT_FILE}")

# === Chapitre 6 : Exécution directe ===
if __name__ == "__main__":
    generate_explanation()

# =============================================================================
# 🌟 Objectif :
# Expliquer les prévisions générées par prophet_predictor.py de manière simple et claire
# pour un utilisateur non technique, comme un gérant de boutique dropshipping.

# 📥 Input :
# Fichiers CSV dans "prophet_model/forecasts/" (ex. : forecast_Aloe_Berry_Nectar.csv)
# contenant les prévisions pour chaque produit.

# ⚙️ Traitement :
# - Liste les fichiers CSV de prévisions.
# - Analyse chaque fichier pour calculer les moyennes et totaux des ventes prévues.
# - Vérifie les anomalies (jours sans ventes, prévisions faibles).
# - Génère une explication texte vulgarisée avec :
#   - Introduction expliquant les termes (ventes prévues, fourchette, stock).
#   - Recommandations par produit avec conseils pratiques et alertes.
#   - Note sur la fiabilité et les anomalies.
#   - Résumé des actions à entreprendre.
# - Sauvegarde l’explication dans un fichier texte (prophet_result_explainer.txt).

# 📤 Output :
# - Texte affiché dans la console, clair et accessible.
# - Fichier texte (prophet_result_explainer.txt) contenant l’explication.
# - Logs dans prophet_result_explainer.log pour le suivi.

# 🔧 Gestion des erreurs :
# - Vérifie l’existence des dossiers et fichiers.
# - Gère les fichiers CSV vides ou mal formatés.
# - Continue le traitement en cas d’erreur sur un fichier.
# =============================================================================