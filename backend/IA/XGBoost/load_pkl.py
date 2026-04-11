# ================================================================
# ✅ Script : load_pkl.py
# Charge et affiche les données préparées pour l'entraînement du modèle
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import joblib
import pandas as pd
import numpy as np
from pathlib import Path

# === Chapitre 2 : Définition des chemins ===
DATA_DIR = "xgboost_model/tmp_prepared/"  # Dossier contenant les fichiers .pkl

# === Chapitre 3 : Fonction pour charger et afficher un fichier .pkl ===
def load_and_display_pkl(file_path):
    """Charge un fichier .pkl et affiche un aperçu des données X et y."""
    try:
        # Charger le fichier .pkl
        data = joblib.load(file_path)

        # Vérifier que data est un dictionnaire
        if not isinstance(data, dict):
            raise ValueError("Le fichier .pkl doit contenir un dictionnaire avec les clés 'X' et 'y'.")

        # Extraire X et y
        X = data.get("X")
        y = data.get("y")

        # Vérifier que X est un DataFrame et y est une Series ou array
        if not isinstance(X, pd.DataFrame):
            raise ValueError("X doit être un pandas.DataFrame.")
        if not isinstance(y, (pd.Series, np.ndarray)):
            raise ValueError("y doit être un pandas.Series ou numpy.ndarray.")

        # Afficher les données
        product_name = os.path.basename(file_path).replace('_xy.pkl', '')
        print(f"\n📊 Données pour : {product_name}")
        print("Features (X):")
        print(X.head())  # Affiche les 5 premières lignes de X
        print("\nQuantité vendue (y):")
        print(y[:5])  # Affiche les 5 premières valeurs de y
        print("-" * 50)

        return True

    except FileNotFoundError:
        print(f"❌ Erreur : Le fichier {file_path} n'existe pas.")
        return False
    except Exception as e:
        print(f"❌ Erreur lors du chargement ou de l'affichage de {file_path} : {e}")
        return False

# === Chapitre 4 : Point d'entrée du programme ===
def main():
    """Charge et affiche tous les fichiers .pkl dans le dossier DATA_DIR."""
    print(f"🔍 Chargement des fichiers .pkl depuis {DATA_DIR}...")

    # Vérifier si le dossier existe
    if not os.path.exists(DATA_DIR):
        print(f"❌ Erreur : Le dossier {DATA_DIR} n'existe pas.")
        return

    # Lister les fichiers .pkl
    pkl_files = [f for f in os.listdir(DATA_DIR) if f.endswith('_xy.pkl')]
    if not pkl_files:
        print(f"❌ Aucun fichier .pkl trouvé dans {DATA_DIR}.")
        return

    # Traiter chaque fichier .pkl
    success_count = 0
    for pkl_file in pkl_files:
        file_path = os.path.join(DATA_DIR, pkl_file)
        if load_and_display_pkl(file_path):
            success_count += 1

    # Résumé
    print(f"\n📤 Résultat : {success_count} fichier(s) .pkl chargé(s) avec succès sur {len(pkl_files)}.")

# === Chapitre 5 : Exécution directe ===
if __name__ == "__main__":
    main()








# ============================================================
# ✅ Script : load_pkl.py
# Charge et affiche les données préparées pour l'entraînement du modèle
# ============================================================
# 🎯 OBJECTIF PRINCIPAL :
# Ce script charge un fichier .pkl contenant les données préparées pour l'entraînement
# d'un modèle XGBoost (features X et cible y), puis affiche un aperçu de ces données
# pour vérification.
#
# 📥 INPUT :
# - Un fichier sérialisé (.pkl) contenant un dictionnaire avec les clés 'X' (features)
#   et 'y' (cible, quantité vendue).
#
# ⚙️ TRAITEMENT :
# 1. **file_path** : Chemin du fichier .pkl à charger.
# 2. **joblib.load(file_path)** : Charge le dictionnaire sérialisé.
# 3. Extraction des clés 'X' et 'y' du dictionnaire.
# 4. Vérifications :
#    - Le fichier contient un dictionnaire.
#    - X est un pandas.DataFrame.
#    - y est un pandas.Series ou numpy.ndarray.
# 5. **print(X.head())** : Affiche les 5 premières lignes de X.
# 6. **print(y[:5])** : Affiche les 5 premières valeurs de y.
#
# 📤 OUTPUT :
# - Affichage dans la console des premières lignes de X et des premières valeurs de y.
#
# ❗️ ERREUR :
# - Gestion des erreurs pour fichier manquant, format incorrect, ou autres exceptions.
#
# 📝 Détails des éléments du script :
# - **file_path** : Chemin du fichier .pkl.
# - **data** : Dictionnaire chargé contenant X et y.
# - **X** : Features (pandas.DataFrame) pour l'entraînement.
# - **y** : Cible (pandas.Series ou numpy.ndarray) représentant la quantité vendue.
# - **joblib.load()** : Charge le fichier .pkl.
# - **print()** : Affiche un aperçu des données.