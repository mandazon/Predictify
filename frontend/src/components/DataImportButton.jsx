import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DataImportButton.css'; // Importation du fichier CSS si nécessaire

const DataImportButton = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Redirige vers FormGet.jsx (nouvelle route)
  const handleDataImport = () => {
    navigate('/Excel'); // Mise à jour de la route
  };

  return (
    <div className="relative">
      {isHovered && (
        <div className="tooltip">
          Importer vos données de vente
        </div>
      )}
      <button
        onClick={handleDataImport}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="import-button"
      >
        <span>Importer mes données de vente</span>
      </button>
    </div>
  );
};

export default DataImportButton;
