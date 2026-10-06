import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (err) {
      toast.error(err.message || 'Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("/photos/forgot_pass.jpg"), url("/photos/login2.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <Toaster position="top-right" />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(5, 20, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        padding: '40px',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Forgot your Password</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '15px', lineHeight: 1.5, marginBottom: '30px' }}>
          Please enter your email you would like your password reset information sent to
        </p>

        {sent ? (
          <div style={{
            background: 'rgba(0, 200, 120, 0.15)',
            border: '1px solid #00c878',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px'
          }}>
            <p style={{ color: '#00c878', margin: 0, fontWeight: 'bold' }}>
              ✓ Reset link has been sent to {email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '15px', marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                placeholder="eg- abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontSize: '16px',
                  padding: '0 15px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                border: 'none',
                borderRadius: '25px',
                backgroundColor: '#04b604',
                color: '#ffffff',
                fontSize: '17px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sending...' : 'Send Mail'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '25px' }}>
          <p style={{ margin: 0, fontSize: '15px' }}>
            Back to{' '}
            <Link to="/login" style={{ color: '#06eb06', textDecoration: 'none', fontWeight: 'bold' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
