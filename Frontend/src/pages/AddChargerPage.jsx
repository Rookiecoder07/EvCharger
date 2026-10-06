import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import API from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

export const AddChargerPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    connector_type: 'CCS2',
    charging_type: 'DC Fast',
    power_kw: 30,
    price_per_kwh: 12,
    operating_hours_start: '06:00',
    operating_hours_end: '22:00',
    is_available: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post('/owner/chargers', formData);
      if (res.data?.success) {
        toast.success('Charger listed successfully!');
        navigate('/owner/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to list charger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-right" />
      <Navbar />

      <main style={{ maxWidth: '800px', width: '92%', margin: '40px auto', flex: 1 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', color: '#89968e', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginBottom: '20px' }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '20px',
          padding: '35px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
        }}>
          <h1 style={{ fontSize: '28px', margin: '0 0 10px', fontWeight: 'bold' }}>List a New EV Charger</h1>
          <p style={{ color: '#89968e', margin: '0 0 30px' }}>
            Provide technical specifications and pricing so EV drivers can locate and book your station
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Station / Charger Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Nexon Home Fast Charger"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Directions, parking instructions, access gates..."
                  value={formData.description}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Full Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="e.g. Block C, Sector 62"
                    value={formData.address}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Noida, Delhi, Bengaluru"
                    value={formData.city}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Connector Type</label>
                  <select
                    name="connector_type"
                    value={formData.connector_type}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                  >
                    <option value="CCS2">CCS2</option>
                    <option value="Type2">Type 2</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                    <option value="Type1">Type 1</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Charging Speed</label>
                  <select
                    name="charging_type"
                    value={formData.charging_type}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                  >
                    <option value="DC Fast">DC Fast</option>
                    <option value="Rapid DC">Rapid DC</option>
                    <option value="AC Slow">AC Slow</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Power (kW)</label>
                  <input
                    type="number"
                    name="power_kw"
                    required
                    value={formData.power_kw}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Price (₹ / kWh)</label>
                  <input
                    type="number"
                    name="price_per_kwh"
                    required
                    value={formData.price_per_kwh}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Opening Time</label>
                  <input
                    type="time"
                    name="operating_hours_start"
                    value={formData.operating_hours_start}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Closing Time</label>
                  <input
                    type="time"
                    name="operating_hours_end"
                    value={formData.operating_hours_end}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  marginTop: '15px',
                  padding: '16px',
                  background: '#00b86b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Save size={18} /> {submitting ? 'Listing Station...' : 'Publish Charger to Network'}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};
