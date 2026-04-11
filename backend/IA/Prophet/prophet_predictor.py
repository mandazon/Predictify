# 📦 Importation des bibliothèques nécessaires :
import requests # - requests : pour les appels API
import pandas as pd # - pandas : pour la manipulation des données
import numpy as np # - numpy : pour les transformations numériques
from prophet import Prophet # - prophet : pour la modélisation des séries temporelles
import os  # Pour créer le dossier et manipuler les chemins









##### ==========================
##### CHAPITRE 1 : RÉCUPÉRATION DES DONNÉES
##### ==========================

# 📥 Sous-chapitre 1.1 : Récupérer les données depuis l'API
def fetch_sales_data(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Vérifie si la réponse a un statut 2xx
        data = response.json()
        
        # Vérifier qu'il y a suffisamment de données (au moins 30 jours)
        if len(data) < 30:
            print(f"❌ Pas assez de données historiques. Seulement {len(data)} jours de données récupérées.")
            return []  # Retourner une liste vide si les données sont insuffisantes
        
        print("✅ Données récupérées avec succès !")
        return data

    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur de requête : {e}")
        return []  # Retourner une liste vide en cas d'erreur de requête









##### ==========================
##### CHAPITRE 2 : PRÉPARATION DES DONNÉES
##### ==========================

# 🛠 Sous-chapitre 2.1 : Filtrer et formater les données pour Prophet
def prepare_sales_data(sales_data, product_name):
    product_sales_data = [sale for sale in sales_data if sale['product_name'] == product_name]
    prepared_data = [{"ds": sale["sales_date"], "y": sale["total_sales"]} for sale in product_sales_data]
    return prepared_data


# 🛠 Sous-chapitre 2.2 : Gérer les valeurs manquantes et les outliers
def handle_missing_data(prepared_data):
    df = pd.DataFrame(prepared_data)
    df['ds'] = pd.to_datetime(df['ds'], errors='coerce')
    df = df.dropna(subset=['ds', 'y'])  # Supprimer les lignes avec dates ou valeurs manquantes

    # Supprimer les valeurs nulles ou négatives
    df = df[df['y'] > 0]

    # Interpolation linéaire pour combler les valeurs manquantes potentielles
    df['y'] = df['y'].interpolate(method='linear')

    # Vérification post-interpolation
    if df['y'].isna().sum() > 0:
        print("❌ Il reste des valeurs manquantes après interpolation.")
        return []

    if len(df) < 2:
        print("❌ Données insuffisantes après nettoyage.")
        return []

    # Suppression des outliers extrêmes (au-delà du 99e percentile)
    df = df[df['y'] < df['y'].quantile(0.99)]

    return df.to_dict(orient='records')


# 📊 Sous-chapitre 2.3 : Appliquer une transformation logarithmique sur les ventes
def apply_log_transformation(prepared_data):
    epsilon = 0.1  # Pour éviter log(0)
    for entry in prepared_data:
        if entry["y"] > 0:
            entry["y"] = np.log(entry["y"] + epsilon)
        else:
            entry["y"] = np.nan  # Log non défini pour valeurs nulles ou négatives
    return [entry for entry in prepared_data if not np.isnan(entry["y"])]






##### ==========================
##### CHAPITRE 3 : PRÉDICTION DES VENTES AVEC PROPHET
##### ==========================

# 📊 Sous-chapitre 3.1 : Entraîner Prophet et générer les prévisions
def predict_sales(prepared_data, growth_type="logistic"):
    if len(prepared_data) < 2:
        print("❌ Pas assez de données pour entraîner le modèle.")
        return pd.DataFrame(), None  # Retourne aussi 'None' pour le modèle

    # Convertir en DataFrame
    df_prophet = pd.DataFrame(prepared_data)
    df_prophet['ds'] = pd.to_datetime(df_prophet['ds'])

    # Appliquer cap/floor pour la croissance logistique
    max_sales = df_prophet["y"].max()
    min_sales = df_prophet["y"].min()
    df_prophet["cap"] = max_sales * 1.2  # Cap à 120% du maximum observé
    df_prophet["floor"] = max(min_sales * 0.8, 0)  # Floor à 80% du minimum, sans valeurs négatives

    # Définir les jours fériés ou événements spécifiques
    holidays = pd.DataFrame({
        'holiday': ['Noël', 'Jour de l\'An', 'Fête du Travail', 'Promo Spéciale'],
        'ds': pd.to_datetime(['2025-12-25', '2025-01-01', '2025-05-01', '2025-06-15']),
        'lower_window': 0,
        'upper_window': 1
    })

    # Initialisation du modèle Prophet
    model = Prophet(
        growth=growth_type,
        changepoint_prior_scale=0.1,  # Plus flexible aux changements récents
        seasonality_mode="multiplicative",
        yearly_seasonality=True,
        weekly_seasonality=True,
        holidays=holidays,
        interval_width=0.95
    )

    # Ajouter des saisonnalités personnalisées
    model.add_seasonality(name="monthly", period=30.5, fourier_order=5)
    model.add_seasonality(name="weekly", period=7, fourier_order=8)
    model.add_seasonality(name="yearly", period=365, fourier_order=10)

    try:
        model.fit(df_prophet)
    except Exception as e:
        print(f"❌ Erreur lors de l'entraînement : {e}")
        return pd.DataFrame(), None  # Retourne None pour le modèle en cas d'erreur

    # Générer les futures dates à prédire
    future = model.make_future_dataframe(periods=30, freq='D')
    future["cap"] = df_prophet["cap"].max()
    future["floor"] = df_prophet["floor"].min()

    # Prédictions
    forecast = model.predict(future)

    # Reverser la transformation logarithmique si elle a été appliquée
    if isinstance(prepared_data, list) and "log_transformed" in prepared_data[0]:
        forecast['yhat'] = np.exp(forecast['yhat'])
        forecast['yhat_lower'] = np.exp(forecast['yhat_lower'])
        forecast['yhat_upper'] = np.exp(forecast['yhat_upper'])

    # Supprimer les valeurs négatives
    forecast['yhat'] = forecast['yhat'].clip(lower=0)
    forecast['yhat_lower'] = forecast['yhat_lower'].clip(lower=0)
    forecast['yhat_upper'] = forecast['yhat_upper'].clip(lower=0)

    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']], model







##### ==========================
##### CHAPITRE 4 : EXÉCUTION PRINCIPALE
##### ==========================

# 🚀 Sous-chapitre 4.1 : Lancer le script complet
if __name__ == "__main__":
    api_url = "http://127.0.0.1:8000/api/sales/"

    raw_sales_data = fetch_sales_data(api_url)
    
    if raw_sales_data:  
        product_names = set([sale['product_name'] for sale in raw_sales_data])
        all_forecasts = {}

        for product_name in product_names:
            print(f"\n📈 Traitement des données pour {product_name} :")
            prepared_data = prepare_sales_data(raw_sales_data, product_name)
            prepared_data = handle_missing_data(prepared_data)
            
            if not prepared_data:
                print(f"❌ Pas de données valides pour {product_name}. Passer au produit suivant.")
                continue

            prepared_data_log = apply_log_transformation(prepared_data)
            forecast, model = predict_sales(prepared_data_log, "logistic")  # Retourner à la fois la prévision et le modèle

            if not forecast.empty:
                all_forecasts[product_name] = forecast
                print(f"📊 Prévisions pour {product_name}:")
                print(forecast)

                # 🚨 Alerte si plus de 5 jours consécutifs avec yhat = 0
                zero_predictions_count = (forecast['yhat'] <= 0).sum()
                if zero_predictions_count > 5:
                    print(f"⚠️ [ALERTE] {product_name} : plus de 5 jours avec yhat = 0.")

                # 📉 Sauvegarder les graphiques si la moyenne des yhat est inférieure à un seuil (par exemple, 10)
                seuil = 10
                if forecast['yhat'].mean() < seuil:
                    # Sauvegarde du graphique des prévisions
                    fig = model.plot(forecast)
                    fig.savefig(f"plots/{product_name}_anomalie.png")
                    print(f"📉 Graphique sauvegardé pour {product_name} (yhat moyen trop bas).")

                # 💾 Sauvegarde des prévisions dans un fichier CSV
                os.makedirs("prophet_model/forecasts/", exist_ok=True)
                # Sanitiser le nom du produit pour le nom de fichier (remplacer espaces par underscores)
                safe_product_name = product_name.replace(" ", "_")
                forecast_path = f"prophet_model/forecasts/forecast_{safe_product_name}.csv"
                forecast.to_csv(forecast_path, index=False)
                print(f"💾 Prévisions sauvegardées dans : {forecast_path}")
        
        print("\n📦 Résultats des prévisions pour tous les produits:")
        print(all_forecasts)








# Actuel 


# 🌟 Objectif :  
# Récupérer des données de vente via une API, les nettoyer, les préparer pour la modélisation, prédire les ventes futures sur 30 jours avec le modèle Prophet, et détecter les anomalies pour chaque produit  

# 📥 Input :  
# Une URL d'API ("http://127.0.0.1:8000/api/sales/") fournissant des données de vente au format JSON, incluant le nom du produit, la date de vente et le total des ventes  

# ⚙️ Traitement :  
# - **Récupération des données** : Envoie une requête HTTP GET à l'API, vérifie la validité de la réponse (statut 2xx) et s'assure qu'il y a au moins 30 jours de données 📡  
# - **Préparation des données** :  
#   - Filtre les données par produit et extrait les champs "date" (ds) et "ventes" (y) 🗂️  
#   - Convertit les dates en format datetime, supprime les valeurs manquantes ou négatives, et interpole linéairement les valeurs manquantes 📅  
#   - Applique une transformation logarithmique pour stabiliser les données élevées 🔢  
#   - Supprime les valeurs aberrantes au-delà du 99e percentile 🧹  
# - **Modélisation avec Prophet** :  
#   - Configure un modèle Prophet avec croissance logistique, saisonnalités (annuelle, hebdomadaire, mensuelle) et jours fériés prédéfinis 🎄  
#   - Définit des limites (cap/floor) pour encadrer les prévisions 📈  
#   - Entraîne le modèle sur les données nettoyées et génère des prévisions pour 30 jours futurs 🔮  
#   - Annule la transformation logarithmique si appliquée et supprime les prévisions négatives 🚫  
# - **Analyse des anomalies** : Détecte les jours avec ventes nulles (>5 jours consécutifs) et les prévisions faibles (moyenne <10), puis sauvegarde un graphique si anomalie détectée 📉  
# - **Exécution** : Boucle sur chaque produit, applique le pipeline de traitement et affiche les résultats 🖥️  

# 📤 Output :  
# - Messages de succès ou d'erreur dans la console pour chaque étape (récupération, nettoyage, prédiction) ✅❌  
# - Prévisions pour chaque produit sous forme de DataFrame avec dates, valeurs prédites et intervalles de confiance 📊  
# - Alertes pour anomalies (ventes nulles ou faibles) et sauvegarde de graphiques pour les produits concernés 📉  
# - Résumé final des prévisions pour tous les produits sous forme de dictionnaire 🗃️