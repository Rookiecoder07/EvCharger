import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import API from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar, Clock, MapPin, XCircle, Star } from 'lucide-react';

export const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/bookings?upcoming=${activeTab === 'upcoming'}`);
      if (res.data?.success) setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await API.put(`/bookings/${id}/cancel`);
      if (res.data?.success) {
        toast.success('Booking cancelled and refunded to wallet');
        fetchBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cancellation failed');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/reviews', {
        charger_id: reviewBooking.charger_id,
        booking_id: reviewBooking.id,
        rating,
        comment
      });
      if (res.data?.success) {
        toast.success('Thank you for rating! Earned 10 EV Points.');
        setReviewBooking(null);
        setComment('');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not submit review');
    }
  };

  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-right" />
      <Navbar />

      <main style={{ maxWidth: '900px', width: '92%', margin: '40px auto', flex: 1 }}>
        <h1 style={{ fontSize: '30px', margin: '0 0 25px', fontWeight: 'bold' }}>My Charging Bookings</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '1px solid #1f3026', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'upcoming' ? '#00c878' : '#89968e',
              borderBottom: activeTab === 'upcoming' ? '2px solid #00c878' : 'none',
              paddingBottom: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Upcoming Slots
          </button>
          <button
            onClick={() => setActiveTab('past')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'past' ? '#00c878' : '#89968e',
              borderBottom: activeTab === 'past' ? '2px solid #00c878' : 'none',
              paddingBottom: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            History & Past Sessions
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#00c878' }}>
            <h2>Loading your bookings...</h2>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{
            background: '#111613',
            borderRadius: '16px',
            border: '1px dashed #1f3026',
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#89968e', margin: 0 }}>
              No {activeTab} bookings found. Browse chargers to schedule your next charge!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '18px' }}>
            {bookings.map((b) => (
              <article key={b.id} style={{
                background: '#111613',
                border: '1px solid #1f3026',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px' }}>{b.chargers?.name || 'EV Station'}</h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#89968e', fontSize: '14px', margin: '0 0 6px' }}>
                    <MapPin size={14} color="#00c878" /> {b.chargers?.address}, {b.chargers?.city}
                  </p>
                  <p style={{ margin: 0, color: '#a0aec0', fontSize: '13px' }}>
                    📅 {b.booking_date} • 🕒 {b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <strong style={{ display: 'block', fontSize: '18px', color: '#00c878', marginBottom: '6px' }}>
                    ₹{b.amount}
                  </strong>
                  <span style={{
                    display: 'inline-block',
                    background: b.status === 'confirmed' ? 'rgba(0, 200, 120, 0.15)' : 'rgba(255, 85, 85, 0.15)',
                    color: b.status === 'confirmed' ? '#00c878' : '#ff5555',
                    padding: '4px 10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    {b.status?.toUpperCase()}
                  </span>

                  <div>
                    {activeTab === 'upcoming' && b.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        style={{
                          background: 'transparent',
                          color: '#ff5555',
                          border: '1px solid rgba(255, 85, 85, 0.4)',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                      >
                        Cancel Booking
                      </button>
                    )}

                    {activeTab === 'past' && b.status === 'completed' && (
                      <button
                        onClick={() => setReviewBooking(b)}
                        style={{
                          background: 'rgba(227, 154, 0, 0.15)',
                          color: '#e39a00',
                          border: '1px solid #e39a00',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                      >
                        Leave Review ★
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* REVIEW MODAL */}
        {reviewBooking && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <form onSubmit={handleSubmitReview} style={{
              background: '#111613',
              border: '1px solid #1f3026',
              padding: '30px',
              borderRadius: '18px',
              maxWidth: '450px',
              width: '100%'
            }}>
              <h3 style={{ margin: '0 0 10px' }}>Rate Your Charging Session</h3>
              <p style={{ color: '#89968e', fontSize: '14px', margin: '0 0 20px' }}>
                Station: {reviewBooking.chargers?.name}
              </p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Poor)</option>
                  <option value={1}>⭐ (1 - Terrible)</option>
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Comment</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about charging speed, connector condition, parking..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#00c878', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
                  Submit Review
                </button>
                <button type="button" onClick={() => setReviewBooking(null)} style={{ padding: '12px', background: 'transparent', border: '1px solid #4a5568', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
