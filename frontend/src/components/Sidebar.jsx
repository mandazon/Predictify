import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaChartLine, FaThLarge } from 'react-icons/fa';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <nav className="nav-links">
        <button onClick={() => navigate('/home')} className="nav-item">
          <FaHome className="nav-icon" /> Accueil
        </button>
        <button onClick={() => navigate('/analyse')} className="nav-item">
          <FaChartLine className="nav-icon" /> Analyse
        </button>
        <button onClick={() => navigate('/affichage')} className="nav-item">
          <FaThLarge className="nav-icon" /> Affichage
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;