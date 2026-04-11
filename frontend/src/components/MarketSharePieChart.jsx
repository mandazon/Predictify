import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/MarketSharePieChart.css';

// Données simulées pour les parts de marché (6 produits)
const mockMarketShareData = [
  { name: 'Forever Clean9', shortName: 'Clean9', value: 46.16, price: 183.33, stock: 126 },
  { name: 'Aloe Berry Nectar', shortName: 'Aloe Berry', value: 15.51, price: 91.35, stock: 85 },
  { name: 'Forever Aloe Vera Gel', shortName: 'Aloe Vera Gel', value: 11.62, price: 39.58, stock: 147 },
  { name: 'Forever Arctic Sea', shortName: 'Arctic Sea', value: 11.54, price: 45.83, stock: 126 },
  { name: 'Forever Active Pro-B', shortName: 'Active Pro-B', value: 8.05, price: 43.33, stock: 93 },
  { name: 'Forever Aloe Lips', shortName: 'Aloe Lips', value: 7.12, price: 14.42, stock: 247 },
];

// Palette de couleurs (identique à ProductBarChart)
const COLORS = [
  '#051C24', /* 👉 Modifiable: Couleur du segment */
  '#0B3D4A', /* 👉 Modifiable: Couleur du segment */
  '#1D8296', /* 👉 Modifiable: Couleur du segment */
  '#4AB1C2', /* 👉 Modifiable: Couleur du segment */
  '#88D3DE', /* 👉 Modifiable: Couleur du segment */
  '#CEEFF4', /* 👉 Modifiable: Couleur du segment */
];

const MarketSharePieChart = () => {
  // Fonction pour trier et limiter aux 6 premiers (inutile ici, conservée pour extensibilité)
  const getTopSixData = (data) => {
    return data.sort((a, b) => b.value - a.value).slice(0, 6);
  };

  // Fonction pour formater les noms en fonction de la taille de l’écran
  const formatName = (value, isMobile) => {
    const product = mockMarketShareData.find((item) => item.name === value);
    return isMobile ? product.shortName : value;
  };

  // Fonction de rendu personnalisée pour les labels
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.4; /* 👉 Modifiable: Position du label (facteur de radius) */
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    // Couleur du texte : sombre pour les segments clairs, clair pour les segments sombres
    const textColor = index >= 4 ? '#1f2937' : '#ffffff'; /* 👉 Modifiable: Couleur du texte */
    const isMobile = window.innerWidth <= 768;

    return (
      <text
        x={x}
        y={y}
        fill={textColor} /* 👉 Modifiable: Couleur du texte */
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: isMobile ? 10 : 12, fontWeight: '500', fontFamily: 'Inter, sans-serif' }} /* 👉 Modifiable: Taille de la police */
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };

  const topSixData = getTopSixData(mockMarketShareData);
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="market-share-chart">
      <h3 className="chart-title">Parts de marché des produits</h3>
      <ResponsiveContainer width="100%" height={300} /* 👉 Modifiable: Hauteur du conteneur */>
        <PieChart>
          <Pie
            data={topSixData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120} /* 👉 Modifiable: Rayon extérieur du graphique */
            label={renderCustomizedLabel}
            labelLine={false}
            paddingAngle={1} /* 👉 Modifiable: Espacement entre les segments */
          >
            {topSixData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /* 👉 Modifiable: Couleur de remplissage des segments */ />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}%`, formatName(name, isMobile)]}
            cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }} /* 👉 Modifiable: Couleur de fond du curseur */
          />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: isMobile ? '0.8rem' : '0.9rem', fontFamily: 'Inter, sans-serif', color: '#374151' }} /* 👉 Modifiable: Taille de la police et couleur du texte */
            formatter={(value) => formatName(value, isMobile)}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketSharePieChart;