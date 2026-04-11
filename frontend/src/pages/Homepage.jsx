import React from 'react';
import ShopifyIntegrationButton from '../components/ShopifyIntegrationButton';
import DataImportButton from '../components/DataImportButton';
import '../styles/Homepage.css'; 

function Homepage() {
  return (
    <div className="homepage-container">
      {/* Message de bienvenue avec dégradé et texte en italique pour le sous-titre */}
      <div className="intro-message-container">
        <h1 className="intro-message-header">
          Bienvenue sur Predictify
        </h1>
        <p className="intro-message-text">
          <em>Choisissez l'une des options suivantes :</em>
        </p>
      </div>

      {/* Conteneur des boutons avec "ou" au centre */}
      <div className="button-container">
        <div className="shopify-integration-container">
          <ShopifyIntegrationButton />
        </div>
        <div className="or-text">ou</div>
        <div className="data-import-container">
          <DataImportButton />
        </div>
      </div>

      {/* Footer en bas de la page */}
      <div className="footer">
        <p>© 2025 Predictify. Tous droits réservés.</p>
      </div>
    </div>
  );
}

export default Homepage;
