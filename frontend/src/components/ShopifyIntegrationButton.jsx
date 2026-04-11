import React from 'react';
import '../styles/ShopifyIntegrationButton.css'; // Importation du fichier CSS

const ShopifyIntegrationButton = () => {
  // Fonction qui redirige l'utilisateur vers le processus d'intégration Shopify
  const handleShopifyIntegration = () => {
    // L'URL pour la connexion à Shopify. Elle peut être remplacée par l'URL réelle de ton intégration Shopify
    const shopifyIntegrationUrl = "https://www.shopify.com";
    window.location.href = shopifyIntegrationUrl;
  };

  return (
    <div className="shopify-integration-container">
      {/* Bouton d'intégration avec effet de survol */}
      <button
        onClick={handleShopifyIntegration}
        className="shopify-button"
      >
        {/* Icône et texte */}
        <span className="shopify-icon"></span>
        <span>Intégrer ma boutique Shopify</span>
      </button>

      {/* Description sous le bouton */}
      <p className="shopify-description">
      
      </p>
    </div>
  );
};

export default ShopifyIntegrationButton;








/**
 * 🔗 Composant ShopifyIntegrationButton
 *
 * ✅ Objectif :
 *   Proposer un bouton d’intégration Shopify, redirigeant l’utilisateur vers une URL dédiée à la connexion OAuth ou à la configuration de sa boutique.
 *
 * ⚙️ Fonctionnement :
 *   - Lors du clic sur le bouton, redirection vers `shopifyIntegrationUrl`
 *   - Comportement simple, extensible pour inclure des paramètres OAuth
 *
 * 🖥️ UI :
 *   - Bouton avec icône + texte
 *   - Description facultative sous le bouton
 *
 * 📌 Remarques :
 *   - Prévoir d’adapter l’URL pour qu’elle pointe vers l’application Shopify réelle (backend ou OAuth)
 */
