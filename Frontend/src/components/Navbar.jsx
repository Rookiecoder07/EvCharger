import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, User, Wallet, Calendar, PlusCircle, LogOut, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header style={{
      height: '75px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 8%',
      position: 'relative',
      width: '100%',
      top: 0,
      zIndex: 100,
      background: '#06130f',
      borderBottom: '1px solid rgba(0, 200, 120, 0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '26px' }}>⚡</span>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
            <span style={{ color: '#00c878' }}>E</span>VCharge
          </h2>
        </Link>
      </div>

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
      }} className="desktop-nav">
        <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>Home</Link>
        <Link to="/find-chargers" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>Find Chargers</Link>
        <Link to="/about" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>About</Link>
        
        {user ? (
          <>
            <Link to="/bookings" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={16} color="#00c878" /> My Bookings
            </Link>
            <Link to="/wallet" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wallet size={16} color="#00c878" /> Wallet
            </Link>
            <Link to="/owner/dashboard" style={{ color: '#00c878', textDecoration: 'none', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
              <PlusCircle size={16} /> Host Dashboard
            </Link>
          </>
        ) : null}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/profile" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ffffff',
              textDecoration: 'none',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(0, 200, 120, 0.3)'
            }}>
              <User size={16} color="#00c878" />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{profile?.full_name || 'My Profile'}</span>
            </Link>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ff5555',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '6px'
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/login" style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '15px',
              padding: '9px 18px',
              fontWeight: '500'
            }}>Log in</Link>
            <Link to="/signup" style={{
              backgroundColor: '#00a86b',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '7px',
              fontWeight: 'bold',
              fontSize: '15px',
              transition: 'background-color 0.2s ease'
            }}>Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
};
