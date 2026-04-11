# ================================================================
# 📖 LECTEUR DES PRÉDICTIONS COMBINÉES
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import pandas as pd
import json
from pathlib import Path
import logging

# Configuration des logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# === Chapitre 2 : Définition des chemins ===
COMBINED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "hybrid", "combined_predictions")

# === Chapitre 3 : Fonction pour lire et afficher un fichier CSV ===
def read_and_display_csv(file_path):
    """Lit un fichier CSV de prédictions combinées et affiche son contenu brut."""
    try:
        # Extraire le nom du produit
        product_name = os.path.basename(file_path).replace('combined_', '').replace('.csv', '').replace('_', ' ')
        logger.info(f"\n📊 Prédictions combinées pour : {product_name}")
        logger.info("-" * 50)

        # Lire le fichier CSV
        df = pd.read_csv(file_path)

        if df.empty:
            logger.warning(f"⚠️ Le fichier {file_path} est vide.")
            return False

        # Vérifier les colonnes attendues
        required_columns = ['ds', 'yhat', 'yhat_lower', 'yhat_upper', 'quantité_prévue', 'stock_recommandé', 'prix_ajusté', 'combined_quantity']
        if not all(col in df.columns for col in required_columns):
            logger.warning(f"⚠️ Colonnes manquantes dans {file_path}. Colonnes trouvées : {list(df.columns)}")
            return False

        # Afficher les premières et dernières lignes pour un aperçu
        logger.info(f"Total : {len(df)} lignes de prédictions")
        logger.info("\nAperçu des premières prédictions :")
        for i, row in df.head(5).iterrows():
            logger.info(f"Date : {row['ds']}")
            logger.info(f"  Prophet yhat : {row['yhat']:.2f} [{row['yhat_lower']:.2f}, {row['yhat_upper']:.2f}]")
            logger.info(f"  XGBoost quantité prévue : {row['quantité_prévue']:.2f}")
            logger.info(f"  Stock recommandé : {row['stock_recommandé']:.2f}")
            logger.info(f"  Prix ajusté : {row['prix_ajusté']:.2f}")
            logger.info(f"  Quantité combinée : {row['combined_quantity']:.2f}")
            logger.info("")

        logger.info("\nAperçu des dernières prédictions :")
        for i, row in df.tail(5).iterrows():
            logger.info(f"Date : {row['ds']}")
            logger.info(f"  Prophet yhat : {row['yhat']:.2f} [{row['yhat_lower']:.2f}, {row['yhat_upper']:.2f}]")
            logger.info(f"  XGBoost quantité prévue : {row['quantité_prévue']:.2f}")
            logger.info(f"  Stock recommandé : {row['stock_recommandé']:.2f}")
            logger.info(f"  Prix ajusté : {row['prix_ajusté']:.2f}")
            logger.info(f"  Quantité combinée : {row['combined_quantity']:.2f}")
            logger.info("")

        logger.info(f"✅ {len(df)} prédiction(s) affichée(s) pour {product_name}")
        return True

    except FileNotFoundError:
        logger.error(f"❌ Erreur : Le fichier {file_path} n'existe pas.")
        return False
    except pd.errors.EmptyDataError:
        logger.error(f"❌ Erreur : Le fichier {file_path} est vide ou mal formaté.")
        return False
    except Exception as e:
        logger.error(f"❌ Erreur lors de la lecture de {file_path} : {e}")
        return False

