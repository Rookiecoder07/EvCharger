import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { PlusCircle, Zap, DollarSign, Calendar, Settings } from 'lucide-react';

export const OwnerDashboardPage = () => {
  const [stats, setStats] = useState({
    charger_count: 0,
    active_charger_count: 0,
    total_bookings: 0,
    upcoming_bookings: 0,
    total_earnings: 0
  });
  const [chargers, setChargers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, chargRes, bookRes] = await Promise.allSettled([
          API.get('/owner/dashboard'),
          API.get('/owner/chargers'),
          API.get('/owner/bookings')
        ]);

        if (dashRes.status === 'fulfilled' && dashRes.value.data?.success) setStats(dashRes.value.data.data);
        if (chargRes.status === 'fulfilled' && chargRes.value.data?.success) setChargers(chargRes.value.data.data || []);
        if (bookRes.status === 'fulfilled' && bookRes.value.data?.success) setRecentBookings(bookRes.value.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '1000px', width: '92%', margin: '40px auto', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '30px', margin: '0 0 6px', fontWeight: 'bold' }}>Charger Host Dashboard</h1>
            <p style={{ color: '#89968e', margin: 0 }}>
              Monitor your peer-to-peer charging units, active slots, and payout earnings
            </p>
          </div>
          <Link to="/owner/add-charger">
            <button style={{
              background: '#00b86b',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <PlusCircle size={18} /> Add New Charger
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '35px'
        }}>
          <div style={{ background: '#111613', padding: '22px', borderRadius: '16px', border: '1px solid #1f3026' }}>
            <span style={{ color: '#89968e', fontSize: '13px' }}>Total Units</span>
            <h3 style={{ fontSize: '32px', margin: '8px 0 0', color: '#ffffff' }}>{stats.charger_count}</h3>
          </div>
          <div style={{ background: '#111613', padding: '22px', borderRadius: '16px', border: '1px solid #1f3026' }}>
            <span style={{ color: '#89968e', fontSize: '13px' }}>Active Units</span>
            <h3 style={{ fontSize: '32px', margin: '8px 0 0', color: '#00c878' }}>{stats.active_charger_count}</h3>
          </div>
          <div style={{ background: '#111613', padding: '22px', borderRadius: '16px', border: '1px solid #1f3026' }}>
            <span style={{ color: '#89968e', fontSize: '13px' }}>Total Bookings</span>
            <h3 style={{ fontSize: '32px', margin: '8px 0 0', color: '#ffffff' }}>{stats.total_bookings}</h3>
          </div>
          <div style={{ background: '#111613', padding: '22px', borderRadius: '16px', border: '1px solid #1f3026' }}>
            <span style={{ color: '#89968e', fontSize: '13px' }}>Gross Revenue</span>
            <h3 style={{ fontSize: '32px', margin: '8px 0 0', color: '#39ff88' }}>₹{Number(stats.total_earnings || 0).toFixed(2)}</h3>
          </div>
        </section>

        {/* My Chargers Section */}
        <section style={{ background: '#111613', border: '1px solid #1f3026', borderRadius: '18px', padding: '28px', marginBottom: '35px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px' }}>My Listed Chargers ({chargers.length})</h2>

          {chargers.length === 0 ? (
            <p style={{ color: '#89968e', margin: 0 }}>
              You have no active chargers listed. Click "Add New Charger" to share your charging plug with the community.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {chargers.map((c) => (
                <div key={c.id} style={{
                  background: '#0b0f0d',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #1f3026',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px', fontSize: '18px' }}>{c.name}</h4>
                    <p style={{ margin: '0 0 3px', color: '#89968e', fontSize: '14px' }}>📍 {c.address}, {c.city}</p>
                    <p style={{ margin: 0, color: '#a0aec0', fontSize: '13px' }}>
                      ⚡ {c.power_kw} kW • {c.connector_type} • ₹{c.price_per_kwh}/kWh
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: c.is_active ? '#00c878' : '#ff5555', fontSize: '13px', fontWeight: 'bold' }}>
                      ● {c.is_active ? 'Online' : 'Disabled'}
                    </span>
                    <Link to={`/owner/manage-charger/${c.id}`}>
                      <button style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        border: '1px solid #2d3748',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}>
                        Edit & Manage
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Received Bookings */}
        <section style={{ background: '#111613', border: '1px solid #1f3026', borderRadius: '18px', padding: '28px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px' }}>Bookings Received for Your Chargers</h2>

          {recentBookings.length === 0 ? (
            <p style={{ color: '#89968e', margin: 0 }}>
              No bookings received yet. Drivers will see your charger when searching their area.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {recentBookings.slice(0, 5).map((b) => (
                <div key={b.id} style={{
                  background: '#0b0f0d',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid #1f3026',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{b.chargers?.name}</h4>
                    <p style={{ margin: 0, color: '#89968e', fontSize: '13px' }}>
                      Customer: <strong style={{ color: '#cbd5e1' }}>{b.profiles?.full_name || 'EV Driver'}</strong> • 📅 {b.booking_date} ({b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)})
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: '#00c878', display: 'block', fontSize: '16px' }}>₹{b.amount}</strong>
                    <span style={{ fontSize: '12px', color: '#a0aec0' }}>Status: {b.status?.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};
