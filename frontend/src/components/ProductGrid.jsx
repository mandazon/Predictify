import React, { useState, useEffect } from 'react';
import '../styles/ProductGrid.css'; // Importation des styles

// Composant ProductGrid
const ProductGrid = () => {
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
        // Limiter aux 6 premiers produits
        const topProducts = data.slice(0, 6).map(product => ({
          name: product.product_name,
          adjustedPrice: product.recommended_price,
          recommendedStock: product.recommended_stock,
          image: product.image || 'https://via.placeholder.com/150?text=Image+Manquante' // Fallback si image est null
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
    return <div className="product-grid">Chargement des prédictions...</div>;
  }

  // Affichage en cas d'erreur
  if (error) {
    return <div className="product-grid">Erreur : {error}</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <div key={index} className="product-card">
          <div className="tooltip">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
            <span className="tooltip-text">
              Nom produit : {product.name}<br />
              Prix ajusté : €{product.adjustedPrice.toFixed(2)}<br />
              Stock 30 jours recommandé : {product.recommendedStock}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;