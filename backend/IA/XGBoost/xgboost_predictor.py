# ================================================================
# 🔧 PREDICTEUR DE VENTES AVEC XGBOOST
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import json
import logging
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
from pathlib import Path

# === Chapitre 2 : Définition des chemins de fichiers ===
TMP_SALES_DIR = "xgboost_model/tmp_prepared/"
PREDICTIONS_DIR = "xgboost_model/predictions/"
LOG_FILE = "xgboost_predictor.log"

# === Chapitre 3 : Paramètres du modèle XGBoost ===
PARAMS = {
    'objective': 'reg:squarederror',
    'eval_metric': 'rmse',
    'max_depth': 6,
    'learning_rate': 0.1,
    'n_estimators': 100,
    'colsample_bytree': 0.8,
    'subsample': 0.8,
    'random_state': 42  # Pour reproductibilité
}

# Multiplicateurs pour prix et stock (ajustés pour dropshipping)
PRICE_MULTIPLIER = 5.0  # Réduit de x10 à x5
STOCK_MULTIPLIER = 1.1  # Réduit de x1.2 à x1.1

# === Chapitre 4 : Configuration du système de logs ===
def init_logging():
    logging.basicConfig(
        filename=LOG_FILE,
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    logging.info("🎯 Initialisation du système de logs")
    logging.info("✅ Le fichier de log a été configuré avec succès")

# === Chapitre 5 : Préparation des données ===
def prepare_data_for_xgboost(X, y):
    """Prépare les données pour XGBoost en vérifiant les types et en convertissant les formats."""
    try:
        # Vérification des colonnes numériques
        if not all(np.issubdtype(dtype, np.number) for dtype in X.dtypes):
            logging.error("X contient des colonnes non numériques.")
            raise ValueError("X contient des colonnes non numériques.")

        # Conversion en format compatible avec XGBoost
        X = X.values
        y = y.values.flatten() if isinstance(y, (pd.DataFrame, pd.Series)) else y

        return X, y
    except Exception as e:
        logging.error(f"Erreur lors de la préparation des données : {e}")
        raise

# === Chapitre 6 : Entraînement et prédiction ===
def train_and_predict(file_path):
    """Entraîne un modèle XGBoost et génère des prédictions à partir d'un fichier .pkl."""
    try:
        # Extraire le nom du produit
        product_name = os.path.basename(file_path).replace('_xy.pkl', '')
        print(f"🚀 Traitement de : {file_path}")
        print(f"➡️ Traitement de : {product_name}")
        logging.info(f"Chargement des données depuis {file_path}")

        # Charger les données
        data = joblib.load(file_path)
        required_keys = ['X', 'y']
        if not isinstance(data, dict) or not all(k in data for k in required_keys):
            raise ValueError(f"Fichier invalide : clés manquantes. Attendu : {required_keys}")

        X, y = data['X'], data['y']

        # Valider les données
        if not isinstance(X, pd.DataFrame) or X.empty:
            raise ValueError("'X' est vide ou non valide.")
        if not isinstance(y, (pd.Series, np.ndarray)) or len(y) == 0:
            raise ValueError("'y' est vide ou non valide.")

        print(f"✅ Données chargées : {len(X)} lignes")
        logging.info(f"Données valides : {len(X)} échantillons")

        # Préparer les données pour XGBoost
        X, y = prepare_data_for_xgboost(X, y)

        # Diviser les données (80% entraînement, 20% test)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Entraîner le modèle
        model = xgb.XGBRegressor(**PARAMS)
        model.fit(X_train, y_train)

        # Évaluer le modèle
        y_pred = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        print(f"📀️ Métriques : RMSE = {rmse:.2f}, R² = {r2:.2f}")
        logging.info(f"Évaluation pour {product_name} - RMSE: {rmse:.2f}, R²: {r2:.2f}")

        # Prédictions pour les 30 jours (hypothèse : données quotidiennes)
        last_data = X[-30:] if len(X) >= 30 else X
        predictions = model.predict(last_data)

        # Sauvegarder le modèle
        model_path = os.path.join(PREDICTIONS_DIR, f"model_{product_name}.pkl")
        joblib.dump(model, model_path)
        print(f"💾 Modèle sauvegardé : {model_path}")
        logging.info(f"Modèle sauvegardé : {model_path}")

        # Générer et sauvegarder les prédictions
        results = []
        for i, qty in enumerate(predictions):
            qty = max(0, float(qty))  # Éviter les quantités négatives
            results.append({
                "nom_produit": product_name,
                "quantité_prévue": qty,
                "stock_recommandé": round(qty * STOCK_MULTIPLIER, 2),
                "prix_ajusté": round(qty * PRICE_MULTIPLIER, 2)
            })

        json_path = os.path.join(PREDICTIONS_DIR, f"predictions_{product_name}.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=4)
        print(f"✅ Prédictions enregistrées dans : {json_path}")
        logging.info(f"Prédictions sauvegardées : {json_path}")

        return True

    except Exception as e:
        print(f"❌ Erreur pour {file_path} : {e}")
        logging.error(f"Erreur lors du traitement de {file_path} : {e}")
        return False

# === Chapitre 7 : Point d'entrée du programme ===
def main():
    init_logging()
    print(f"🔍 Listing des fichiers dans {TMP_SALES_DIR}...")

    # Vérifier l'existence du dossier
    if not os.path.exists(TMP_SALES_DIR):
        print(f"❌ Dossier introuvable : {TMP_SALES_DIR}")
        logging.error(f"Dossier introuvable : {TMP_SALES_DIR}")
        return

    # Lister les fichiers .pkl uniques
    files = list(set(f for f in os.listdir(TMP_SALES_DIR) if f.endswith('_xy.pkl')))
    print(f"📂 Fichiers détectés : {files}")
    logging.info(f"Fichiers détectés : {files}")

    if not files:
        print("⚠️ Aucun fichier .pkl trouvé.")
        logging.warning("Aucun fichier .pkl dans le dossier source.")
        return

    # Créer le dossier de prédictions si nécessaire
    os.makedirs(PREDICTIONS_DIR, exist_ok=True)
    print(f"📁 Dossier de prédictions vérifié/créé : {PREDICTIONS_DIR}")
    logging.info(f"Dossier de prédictions : {PREDICTIONS_DIR}")

    # Traiter chaque fichier
    success_count = 0
    for f in files:
        file_path = os.path.join(TMP_SALES_DIR, f)
        if train_and_predict(file_path):
            success_count += 1

    print(f"\n📤 Résultat : {success_count} fichier(s) traité(s) avec succès sur {len(files)}.")
    logging.info(f"Résultat : {success_count} fichier(s) traité(s) sur {len(files)}.")

# === Chapitre 8 : Exécution directe ===
if __name__ == "__main__":
    main()

# ================================================================
# 🌟 Objectif :
# Charger des données de vente préparées depuis des fichiers pickle, entraîner un modèle XGBoost pour prédire les quantités vendues, évaluer ses performances, et sauvegarder les modèles et prédictions pour chaque produit.

# 📥 Input :
# Fichiers pickle dans "xgboost_model/tmp_prepared/" contenant des données de vente préparées (features X et cible y) pour chaque produit.

# ⚙️ Traitement :
# - **Initialisation** : Configure un système de logs robuste ("xgboost_predictor.log").
# - **Chargement des données** : Liste les fichiers .pkl uniques, vérifie leur existence.
# - **Préparation des données** : Valide les données (X numérique, y valide), convertit en format XGBoost.
# - **Entraînement et évaluation** : Entraîne un modèle XGBoost, évalue avec RMSE et R² sur un ensemble de test (20%).
# - **Prédictions** : Génère des prédictions pour les 30 derniers jours, calcule stock (x1.1) et prix (x5).
# - **Sauvegarde** : Sauvegarde modèles (.pkl) et prédictions (.json) avec noms corrects.
# - **Gestion des erreurs** : Logs détaillés, continuation en cas d’erreur sur un fichier.

# 📤 Output :
# - Fichiers .pkl (modèles) et .json (prédictions) dans "xgboost_model/predictions/".
# - Métriques RMSE et R² affichées pour chaque produit.
# - Logs détaillés dans "xgboost_predictor.log".
# - Résumé du nombre de fichiers traités.
# ================================================================