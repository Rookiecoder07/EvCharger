import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { CreditCard, Wallet, Smartphone, ShieldCheck } from 'lucide-react';

export const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { profile, reloadProfile } = useAuth();

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get(`/bookings/${bookingId}`);
        if (res.data?.success) {
          setBooking(res.data.data);
        }
      } catch (err) {
        toast.error('Could not load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleProcessPayment = async () => {
    setProcessing(true);
    try {
      const res = await API.post('/payments/process', {
        booking_id: bookingId,
        amount: booking.amount,
        payment_method: paymentMethod,
        upi_id: upiId || null
      });

      if (res.data?.success) {
        toast.success('Payment verified & slot confirmed!');
        reloadProfile();
        navigate(`/booking-confirmation/${bookingId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed. Please try another method.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#06130f', color: '#00c878', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Loading Payment Gateway...</h2>
      </div>
    );
  }

  const walletBalance = Number(profile?.wallet_balance || 0);
  const canPayWithWallet = walletBalance >= Number(booking?.amount || 0);

  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-right" />
      <Navbar />

      <main style={{ maxWidth: '650px', width: '92%', margin: '40px auto', flex: 1 }}>
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '20px',
          padding: '35px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <h1 style={{ fontSize: '26px', margin: '0 0 8px', fontWeight: 'bold' }}>Complete Charging Payment</h1>
          <p style={{ color: '#89968e', margin: '0 0 25px' }}>
            Station: <strong style={{ color: '#ffffff' }}>{booking?.chargers?.name}</strong>
          </p>

          {/* Amount Box */}
          <div style={{
            background: '#0b0f0d',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #1f3026',
            marginBottom: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ color: '#89968e', fontSize: '13px' }}>Session Total</span>
              <p style={{ margin: 0, fontSize: '14px', color: '#a0aec0' }}>
                {booking?.booking_date} ({booking?.start_time?.slice(0, 5)} - {booking?.end_time?.slice(0, 5)})
              </p>
            </div>
            <strong style={{ fontSize: '28px', color: '#00c878' }}>₹{booking?.amount}</strong>
          </div>

          <h3 style={{ fontSize: '16px', margin: '0 0 15px', color: '#cbd5e1' }}>Select Payment Method</h3>

          {/* Payment Methods */}
          <div style={{ display: 'grid', gap: '12px', marginBottom: '25px' }}>
            {/* Wallet */}
            <div
              onClick={() => setPaymentMethod('wallet')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: paymentMethod === 'wallet' ? 'rgba(0, 200, 120, 0.12)' : '#0b0f0d',
                border: paymentMethod === 'wallet' ? '2px solid #00c878' : '1px solid #2d3748',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Wallet color="#00c878" size={22} />
                <div>
                  <strong style={{ display: 'block' }}>EVCharge Digital Wallet</strong>
                  <span style={{ fontSize: '13px', color: canPayWithWallet ? '#39ff88' : '#ff5555' }}>
                    Available: ₹{walletBalance.toFixed(2)} {!canPayWithWallet && '(Insufficient balance)'}
                  </span>
                </div>
              </div>
              <input type="radio" checked={paymentMethod === 'wallet'} onChange={() => {}} />
            </div>

            {/* UPI */}
            <div
              onClick={() => setPaymentMethod('upi')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: paymentMethod === 'upi' ? 'rgba(0, 200, 120, 0.12)' : '#0b0f0d',
                border: paymentMethod === 'upi' ? '2px solid #00c878' : '1px solid #2d3748',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Smartphone color="#00c878" size={22} />
                <div>
                  <strong style={{ display: 'block' }}>Instant UPI (GPay, PhonePe, Paytm)</strong>
                  <span style={{ fontSize: '13px', color: '#89968e' }}>Zero transaction fee</span>
                </div>
              </div>
              <input type="radio" checked={paymentMethod === 'upi'} onChange={() => {}} />
            </div>

            {/* Card */}
            <div
              onClick={() => setPaymentMethod('card')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: paymentMethod === 'card' ? 'rgba(0, 200, 120, 0.12)' : '#0b0f0d',
                border: paymentMethod === 'card' ? '2px solid #00c878' : '1px solid #2d3748',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CreditCard color="#00c878" size={22} />
                <div>
                  <strong style={{ display: 'block' }}>Debit / Credit Card</strong>
                  <span style={{ fontSize: '13px', color: '#89968e' }}>Visa, MasterCard, RuPay</span>
                </div>
              </div>
              <input type="radio" checked={paymentMethod === 'card'} onChange={() => {}} />
            </div>
          </div>

          {/* Conditional inputs */}
          {paymentMethod === 'upi' && (
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>UPI ID</label>
              <input
                type="text"
                placeholder="e.g. yourname@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff' }}
              />
            </div>
          )}

          <button
            onClick={handleProcessPayment}
            disabled={processing || (paymentMethod === 'wallet' && !canPayWithWallet)}
            style={{
              width: '100%',
              padding: '16px',
              background: (paymentMethod === 'wallet' && !canPayWithWallet) ? '#4a5568' : '#00b86b',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '17px',
              fontWeight: 'bold',
              cursor: processing || (paymentMethod === 'wallet' && !canPayWithWallet) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(0, 184, 107, 0.4)'
            }}
          >
            <ShieldCheck size={20} />
            {processing ? 'Verifying Transaction...' : `Pay ₹${booking?.amount} & Confirm`}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};
