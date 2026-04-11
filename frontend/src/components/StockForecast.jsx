import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/StockForecast.css';

// Mapping pour abréger les noms de produits sur mobile
const productShortNames = {
  'Forever Clean9': 'Clean9',
  'Aloe Berry Nectar': 'Aloe Berry',
  'Forever Aloe Vera Gel': 'Aloe Vera Gel',
  'Forever Arctic Sea': 'Arctic Sea',
  'Forever Active Pro-B': 'Active Pro-B',
  'Forever Aloe Lips': 'Aloe Lips',
};

const StockForecast = () => {
  const [stockData, setStockData] = useState([]);
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
          product: product.product_name,
          recommendedStock: product.recommended_stock,
          shortName: productShortNames[product.product_name] || product.product_name,
        }));
        setStockData(topProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  // Fonction pour formater les étiquettes en fonction de la taille de l’écran
  const formatTick = (value, isMobile) => {
    return isMobile ? productShortNames[value] || value : value;
  };

  const isMobile = window.innerWidth <= 768;

  // Affichage pendant le chargement
  if (loading) {
    return <div className="stock-forecast">Chargement des prévisions...</div>;
  }

  // Affichage en cas d'erreur
  if (error) {
    return <div className="stock-forecast">Erreur : {error}</div>;
  }

  return (
    <div className="stock-forecast">
      <h3 className="chart-title">Prévisions de Stock</h3>
      <p className="chart-description">
        Niveaux de stock recommandés pour les six meilleurs produits, basés sur les tendances de vente.
      </p>
      <ResponsiveContainer width="100%" height={300} /* 👉 Modifiable: Hauteur du conteneur */>
        <BarChart
          data={stockData}
          margin={isMobile ? { top: 10, right: 20, left: 10, bottom: 10 } : { top: 20, right: 30, left: 20, bottom: 20 }} /* 👉 Modifiable: Marges (top, right, left, bottom) */
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /* 👉 Modifiable: Couleur et style de la grille */ />
          <XAxis
            dataKey="product"
            tickFormatter={(value) => formatTick(value, isMobile)}
            tick={{ fontSize: isMobile ? 10 : 12, fill: '#374151' }} /* 👉 Modifiable: Taille de la police et couleur du texte */
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60} /* 👉 Modifiable: Hauteur de l'axe */
          />
          <YAxis
            label={{ value: 'Stock recommandé (unités)', angle: -90, position: 'insideLeft', fill: '#374151', fontFamily: 'Inter, sans-serif' }} /* 👉 Modifiable: Couleur du texte de l'étiquette */
            tick={{ fontSize: isMobile ? 10 : 12, fill: '#374151' }} /* 👉 Modifiable: Taille de la police et couleur du texte */
            beginAtZero
          />
          <Tooltip
            formatter={(value) => [`${value} unités`, 'Stock recommandé']}
            cursor={{ fill: 'rgba(0, 113, 152, 0.2)' }} /* 👉 Modifiable: Couleur de fond du curseur */
          />
          <Bar dataKey="recommendedStock" fill="#007198" /* 👉 Modifiable: Couleur de remplissage des barres */ />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockForecast;