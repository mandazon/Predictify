import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Homepage from './pages/Homepage';
import ImportPage from './pages/Importpage';
import AnalysisPage from './pages/AnalysisPage';
import DisplayPage from './pages/DisplayPage';
import PricingPage from './pages/PricingPage';
import LandingPage from './pages/LandingPage';
import FormGET from './components/FormGet';
import Excel from './components/Excel';

// Ajout pour la nouvelle page de paiement
import PaymentChoice from './components/PaymentChoice';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PromoBanner from './components/PromoBanner';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './App.css';

function App() {
  const location = useLocation();

  const isFullScreenPage = 
    location.pathname === '/' || 
    location.pathname === '/pricing';

  const isHomePage = location.pathname === '/home';

  useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('homepage');
    } else {
      document.body.classList.remove('homepage');
    }

    // Cleanup
    return () => {
      document.body.classList.remove('homepage');
    };
  }, [isHomePage]);

  return (
    <div className={`app-container ${isFullScreenPage ? 'fullscreen-page' : ''}`}>

      {isFullScreenPage ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
      ) : (
        <>
          <Header />
          {isHomePage && <PromoBanner />}
          <div className="main-layout">
            <Sidebar />
            <main className="main-content">
              <ToastContainer position="top-center" autoClose={5000} />
              <Routes>
                <Route path="/home" element={<Homepage />} />
                <Route path="/import" element={<ImportPage />} />
                <Route path="/analyse" element={<AnalysisPage />} />
                <Route path="/affichage" element={<DisplayPage />} />
                <Route path="/form-Get" element={<FormGET />} />
                <Route path="/excel" element={<Excel />} />
                
                {/* Nouvelle route - avec Sidebar + Header */}
                <Route path="/payment-choice" element={<PaymentChoice />} />

                <Route path="*" element={<h2 className="page-not-found">Page non trouvée</h2>} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;