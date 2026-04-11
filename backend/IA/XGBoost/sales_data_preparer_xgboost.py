# ============================================
# Chapitre 1: Importation des bibliothèques
# ============================================

import pandas as pd
import numpy as np
import os
import json
from sklearn.preprocessing import LabelEncoder
import joblib







# ============================================
# Chapitre 2: Fonction de préparation des données pour XGBoost
# ============================================

def prepare_sales_data_for_xgboost(product_df: pd.DataFrame) -> tuple:
    """
    Cette fonction prépare les données de vente pour l'entraînement d'un modèle XGBoost.
    Elle effectue les transformations nécessaires et crée de nouvelles caractéristiques.
    """

    # Sous-chapitre 2.1: Préparation initiale des données
    df = product_df.copy()
    df['Date de vente'] = pd.to_datetime(df['sales_date'], errors='coerce')  # Utilisation de 'sales_date' pour la date de vente
    df = df.dropna(subset=['Date de vente'])  # Suppression des lignes sans date de vente valide
    df = df.sort_values("Date de vente")  # Tri des données par date
    df = df.drop_duplicates(subset=["Date de vente"])  # Suppression des doublons
    df['quantite_vendue'] = df['quantity_sold'].fillna(0)  # Utilisation de 'quantity_sold' pour la quantité
    df['prix_unitaire'] = df['unit_price'].ffill()  # Utilisation de 'unit_price' pour le prix unitaire

    # Sous-chapitre 2.2: Extraction des caractéristiques temporelles
    df['jour'] = df['Date de vente'].dt.day
    df['mois'] = df['Date de vente'].dt.month
    df['annee'] = df['Date de vente'].dt.year
    df['jour_semaine'] = df['Date de vente'].dt.weekday
    df['weekend'] = df['jour_semaine'].isin([5, 6]).astype(int)  # Indicateur du weekend
    df['saison'] = df['mois'] % 12 // 3 + 1  # Détermination de la saison (1 à 4)
    
    # Sous-chapitre 2.3: Ajout des jours fériés
    holidays = pd.to_datetime(['2025-01-01', '2025-05-01', '2025-12-25'])
    df['ferie'] = df['Date de vente'].isin(holidays).astype(int)  # Indicateur des jours fériés

    # Sous-chapitre 2.4: Création des variables de retard (lag)
    for lag in [1, 3, 7]:
        df[f'lag_{lag}'] = df['quantite_vendue'].shift(lag)

    # Sous-chapitre 2.5: Calcul des moyennes et écarts-types mobiles
    df['rolling_mean_7'] = df['quantite_vendue'].rolling(window=7).mean()  # Moyenne mobile sur 7 jours
    df['rolling_std_7'] = df['quantite_vendue'].rolling(window=7).std()  # Écart-type mobile sur 7 jours
    df = df.dropna()  # Suppression des lignes avec des valeurs manquantes résultant des calculs

    # Sous-chapitre 2.6: Encodage des variables catégorielles
    if 'category' in df.columns:  # Utilisation de 'category' pour la catégorie
        le_cat = LabelEncoder()
        df['categorie_enc'] = le_cat.fit_transform(df['category'])  # Encodage de la catégorie

    if 'trend' in df.columns:  # Utilisation de 'trend' pour la tendance
        le_trend = LabelEncoder()
        df['tendance_enc'] = le_trend.fit_transform(df['trend'])  # Encodage de la tendance

    # Sous-chapitre 2.7: Sélection des colonnes de caractéristiques (features)
    feature_cols = [
        'jour', 'mois', 'annee', 'jour_semaine', 'weekend', 'saison', 'ferie',
        'prix_unitaire', 'lag_1', 'lag_3', 'lag_7', 'rolling_mean_7', 'rolling_std_7'
    ]
    if 'categorie_enc' in df.columns:
        feature_cols.append('categorie_enc')  # Ajout de la catégorie encodée si elle existe
    if 'tendance_enc' in df.columns:
        feature_cols.append('tendance_enc')  # Ajout de la tendance encodée si elle existe

    X = df[feature_cols]  # Données d'entrée (features)
    y = df['quantite_vendue']  # Cible (quantité vendue)

    return X, y









