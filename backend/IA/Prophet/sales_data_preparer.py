import requests
import pandas as pd
import numpy as np  # Pour la transformation logarithmique

# Fonction pour récupérer les données depuis l'API
def fetch_sales_data(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        print("✅ Données récupérées avec succès !")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur de requête : {e}")
        return []

# Fonction pour nettoyer les données
def clean_dataframe(df):
    # Convertir "ds" en datetime
    df["ds"] = pd.to_datetime(df["ds"], errors="coerce")

    # Supprimer les valeurs manquantes et s'assurer de la validité numérique
    df = df.dropna(subset=["ds", "y"]).copy()
    df["y"] = pd.to_numeric(df["y"], errors="coerce")
    df = df.dropna(subset=["y"])
    df = df[df["y"] > 0]

    # Log des doublons sur les dates
    duplicated_dates = df.duplicated(subset=["ds"], keep=False).sum()
    if duplicated_dates > 0:
        print(f"⚠️ {duplicated_dates} doublons détectés sur les dates. Agrégation par moyenne appliquée.")

    # Agréger les doublons par date (moyenne des ventes pour la même date)
    df = df.groupby("ds", as_index=False).mean()

    # Trier les données
    df = df.sort_values(by="ds")

    # Interpolation des valeurs manquantes
    df["y"] = df["y"].interpolate(method="linear")

    # Transformation logarithmique si valeurs élevées
    if df["y"].max() > 1000:
        df["y"] = np.log1p(df["y"])

    # Suppression des valeurs aberrantes via Z-score
    if len(df) > 10:
        z_scores = (df["y"] - df["y"].mean()) / df["y"].std()
        df = df[abs(z_scores) < 3]

    return df.reset_index(drop=True)

# Préparation des données par produit
def prepare_sales_data(sales_data):
    product_sales = {}

    for sale in sales_data:
        product_name = sale["product_name"]
        product_sales.setdefault(product_name, []).append({
            "ds": sale["sales_date"],
            "y": sale["quantity_sold"]
        })

    prepared_data = {}
    for product_name, data in product_sales.items():
        df = pd.DataFrame(data)
        df = clean_dataframe(df)
        prepared_data[product_name] = df

    return prepared_data

# Exécution principale
if __name__ == "__main__":
    api_url = "http://127.0.0.1:8000/api/sales/"
    raw_sales_data = fetch_sales_data(api_url)

    if raw_sales_data:
        prepared_data = prepare_sales_data(raw_sales_data)

        for product_name, df in prepared_data.items():
            print(f"\n📦 Données nettoyées pour le produit : {product_name}")
            print(df)





# Actuel


# 🌟 Objectif :  
# Récupérer des données de vente depuis une API, les organiser par produit, nettoyer et transformer les données, puis afficher les résultats formatés  

# 📥 Input :  
# Une URL d'API (chaîne de caractères, "http://127.0.0.1:8000/api/sales/") fournissant des données de vente au format JSON, contenant des informations comme le nom du produit, la date de vente et la quantité vendue  

# ⚙️ Traitement :  
# - Envoie une requête HTTP GET à l'API et récupère les données JSON 📡  
# - Gère les erreurs de requête (ex. : connexion échouée) et retourne une liste vide si échec 🚨  
# - Organise les données par produit dans un dictionnaire, en extrayant la date ("ds") et la quantité vendue ("y") 🗂️  
# - Nettoie chaque ensemble de données produit :  
#   - Convertit les dates en format datetime 📅  
#   - Supprime les valeurs manquantes et non numériques ❌  
#   - Filtre les quantités négatives ou nulles 🚫  
#   - Détecte et agrège les doublons de dates par moyenne 🔄  
#   - Trie les données par date ⬆️  
#   - Interpole les valeurs manquantes avec une méthode linéaire 📈  
#   - Applique une transformation logarithmique si les valeurs sont élevées (>1000) 🔢  
#   - Supprime les valeurs aberrantes via un Z-score (seuil de 3 écarts-types) 🧹  
# - Structure les données nettoyées dans des DataFrames par produit 🗃️  
# - Affiche les données nettoyées pour chaque produit dans la console 🖥️  

# 📤 Output :  
# - Si la requête réussit, affiche un message de succès et les données nettoyées par produit sous forme de DataFrames formatés 📋  
# - En cas d'erreur, affiche un message d'erreur et aucune donnée n'est traitée 🚫












# 🌟 Objectif :  
# Organiser, nettoyer et transformer des données de vente brutes (JSON ou DataFrame) par produit, puis afficher les résultats formatés.

# 📥 Input :  
# Données de vente brutes fournies sous forme de JSON ou DataFrame, contenant des informations telles que le nom du produit, la date de vente et la quantité vendue.
# Ces données sont présupposées avoir été préalablement récupérées (par exemple via sales_data_fetcher.py).

# ⚙️ Traitement :  
# - Organise les données par produit dans un dictionnaire, en extrayant la date ("ds") et la quantité vendue ("y") 🗂️  
# - Nettoie chaque ensemble de données produit :  
#   - Convertit les dates en format datetime 📅  
#   - Supprime les valeurs manquantes et non numériques ❌  
#   - Filtre les quantités négatives ou nulles 🚫  
#   - Détecte et agrège les doublons de dates par moyenne 🔄  
#   - Trie les données par date ⬆️  
#   - Interpole les valeurs manquantes avec une méthode linéaire 📈  
#   - Applique une transformation logarithmique si les valeurs sont élevées (>1000) 🔢  
#   - Supprime les valeurs aberrantes via un Z-score (seuil de 3 écarts-types) 🧹  
# - Structure les données nettoyées dans des DataFrames par produit 🗃️  
# - Affiche les données nettoyées pour chaque produit dans la console 🖥️  

# 📤 Output :  
# - Retourne un dictionnaire de DataFrames nettoyés, indexés par produit  
# - En cas d'erreur ou de données invalides, affiche un message d'erreur et retourne un dictionnaire vide ou None
