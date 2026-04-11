import os
import pandas as pd
import json
import logging

# Configuration des logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Chemins des répertoires
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Pointe vers predictify\IA
FORECASTS_DIR = os.path.join(BASE_DIR, "Prophet", "prophet_model", "forecasts")
PREDICTIONS_DIR = os.path.join(BASE_DIR, "XGBoost", "xgboost_model", "predictions")

def fetch_prophet_forecasts():
    """Récupère les prédictions Prophet depuis Prophet_summary.json."""
    try:
        prophet_summary_file = os.path.join(FORECASTS_DIR, "Prophet_summary.json")
        prophet_data = {}
        
        if not os.path.exists(FORECASTS_DIR):
            logger.error(f"Le répertoire {FORECASTS_DIR} n'existe pas.")
            return {}
        
        if not os.path.exists(prophet_summary_file):
            logger.error(f"Le fichier {prophet_summary_file} n'existe pas.")
            return {}
        
        try:
            with open(prophet_summary_file, 'r', encoding='utf-8') as f:
                prophet_summary = json.load(f)
            
            for product_name, predictions in prophet_summary.items():
                if not predictions or not isinstance(predictions, list):
                    logger.warning(f"Données invalides pour le produit {product_name} dans {prophet_summary_file}.")
                    continue
                
                # Convertir en DataFrame
                df = pd.DataFrame(predictions)
                
                # Vérifier les colonnes requises
                required_columns = {'ds', 'yhat', 'yhat_lower', 'yhat_upper'}
                if not required_columns.issubset(df.columns):
                    logger.warning(f"Colonnes manquantes pour {product_name} dans {prophet_summary_file}. Colonnes trouvées : {list(df.columns)}")
                    continue
                
                prophet_data[product_name] = df
                logger.info(f"Prédictions Prophet chargées pour : {product_name}")
            
            return prophet_data
            
        except json.JSONDecodeError:
            logger.error(f"Le fichier {prophet_summary_file} n'est pas un JSON valide.")
            return {}
        except Exception as e:
            logger.error(f"Erreur lors de la lecture de {prophet_summary_file} : {e}")
            return {}
    
    except Exception as e:
        logger.error(f"Erreur dans fetch_prophet_forecasts : {e}")
        return {}

def fetch_xgboost_predictions():
    """Récupère les prédictions XGBoost depuis xgboost_summary.json."""
    try:
        xgboost_summary_file = os.path.join(PREDICTIONS_DIR, "xgboost_summary.json")
        xgboost_data = {}
        
        if not os.path.exists(PREDICTIONS_DIR):
            logger.error(f"Le répertoire {PREDICTIONS_DIR} n'existe pas.")
            return {}
        
        if not os.path.exists(xgboost_summary_file):
            logger.error(f"Le fichier {xgboost_summary_file} n'existe pas.")
            return {}
        
        try:
            with open(xgboost_summary_file, 'r', encoding='utf-8') as f:
                xgboost_summary = json.load(f)
            
            for product_name, predictions in xgboost_summary.items():
                if not predictions or not isinstance(predictions, list):
                    logger.warning(f"Données invalides pour le produit {product_name} dans {xgboost_summary_file}.")
                    continue
                
                # Vérifier les clés requises
                required_keys = ['nom_produit', 'quantité_prévue', 'stock_recommandé', 'prix_ajusté']
                valid_entries = [
                    entry for entry in predictions
                    if all(key in entry for key in required_keys)
                ]
                
                if not valid_entries:
                    logger.warning(f"Aucune entrée valide pour {product_name} dans {xgboost_summary_file}.")
                    continue
                
                xgboost_data[product_name] = valid_entries
                logger.info(f"Prédictions XGBoost chargées pour : {product_name}")
            
            return xgboost_data
            
        except json.JSONDecodeError:
            logger.error(f"Le fichier {xgboost_summary_file} n'est pas un JSON valide.")
            return {}
        except Exception as e:
            logger.error(f"Erreur lors de la lecture de {xgboost_summary_file} : {e}")
            return {}
    
    except Exception as e:
        logger.error(f"Erreur dans fetch_xgboost_predictions : {e}")
        return {}

def fetch_all_predictions():
    """Récupère toutes les prédictions Prophet et XGBoost."""
    logger.info("Début de la récupération des prédictions...")
    prophet_data = fetch_prophet_forecasts()
    xgboost_data = fetch_xgboost_predictions()
    return {
        "prophet": prophet_data,
        "xgboost": xgboost_data
    }

if __name__ == "__main__":
    # Pour tester l'exécution indépendante
    data = fetch_all_predictions()
    logger.info(f"Données récupérées : {len(data['prophet'])} produits Prophet, {len(data['xgboost'])} produits XGBoost")