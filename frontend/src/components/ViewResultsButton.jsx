import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/ViewResultsButton.css';

const ViewResultsButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    toast.success("Résultats chargés avec succès !", {
      position: "top-center",
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate('/affichage');
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="view-results-button"
    >
      Voir les résultats
    </button>
  );
};

export default ViewResultsButton;

/**
 * 🔍 Analyse fonctionnelle du composant ViewResultsButton :
 *
 * ✅ Objectif : Affiche un bouton "Voir les résultats". Lors du clic :
 *    - Affiche une notification de succès via react-toastify
 *    - Redirige l’utilisateur vers la page "/affichage" après 2 secondes
 *
 * 🧾 Input :
 *    - Props : Aucune
 *    - State : Aucun (isClicked supprimé car inutile)
 *
 * ⚙️ Traitement :
 *    - `useNavigate` : redirection via React Router
 *    - `toast.success` : affiche un message toast (notification)
 *    - `setTimeout` : ajoute un délai de 2 secondes avant redirection
 *
 * 🖥️ Output :
 *    - Bouton cliquable avec classe CSS personnalisée
 *    - Comportement utilisateur : feedback visuel (toast) + navigation automatique
 */