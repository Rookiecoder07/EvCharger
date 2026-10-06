import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, MapPin, Star, Clock } from 'lucide-react';

export const ChargerCard = ({ charger }) => {
  return (
    <article style={{
      background: '#111613',
      border: '1px solid #1f3026',
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.2s ease, border-color 0.2s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '19px', margin: 0, color: '#ffffff', fontWeight: 'bold' }}>
            {charger.name}
          </h3>
          <span style={{
            background: charger.is_available ? 'rgba(0, 200, 120, 0.15)' : 'rgba(255, 85, 85, 0.15)',
            color: charger.is_available ? '#00c878' : '#ff5555',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            ● {charger.is_available ? 'Available' : 'In Use'}
          </span>
        </div>

        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#89968e', fontSize: '14px', margin: '0 0 16px' }}>
          <MapPin size={16} color="#00c878" /> {charger.address}, {charger.city}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          background: '#0b0f0d',
          padding: '12px',
          borderRadius: '10px',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          <div>
            <span style={{ color: '#89968e', display: 'block' }}>Connector</span>
            <strong style={{ color: '#ffffff' }}>{charger.connector_type}</strong>
          </div>
          <div>
            <span style={{ color: '#89968e', display: 'block' }}>Power</span>
            <strong style={{ color: '#00c878' }}>{charger.power_kw} kW ({charger.charging_type})</strong>
          </div>
          <div>
            <span style={{ color: '#89968e', display: 'block' }}>Rate</span>
            <strong style={{ color: '#ffffff' }}>₹{charger.price_per_kwh} / kWh</strong>
          </div>
          <div>
            <span style={{ color: '#89968e', display: 'block' }}>Rating</span>
            <strong style={{ color: '#e39a00', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={13} fill="#e39a00" />
              {charger.total_ratings > 0 ? (charger.sum_ratings / charger.total_ratings).toFixed(1) : '4.8'}
              <span style={{ color: '#89968e', fontSize: '11px' }}>({charger.total_ratings || 12})</span>
            </strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <Link to={`/charger/${charger.id}`} style={{ flex: 1, textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            background: 'transparent',
            color: '#39ff88',
            border: '1px solid #39ff88',
            padding: '10px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Details
          </button>
        </Link>
        <Link to={`/book/${charger.id}`} style={{ flex: 1, textDecoration: 'none' }}>
          <button style={{
            width: '100%',
            background: '#00b86b',
            color: '#ffffff',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Book Slot →
          </button>
        </Link>
      </div>
    </article>
  );
};
