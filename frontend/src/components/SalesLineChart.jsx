import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip
} from 'chart.js';
import '../styles/SalesLineChart.css';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip);

// Données simulées avec fluctuations pour juillet à octobre
const mockData = [
  // Forever Clean9
  { date: '2025-06-01', sales: 46.16, forecast: null, product: 'Forever Clean9' },
  { date: '2025-06-02', sales: 45.80, forecast: null, product: 'Forever Clean9' },
  { date: '2025-06-03', sales: 47.20, forecast: null, product: 'Forever Clean9' },
  { date: '2025-06-04', sales: 46.50, forecast: null, product: 'Forever Clean9' },
  { date: '2025-06-05', sales: 48.10, forecast: null, product: 'Forever Clean9' },
  { date: '2025-06-06', sales: 47.90, forecast: null, product: 'Forever Clean9' },
  { date: '2025-07-01', sales: null, forecast: 48.50, product: 'Forever Clean9' },
  { date: '2025-07-02', sales: null, forecast: 48.80, product: 'Forever Clean9' },
  { date: '2025-07-03', sales: null, forecast: 49.30, product: 'Forever Clean9' },
  { date: '2025-08-01', sales: null, forecast: 49.60, product: 'Forever Clean9' },
  { date: '2025-08-02', sales: null, forecast: 50.00, product: 'Forever Clean9' },
  { date: '2025-08-03', sales: null, forecast: 49.80, product: 'Forever Clean9' },
  { date: '2025-09-01', sales: null, forecast: 50.50, product: 'Forever Clean9' },
  { date: '2025-09-02', sales: null, forecast: 50.10, product: 'Forever Clean9' },
  { date: '2025-09-03', sales: null, forecast: 50.30, product: 'Forever Clean9' },
  { date: '2025-10-01', sales: null, forecast: 50.60, product: 'Forever Clean9' },
  { date: '2025-10-02', sales: null, forecast: 51.00, product: 'Forever Clean9' },
  { date: '2025-10-03', sales: null, forecast: 50.80, product: 'Forever Clean9' },
  // Aloe Berry
  { date: '2025-06-01', sales: 32.50, forecast: null, product: 'Aloe Berry' },
  { date: '2025-06-02', sales: 33.10, forecast: null, product: 'Aloe Berry' },
  { date: '2025-06-03', sales: 31.80, forecast: null, product: 'Aloe Berry' },
  { date: '2025-07-01', sales: null, forecast: 34.00, product: 'Aloe Berry' },
  { date: '2025-07-02', sales: null, forecast: 34.30, product: 'Aloe Berry' },
  { date: '2025-07-03', sales: null, forecast: 34.50, product: 'Aloe Berry' },
  { date: '2025-08-01', sales: null, forecast: 34.80, product: 'Aloe Berry' },
  { date: '2025-08-02', sales: null, forecast: 35.20, product: 'Aloe Berry' },
  { date: '2025-08-03', sales: null, forecast: 35.00, product: 'Aloe Berry' },
  { date: '2025-09-01', sales: null, forecast: 35.30, product: 'Aloe Berry' },
  { date: '2025-09-02', sales: null, forecast: 35.70, product: 'Aloe Berry' },
  { date: '2025-09-03', sales: null, forecast: 35.50, product: 'Aloe Berry' },
  { date: '2025-10-01', sales: null, forecast: 35.80, product: 'Aloe Berry' },
  { date: '2025-10-02', sales: null, forecast: 36.20, product: 'Aloe Berry' },
  { date: '2025-10-03', sales: null, forecast: 36.00, product: 'Aloe Berry' },
  // Forever Aloe Lips
  { date: '2025-06-01', sales: 25.30, forecast: null, product: 'Forever Aloe Lips' },
  { date: '2025-06-02', sales: 26.10, forecast: null, product: 'Forever Aloe Lips' },
  { date: '2025-07-01', sales: null, forecast: 27.00, product: 'Forever Aloe Lips' },
  { date: '2025-07-02', sales: null, forecast: 27.20, product: 'Forever Aloe Lips' },
  { date: '2025-07-03', sales: null, forecast: 26.80, product: 'Forever Aloe Lips' },
  { date: '2025-08-01', sales: null, forecast: 27.40, product: 'Forever Aloe Lips' },
  { date: '2025-08-02', sales: null, forecast: 27.70, product: 'Forever Aloe Lips' },
  { date: '2025-08-03', sales: null, forecast: 27.50, product: 'Forever Aloe Lips' },
  { date: '2025-09-01', sales: null, forecast: 27.90, product: 'Forever Aloe Lips' },
  { date: '2025-09-02', sales: null, forecast: 28.20, product: 'Forever Aloe Lips' },
  { date: '2025-09-03', sales: null, forecast: 28.00, product: 'Forever Aloe Lips' },
  { date: '2025-10-01', sales: null, forecast: 28.30, product: 'Forever Aloe Lips' },
  { date: '2025-10-02', sales: null, forecast: 28.60, product: 'Forever Aloe Lips' },
  { date: '2025-10-03', sales: null, forecast: 28.50, product: 'Forever Aloe Lips' },
  // Forever Freedom
  { date: '2025-06-01', sales: 38.20, forecast: null, product: 'Forever Freedom' },
  { date: '2025-06-02', sales: 39.00, forecast: null, product: 'Forever Freedom' },
  { date: '2025-07-01', sales: null, forecast: 40.00, product: 'Forever Freedom' },
  { date: '2025-07-02', sales: null, forecast: 40.20, product: 'Forever Freedom' },
  { date: '2025-07-03', sales: null, forecast: 39.80, product: 'Forever Freedom' },
  { date: '2025-08-01', sales: null, forecast: 40.40, product: 'Forever Freedom' },
  { date: '2025-08-02', sales: null, forecast: 40.70, product: 'Forever Freedom' },
  { date: '2025-08-03', sales: null, forecast: 40.50, product: 'Forever Freedom' },
  { date: '2025-09-01', sales: null, forecast: 40.90, product: 'Forever Freedom' },
  { date: '2025-09-02', sales: null, forecast: 41.20, product: 'Forever Freedom' },
  { date: '2025-09-03', sales: null, forecast: 41.00, product: 'Forever Freedom' },
  { date: '2025-10-01', sales: null, forecast: 41.30, product: 'Forever Freedom' },
  { date: '2025-10-02', sales: null, forecast: 41.60, product: 'Forever Freedom' },
  { date: '2025-10-03', sales: null, forecast: 41.50, product: 'Forever Freedom' },
  // Forever Lite Ultra
  { date: '2025-06-01', sales: 42.70, forecast: null, product: 'Forever Lite Ultra' },
  { date: '2025-06-02', sales: 43.20, forecast: null, product: 'Forever Lite Ultra' },
  { date: '2025-07-01', sales: null, forecast: 44.00, product: 'Forever Lite Ultra' },
  { date: '2025-07-02', sales: null, forecast: 44.20, product: 'Forever Lite Ultra' },
  { date: '2025-07-03', sales: null, forecast: 43.80, product: 'Forever Lite Ultra' },
  { date: '2025-08-01', sales: null, forecast: 44.40, product: 'Forever Lite Ultra' },
  { date: '2025-08-02', sales: null, forecast: 44.70, product: 'Forever Lite Ultra' },
  { date: '2025-08-03', sales: null, forecast: 44.50, product: 'Forever Lite Ultra' },
  { date: '2025-09-01', sales: null, forecast: 44.90, product: 'Forever Lite Ultra' },
  { date: '2025-09-02', sales: null, forecast: 45.20, product: 'Forever Lite Ultra' },
  { date: '2025-09-03', sales: null, forecast: 45.00, product: 'Forever Lite Ultra' },
  { date: '2025-10-01', sales: null, forecast: 45.30, product: 'Forever Lite Ultra' },
  { date: '2025-10-02', sales: null, forecast: 45.60, product: 'Forever Lite Ultra' },
  { date: '2025-10-03', sales: null, forecast: 45.50, product: 'Forever Lite Ultra' },
  // Forever Active Pro-B
  { date: '2025-06-01', sales: 29.90, forecast: null, product: 'Forever Active Pro-B' },
  { date: '2025-06-02', sales: 30.40, forecast: null, product: 'Forever Active Pro-B' },
  { date: '2025-07-01', sales: null, forecast: 31.50, product: 'Forever Active Pro-B' },
  { date: '2025-07-02', sales: null, forecast: 31.70, product: 'Forever Active Pro-B' },
  { date: '2025-07-03', sales: null, forecast: 31.30, product: 'Forever Active Pro-B' },
  { date: '2025-08-01', sales: null, forecast: 31.90, product: 'Forever Active Pro-B' },
  { date: '2025-08-02', sales: null, forecast: 32.20, product: 'Forever Active Pro-B' },
  { date: '2025-08-03', sales: null, forecast: 32.00, product: 'Forever Active Pro-B' },
  { date: '2025-09-01', sales: null, forecast: 32.40, product: 'Forever Active Pro-B' },
  { date: '2025-09-02', sales: null, forecast: 32.70, product: 'Forever Active Pro-B' },
  { date: '2025-09-03', sales: null, forecast: 32.50, product: 'Forever Active Pro-B' },
  { date: '2025-10-01', sales: null, forecast: 32.90, product: 'Forever Active Pro-B' },
  { date: '2025-10-02', sales: null, forecast: 33.20, product: 'Forever Active Pro-B' },
  { date: '2025-10-03', sales: null, forecast: 33.00, product: 'Forever Active Pro-B' },
];

const SalesLineChart = () => {
  // Calculer les labels
  const labels = [...new Set(mockData.map(entry => entry.date))].sort();

  // Données statiques pour les ventes passées
  const staticSalesDatasets = [...new Set(mockData.map(entry => entry.product))].map((product, index) => ({
    label: `${product} - Ventes passées`,
    data: labels.map(date => {
      const entry = mockData.find(e => e.date === date && e.product === product);
      return entry?.sales || null;
    }),
    borderColor: `rgba(107, 114, 128, ${0.8 + index * 0.05})`, /* #6B7280 (gris) avec variations */
    backgroundColor: `rgba(107, 114, 128, ${0.3 + index * 0.05})`, /* Remplissage léger */
    pointRadius: 6,
    pointStyle: 'circle',
    pointHoverRadius: 8,
    pointBackgroundColor: `rgba(107, 114, 128, ${0.8 + index * 0.05})`,
    pointBorderColor: '#FFFFFF',
    pointBorderWidth: 2,
    tension: 0, /* Lignes droites pour effet ECG */
    fill: true,
    borderWidth: 3,
    animation: false, /* Désactiver toute animation Chart.js pour les ventes passées */
  }));

  // Journalisation pour vérifier les données des ventes passées
  console.log('Datasets ventes passées (doivent rester inchangés):', staticSalesDatasets);

  // Données initiales pour les prévisions
  const initialForecastDatasets = [...new Set(mockData.map(entry => entry.product))].map((product, index) => ({
    label: `${product} - Prévisions`,
    originalData: labels.map(date => {
      const entry = mockData.find(e => e.date === date && e.product === product);
      return entry?.forecast || null;
    }),
    data: labels.map(date => {
      const entry = mockData.find(e => e.date === date && e.product === product);
      return entry?.forecast || null;
    }),
    borderColor: `rgba(59, 130, 246, ${0.8 + index * 0.05})`, /* #3B82F6 (bleu) avec variations */
    backgroundColor: `rgba(59, 130, 246, ${0.3 + index * 0.05})`, /* Remplissage léger */
    pointRadius: 6,
    pointStyle: 'circle',
    pointHoverRadius: 8,
    pointBackgroundColor: `rgba(59, 130, 246, ${0.8 + index * 0.05})`,
    pointBorderColor: '#FFFFFF',
    pointBorderWidth: 2,
    tension: 0, /* Lignes droites pour effet ECG */
    fill: true,
    borderWidth: 3,
    animation: {
      duration: 1200,
      easing: 'easeOutExpo', /* Animation pour les prévisions uniquement */
    },
  }));

  // État pour les datasets des prévisions uniquement
  const [forecastDatasets, setForecastDatasets] = useState(initialForecastDatasets);

  // Combiner les datasets statiques (ventes passées) et dynamiques (prévisions)
  const chartData = {
    labels,
    datasets: [
      ...staticSalesDatasets, // Datasets statiques pour les ventes passées
      ...forecastDatasets, // Datasets dynamiques pour les prévisions
    ],
  };

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setForecastDatasets(prevDatasets => {
        const newDatasets = prevDatasets.map(dataset => {
          const elapsedTime = (Date.now() - startTime) / 1000; // Temps écoulé en secondes
          const amplitude = 5.0; // Amplitude constante de 5.0
          const newData = dataset.originalData.map(value => {
            if (value !== null) {
              return value + amplitude * Math.sin(elapsedTime * 2); // Oscillation sinusoïdale
            }
            return value;
          });
          // Journalisation pour débogage
          console.log(`Mise à jour prévisions pour ${dataset.label}:`, newData);
          return { ...dataset, data: [...newData] };
        });
        return newDatasets;
      });
    }, 100); // Mise à jour toutes les 100ms pour réduire les redessinages

    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, /* Supprimer la légende */
      },
      title: {
        display: true,
        text: 'Évolution des Ventes et Prévisions (Juin - Octobre 2025)',
        font: {
          size: 20,
          family: 'Inter, sans-serif',
          weight: '700',
        },
        color: '#344D59', /* Bleu-gris foncé pour texte */
        padding: {
          top: 15,
          bottom: 25,
        },
      },
      tooltip: {
        backgroundColor: '#344D59', /* Fond futuriste */
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          color: 'rgba(184, 203, 208, 0.2)', /* #B8CBD0 avec opacité */
          borderColor: '#000000', /* Axe X noir */
          borderWidth: 20, /* Dix fois plus épais */
        },
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            family: 'Inter, sans-serif',
            weight: '600',
          },
          color: '#344D59',
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          color: '#344D59',
          maxRotation: 45,
          minRotation: 45,
        },
        animation: false, /* Désactiver animation de l'axe X */
      },
      y: {
        min: 20, /* Plage fixe pour empêcher le mouvement */
        max: 60, /* Englobe toutes les données, y compris oscillations */
        suggestedMin: 20, /* Renforcer la plage fixe */
        suggestedMax: 60, /* Renforcer la plage fixe */
        grid: {
          color: 'rgba(184, 203, 208, 0.2)', /* #B8CBD0 avec opacité */
          borderColor: '#000000', /* Axe Y noir */
          borderWidth: 20, /* Dix fois plus épais */
        },
        title: {
          display: true,
          text: 'Ventes/Prévisions (%)',
          font: {
            size: 14,
            family: 'Inter, sans-serif',
            weight: '600',
          },
          color: '#344D59',
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          color: '#344D59',
          stepSize: 5, /* Espacement régulier pour lisibilité */
        },
        animation: false, /* Désactiver toute animation de l'axe Y */
      },
    },
    animation: false, /* Désactiver animations globales */
    elements: {
      point: {
        hoverBorderWidth: 3,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)', /* Effet de lueur */
      },
      line: {
        borderCapStyle: 'round',
      },
    },
    backgroundColor: '#FFFFFF', /* Fond blanc */
  };

  return (
    <div className="sales-line-chart">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SalesLineChart;