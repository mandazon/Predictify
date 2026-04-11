import requests
import json
import os

# URL de l'API
API_URL = "http://127.0.0.1:8000/api/sales/"

def fetch_sales_data():
    # Récupérer les données depuis l'API
    response = requests.get(API_URL)
    
    if response.status_code == 200:
        sales_data = response.json()  # Transformer la réponse JSON en dictionnaire
        
        # Créer un dossier temporaire si non existant
        if not os.path.exists('xgboost_model/tmp_sales/'):
            os.makedirs('xgboost_model/tmp_sales/')
        
        # Sauvegarder les données dans un fichier
        with open('xgboost_model/tmp_sales/sales_data.json', 'w') as outfile:
            json.dump(sales_data, outfile, indent=4)
        
        print("✅ Données récupérées et sauvegardées avec succès.")
        
        # Afficher un aperçu des données pour vérifier
        print(json.dumps(sales_data, indent=4))  # Affiche les données de manière lisible
    else:
        print(f"❌ Échec de la récupération des données (Status Code: {response.status_code})")

# Appeler la fonction pour récupérer les données
fetch_sales_data()












# Actuel 

# 🌟 Objectif :  
# Récupérer des données de vente depuis une API et les sauvegarder localement dans un fichier JSON tout en affichant un aperçu des données  

# 📥 Input :  
# Une URL d'API prédéfinie ("http://127.0.0.1:8000/api/sales/") fournissant des données de vente au format JSON  

# ⚙️ Traitement :  
# - Envoie une requête HTTP GET à l'API pour récupérer les données 📡  
# - Vérifie si la réponse est réussie (code HTTP 200) ✅  
# - Convertit la réponse JSON en un dictionnaire Python 📋  
# - Crée un dossier temporaire ("xgboost_model/tmp_sales/") s'il n'existe pas 📂  
# - Sauvegarde les données dans un fichier JSON avec indentation pour lisibilité 💾  
# - Affiche un aperçu des données dans la console pour vérification 🖥️  
# - En cas d'échec de la requête, affiche un message d'erreur avec le code de statut 🚨  

# 📤 Output :  
# - Un fichier JSON ("sales_data.json") contenant les données de vente, sauvegardé dans le dossier temporaire 📄  
# - Un message de succès ou d'erreur affiché dans la console ✅❌  
# - Un aperçu formaté des données de vente affiché dans la console si la requête réussit 📊