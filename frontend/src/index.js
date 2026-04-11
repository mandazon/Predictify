// Import des modules React et ReactDOM pour créer et rendre l'application dans le DOM
import React from 'react';
import ReactDOM from 'react-dom/client';

//  Import de BrowserRouter de React Router pour gérer le routage de l'application
import { BrowserRouter } from 'react-router-dom';

//  Import du fichier CSS global pour les styles de l'application
import './index.css';

//  Import de reportWebVitals pour mesurer les performances de l'application (facultatif)
import reportWebVitals from './reportWebVitals';

// Import du composant principal App, qui contient la structure de l'application
import App from './App';

//  Création de la racine de l'application et montage de celle-ci
const root = ReactDOM.createRoot(document.getElementById('root'));

//  Rendu de l'application avec BrowserRouter pour activer le routage
root.render(
    <BrowserRouter>
        <App /> {/* Chargement du composant principal contenant les pages */}
    </BrowserRouter>
);

// 🛠️ Enregistrement des métriques de performance (facultatif)
reportWebVitals();
