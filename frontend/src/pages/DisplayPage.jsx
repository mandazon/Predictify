import React, { useRef } from 'react'; // Importation de useRef pour cibler l'élément à exporter
import ProductGrid from '../components/ProductGrid'; // Importation du composant ProductGrid
import ExportButton from '../components/ExportButton'; // Bouton d'exportation en PDF
import '../styles/DisplayPage.css'; // Importation du fichier CSS séparé

// Définition du composant DisplayPage, qui sert de page d'affichage pour Predictify
const DisplayPage = () => {
  // Référence pour cibler l'élément que l'on souhaite capturer en PDF
  const exportRef = useRef();

  return (
    // Conteneur principal de la page d'affichage avec une palette de couleurs inspirée de Facebook
    <div className="display-page" ref={exportRef}>
      
      {/* En-tête de la page d'affichage */}
      <header>
        <h1>Produits et Recommandations </h1>
        <p>
          Découvrez les produits recommandés avec des informations détaillées pour optimiser vos stocks et prix.
        </p>
      </header>

      {/* Section principale de la grille de produits */}
      <main>
        <ProductGrid />
      </main>

      {/* Bouton d'exportation en PDF */}
      <div className="export-btn-container">
        <ExportButton exportRef={exportRef} />
      </div>
      
    </div>
  );
};

// Export de DisplayPage pour utilisation dans d'autres parties de l'application
export default DisplayPage;
