# ================================================================
# 📖 LECTEUR DES PRÉDICTIONS PROPHET
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import pandas as pd
import json
from pathlib import Path

# === Chapitre 2 : Définition des chemins ===
FORECASTS_DIR = "prophet_model/forecasts/"

# === Chapitre 3 : Fonction pour lire et afficher un fichier CSV ===
def read_and_display_csv(file_path):
    """Lit un fichier CSV de prévisions et affiche son contenu brut."""
    try:
        # Extraire le nom du produit
        product_name = os.path.basename(file_path).replace('forecast_', '').replace('.csv', '').replace('_', ' ')
        print(f"\n📊 Prédictions pour : {product_name}")
        print("-" * 50)

        # Lire le fichier CSV
        df = pd.read_csv(file_path)

        if df.empty:
            print(f"⚠️ Le fichier {file_path} est vide.")
            return False

        # Vérifier les colonnes attendues
        required_columns = ['ds', 'yhat', 'yhat_lower', 'yhat_upper']
        if not all(col in df.columns for col in required_columns):
            print(f"⚠️ Colonnes manquantes dans {file_path}. Colonnes trouvées : {list(df.columns)}")
            return False

        # Afficher les premières et dernières lignes pour un aperçu
        print(f"Total : {len(df)} lignes de prévisions")
        print("\nAperçu des premières prévisions :")
        for i, row in df.head(5).iterrows():
            print(f"Date : {row['ds']}")
            print(f"  Quantité prévue : {row['yhat']:.2f}")
            print(f"  Fourchette : [{row['yhat_lower']:.2f}, {row['yhat_upper']:.2f}]")
            print("")
        
        print("\nAperçu des dernières prévisions (30 jours futurs) :")
        for i, row in df.tail(5).iterrows():
            print(f"Date : {row['ds']}")
            print(f"  Quantité prévue : {row['yhat']:.2f}")
            print(f"  Fourchette : [{row['yhat_lower']:.2f}, {row['yhat_upper']:.2f}]")
            print("")

        print(f"✅ {len(df)} prédiction(s) affichée(s) pour {product_name}")
        return True

    except FileNotFoundError:
        print(f"❌ Erreur : Le fichier {file_path} n'existe pas.")
        return False
    except pd.errors.EmptyDataError:
        print(f"❌ Erreur : Le fichier {file_path} est vide ou mal formaté.")
        return False
    except Exception as e:
        print(f"❌ Erreur lors de la lecture de {file_path} : {e}")
        return False

# === Chapitre 3.5 : Fonction pour générer un CSV récapitulatif ===
def generate_summary_csv(csv_files):
    """Génère un fichier CSV récapitulatif des prévisions lues."""
    summary_data = []
    
    for csv_file in csv_files:
        file_path = os.path.join(FORECASTS_DIR, csv_file)
        try:
            # Extraire le nom du produit
            product_name = os.path.basename(file_path).replace('forecast_', '').replace('.csv', '').replace('_', ' ')
            
            # Lire le fichier CSV
            df = pd.read_csv(file_path)
            
            if df.empty or not all(col in df.columns for col in ['ds', 'yhat', 'yhat_lower', 'yhat_upper']):
                continue
                
            # Extraire les informations clés
            total_predictions = len(df)
            first_date = df['ds'].iloc[0]
            first_yhat = df['yhat'].iloc[0]
            last_date = df['ds'].iloc[-1]
            last_yhat = df['yhat'].iloc[-1]
            
            # Ajouter au récapitulatif
            summary_data.append({
                'product_name': product_name,
                'total_predictions': total_predictions,
                'first_date': first_date,
                'first_yhat': first_yhat,
                'last_date': last_date,
                'last_yhat': last_yhat
            })
            
        except Exception as e:
            print(f"⚠️ Erreur lors du traitement de {file_path} pour le récapitulatif : {e}")
            continue
    
    if not summary_data:
        print("⚠️ Aucun fichier valide pour générer le récapitulatif.")
        return False
    
    # Créer un DataFrame pour le récapitulatif
    summary_df = pd.DataFrame(summary_data)
    
    # Définir le chemin du fichier récapitulatif
    summary_file = os.path.join(FORECASTS_DIR, 'prophet_forecasts_summary.csv')
    
    # Ajouter un titre comme commentaire dans le fichier
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("# Récapitulatif des prévisions Prophet\n")
    
    # Sauvegarder le récapitulatif en CSV
    summary_df.to_csv(summary_file, mode='a', index=False, encoding='utf-8')
    print(f"✅ Fichier récapitulatif généré : {summary_file}")
    return True

