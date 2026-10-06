import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { MapPin, Zap, Clock, ShieldCheck, Heart, Star, ArrowLeft } from 'lucide-react';

export const ChargerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [charger, setCharger] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [cRes, rRes] = await Promise.allSettled([
          API.get(`/chargers/${id}`),
          API.get(`/reviews/charger/${id}`)
        ]);

        if (cRes.status === 'fulfilled' && cRes.value.data?.success) {
          setCharger(cRes.value.data.data);
        }
        if (rRes.status === 'fulfilled' && rRes.value.data?.success) {
          setReviews(rRes.value.data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.error('Please login to save chargers');
      return;
    }
    try {
      if (isSaved) {
        await API.delete(`/saved-chargers/${id}`);
        setIsSaved(false);
        toast.success('Removed from saved');
      } else {
        await API.post('/saved-chargers', { charger_id: id });
        setIsSaved(true);
        toast.success('Saved to your favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#06130f', color: '#00c878', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Loading Charger Details...</h2>
      </div>
    );
  }

  if (!charger) {
    return (
      <div style={{ backgroundColor: '#06130f', color: '#fff', minHeight: '100vh', padding: '60px 20px', textAlign: 'center' }}>
        <h2>Station Not Found</h2>
        <Link to="/find-chargers" style={{ color: '#00c878' }}>Back to Search</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-right" />
      <Navbar />

      <main style={{ maxWidth: '1000px', width: '92%', margin: '40px auto', flex: 1 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#89968e',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontSize: '15px'
          }}
        >
          <ArrowLeft size={18} /> Back to Search
        </button>

        {/* Top Header Card */}
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '20px',
          padding: '35px',
          marginBottom: '30px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '15px' }}>
            <div>
              <span style={{
                background: 'rgba(0, 200, 120, 0.15)',
                color: '#00c878',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'inline-block',
                marginBottom: '10px'
              }}>
                {charger.charging_type} • {charger.connector_type}
              </span>
              <h1 style={{ fontSize: '32px', margin: '0 0 8px', fontWeight: 'bold' }}>{charger.name}</h1>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#89968e', fontSize: '15px', margin: 0 }}>
                <MapPin size={18} color="#00c878" /> {charger.address}, {charger.city}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={handleToggleSave}
                style={{
                  background: isSaved ? 'rgba(255, 85, 85, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: isSaved ? '1px solid #ff5555' : '1px solid #2d3748',
                  color: isSaved ? '#ff5555' : '#ffffff',
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Heart size={20} fill={isSaved ? '#ff5555' : 'transparent'} />
              </button>

              <button
                onClick={() => navigate(`/book/${charger.id}`)}
                style={{
                  background: '#00b86b',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 184, 107, 0.4)'
                }}
              >
                Book Charger Slot
              </button>
            </div>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: 1.6, margin: '20px 0 25px' }}>
            {charger.description || 'Reliable EV charging station equipped with high efficiency charging and community monitored reliability.'}
          </p>

          {/* Key Specifications Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            background: '#0b0f0d',
            padding: '20px',
            borderRadius: '14px',
            border: '1px solid #1f3026'
          }}>
            <div>
              <span style={{ color: '#89968e', fontSize: '13px', display: 'block' }}>Power Output</span>
              <strong style={{ fontSize: '18px', color: '#00c878' }}>{charger.power_kw} kW</strong>
            </div>
            <div>
              <span style={{ color: '#89968e', fontSize: '13px', display: 'block' }}>Tariff Rate</span>
              <strong style={{ fontSize: '18px', color: '#ffffff' }}>₹{charger.price_per_kwh} / kWh</strong>
            </div>
            <div>
              <span style={{ color: '#89968e', fontSize: '13px', display: 'block' }}>Operating Hours</span>
              <strong style={{ fontSize: '18px', color: '#ffffff' }}>
                {charger.operating_hours_start?.slice(0, 5)} - {charger.operating_hours_end?.slice(0, 5)}
              </strong>
            </div>
            <div>
              <span style={{ color: '#89968e', fontSize: '13px', display: 'block' }}>Host / Owner</span>
              <strong style={{ fontSize: '18px', color: '#ffffff' }}>
                {charger.profiles?.full_name || 'Community Verified Host'}
              </strong>
            </div>
          </div>
        </section>

        {/* User Reviews Section */}
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '40px'
        }}>
          <h2 style={{ fontSize: '22px', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={22} fill="#e39a00" color="#e39a00" />
            User Ratings & Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p style={{ color: '#89968e', margin: 0 }}>
              No reviews yet for this charger. Completed sessions can leave ratings.
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} style={{
                borderBottom: '1px solid #1f3026',
                paddingBottom: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ color: '#39ff88' }}>{r.profiles?.full_name || 'Verified EV Driver'}</strong>
                  <div style={{ color: '#e39a00', display: 'flex', gap: '2px' }}>
                    {'★'.repeat(r.rating)}
                  </div>
                </div>
                <p style={{ margin: 0, color: '#cbd5e1', fontSize: '14px' }}>{r.comment}</p>
                <span style={{ fontSize: '12px', color: '#666', marginTop: '4px', display: 'block' }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};
