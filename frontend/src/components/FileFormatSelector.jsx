// FileFormatSelector.jsx
import React, { useState } from 'react';
import '../styles/FileFormatSelector.css'; // Importation du fichier CSS si nécessaire

const FileFormatSelector = ({ onFormatChange }) => {
  const [selectedFormat, setSelectedFormat] = useState('CSV');

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
    onFormatChange(format); // Appel de la fonction pour notifier le changement de format
  };

  return (
    <div className="file-format-selector">
      {/* Format CSV */}
      <div
        className={`file-format-item ${selectedFormat === 'CSV' ? 'selected' : ''}`}
        onClick={() => handleFormatChange('CSV')}
      >
        <div className="file-format-icon">🗂️</div>
        <h3 className="file-format-title">CSV</h3>
        <p className="file-format-description">Un format simple pour les données tabulaires.</p>
      </div>

      {/* Format Excel */}
      <div
        className={`file-format-item ${selectedFormat === 'Excel' ? 'selected' : ''}`}
        onClick={() => handleFormatChange('Excel')}
      >
        <div className="file-format-icon">📑</div>
        <h3 className="file-format-title">Excel</h3>
        <p className="file-format-description">Le format couramment utilisé pour les feuilles de calcul complexes.</p>
      </div>

      {/* Format PDF */}
      <div
        className={`file-format-item ${selectedFormat === 'PDF' ? 'selected' : ''}`}
        onClick={() => handleFormatChange('PDF')}
      >
        <div className="file-format-icon">📄</div>
        <h3 className="file-format-title">PDF</h3>
        <p className="file-format-description">Format polyvalent pour les documents fixes.</p>
      </div>
    </div>
  );
};

export default FileFormatSelector;






/**
 * 📁 Analyse fonctionnelle du composant FileFormatSelector :
 *
 * ✅ Objectif : Permettre la sélection d’un format de fichier (CSV, Excel ou PDF)
 *    avec retour visuel et communication du choix au composant parent.
 *
 * 🧾 Input :
 *    - Props :
 *       - onFormatChange(format: string) : callback déclenché lors du changement de format
 *
 * ⚙️ Traitement :
 *    - Stockage local du format sélectionné dans le state `selectedFormat`
 *    - Application d’un style CSS conditionnel pour l’élément sélectionné
 *    - Transmission immédiate du format sélectionné au parent via `onFormatChange`
 *
 * 🖥️ Output :
 *    - Interface simple et intuitive
 *    - Trois formats proposés avec icône, titre et description
 */