# === Chapitre 3.6 : Fonction pour générer un JSON des prévisions brutes ===
def generate_prophet_summary_json(csv_files):
    """Génère un fichier JSON contenant les prévisions brutes de tous les fichiers CSV."""
    all_predictions = {}
    
    for csv_file in csv_files:
        file_path = os.path.join(FORECASTS_DIR, csv_file)
        try:
            # Extraire le nom du produit
            product_name = os.path.basename(file_path).replace('forecast_', '').replace('.csv', '').replace('_', ' ')
            
            # Lire le fichier CSV
            df = pd.read_csv(file_path)
            
            if df.empty or not all(col in df.columns for col in ['ds', 'yhat', 'yhat_lower', 'yhat_upper']):
                print(f"⚠️ Fichier {file_path} ignoré : vide ou colonnes manquantes.")
                continue
                
            # Convertir le DataFrame en liste de dictionnaires
            predictions = df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_dict(orient='records')
            
            # Ajouter au dictionnaire global
            all_predictions[product_name] = predictions
            
        except Exception as e:
            print(f"⚠️ Erreur lors du traitement de {file_path} pour le JSON : {e}")
            continue
    
    if not all_predictions:
        print("⚠️ Aucune donnée valide pour générer Prophet_summary.json.")
        return False
    
    # Définir le chemin du fichier JSON
    json_file = os.path.join(FORECASTS_DIR, 'Prophet_summary.json')
    
    # Sauvegarder les données brutes en JSON
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(all_predictions, f, indent=4, ensure_ascii=False)
    print(f"✅ Fichier JSON généré : {json_file}")
    return True

# === Chapitre 4 : Point d'entrée du programme ===
def main():
    """Lit et affiche tous les fichiers CSV de prévisions."""
    print(f"🔍 Lecture des prévisions depuis {FORECASTS_DIR}...")

    # Vérifier si le dossier existe
    if not os.path.exists(FORECASTS_DIR):
        print(f"❌ Erreur : Le dossier {FORECASTS_DIR} n'existe pas.")
        return

    # Lister les fichiers CSV
    csv_files = [f for f in os.listdir(FORECASTS_DIR) if f.startswith("forecast_") and f.endswith(".csv")]
    if not csv_files:
        print(f"⚠️ Aucun fichier CSV de prévisions trouvé dans {FORECASTS_DIR}.")
        return

    print(f"📂 Fichiers détectés : {csv_files}")

    # Lire et afficher chaque CSV
    success_count = 0
    for csv_file in csv_files:
        file_path = os.path.join(FORECASTS_DIR, csv_file)
        if read_and_display_csv(file_path):
            success_count += 1

    # Générer le fichier récapitulatif CSV
    generate_summary_csv(csv_files)
    
    # Générer le fichier JSON des prévisions brutes
    generate_prophet_summary_json(csv_files)

    # Résumé
    print(f"\n📤 Résultat : {success_count} fichier(s) lu(s) avec succès sur {len(csv_files)}.")

# === Chapitre 5 : Exécution directe ===
if __name__ == "__main__":
    main()

# ================================================================
# 🌟 Objectif :
# Lire et afficher les prévisions brutes générées par prophet_predictor.py sans les modifier ou analyser.
# Enregistrer les prévisions brutes dans un fichier JSON nommé Prophet_summary.json.

# 📥 Input :
# Fichiers CSV dans "prophet_model/forecasts/" (ex. : forecast_Aloe_Berry_Nectar.csv) contenant les prévisions pour chaque produit.

# 📖 Traitement :
# - Liste les fichiers CSV dans le dossier.
# - Lit chaque fichier et affiche son contenu brut (date, quantité prévue, fourchette de confiance).
# - Affiche un aperçu des premières et dernières lignes pour chaque produit.
# - Gère les erreurs (fichier manquant, CSV invalide) et continue le traitement.
# - Génère un fichier CSV récapitulatif (prophet_forecasts_summary.csv).
# - Génère un fichier JSON (Prophet_summary.json) contenant les données brutes de tous les fichiers CSV.
# - Fournit un résumé du nombre de fichiers lus.

# 📤 Output :
# - Affichage console du contenu brut de chaque fichier CSV, organisé par produit.
# - Fichier CSV récapitulatif : prophet_model/forecasts/prophet_forecasts_summary.csv
# - Fichier JSON des données brutes : prophet_model/forecasts/Prophet_summary.json
# - Messages d’erreur en cas de problème avec un fichier.

# 🔧 Gestion des erreurs :
# - Vérifie l’existence du dossier et des fichiers.
# - Gère les fichiers CSV vides ou mal formatés.
# - Continue le traitement en cas d’erreur sur un fichier.

# 🗂️ Chemin de sauvegarde :
# - Fichiers CSV et JSON sauvegardés dans :
#   C:\Users\TOSHIBA\Desktop\Predictify\3-Backend\1-Python\predictify\IA\Prophet\prophet_model\forecasts
# ================================================================