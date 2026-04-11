import os
import pandas as pd
import logging
from sales_data_fetcher_combine import fetch_all_predictions

# Configuration des logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Répertoire de sortie pour les prédictions combinées
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "hybrid", "combined_predictions")

def normalize_product_name(name):
    """Normalise les noms de produits en remplaçant les espaces par des underscores."""
    return name.replace(" ", "_")

def combine_predictions(prophet_data, xgboost_data):
    """Combine les prédictions Prophet et XGBoost."""
    try:
        if not os.path.exists(OUTPUT_DIR):
            os.makedirs(OUTPUT_DIR)
            logger.info(f"Répertoire créé : {OUTPUT_DIR}")
        
        combined_predictions = {}
        
        # Normaliser les noms de produits
        prophet_products = {normalize_product_name(name): name for name in prophet_data.keys()}
        xgboost_products = {normalize_product_name(name): name for name in xgboost_data.keys()}
        
        # Liste des produits communs (basée sur les noms normalisés)
        common_products = set(prophet_products.keys()) & set(xgboost_products.keys())
        if not common_products:
            logger.error("Aucun produit commun trouvé entre Prophet et XGBoost.")
            return {}
        
        for normalized_product in common_products:
            try:
                # Récupérer les noms originaux
                prophet_name = prophet_products[normalized_product]
                xgboost_name = xgboost_products[normalized_product]
                
                # Récupérer les données
                prophet_df = prophet_data[prophet_name]
                xgboost_entries = xgboost_data[xgboost_name]
                
                # Convertir les données XGBoost en DataFrame
                xgboost_df = pd.DataFrame(xgboost_entries)
                
                # Vérifier les colonnes nécessaires
                prophet_required = {'ds', 'yhat'}
                xgboost_required = {'quantité_prévue', 'stock_recommandé', 'prix_ajusté'}
                if not prophet_required.issubset(prophet_df.columns):
                    logger.warning(f"Colonnes Prophet manquantes pour {prophet_name}. Colonnes trouvées : {list(prophet_df.columns)}")
                    continue
                if not xgboost_required.issubset(xgboost_df.columns):
                    logger.warning(f"Colonnes XGBoost manquantes pour {xgboost_name}. Colonnes trouvées : {list(xgboost_df.columns)}")
                    continue
                
                # Aligner les données
                if 'ds' in xgboost_df.columns:
                    # Fusionner sur la colonne 'ds' si présente
                    merged_df = pd.merge(
                        prophet_df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']],
                        xgboost_df[['ds', 'quantité_prévue', 'stock_recommandé', 'prix_ajusté']],
                        on='ds',
                        how='inner'
                    )
                else:
                    # Aligner par index si 'ds' est absent dans XGBoost
                    min_length = min(len(prophet_df), len(xgboost_df))
                    merged_df = prophet_df[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].iloc[:min_length].copy()
                    merged_df['quantité_prévue'] = xgboost_df['quantité_prévue'].iloc[:min_length]
                    merged_df['stock_recommandé'] = xgboost_df['stock_recommandé'].iloc[:min_length]
                    merged_df['prix_ajusté'] = xgboost_df['prix_ajusté'].iloc[:min_length]
                
                if merged_df.empty:
                    logger.warning(f"Aucune donnée combinée pour {prophet_name} (fusion vide).")
                    continue
                
                # Calculer la moyenne des prédictions
                merged_df['combined_quantity'] = (merged_df['yhat'] + merged_df['quantité_prévue']) / 2
                
                # Sauvegarder les résultats
                output_file = os.path.join(OUTPUT_DIR, f"combined_{normalized_product}.csv")
                merged_df.to_csv(output_file, index=False, encoding='utf-8')
                combined_predictions[normalized_product] = merged_df
                logger.info(f"Prédictions combinées générées pour {prophet_name} : {output_file}")
                
            except Exception as e:
                logger.error(f"Erreur lors de la combinaison pour {prophet_name} : {e}")
                continue
        
        return combined_predictions
    
    except Exception as e:
        logger.error(f"Erreur dans combine_predictions : {e}")
        return {}

if __name__ == "__main__":
    # Pour tester l'exécution indépendante
    logger.info("Début de la combinaison des prédictions...")
    all_data = fetch_all_predictions()
    combined_results = combine_predictions(all_data['prophet'], all_data['xgboost'])
    logger.info(f"Prédictions combinées générées pour {len(combined_results)} produits.")