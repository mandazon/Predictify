import React, { useState, useEffect } from 'react';
import '../styles/PriceRecommendation.css';

const PriceRecommendation = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Requête GET vers l'API pour récupérer les prédictions
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/predictions/');
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        // Limiter aux 6 premiers produits et transformer les données
        const topProducts = data.slice(0, 6).map(product => ({
          name: product.product_name,
          currentPrice: product.current_price || 0,
          recommendedPrice: product.recommended_price || 0,
        }));
        setProducts(topProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Affichage pendant le chargement
  if (loading) {
    return <div className="price-recommendation">Chargement des recommandations...</div>;
  }

  // Affichage en cas d'erreur
  if (error) {
    return <div className="price-recommendation">Erreur : {error}</div>;
  }

  return (
    <div className="price-recommendation">
      <h2 className="price-title">Recommandations de Prix</h2>
      <div className="table-container">
        <table className="price-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Prix Act.</th>
              <th>Prix Cons.</th>
              <th className="difference-column">Différence</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => {
                const difference = product.recommendedPrice - product.currentPrice;
                return (
                  <tr key={index} className="table-row">
                    <td>{product.name}</td>
                    <td className="current-price">{`€${product.currentPrice.toFixed(2)}`}</td>
                    <td className="recommended-price">{`€${product.recommendedPrice.toFixed(2)}`}</td>
                    <td className={`difference ${difference < 0 ? 'negative' : 'positive'} difference-column`}>
                      {difference > 0 ? '+' : ''}{`€${difference.toFixed(2)}`}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="no-data">Aucune donnée de produit disponible.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceRecommendation;