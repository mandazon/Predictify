import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Line, Tooltip } from 'recharts';
import { FaTrafficLight, FaInstagram, FaEnvelope, FaSearch, FaShoppingCart, FaFlagCheckered, FaTiktok, FaFacebook, FaTwitter, FaComment } from 'react-icons/fa';
import '../styles/MarketingStrategy.css';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: undefined });
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
};

const MarketingStrategy = () => {
  const { width } = useWindowSize();
  const chartWidth = width < 768 ? width - 40 : 960;
  const iconSize = width < 768 ? 24 : 32;
  const fontSize = width < 768 ? 12 : 14;

  const products = [
    {
      name: 'Forever Arctic Sea',
      price: 45.83,
      stock: 126,
      target: 'Hommes/femmes 35-55 ans, santé cardiovasculaire',
      strategies: [
        { title: 'Meta Ads', description: 'Vidéo éducative sur oméga-3 (20 €/jour, retargeting inclus)', icon: <FaFacebook className="text-blue-600 hover:text-blue-800" size={iconSize} /> },
        { title: 'Instagram', description: 'Reels avec témoignage client authentique', icon: <FaInstagram className="text-pink-500 hover:text-pink-700" size={iconSize} /> },
        { title: 'Email', description: 'Relance panier abandonné (-10 % + livraison gratuite)', icon: <FaEnvelope className="text-orange-500 hover:text-orange-700" size={iconSize} /> },
        { title: 'SEO', description: 'Article « Meilleurs compléments oméga-3 pour le cœur »', icon: <FaSearch className="text-green-500 hover:text-green-700" size={iconSize} /> },
      ],
      action: 'Lancer Meta Ads avec Pixel Facebook pour suivre conversions',
    },
    {
      name: 'Forever Clean9',
      price: 183.33,
      stock: 126,
      target: 'Femmes 25-45 ans, perte de poids',
      strategies: [
        { title: 'TikTok', description: 'Vidéo avant/après (15 sec, musique virale)', icon: <FaTiktok className="text-black hover:text-gray-700" size={iconSize} /> },
        { title: 'Instagram', description: 'Story routine fitness + défi communautaire #Clean9Challenge', icon: <FaInstagram className="text-pink-500 hover:text-pink-700" size={iconSize} /> },
        { title: 'Email', description: 'Offre paiement 3x + réduction 15 %', icon: <FaEnvelope className="text-orange-500 hover:text-orange-700" size={iconSize} /> },
        { title: 'Influenceur', description: 'Unboxing par micro-influenceur fitness (10k-50k abonnés)', icon: <FaInstagram className="text-pink-500 hover:text-pink-700" size={iconSize} /> },
      ],
      action: 'Pub Meta Ads (25 €/jour, test carrousel/vidéo)',
    },
    {
      name: 'Forever Active Pro-B',
      price: 43.33,
      stock: 93,
      target: 'Sportifs 25-40 ans, digestion optimale',
      strategies: [
        { title: 'Instagram', description: 'Reels animés sur bienfaits probiotiques', icon: <FaInstagram className="text-pink-500 hover:text-pink-700" size={iconSize} /> },
        { title: 'Email', description: 'Newsletter « Probiotiques pour sportifs » + code promo', icon: <FaEnvelope className="text-orange-500 hover:text-orange-700" size={iconSize} /> },
        { title: 'SEO', description: 'Article « Probiotiques pour une digestion optimale »', icon: <FaSearch className="text-green-500 hover:text-green-700" size={iconSize} /> },
        { title: 'SMS', description: 'Offre flash (-15 % ce week-end)', icon: <FaComment className="text-blue-500 hover:text-blue-700" size={iconSize} /> },
      ],
      action: 'Collab avec micro-influenceur fitness (code promo tracké)',
    },
    {
      name: 'Forever Aloe Lips',
      price: 14.42,
      stock: 247,
      target: 'Jeunes 18-35 ans, usage quotidien',
      strategies: [
        { title: 'TikTok', description: 'Vidéo lifestyle hydratation lèvres (15 sec)', icon: <FaTiktok className="text-black hover:text-gray-700" size={iconSize} /> },
        { title: 'Instagram', description: 'Story saisonnière (hiver/été) + swipe-up', icon: <FaInstagram className="text-pink-500 hover:text-pink-700" size={iconSize} /> },
        { title: 'Upsell', description: 'Bundle Aloe Lips + Aloe Vera Gel au checkout', icon: <FaShoppingCart className="text-blue-500 hover:text-blue-700" size={iconSize} /> },
        { title: 'Influenceurs', description: 'Envoi à 5 micro-créatrices beauté (5k-20k abonnés)', icon: <FaInstagram className="text-pink-500 hover:text-pink-700" size={iconSize} /> },
      ],
      action: 'Pub Instagram Reels (15 €/jour, test 2 créatifs)',
    },
    {
      name: 'Forever Aloe Vera Gel',
      price: 39.58,
      stock: 147,
      target: 'Adultes actifs 30-50 ans, digestion & immunité',
      strategies: [
        { title: 'Meta Ads', description: 'Vidéo routine matinale avec gel (20 €/jour, retargeting)', icon: <FaFacebook className="text-blue-600 hover:text-blue-800" size={iconSize} /> },
        { title: 'TikTok', description: 'Vidéo « Comment intégrer l’aloe dans votre journée »', icon: <FaTiktok className="text-black hover:text-gray-700" size={iconSize} /> },
        { title: 'SEO', description: 'Article « 5 bienfaits prouvés de l’aloe vera »', icon: <FaSearch className="text-green-500 hover:text-green-700" size={iconSize} /> },
        { title: 'Bundle', description: 'Pack Gel + Active Pro-B à prix réduit', icon: <FaShoppingCart className="text-blue-500 hover:text-blue-700" size={iconSize} /> },
      ],
      action: 'Optimiser page produit (SEO, avis clients, images HD)',
    },
    {
      name: 'Aloe Berry Nectar',
      price: 91.35,
      stock: 85,
      target: 'Femmes 25-50 ans, vitalité',
      strategies: [
        { title: 'TikTok', description: 'Vidéo petit-déjeuner énergétique (20 sec)', icon: <FaTiktok className="text-black hover:text-gray-700" size={iconSize} /> },
        { title: 'Instagram', description: 'Post lifestyle sain + carrousel bienfaits', icon: <FaInstagram className="text-pink-500 hover:text-pink-700" size={iconSize} /> },
        { title: 'Email', description: 'Relance panier + livraison gratuite (72h)', icon: <FaEnvelope className="text-orange-500 hover:text-orange-700" size={iconSize} /> },
        { title: 'SMS', description: 'Offre limitée « -10 % sur votre 1er achat »', icon: <FaComment className="text-blue-500 hover:text-blue-700" size={iconSize} /> },
      ],
      action: 'Pub Meta Ads (20 €/jour, vidéo + retargeting)',
    },
  ];

  const [implementedStrategies, setImplementedStrategies] = useState(
    products.reduce((acc, product, productIndex) => {
      acc[productIndex] = new Array(product.strategies.length).fill(false);
      return acc;
    }, {})
  );

  const [openAccordions, setOpenAccordions] = useState(
    products.reduce((acc, _, productIndex) => {
      acc[productIndex] = false;
      return acc;
    }, {})
  );

  // eslint-disable-next-line no-unused-vars
  const handleStepClick = (productIndex, strategyIndex) => {
    setImplementedStrategies((prev) => ({
      ...prev,
      [productIndex]: prev[productIndex].map((checked, idx) =>
        idx === strategyIndex ? !checked : checked
      ),
    }));
  };

  const toggleAccordion = (productIndex) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [productIndex]: !prev[productIndex],
    }));
  };

  const isMobile = width <= 768;

  const CustomScatter = ({ cx, cy, payload, productIndex }) => {
    const isSelected =
      payload.step === 'Départ' ||
      payload.step === 'Objectif' ||
      (payload.index !== undefined && implementedStrategies[productIndex][payload.index]);
    return (
      <g>
        <rect
          x={cx - iconSize / 2}
          y={cy - iconSize / 2}
          width={iconSize}
          height={iconSize}
          fill="transparent"
          stroke={isSelected ? '#16A34A' : 'none'}
          strokeWidth={2}
          rx={4}
        />
        <foreignObject x={cx - iconSize / 2} y={cy - iconSize / 2} width={iconSize} height={iconSize}>
          <div className="flex items-center justify-center">{payload.icon}</div>
        </foreignObject>
        <text x={cx} y={cy + iconSize + 12} textAnchor="middle" fontSize={fontSize} fill="#111827">
          {payload.step}
        </text>
      </g>
    );
  };

  return (
    <div className="marketing-strategy">
      <h2 className="marketing-title">🎯 Feuille de route Marketing</h2>
      {products.map((product, productIndex) => {
        const roadmapData = [
          { step: 'Départ', order: 1, details: `Lancement de la campagne pour ${product.name}`, productName: product.name, icon: <FaTrafficLight className="text-green-500 hover:text-green-700" size={iconSize} /> },
          ...product.strategies.map((strategy, index) => ({
            step: strategy.title,
            order: index + 2,
            details: strategy.description,
            icon: strategy.icon,
            index,
          })),
          { step: 'Objectif', order: product.strategies.length + 2, details: product.action, icon: <FaFlagCheckered className="text-black hover:text-gray-700" size={iconSize} /> },
        ];

        return (
          <div key={productIndex} className="product-strategies">
            <h3
              className="product-name"
              onClick={() => isMobile && toggleAccordion(productIndex)}
            >
              {product.name}
              {isMobile && (
                <span className="accordion-toggle">{openAccordions[productIndex] ? '−' : '+'}</span>
              )}
            </h3>
            <p className={`product-target ${isMobile && !openAccordions[productIndex] ? 'hidden' : ''}`}>
              <strong>Ciblage :</strong> {product.target} | <strong>Prix :</strong> €{product.price.toFixed(2)} | <strong>Stock :</strong> {product.stock}
            </p>
            <div className={`strategy-roadmap ${isMobile && !openAccordions[productIndex] ? 'hidden' : ''}`}>
              <ScatterChart
                width={chartWidth}
                height={120}
                margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="order" type="number" domain={[1, roadmapData.length]} hide />
                <YAxis hide />
                <Scatter
                  name="Stratégies"
                  data={roadmapData}
                  shape={(props) => <CustomScatter {...props} productIndex={productIndex} />}
                />
                <Line
                  type="monotone"
                  dataKey="order"
                  stroke="#16A34A"
                  strokeWidth={4}
                  dot={false}
                  activeDot={false}
                  data={roadmapData.map((entry) => ({ order: entry.order }))}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="custom-tooltip">
                          <p className="font-semibold">{data.step}</p>
                          {data.step === 'Départ' && (
                            <p className="font-medium">Produit : {data.productName}</p>
                          )}
                          <p>{data.details}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </ScatterChart>
            </div>
          </div>
        );
      })}
      <div className="global-advice">
        <h3 className="advice-title">✅ Conseil global</h3>
        <p className="advice-description">
          Commencez par Aloe Lips et Aloe Vera Gel (bons stocks, prix accessibles). Analysez les performances après une semaine et réallouez le budget vers les produits les plus rentables.
        </p>
      </div>
      <div className="flex justify-center space-x-4 mt-6">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="text-blue-500 text-3xl hover:text-blue-700" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-blue-600 text-3xl hover:text-blue-800" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-pink-500 text-3xl hover:text-pink-700" />
        </a>
      </div>
    </div>
  );
};

export default MarketingStrategy;