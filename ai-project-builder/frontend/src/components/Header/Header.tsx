

// frontend/components/Header/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            ⚗️ CodeAlchemy
          </Link>
        </div>
        
        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.name || 'User'}
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <Link to="/" className="dropdown-item logout-button">
                    Dashboard
                  </Link> <br />
                  <Link to="/profile" className="dropdown-item logout-button">
                    Profile
                  </Link>
                  <button 
                    className="dropdown-item logout-button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn">
                Login
              </Link>
              <Link to="/register" className="btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;