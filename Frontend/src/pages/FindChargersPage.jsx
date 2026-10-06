import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChargerCard } from '../components/ChargerCard';
import API from '../services/api';
import { Search, Filter } from 'lucide-react';

export const FindChargersPage = () => {
  const [searchParams] = useSearchParams();
  const initialLocation = searchParams.get('location') || '';
  const initialConnector = searchParams.get('connector') || 'any';

  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialLocation);
  const [connectorFilter, setConnectorFilter] = useState(initialConnector);
  const [speedFilter, setSpeedFilter] = useState('any');
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    fetchChargers();
  }, [connectorFilter, speedFilter, availableOnly]);

  const fetchChargers = async () => {
    setLoading(true);
    try {
      let query = `/chargers?`;
      if (searchTerm) query += `location=${encodeURIComponent(searchTerm)}&`;
      if (connectorFilter !== 'any') query += `connector_type=${connectorFilter}&`;
      if (speedFilter !== 'any') query += `charging_type=${speedFilter}&`;
      if (availableOnly) query += `available_only=true&`;

      const res = await API.get(query);
      if (res.data?.success) {
        setChargers(res.data.data || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchChargers();
  };

  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', width: '92%', margin: '40px auto', flex: 1 }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', margin: '0 0 10px', fontWeight: 'bold' }}>Find EV Charging Stations</h1>
          <p style={{ color: '#89968e', margin: 0, fontSize: '16px' }}>
            Browse verified peer-to-peer and public fast chargers across India
          </p>
        </div>

        {/* Search & Filter Bar */}
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '35px'
        }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 2, minWidth: '220px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search city, neighborhood, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#0b0f0d',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ minWidth: '140px' }}>
              <select
                value={connectorFilter}
                onChange={(e) => setConnectorFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0b0f0d',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="any">All Connectors</option>
                <option value="CCS2">CCS2</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="Type2">Type 2</option>
                <option value="Type1">Type 1</option>
              </select>
            </div>

            <div style={{ minWidth: '140px' }}>
              <select
                value={speedFilter}
                onChange={(e) => setSpeedFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#0b0f0d',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="any">All Speeds</option>
                <option value="DC Fast">DC Fast</option>
                <option value="Rapid DC">Rapid DC</option>
                <option value="AC Slow">AC Slow</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', color: '#cbd5e1' }}>
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Available Only
            </label>

            <button
              type="submit"
              style={{
                background: '#00b86b',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Search size={16} /> Filter
            </button>
          </form>
        </section>

        {/* Grid of Chargers */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#00c878' }}>
            <h2>Loading charging stations...</h2>
          </div>
        ) : chargers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            background: '#111613',
            borderRadius: '16px',
            border: '1px dashed #1f3026'
          }}>
            <h3 style={{ margin: '0 0 8px' }}>No charging stations match your criteria</h3>
            <p style={{ color: '#89968e', margin: 0 }}>
              Try broadening your filter, or reset your search location.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {chargers.map((charger) => (
              <ChargerCard key={charger.id} charger={charger} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
