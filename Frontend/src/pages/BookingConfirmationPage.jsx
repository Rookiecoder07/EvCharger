import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import API from '../services/api';
import { CheckCircle2, Calendar, MapPin, ArrowRight } from 'lucide-react';

export const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get(`/bookings/${bookingId}`);
        if (res.data?.success) setBooking(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '650px', width: '92%', margin: '40px auto', textAlign: 'center', flex: 1 }}>
        <div style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '24px',
          padding: '40px 30px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
        }}>
          <CheckCircle2 color="#00c878" size={70} style={{ marginBottom: '15px' }} />
          <h1 style={{ fontSize: '28px', margin: '0 0 8px', fontWeight: 'bold' }}>Charging Slot Confirmed!</h1>
          <p style={{ color: '#89968e', margin: '0 0 30px', fontSize: '15px' }}>
            Reference Booking ID: <code style={{ color: '#00c878' }}>{bookingId?.slice(0, 8)}</code>
          </p>

          <div style={{
            background: '#0b0f0d',
            padding: '24px',
            borderRadius: '16px',
            textAlign: 'left',
            marginBottom: '30px',
            border: '1px solid #1f3026'
          }}>
            <h3 style={{ margin: '0 0 16px', color: '#ffffff', fontSize: '18px' }}>
              {booking?.chargers?.name || 'EV Station'}
            </h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#89968e', margin: '0 0 16px', fontSize: '14px' }}>
              <MapPin size={16} color="#00c878" /> {booking?.chargers?.address}, {booking?.chargers?.city}
            </p>

            <div style={{ borderTop: '1px solid #1f3026', paddingTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#89968e' }}>Date</span>
                <strong style={{ display: 'block', fontSize: '15px' }}>{booking?.booking_date}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#89968e' }}>Time Window</span>
                <strong style={{ display: 'block', fontSize: '15px' }}>
                  {booking?.start_time?.slice(0, 5)} - {booking?.end_time?.slice(0, 5)}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#89968e' }}>Amount Paid</span>
                <strong style={{ display: 'block', fontSize: '15px', color: '#00c878' }}>₹{booking?.amount}</strong>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#89968e' }}>Payment Status</span>
                <strong style={{ display: 'block', fontSize: '15px', color: '#39ff88' }}>
                  ✓ {booking?.payment_status?.toUpperCase()}
                </strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <Link to="/bookings" style={{ flex: 1, textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                padding: '14px',
                background: '#00b86b',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '15px'
              }}>
                View My Bookings
              </button>
            </Link>
            <Link to="/find-chargers" style={{ flex: 1, textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                padding: '14px',
                background: 'transparent',
                color: '#fff',
                border: '1px solid #4a5568',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '15px'
              }}>
                Find More Stations
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
