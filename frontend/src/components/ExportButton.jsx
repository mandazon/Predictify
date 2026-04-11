
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../styles/ExportButton.css';

const ExportButton = ({ exportRef }) => {
  const generatePDF = async () => {
    const nom_fichier = prompt('Nom du fichier PDF:');

    if (!nom_fichier) {
      alert('Veuillez choisir un nom pour le fichier PDF.');
      return;
    }

    if (!exportRef.current) {
      alert('Aucun contenu à exporter en PDF !');
      return;
    }

    try {
      // Capturer le contenu HTML avec html2canvas
      const canvas = await html2canvas(exportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Créer un document PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter',
      });

      // Calculer les dimensions pour ajuster l'image
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 1; // Marge de 0.5in de chaque côté
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Ajouter l'image au PDF
      pdf.addImage(imgData, 'JPEG', 0.5, 0.5, pdfWidth, pdfHeight);

      // Sauvegarder le PDF
      pdf.save(`${nom_fichier}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  return (
    <div className="export-button-container">
      <button onClick={generatePDF} className="export-button">
        Exporter en PDF
      </button>
    </div>
  );
};

export default ExportButton;

/**
 * 📄 Analyse fonctionnelle du composant ExportButton :
 *
 * ✅ Objectif : Exporter en PDF une section HTML référencée (via exportRef)
 *    grâce à jsPDF et html2canvas.
 *
 * 🧾 Input :
 *    - Props : exportRef (référence React vers le contenu à exporter)
 *    - Aucune donnée dynamique ou API utilisée
 *
 * ⚙️ Traitement :
 *    - Prompt utilisateur pour le nom du fichier
 *    - Validation des entrées et de la référence DOM
 *    - Capture du contenu HTML avec html2canvas
 *    - Génération PDF avec jsPDF et déclenchement du téléchargement
 *
 * 🖥️ Output :
 *    - Un simple bouton "Exporter en PDF"
 *    - Interactions utilisateur via alertes et prompt
 */
