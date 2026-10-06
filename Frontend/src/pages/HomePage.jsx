import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  const [location, setLocation] = useState('');
  const [connector, setConnector] = useState('any');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/find-chargers?location=${encodeURIComponent(location)}&connector=${encodeURIComponent(connector)}`);
  };

  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <section style={{
          minHeight: 'calc(100vh - 75px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 20px 60px',
          position: 'relative',
          backgroundImage: 'linear-gradient(rgba(0, 20, 14, 0.75), rgba(0, 15, 10, 0.95)), url("/image/ev.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          {/* Badge */}
          <p style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            padding: '8px 18px',
            borderRadius: '25px',
            color: '#dddddd',
            fontSize: '14px',
            marginBottom: '20px',
            display: 'inline-block'
          }}>
            ● India's peer-to-peer charging network
          </p>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            marginBottom: '20px',
            fontWeight: 800,
            letterSpacing: '-1px'
          }}>
            Find. Book. Charge.
          </h1>

          {/* Description */}
          <p style={{
            maxWidth: '680px',
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#d2dad7',
            marginBottom: '35px'
          }}>
            Discover public and private EV chargers wherever your journey takes you —
            or share your own charger and earn while it's idle.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '45px' }}>
            <button
              onClick={() => navigate('/find-chargers')}
              style={{
                backgroundColor: '#00b86b',
                color: '#ffffff',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: '0 4px 15px rgba(0, 184, 107, 0.4)'
              }}
            >
              📍 Find a Charger →
            </button>
            <button
              onClick={() => navigate('/owner/dashboard')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backdropFilter: 'blur(5px)'
              }}
            >
              🔌 Become a Charger Host
            </button>
          </div>

          {/* Search Bar Form */}
          <div style={{ width: '100%', maxWidth: '750px', marginBottom: '50px' }}>
            <form onSubmit={handleSearch} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              backgroundColor: 'rgba(5, 20, 15, 0.88)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <label htmlFor="location" style={{ color: '#00c878', fontSize: '14px', marginLeft: '10px' }}>
                📍 Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city, area or landmark (e.g. Delhi, Koramangala)"
                style={{
                  flex: 2,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '15px',
                  padding: '10px',
                  minWidth: '160px'
                }}
              />

              <label htmlFor="connector" style={{ color: '#00c878', fontSize: '14px', marginLeft: '10px' }}>
                🔌 Connector
              </label>
              <select
                id="connector"
                name="connector"
                value={connector}
                onChange={(e) => setConnector(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '15px',
                  padding: '10px',
                  minWidth: '130px',
                  cursor: 'pointer'
                }}
              >
                <option value="any" style={{ backgroundColor: '#07130f' }}>Any connector</option>
                <option value="CCS2" style={{ backgroundColor: '#07130f' }}>CCS2</option>
                <option value="CHAdeMO" style={{ backgroundColor: '#07130f' }}>CHAdeMO</option>
                <option value="Type2" style={{ backgroundColor: '#07130f' }}>Type 2</option>
                <option value="Type1" style={{ backgroundColor: '#07130f' }}>Type 1</option>
              </select>

              <button
                type="submit"
                style={{
                  backgroundColor: '#e39a00',
                  color: '#ffffff',
                  border: 'none',
                  padding: '13px 28px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                🔍 Search
              </button>
            </form>
          </div>

          {/* Statistics Row */}
          <div style={{
            width: '100%',
            maxWidth: '850px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '20px',
            marginTop: '10px'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 style={{ fontSize: '32px', margin: '0 0 4px', color: '#00c878' }}>10,000+</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#b9c3bf' }}>Chargers listed</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 style={{ fontSize: '32px', margin: '0 0 4px', color: '#00c878' }}>120+</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#b9c3bf' }}>Cities covered</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 style={{ fontSize: '32px', margin: '0 0 4px', color: '#00c878' }}>4.8 ★</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#b9c3bf' }}>Average rating</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 style={{ fontSize: '32px', margin: '0 0 4px', color: '#00c878' }}>24/7</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#b9c3bf' }}>Smart support</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
