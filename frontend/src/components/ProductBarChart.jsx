import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/ProductBarChart.css';

// Données simulées pour les prévisions de ventes (6 produits)
const mockProductData = [
  { product: 'Forever Clean9', shortName: 'Clean9', forecast: 46.16, price: 183.33, stock: 126 },
  { product: 'Aloe Berry Nectar', shortName: 'Aloe Berry', forecast: 15.51, price: 91.35, stock: 85 },
  { product: 'Forever Aloe Vera Gel', shortName: 'Aloe Vera Gel', forecast: 11.62, price: 39.58, stock: 147 },
  { product: 'Forever Arctic Sea', shortName: 'Arctic Sea', forecast: 11.54, price: 45.83, stock: 126 },
  { product: 'Forever Active Pro-B', shortName: 'Active Pro-B', forecast: 8.05, price: 43.33, stock: 93 },
  { product: 'Forever Aloe Lips', shortName: 'Aloe Lips', forecast: 7.12, price: 14.42, stock: 247 },
];

const ProductBarChart = () => {
  // Fonction pour trier et limiter aux 6 premiers (inutile ici, mais conservée pour extensibilité)
  const getTopProducts = (data) => {
    return data.sort((a, b) => b.forecast - a.forecast).slice(0, 6);
  };

  // Fonction pour formater les étiquettes en fonction de la taille de l’écran
  const formatTick = (value, isMobile) => {
    const product = mockProductData.find((item) => item.product === value);
    return isMobile ? product.shortName : value;
  };

  const topProducts = getTopProducts(mockProductData);

  // Palette de couleurs pour les barres (correspondant à MarketSharePieChart)
  const colorPalette = [
    '#051C24', // Dark teal /* 👉 Modifiable: Couleur de la barre */
    '#0B3D4A', /* 👉 Modifiable: Couleur de la barre */
    '#1D8296', /* 👉 Modifiable: Couleur de la barre */
    '#4AB1C2', /* 👉 Modifiable: Couleur de la barre */
    '#88D3DE', /* 👉 Modifiable: Couleur de la barre */
    '#CEEFF4', // Light teal /* 👉 Modifiable: Couleur de la barre */
  ];

  // Détection de la taille de l’écran pour ajuster le formatage
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="product-bar-chart">
      <h3 className="chart-title">Prévisions de ventes des produits</h3>
      <ResponsiveContainer width="100%" height={300} /* 👉 Modifiable: Hauteur du conteneur */>
        <BarChart
          data={topProducts}
          margin={isMobile ? { top: 10, right: 20, left: 10, bottom: 10 } : { top: 20, right: 30, left: 20, bottom: 20 }} /* 👉 Modifiable: Marges (top, right, left, bottom) */
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /* 👉 Modifiable: Couleur et style de la grille */ />
          <XAxis
            dataKey="product"
            tickFormatter={(value) => formatTick(value, isMobile)}
            tick={{ fontSize: isMobile ? 10 : 12, fill: '#374151' }} /* 👉 Modifiable: Taille de la police et couleur du texte */
            interval={0}
            angle={isMobile ? -60 : -45} /* 👉 Modifiable: Angle des étiquettes */
            textAnchor="end"
            height={60} /* 👉 Modifiable: Hauteur de l'axe */
          />
          <YAxis
            label={{ value: 'Prévisions (%)', angle: -90, position: 'insideLeft', fill: '#374151', fontFamily: 'Inter, sans-serif' }} /* 👉 Modifiable: Couleur du texte de l'étiquette */
            tick={{ fontSize: isMobile ? 10 : 12, fill: '#374151' }} /* 👉 Modifiable: Taille de la police et couleur du texte */
          />
          <Tooltip
            formatter={(value) => [`${value}%`, 'Prévisions']}
            cursor={{ fill: 'rgba(29, 78, 216, 0.2)' }} /* 👉 Modifiable: Couleur de fond du curseur */
          />
          {topProducts.map((entry, index) => (
            <Bar
              key={entry.product}
              dataKey="forecast"
              fill={colorPalette[index % colorPalette.length]} /* 👉 Modifiable: Couleur de remplissage des barres */
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductBarChart;