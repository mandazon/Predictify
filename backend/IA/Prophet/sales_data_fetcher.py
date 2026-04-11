import requests
import json

def fetch_sales_data(api_url):
    """
    Récupère les données de vente depuis l'API.
    
    Arguments:
    - api_url (str) : L'URL de l'API pour récupérer les données de vente.
    
    Retourne:
    - (list) : Liste des données de vente au format JSON si la requête réussit.
    """
    try:
        # Effectuer une requête GET pour récupérer les données de l'API
        response = requests.get(api_url)
        
        # Vérification du statut de la réponse (HTTP 200 OK)
        if response.status_code == 200:
            print("Données récupérées avec succès !")
            # Retourner les données sous forme de liste d'objets JSON
            return response.json()
        else:
            print(f"Erreur lors de la récupération des données: {response.status_code}")
            return None
    except Exception as e:
        print(f"Une erreur s'est produite lors de la requête : {e}")
        return None

# URL de l'API pour récupérer les données de vente
api_url = "http://127.0.0.1:8000/api/sales/"

# Appel de la fonction pour récupérer les données
sales_data = fetch_sales_data(api_url)

# Si les données ont été récupérées avec succès, les afficher
if sales_data:
    print(json.dumps(sales_data, indent=4))








    # Actuel


# 🌟 Objectif :  
# Récupérer des données de vente depuis une API et les afficher de manière lisible et formatée  

# 📥 Input :  
# Une URL d'API (chaîne de caractères) pointant vers les données de vente, définie comme "http://127.0.0.1:8000/api/sales/"  

# ⚙️ Traitement :  
# - Envoie une requête HTTP GET à l'URL spécifiée  
# - Vérifie si la réponse est réussie (code HTTP 200 ✅)  
# - Convertit les données reçues en format JSON  
# - Gère les erreurs potentielles (codes non-200 ou exceptions 🚨)  
# - Affiche les données formatées si elles sont disponibles  

# 📤 Output :  
# - Affiche un message de succès ou d'erreur dans la console 🖥️  
# - Si la requête réussit, affiche les données de vente en JSON avec une mise en forme lisible 📋








