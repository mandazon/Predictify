import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSignOutAlt } from 'react-icons/fa';
import Img1 from '../Images/p.png';
import '../styles/Header.css';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="header-main">
      <div className="header-content">
        <div className="logo-container">
          <img src={Img1} alt="Logo" className="logo" />
          <h1 className="header-title">Predictify</h1>
        </div>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="search-input"
          />
        </div>
        <button
          onClick={() => navigate('/')}
          className="logout-button"
          title="Déconnexion"
        >
          <FaSignOutAlt className="logout-icon" /> Déconnexion
        </button>
      </div>
    </header>
  );
}

export default Header;