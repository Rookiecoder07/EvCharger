import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import API from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Trash2, Power } from 'lucide-react';

export const ManageChargerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCharger = async () => {
      try {
        const res = await API.get(`/chargers/${id}`);
        if (res.data?.success) setFormData(res.data.data);
      } catch (err) {
        toast.error('Could not load charger details');
      } finally {
        setLoading(false);
      }
    };
    fetchCharger();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put(`/owner/chargers/${id}`, formData);
      if (res.data?.success) {
        toast.success('Charger settings saved!');
        navigate('/owner/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      const res = await API.put(`/owner/chargers/${id}/toggle`);
      if (res.data?.success) {
        setFormData(prev => ({ ...prev, is_active: res.data.data.is_active }));
        toast.success(`Charger status changed to: ${res.data.data.is_active ? 'Active' : 'Disabled'}`);
      }
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this charger permanently from the network?')) return;
    try {
      const res = await API.delete(`/owner/chargers/${id}`);
      if (res.data?.success) {
        toast.success('Charger deleted');
        navigate('/owner/dashboard');
      }
    } catch (err) {
      toast.error('Failed to delete charger');
    }
  };

  if (loading || !formData) {
    return (
      <div style={{ backgroundColor: '#06130f', color: '#00c878', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Loading Unit Settings...</h2>
      </div>
    );
  }

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

        <section style={{ background: '#111613', border: '1px solid #1f3026', borderRadius: '20px', padding: '35px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h1 style={{ fontSize: '26px', margin: '0 0 6px', fontWeight: 'bold' }}>Manage: {formData.name}</h1>
              <span style={{ color: formData.is_active ? '#00c878' : '#ff5555', fontSize: '14px', fontWeight: 'bold' }}>
                ● {formData.is_active ? 'Online & Available for Booking' : 'Offline / Disabled'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleToggleActive}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: '1px solid #2d3748',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Power size={16} color={formData.is_active ? '#00c878' : '#ff5555'} />
                {formData.is_active ? 'Disable' : 'Enable'}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                style={{
                  background: 'rgba(255, 85, 85, 0.1)',
                  color: '#ff5555',
                  border: '1px solid rgba(255, 85, 85, 0.3)',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>

          <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#cbd5e1' }}>Station Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#cbd5e1' }}>Power (kW)</label>
                <input
                  type="number"
                  name="power_kw"
                  value={formData.power_kw || ''}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#cbd5e1' }}>Rate (₹/kWh)</label>
                <input
                  type="number"
                  name="price_per_kwh"
                  value={formData.price_per_kwh || ''}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#cbd5e1' }}>Opening Time</label>
                <input
                  type="time"
                  name="operating_hours_start"
                  value={formData.operating_hours_start || ''}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#cbd5e1' }}>Closing Time</label>
                <input
                  type="time"
                  name="operating_hours_end"
                  value={formData.operating_hours_end || ''}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                marginTop: '10px',
                padding: '14px',
                background: '#00b86b',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
            >
              {saving ? 'Saving changes...' : 'Save Updates'}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
};
