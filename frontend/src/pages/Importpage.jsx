import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import FileFormatSelector from '../components/Excel'; // Assurez-vous que le chemin est correct
import axios from 'axios'; // Importer axios

const ImportPage = () => {
  const [file, setFile] = useState(null); // Stocke le fichier importé
  const [loading, setLoading] = useState(false); // Nouvel état pour gérer le chargement
  const [fileName, setFileName] = useState(''); // Nouveau état pour stocker le nom du fichier
  const [errorMessage, setErrorMessage] = useState(''); // Nouveau état pour afficher les erreurs
  const [successMessage, setSuccessMessage] = useState(''); // Nouveau état pour afficher le message de succès
  const navigate = useNavigate(); // Initialiser le hook useNavigate

  // Gère le téléchargement du fichier
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]; // Stocke le fichier sélectionné
    setFile(uploadedFile); // Met à jour l'état avec le fichier téléchargé
    setFileName(uploadedFile ? uploadedFile.name : ''); // Met à jour le nom du fichier
    console.log(`Fichier téléchargé : ${uploadedFile.name}`);
  };

  // Fonction pour envoyer le fichier vers le backend
  const handleFileUploadToBackend = async () => {
    if (!file) {
      alert('Veuillez d\'abord télécharger un fichier !');
      return;
    }

    setLoading(true); // Affiche l'indicateur de chargement
    setErrorMessage(''); // Réinitialise le message d'erreur
    setSuccessMessage(''); // Réinitialise le message de succès

    const formData = new FormData();
    formData.append('file', file); // Ajouter le fichier à l'objet FormData

    try {
      // Envoi de la requête POST avec le fichier via axios
      const response = await axios.post('http://127.0.0.1:8000/api/sales/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Indiquer que c'est un envoi multipart/form-data
        },
      });

      console.log('Réponse du serveur :', response.data);

      if (response.status === 200) {
        // Si la réponse est OK, afficher un message de succès et rediriger
        setSuccessMessage('Fichier envoyé avec succès !');
        setTimeout(() => {
          navigate('/analyse'); // Redirige vers la page d'analyse
          setLoading(false); // Arrête le chargement après l'attente
        }, 2000); // Simule un délai de 2 secondes avant de rediriger
      } else {
        // Si le statut n'est pas 200, afficher un message d'erreur détaillé
        setErrorMessage(`Erreur du serveur : Statut ${response.status}`);
        setLoading(false);
      }
    } catch (error) {
      // Gestion des erreurs spécifiques
      console.error('Erreur lors de l\'envoi du fichier :', error);

      if (error.response) {
        // Le serveur a répondu mais avec une erreur
        if (error.response.status >= 400 && error.response.status < 500) {
          // Erreurs HTTP 4xx (problème côté utilisateur)
          setErrorMessage(`Problème avec votre requête : ${error.response.data.message || 'Vérifiez le fichier ou la syntaxe.'} (Statut: ${error.response.status})`);
        } else if (error.response.status >= 500 && error.response.status < 600) {
          // Erreurs HTTP 5xx (problème côté serveur)
          setErrorMessage(`Problème côté serveur : ${error.response.data.message || 'Erreur interne, veuillez réessayer plus tard.'} (Statut: ${error.response.status})`);
        } else {
          // Autres erreurs HTTP
          setErrorMessage(`Erreur HTTP : ${error.response.data.message || 'Erreur imprévue.'}`);
        }
      } else if (error.request) {
        // Pas de réponse du serveur
        setErrorMessage('Erreur réseau, serveur inaccessible, veuillez réessayer.');
      } else {
        // Autres erreurs
        setErrorMessage('Erreur lors de l\'envoi du fichier, veuillez réessayer.');
      }

      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
        Importez vos données de vente
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Téléchargez vos fichiers de données pour lancer l'analyse et prédiction des ventes.
      </p>

      {/* Section de téléchargement de fichier */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md mb-8">
        <div className="mb-4">
          <FileFormatSelector onFormatChange={(format) => console.log(format)} />
        </div>

        <div className="flex flex-col items-center mb-4">
          <label htmlFor="file-upload" className="text-lg text-gray-700 mb-2">Télécharger votre fichier :</label>
          <input
            type="file"
            id="file-upload"
            accept=".csv, .xls, .xlsx, .pdf"
            onChange={handleFileUpload}
            className="border border-gray-300 rounded-lg p-2 text-gray-700 mb-4"
          />
          <div className="flex space-x-4 text-sm text-gray-500">
            <span>Formats acceptés : .CSV, .XLS, .XLSX, .PDF</span>
          </div>

          {/* Afficher le nom du fichier sélectionné */}
          {fileName && (
            <div className="mt-2 text-gray-700">
              <strong>Fichier sélectionné :</strong> {fileName}
            </div>
          )}
        </div>

        {/* Afficher le message de succès ou d'erreur */}
        {successMessage && (
          <div className="mt-4 text-green-500">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 text-red-500">
            {errorMessage}
          </div>
        )}

        {/* Bouton pour lancer l’analyse */}
        <button
          className="bg-[#4267B2] text-white py-2 px-6 rounded-full shadow-md hover:bg-[#365899] transition-all flex items-center space-x-2"
          onClick={handleFileUploadToBackend} // Appel de la fonction pour envoyer le fichier
          disabled={loading || !file} // Désactive le bouton lorsqu'en chargement ou si aucun fichier n'est téléchargé
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-t-transparent border-[#ffffff] border-solid rounded-full animate-spin"></div> // Affiche l'indicateur de chargement
          ) : (
            'Lancer l’analyse'
          )}
        </button>
      </div>
    </div>
  );
};

export default ImportPage;
