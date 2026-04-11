# ================================================================
# 🌐 ENVOI DES PRÉDICTIONS À L'API
# ================================================================

# === Chapitre 1 : Importation des bibliothèques ===
import os
import json
import requests
import logging
from pathlib import Path

# Configuration des logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# === Chapitre 2 : Définition des chemins et URL de l'API ===
COMBINED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "hybrid", "combined_predictions")
INPUT_FILE = os.path.join(COMBINED_DIR, "final_result_2.0.json")
API_URL = "http://127.0.0.1:8000/api/predictions/"

# === Chapitre 3 : Fonction pour envoyer les données à l'API ===
def send_product_to_api(product_data):
    """Envoie les données d'un produit à l'API via une requête POST."""
    try:
        # Formatter les données selon la structure attendue par l'API
        payload = {
            "product_name": product_data["nom_produit"],
            "recommended_stock": int(round(product_data["stock_recommande"])),  # Conversion en entier
            "recommended_price": product_data["prix"]
        }
        
        # Envoyer la requête POST
        response = requests.post(API_URL, json=payload)
        
        # Vérifier le statut de la réponse
        if response.status_code == 201:
            logger.info(f"✅ Produit '{payload['product_name']}' envoyé avec succès à l'API.")
            return True
        else:
            logger.error(f"❌ Échec de l'envoi pour '{payload['product_name']}': {response.status_code} - {response.text}")
            return False
    
    except requests.exceptions.RequestException as e:
        logger.error(f"❌ Erreur réseau lors de l'envoi pour '{product_data['nom_produit']}': {e}")
        return False
    except KeyError as e:
        logger.error(f"❌ Champ manquant dans les données pour '{product_data.get('nom_produit', 'inconnu')}': {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Erreur inattendue pour '{product_data.get('nom_produit', 'inconnu')}': {e}")
        return False

# === Chapitre 4 : Fonction principale pour lire et envoyer les données ===
def send_predictions_to_api():
    """Lit final_result_2.0.json et envoie chaque produit à l'API."""
    try:
        # Vérifier l'existence du répertoire et du fichier d'entrée
        if not os.path.exists(COMBINED_DIR):
            logger.error(f"❌ Erreur : Le dossier {COMBINED_DIR} n'existe pas.")
            return False
        
        if not os.path.exists(INPUT_FILE):
            logger.error(f"❌ Erreur : Le fichier {INPUT_FILE} n'existe pas.")
            return False
        
        # Lire le fichier final_result_2.0.json
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not data:
            logger.warning(f"⚠️ Le fichier {INPUT_FILE} est vide.")
            return False
        
        # Envoyer chaque produit à l'API
        success_count = 0
        for product_name, product_data in data.items():
            if send_product_to_api(product_data):
                success_count += 1
            else:
                logger.warning(f"⚠️ Échec de l'envoi pour {product_name}. Poursuite avec le produit suivant.")
        
        logger.info(f"📊 Résultat : {success_count}/{len(data)} produits envoyés avec succès.")
        return success_count == len(data)
    
    except json.JSONDecodeError:
        logger.error(f"❌ Erreur : Le fichier {INPUT_FILE} n'est pas un JSON valide.")
        return False
    except Exception as e:
        logger.error(f"❌ Erreur lors du traitement : {e}")
        return False

# === Chapitre 5 : Point d'entrée du programme ===
def main():
    """Point d'entrée principal pour envoyer les prédictions à l'API."""
    logger.info(f"🔍 Envoi des prédictions depuis {INPUT_FILE} vers {API_URL}...")
    success = send_predictions_to_api()
    if success:
        logger.info("📤 Envoi des prédictions terminé avec succès.")
    else:
        logger.error("📤 Échec de l'envoi des prédictions.")

# === Chapitre 6 : Exécution directe ===
if __name__ == "__main__":
    main()

# ================================================================
# 🌟 Objectif :
# Lire final_result_2.0.json et envoyer chaque produit à l'API via une requête POST.

# 📥 Input :
# Fichier JSON final_result_2.0.json dans "hybrid/combined_predictions/" contenant les données des 6 produits sélectionnés (nom_produit, prix, stock_recommande).

# 📖 Traitement :
# - Lit le fichier final_result_2.0.json.
# - Pour chaque produit :
#   - Extrait les champs nom_produit, prix, stock_recommande.
#   - Convertit stock_recommande en entier (arrondi) pour répondre aux exigences de l'API.
#   - Formate les données dans la structure attendue par l'API :
#     {
#         "product_name": "<nom_produit>",
#         "recommended_stock": <stock_recommande (entier)>,
#         "recommended_price": <prix>
#     }
#   - Envoie une requête POST à http://127.0.0.1:8000/api/predictions/.
# - Gère les erreurs réseau, JSON invalide, ou champs manquants.

# 📤 Output :
# - Envoi des données à l'API pour chaque produit.
# - Messages de log pour chaque étape et chaque produit (succès ou échec).

# 🔧 Gestion des erreurs :
# - Vérifie l’existence du dossier et du fichier d’entrée.
# - Gère les fichiers JSON vides ou mal formatés.
# - Gère les erreurs réseau (ex. : serveur indisponible).
# - Continue le traitement en cas d’erreur sur un produit.

# 🗂️ Chemin :
# - Fichier d’entrée : C:\Users\TOSHIBA\Desktop\Predictify\3-Backend\1-Python\predictify\IA\hybrid\combined_predictions\final_result_2.0.json
# - Fichier généré : Aucun (envoi direct à l’API).
# - EmPlacement du script : C:\Users\TOSHIBA\Desktop\Predictify\3-Backend\1-Python\predictify\IA\api_integration\send_predictions_to_api.py
# ================================================================