# === Chapitre 3.5 : Fonction pour générer un JSON des prédictions combinées ===
def generate_combined_summary_json(csv_files):
    """Génère un fichier JSON contenant les prédictions combinées brutes de tous les fichiers CSV."""
    all_predictions = {}
    
    for csv_file in csv_files:
        file_path = os.path.join(COMBINED_DIR, csv_file)
        try:
            # Extraire le nom du produit
            product_name = os.path.basename(file_path).replace('combined_', '').replace('.csv', '').replace('_', ' ')
            
            # Lire le fichier CSV
            df = pd.read_csv(file_path)
            
            if df.empty:
                logger.warning(f"⚠️ Fichier {file_path} ignoré : vide.")
                continue
                
            # Vérifier les colonnes attendues
            required_columns = ['ds', 'yhat', 'yhat_lower', 'yhat_upper', 'quantité_prévue', 'stock_recommandé', 'prix_ajusté', 'combined_quantity']
            if not all(col in df.columns for col in required_columns):
                logger.warning(f"⚠️ Fichier {file_path} ignoré : colonnes manquantes.")
                continue
                
            # Convertir le DataFrame en liste de dictionnaires
            predictions = df[required_columns].to_dict(orient='records')
            
            # Ajouter au dictionnaire global
            all_predictions[product_name] = predictions
            
        except Exception as e:
            logger.error(f"⚠️ Erreur lors du traitement de {file_path} pour le JSON : {e}")
            continue
    
    if not all_predictions:
        logger.warning("⚠️ Aucune donnée valide pour générer combined_summary.json.")
        return False
    
    # Définir le chemin du fichier JSON
    json_file = os.path.join(COMBINED_DIR, 'combined_summary.json')
    
    # Sauvegarder les données brutes en JSON
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(all_predictions, f, indent=4, ensure_ascii=False)
    logger.info(f"✅ Fichier JSON généré : {json_file}")
    return True

# === Chapitre 4 : Point d'entrée du programme ===
def main():
    """Lit et affiche tous les fichiers CSV de prédictions combinées."""
    logger.info(f"🔍 Lecture des prédictions combinées depuis {COMBINED_DIR}...")

    # Vérifier si le dossier existe
    if not os.path.exists(COMBINED_DIR):
        logger.error(f"❌ Erreur : Le dossier {COMBINED_DIR} n'existe pas.")
        return

    # Lister les fichiers CSV
    csv_files = [f for f in os.listdir(COMBINED_DIR) if f.startswith("combined_") and f.endswith(".csv")]
    if not csv_files:
        logger.warning(f"⚠️ Aucun fichier CSV de prédictions combinées trouvé dans {COMBINED_DIR}.")
        return

    logger.info(f"📂 Fichiers détectés : {csv_files}")

    # Lire et afficher chaque CSV
    success_count = 0
    for csv_file in csv_files:
        file_path = os.path.join(COMBINED_DIR, csv_file)
        if read_and_display_csv(file_path):
            success_count += 1

    # Générer le fichier JSON des prédictions combinées
    generate_combined_summary_json(csv_files)

    # Résumé
    logger.info(f"\n📤 Résultat : {success_count} fichier(s) lu(s) avec succès sur {len(csv_files)}.")

# === Chapitre 5 : Exécution directe ===
if __name__ == "__main__":
    main()

# ================================================================
# 🌟 Objectif :
# Lire et afficher les prédictions combinées générées par combine_predictions.py sans les modifier ou analyser.
# Enregistrer les prédictions brutes dans un fichier JSON nommé combined_summary.json.

# 📥 Input :
# Fichiers CSV dans "hybrid/combined_predictions/" (ex. : combined_Aloe_Berry_Nectar.csv) contenant les prédictions combinées pour chaque produit.

# 📖 Traitement :
# - Liste les fichiers CSV dans le dossier.
# - Lit chaque fichier et affiche son contenu brut (date, yhat, fourchette, quantité prévue, stock recommandé, prix ajusté, quantité combinée).
# - Affiche un aperçu des premières et dernières lignes pour chaque produit.
# - Génère un fichier JSON (combined_summary.json) contenant les données brutes de tous les fichiers CSV.
# - Gère les erreurs (fichier manquant, CSV invalide) et continue le traitement.
# - Fournit un résumé du nombre de fichiers lus.

# 📤 Output :
# - Affichage console du contenu brut de chaque fichier CSV, organisé par produit.
# - Fichier JSON des données brutes : hybrid/combined_predictions/combined_summary.json
# - Messages d’erreur en cas de problème avec un fichier.

# 🔧 Gestion des erreurs :
# - Vérifie l’existence du dossier et des fichiers.
# - Gère les fichiers CSV vides ou mal formatés.
# - Continue le traitement en cas d’erreur sur un fichier.

# 🗂️ Chemin de lecture et sauvegarde :
# - Fichiers CSV lus et JSON sauvegardé dans :
#   C:\Users\TOSHIBA\Desktop\Predictify\3-Backend\1-Python\predictify\IA\hybrid\combined_predictions
# ================================================================