# ============================================
# Chapitre 3: Traitement du fichier JSON et préparation des données
# ============================================

if __name__ == "__main__":
    """
    Ce bloc exécute le processus complet de préparation des données à partir d'un fichier JSON.
    Les données sont ensuite préparées pour chaque produit et sauvegardées pour un usage ultérieur.
    """

    # Sous-chapitre 3.1: Définition des chemins d'entrée et de sortie
    input_file = "xgboost_model/tmp_sales/sales_data.json"
    output_dir = "xgboost_model/tmp_prepared"
    os.makedirs(output_dir, exist_ok=True)  # Création du répertoire de sortie si nécessaire

    try:
        # Sous-chapitre 3.2: Chargement du fichier JSON
        with open(input_file, "r", encoding="utf-8") as f:
            all_sales = json.load(f)

        # Sous-chapitre 3.3: Vérification de la structure des données JSON
        if not isinstance(all_sales, list):
            raise ValueError("Les données JSON doivent être une liste d'objets de vente.")

        # Sous-chapitre 3.4: Transformation des données en DataFrame
        df = pd.DataFrame(all_sales)

        # Sous-chapitre 3.5: Renommage de la colonne 'product_name' en 'nom_produit' si nécessaire
        if 'product_name' in df.columns:
            df.rename(columns={'product_name': 'nom_produit'}, inplace=True)
        else:
            raise ValueError("La clé 'product_name' est manquante dans les données.")

        # Sous-chapitre 3.6: Traitement des ventes par produit
        for product_name, product_df in df.groupby("nom_produit"):
            print(f"⚙️ Préparation des données pour : {product_name}")
            try:
                # Préparation des données pour chaque produit
                X, y = prepare_sales_data_for_xgboost(product_df)

                # Sauvegarde des données préparées dans un fichier pickle sous forme de dictionnaire
                data_dict = {"X": X, "y": y}
                joblib.dump(data_dict, os.path.join(output_dir, f"{product_name}_xy.pkl"))

                print(f"✅ Données préparées enregistrées pour {product_name}")
            except Exception as e:
                print(f"❌ Erreur lors du traitement de {product_name} : {e}")

    except Exception as e:
        # Gestion des erreurs lors du chargement ou du traitement initial
        print(f"❌ Impossible de charger ou traiter le fichier JSON : {e}")



# ============================================
# Chapitre 1: Importation des bibliothèques
# ============================================

# Importation des bibliothèques nécessaires pour la manipulation des données,
# l'encodage, la sérialisation et la gestion des fichiers.

# ============================================
# Chapitre 2: Fonction de préparation des données pour XGBoost
# ============================================

# Cette fonction prépare les données de vente pour l'entraînement d'un modèle XGBoost.
# Elle effectue diverses transformations et crée des caractéristiques pertinentes.

# Sous-chapitre 2.1: Préparation initiale des données
# - Copie du DataFrame original.
# - Conversion de la date de vente.
# - Suppression des lignes avec dates invalides.
# - Tri et dédoublonnage par date.
# - Remplissage des valeurs manquantes pour la quantité vendue et le prix unitaire.

# Sous-chapitre 2.2: Extraction des caractéristiques temporelles
# - Extraction du jour, mois, année, jour de la semaine.
# - Création d'un indicateur de weekend.
# - Détermination de la saison à partir du mois.

# Sous-chapitre 2.3: Ajout des jours fériés
# - Création d'un indicateur pour identifier si une date correspond à un jour férié.

# Sous-chapitre 2.4: Création des variables de retard (lags)
# - Calcul des ventes décalées à 1, 3 et 7 jours.

# Sous-chapitre 2.5: Calcul des moyennes et écarts-types mobiles
# - Moyenne mobile sur 7 jours.
# - Écart-type mobile sur 7 jours.
# - Suppression des lignes avec valeurs manquantes après calculs.

