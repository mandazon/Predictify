# ================================================================
# 📖 LECTEUR DES PRÉDICTIONS XGBoost
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import json
from pathlib import Path

# === Chapitre 2 : Définition des chemins ===
PREDICTIONS_DIR = "xgboost_model/predictions/"

# === Chapitre 3 : Fonction pour lire et afficher un fichier JSON ===
def read_and_display_json(file_path):
    """Lit un fichier JSON de prédictions et affiche son contenu brut."""
    try:
        # Extraire le nom du produit
        product_name = os.path.basename(file_path).replace('predictions_', '').replace('.json', '')
        print(f"\n📊 Prédictions pour : {product_name}")
        print("-" * 50)

        # Lire le fichier JSON
        with open(file_path, 'r', encoding='utf-8') as f:
            predictions = json.load(f)

        if not predictions:
            print(f"⚠️ Le fichier {file_path} est vide.")
            return False

        # Afficher les prédictions brutes
        for i, pred in enumerate(predictions, 1):
            print(f"Prédiction {i}:")
            for key, value in pred.items():
                print(f"  {key}: {value}")
            print("")

        print(f"✅ {len(predictions)} prédiction(s) affichée(s) pour {product_name}")
        return True

    except FileNotFoundError:
        print(f"❌ Erreur : Le fichier {file_path} n'existe pas.")
        return False
    except json.JSONDecodeError:
        print(f"❌ Erreur : Le fichier {file_path} n'est pas un JSON valide.")
        return False
    except Exception as e:
        print(f"❌ Erreur lors de la lecture de {file_path} : {e}")
        return False

# === Chapitre 3.5 : Fonction pour générer un JSON des prévisions brutes ===
def generate_xgboost_summary_json(json_files):
    """Génère un fichier JSON contenant les prévisions brutes de tous les fichiers JSON."""
    all_predictions = {}
    
    for json_file in json_files:
        file_path = os.path.join(PREDICTIONS_DIR, json_file)
        try:
            # Extraire le nom du produit
            product_name = os.path.basename(file_path).replace('predictions_', '').replace('.json', '')
            
            # Lire le fichier JSON
            with open(file_path, 'r', encoding='utf-8') as f:
                predictions = json.load(f)
            
            if not predictions:
                print(f"⚠️ Fichier {file_path} ignoré : vide.")
                continue
                
            # Vérifier que les clés attendues sont présentes
            required_keys = ['nom_produit', 'quantité_prévue', 'stock_recommandé', 'prix_ajusté']
            if not all(all(key in pred for key in required_keys) for pred in predictions):
                print(f"⚠️ Fichier {file_path} ignoré : clés manquantes.")
                continue
                
            # Ajouter les prédictions brutes au dictionnaire global
            all_predictions[product_name] = predictions
            
        except Exception as e:
            print(f"⚠️ Erreur lors du traitement de {file_path} pour le JSON : {e}")
            continue
    
    if not all_predictions:
        print("⚠️ Aucune donnée valide pour générer xgboost_summary.json.")
        return False
    
    # Définir le chemin du fichier JSON
    json_summary_file = os.path.join(PREDICTIONS_DIR, 'xgboost_summary.json')
    
    # Sauvegarder les données brutes en JSON
    with open(json_summary_file, 'w', encoding='utf-8') as f:
        json.dump(all_predictions, f, indent=4, ensure_ascii=False)
    print(f"✅ Fichier JSON généré : {json_summary_file}")
    return True

# === Chapitre 4 : Point d'entrée du programme ===
def main():
    """Lit et affiche tous les fichiers JSON de prédictions."""
    print(f"🔍 Lecture des prédictions depuis {PREDICTIONS_DIR}...")

    # Vérifier si le dossier existe
    if not os.path.exists(PREDICTIONS_DIR):
        print(f"❌ Erreur : Le dossier {PREDICTIONS_DIR} n'existe pas.")
        return

    # Lister les fichiers JSON
    json_files = [f for f in os.listdir(PREDICTIONS_DIR) if f.startswith("predictions_") and f.endswith(".json")]
    if not json_files:
        print(f"⚠️ Aucun fichier JSON de prédictions trouvé dans {PREDICTIONS_DIR}.")
        return

    print(f"📂 Fichiers détectés : {json_files}")

    # Lire et afficher chaque JSON
    success_count = 0
    for json_file in json_files:
        file_path = os.path.join(PREDICTIONS_DIR, json_file)
        if read_and_display_json(file_path):
            success_count += 1

    # Générer le fichier JSON des prévisions brutes
    generate_xgboost_summary_json(json_files)

    # Résumé
    print(f"\n📤 Résultat : {success_count} fichier(s) lu(s) avec succès sur {len(json_files)}.")

# === Chapitre 5 : Exécution directe ===
if __name__ == "__main__":
    main()

# ================================================================
# 🌟 Objectif :
# Lire et afficher les prédictions brutes générées par xgboost_predictor.py sans les modifier ou analyser.
# Enregistrer les prédictions brutes dans un fichier JSON nommé xgboost_summary.json.

# 📥 Input :
# Fichiers JSON dans "xgboost_model/predictions/" (ex. : predictions_Aloe_Berry_Nectar.json) contenant les prédictions pour chaque produit.

# ⚙️ Traitement :
# - Liste les fichiers JSON dans le dossier.
# - Lit chaque fichier et affiche son contenu brut (nom du produit, quantité prévue, stock recommandé, prix ajusté).
# - Gère les erreurs (fichier manquant, JSON invalide) et continue le traitement.
# - Génère un fichier JSON (xgboost_summary.json) contenant les données brutes de tous les fichiers JSON.
# - Fournit un résumé du nombre de fichiers lus.

# 📤 Output :
# - Affichage console du contenu brut de chaque fichier JSON, organisé par produit.
# - Fichier JSON des données brutes : xgboost_model/predictions/xgboost_summary.json
# - Messages d’erreur en cas de problème avec un fichier.

# 🔧 Gestion des erreurs :
# - Vérifie l’existence du dossier et des fichiers.
# - Gère les fichiers JSON vides ou mal formatés.
# - Continue le traitement en cas d’erreur sur un fichier.

# 🗂️ Chemin de sauvegarde :
# - Fichier JSON sauvegardé dans :
#   C:\Users\TOSHIBA\Desktop\Predictify\3-Backend\1-Python\predictify\IA\XGBoost\xgboost_model\predictions
# ================================================================