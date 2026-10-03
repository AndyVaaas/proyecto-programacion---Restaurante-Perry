import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import logoPerry from './assets/LOGO BIEN ESCRITO.jfif'; 

import Mesas from './pages/Mesas';
import Productos from './pages/Productos';
import Usuarios from './pages/Usuarios';
import Pedidos from './pages/Pedidos';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="nav-bar">
          {/* Logo, Nombre y Eslogan */}
          <div className="brand-container">
            <img src={logoPerry} alt="Rosticería Perry Logo" className="navbar-logo" />
            <div className="brand-text">
              <span className="brand-title">Rosticería Perry</span>
              <span className="brand-slogan">El mejor amigo de tu hambre</span>
            </div>
          </div>

          {/* Enlaces de Navegación (sin emojis) */}
          <div className="nav-links">
            <Link to="/mesas" className="nav-link">Mesas</Link>
            <Link to="/productos" className="nav-link">Productos</Link>
            <Link to="/usuarios" className="nav-link">Usuarios</Link>
            <Link to="/pedidos" className="nav-link">Pedidos</Link>
          </div>
        </nav>

        {/* Contenedor Principal */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/mesas" />} />
            <Route path="/mesas" element={<Mesas />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/pedidos" element={<Pedidos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;