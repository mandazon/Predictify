import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate

const PromoBanner = () => {
  // Utilisation de useNavigate au début du composant
  const navigate = useNavigate();

  // Gérer l'état pour savoir si la bannière est visible ou fermée
  const [isVisible, setIsVisible] = useState(true);

  // Vérifier si la bannière a été fermée dans le sessionStorage
  useEffect(() => {
    const bannerClosed = sessionStorage.getItem('promoBannerClosed');
    if (bannerClosed) {
      setIsVisible(false);
    }
  }, []);

  // Si la bannière est cachée, ne rien afficher
  if (!isVisible) return null;

  const handleRedirect = () => {
    navigate('/pricing'); // Redirection vers la page de tarification
  };

  return (
    <div className="fixed top-[calc(1.7cm+28px)] right-4 w-[567px] h-[60px] bg-[#2f2f2f] text-white rounded-xl p-4 shadow-lg flex items-center justify-between z-50">
      <p className="font-bold text-xs md:text-sm text-center flex-1">
         Bien anticiper la demande, dominer le marché !<br />
        Sélectionnez un forfait et profitez de 3 mois de Predictify pour 1€/mois.
      </p>
      <button
        className="bg-[#4267B2] text-white hover:bg-blue-600 focus:outline-none rounded-md"
        style={{
          width: '128.30px',
          height: '26.46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={handleRedirect} // Appel à la fonction handleRedirect
      >
        Choisir un forfait
      </button>
    </div>
  );
};

export default PromoBanner;
