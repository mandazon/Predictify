import React, { useState, useEffect } from 'react';
import StockForecast from '../components/StockForecast';
import PriceRecommendation from '../components/PriceRecommendation';
import MarketingStrategy from '../components/MarketingStrategy';
import SalesLineChart from '../components/SalesLineChart';
import ProductBarChart from '../components/ProductBarChart';
import MarketSharePieChart from '../components/MarketSharePieChart';
import ViewResultsButton from '../components/ViewResultsButton';

const Analysis = () => {
  // État pour stocker les données de l'API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Requête GET vers l'API au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/predictions/');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setProducts(data); // Stocke les données de l'API
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Le tableau vide signifie que la requête s'exécute une fois au montage

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="analysis-page">
        <header className="analysis-header">
          <h1>Analyse des Ventes et Prévisions</h1>
          <p>Chargement des données...</p>
        </header>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="analysis-page">
        <header className="analysis-header">
          <h1>Analyse des Ventes et Prévisions</h1>
          <p className="error">Erreur : {error}</p>
        </header>
      </div>
    );
  }

  return (
    <div className="analysis-page">
      <header className="analysis-header">
        <h1>Analyse des Ventes et Prévisions</h1>
        <p>
          Cette page fournit une analyse des ventes passées et des prévisions pour vous aider à optimiser les niveaux de stock,
          les prix recommandés, et les campagnes marketing. Consultez les prévisions ci-dessous pour ajuster vos actions.
        </p>
      </header>
      <div className="dashboard-container">
        <div className="charts-section">
          <div className="chart-full">
            <SalesLineChart />
          </div>
          <div className="chart-grid">
            <ProductBarChart />
            <MarketSharePieChart />
          </div>
        </div>
        <div className="recommendations-section">
          <div className="price-recommendation">
            <PriceRecommendation products={products} />
          </div>
          <MarketingStrategy />
          <StockForecast />
        </div>
      </div>
      <div className="results-button">
        <ViewResultsButton />
      </div>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

          .analysis-page {
            background-color: #f8fafc; 👉 Modifiable: Couleur de fond
            min-height: 100vh; 👉 Modifiable: Hauteur minimale
            padding: 2rem; 👉 Modifiable: Padding
            font-family: 'Inter', sans-serif;
          }

          .analysis-header {
            text-align: center;
            margin-bottom: 2rem; 👉 Modifiable: Marge inférieure
          }

          .analysis-header h1 {
            font-size: 2rem; 👉 Modifiable: Taille de la police
            font-weight: 600;
            color: #1D4ED8; 👉 Modifiable: Couleur du texte
            margin-bottom: 1rem; 👉 Modifiable: Marge inférieure
            letter-spacing: 0.05em; 👉 Modifiable: Espacement des lettres
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 👉 Modifiable: Ombre du texte
          }

          .analysis-header p {
            font-size: 1.1rem; 👉 Modifiable: Taille de la police
            font-weight: 400; 👉 Modifiable: Poids de la police
            color: #374151; 👉 Modifiable: Couleur du texte
            max-width: 800px; 👉 Modifiable: Largeur maximale
            margin: 0 auto;
            line-height: 1.6; 👉 Modifiable: Hauteur de ligne
          }

          .analysis-header .error {
            color: #B91C1C; 👉 Modifiable: Couleur du texte
          }

          .dashboard-container {
            max-width: 1200px; 👉 Modifiable: Largeur maximale
            margin: 0 auto;
            background-color: #f8fafc; 👉 Modifiable: Couleur de fond
            border-radius: 12px; 👉 Modifiable: Rayon de la bordure
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 👉 Modifiable: Ombre (couleur et dimensions)
            padding: 1.5rem; 👉 Modifiable: Padding
            display: grid;
            grid-template-columns: 8fr 4fr; 👉 Modifiable: Proportions des colonnes
            gap: 1.5rem; 👉 Modifiable: Espacement entre les colonnes
          }

          .charts-section {
            display: flex;
            flex-direction: column;
            gap: 1.5rem; 👉 Modifiable: Espacement entre les éléments
          }

          .chart-full {
            fall width: 100%; 👉 Modifiable: Largeur
          }

          .chart-grid {
            display: grid;
            grid-template-columns: 1fr 1fr; 👉 Modifiable: Proportions des colonnes
            gap: 1.5rem; 👉 PRÉVOIR: Modifiable: Espacement entre les colonnes
          }

          .recommendations-section {
            display: flex;
            flex-direction: column;
            gap: 1.5rem; 👉 Modifiable: Espacement entre les éléments
          }

          .price-recommendation {
            margin-top: 1.6875rem; 👉 Déplacement de 2,7 cm (environ 27mm, 1rem = 16px)
          }

          .results-button {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 5.5rem; 👉 Modifiable: Marge supérieure (2rem + 3.5rem pour 1.5cm)
            padding-bottom: 2rem; 👉 Modifiable: Padding inférieur pour espacement
          }

          @media (max-width: 1024px) {
            .dashboard-container {
              grid-template-columns: 1fr; 👉 Modifiable: Proportions des colonnes
            }

            .chart-grid {
              grid-template-columns: 1fr 1fr; 👉 Modifiable: Proportions des colonnes
            }
          }

          @media (max-width: 768px) {
            .dashboard-container {
              grid-template-columns: 1fr; 👉 Modifiable: Proportions des colonnes
              padding: 1rem; 👉 Modifiable: Padding
            }

            .chart-grid {
              grid-template-columns: 1fr; 👉 Modifiable: Proportions des colonnes
            }

            .analysis-page {
              padding: 1rem; 👉 Modifiable: Padding
            }

            .analysis-header h1 {
              font-size: 1.5rem; 👉 Modifiable: Taille de la police
              margin-bottom: 0.75rem; 👉 Modifiable: Marge inférieure
            }

            .analysis-header p {
              font-size: 0.95rem; 👉 Modifiable: Taille de la police
              line-height: 1.5; 👉 Modifiable: Hauteur de ligne
            }

            .results-button {
              margin-top: 4rem; 👉 Modifiable: Marge supérieure (1.5rem + 2.5rem pour 1.5cm)
              padding-bottom: 1rem; 👉 Modifiable: Padding inférieur
            }
          }
        `}
      </style>
    </div>
  );
};

export default Analysis;