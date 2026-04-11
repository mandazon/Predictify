# 🔄 Version intelligente et simplifiée de prediction_interpreter.py

# Importation des bibliothèques nécessaires
import pandas as pd
import math
import sys
import os

# Fonction pour charger les résultats de prophet_predictor.py
def load_forecasts():
    try:
        # Importer le script prophet_predictor.py
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        from prophet_predictor import fetch_sales_data, prepare_sales_data, handle_missing_data, apply_log_transformation, predict_sales
        
        # URL de l'API (même que dans prophet_predictor.py)
        api_url = "http://127.0.0.1:8000/api/sales/"
        
        # Récupérer les données brutes
        raw_sales_data = fetch_sales_data(api_url)
        
        if not raw_sales_data:
            print("❌ Échec de la récupération des données depuis prophet_predictor.py")
            return {}
        
        # Traiter les données pour chaque produit
        product_names = set([sale['product_name'] for sale in raw_sales_data])
        all_forecasts = {}
        
        for product_name in product_names:
            prepared_data = prepare_sales_data(raw_sales_data, product_name)
            prepared_data = handle_missing_data(prepared_data)
            
            if not prepared_data:
                continue
            
            prepared_data_log = apply_log_transformation(prepared_data)
            forecast, model = predict_sales(prepared_data_log, "logistic")
            
            if not forecast.empty:
                all_forecasts[product_name] = forecast
        
        return all_forecasts
    
    except Exception as e:
        print(f"❌ Erreur lors du chargement des prévisions : {e}")
        return {}

# Fonction pour interpréter les prévisions et recommander le stock optimal
def interpret_predictions(all_forecasts):
    # Dictionnaire pour stocker les recommandations
    stock_recommendations = {}
    
    # Traiter chaque produit dans le dictionnaire des prévisions
    for product_name, forecast in all_forecasts.items():
        # Convertir 'ds' en format date pour le filtrage
        forecast['ds'] = pd.to_datetime(forecast['ds']).dt.date
        
        # Filtrer les 30 derniers jours des prévisions (période future)
        future_forecast = forecast.tail(30)
        
        # Vérifier si des données sont disponibles pour la période
        if future_forecast.empty:
            stock_recommendations[product_name] = 0
            print(f"📦 Produit : {product_name} → Stock recommandé pour les 30 prochains jours : 0 unités")
            continue
        
        # Nettoyer les valeurs aberrantes : ignorer les jours avec yhat < 0
        future_forecast = future_forecast[future_forecast['yhat'] >= 0]
        
        # Vérifier s'il reste des données après le nettoyage
        if future_forecast.empty:
            stock_recommendations[product_name] = 0
            print(f"📦 Produit : {product_name} → Stock recommandé pour les 30 prochains jours : 0 unités")
            continue
        
        # Calculer la prévision ajustée : moyenne pondérée
        # Poids : yhat (0.5), yhat_lower (0.25), yhat_upper (0.25)
        future_forecast['adjusted_yhat'] = (
            0.5 * future_forecast['yhat'] +
            0.25 * future_forecast['yhat_lower'] +
            0.25 * future_forecast['yhat_upper']
        )
        
        # Cumuler les valeurs ajustées pour estimer la demande totale
        total_demand = future_forecast['adjusted_yhat'].sum()
        
        # Appliquer une marge de sécurité de 20%
        safety_margin = 1.2
        stock_optimal = total_demand * safety_margin
        
        # Arrondir au nombre entier supérieur pour un stock tampon
        stock_optimal = math.ceil(stock_optimal)
        
        # Stocker et afficher la recommandation
        stock_recommendations[product_name] = stock_optimal
        print(f"📦 Produit : {product_name} → Stock recommandé pour les 30 prochains jours : {stock_optimal} unités")
    
    return stock_recommendations

# Exécution principale
if __name__ == "__main__":
    # Charger les prévisions depuis prophet_predictor.py
    all_forecasts = load_forecasts()
    
    # Vérifier si des prévisions ont été chargées
    if not all_forecasts:
        print("❌ Aucune prévision disponible pour interprétation")
    else:
        # Interpréter les prévisions et recommander le stock
        stock_recommendations = interpret_predictions(all_forecasts)












        # 🌟 Objectif :  
# Interpréter les prévisions générées par Prophet (via prophet_predictor.py) pour recommander, de manière fiable, une **quantité de stock optimale à prévoir sur les 30 prochains jours** pour chaque produit.

# 📥 Input :  
# - Un dictionnaire contenant, pour chaque produit, un DataFrame Prophet prévisionnel  
#   (colonnes attendues :  
#     - 'ds' : dates des prévisions  
#     - 'yhat' : prévisions centrales  
#     - 'yhat_lower' et 'yhat_upper' : intervalles de confiance basse/haute)

# ⚙️ Traitement :  
# - Pour chaque produit :  
#   - Filtrer uniquement les 30 prochains jours à partir d’aujourd’hui 📆  
#   - Nettoyer les valeurs aberrantes : ignorer les jours avec 'yhat' < 0 pour éviter des prévisions irréalistes 🚫  
#   - Calculer la **prévision ajustée** par jour : moyenne pondérée entre 'yhat' (poids 0.5), 'yhat_lower' (poids 0.25) et 'yhat_upper' (poids 0.25) pour plus de robustesse 🧠  
#   - Cumuler ces valeurs ajustées sur 30 jours pour estimer la demande totale attendue 📈  
#   - Appliquer une marge de sécurité de 20% pour absorber les incertitudes (pics de demande, délais d’approvisionnement) 🛡️  
#   - Arrondir au nombre entier supérieur pour sécuriser le stock (stock tampon) 🧮  

# 📤 Output :  
# - Pour chaque produit, afficher uniquement :  
#   - 📦 "Produit : [nom] → Stock recommandé pour les 30 prochains jours : [valeur] unités"  
#   (Pas d’analyse de tendance ni d’alerte, focus uniquement sur la prévision quantitative)"