# Sous-chapitre 2.6: Encodage des variables catégorielles
# - Encodage de la colonne 'category' si elle est présente.
# - Encodage de la colonne 'trend' si elle est présente.

# Sous-chapitre 2.7: Sélection des colonnes de caractéristiques
# - Définition des colonnes utilisées comme features pour le modèle.
# - Séparation des features (X) et de la cible (y).

# ============================================
# Chapitre 3: Traitement du fichier JSON et préparation des données
# ============================================

# Ce bloc exécute le processus complet de préparation des données à partir d’un fichier JSON.
# Les données sont ensuite préparées pour chaque produit et sauvegardées.

# Sous-chapitre 3.1: Définition des chemins d’entrée et de sortie
# - Spécification du fichier JSON d’entrée.
# - Création du dossier de sortie pour stocker les fichiers préparés.

# Sous-chapitre 3.2: Chargement du fichier JSON
# - Lecture du fichier JSON contenant les données brutes de vente.

# Sous-chapitre 3.3: Vérification de la structure des données JSON
# - Vérification que les données sont bien une liste d’objets.

# Sous-chapitre 3.4: Transformation des données en DataFrame
# - Conversion de la liste JSON en DataFrame Pandas.

# Sous-chapitre 3.5: Renommage de colonnes si nécessaire
# - Vérification et renommage de la colonne 'product_name' en 'nom_produit'.

# Sous-chapitre 3.6: Traitement des ventes par produit
# - Boucle sur chaque produit distinct.
# - Préparation des données pour chaque produit via la fonction définie.
# - Sérialisation des jeux de données (features + cibles) au format .pkl.
# - Gestion des erreurs individuelles par produit.

# Gestion globale des erreurs liées au chargement du fichier JSON.




















# Actuel 

# 🌟 Objectif :  
# Charger des données de vente à partir d’un fichier JSON, les préparer pour l’entraînement d’un modèle XGBoost en créant des caractéristiques temporelles et en les structurant par produit, puis sauvegarder les données préparées dans des fichiers pickle  

# 📥 Input :  
# Un fichier JSON ("xgboost_model/tmp_sales/sales_data.json") contenant des données de vente avec des champs tels que le nom du produit, la date de vente, la quantité vendue, le prix unitaire, et éventuellement la catégorie et la tendance  

# ⚙️ Traitement :  
# - **Chargement des données** : Lit le fichier JSON et le convertit en un DataFrame pandas 📄  
# - **Validation initiale** : Vérifie que les données JSON sont une liste et contiennent la clé "product_name" (renommée en "nom_produit") 📋  
# - **Préparation par produit** :  
#   - Regroupe les données par produit pour un traitement individuel 🗂️  
#   - Convertit les dates de vente en format datetime, supprime les doublons et remplit les valeurs manquantes pour les quantités (0) et les prix unitaires (propagation avant) 📅  
#   - Crée des caractéristiques temporelles : jour, mois, année, jour de la semaine, indicateur de week-end, saison, et jours fériés (prédéfinis pour 2025) 🕒  
#   - Ajoute des variables de retard (lag 1, 3, 7 jours) et des statistiques mobiles (moyenne et écart-type sur 7 jours) 📈  
#   - Encode les variables catégorielles (catégorie et tendance) avec LabelEncoder si présentes 🔢  
#   - Sélectionne les colonnes pertinentes comme caractéristiques (features) pour XGBoost ⚙️  
# - **Sauvegarde** : Crée un répertoire de sortie ("xgboost_model/tmp_prepared") et sauvegarde les données préparées (features X et cible y) dans des fichiers pickle par produit 💾  
# - **Gestion des erreurs** : Affiche des messages d’erreur en cas de problème lors du chargement du JSON ou du traitement des données 🚨  

# 📤 Output :  
# - Fichiers pickle par produit ("nom_produit_xy.pkl") contenant les features (X) et la cible (y) dans le répertoire de sortie 📂  
# - Messages dans la console indiquant le succès ou l’échec du traitement pour chaque produit et le chargement du JSON ✅❌