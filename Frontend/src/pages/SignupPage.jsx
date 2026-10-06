import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !firstName) {
      toast.error('Please enter name, email, and password');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await signup(email, password, fullName);
      toast.success('Account created successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast(`${provider} sign up will be available soon!`, { icon: 'ℹ️' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("/photos/signup.png"), url("/photos/login2.png")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <Toaster position="top-right" />

      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: 'rgba(5, 20, 15, 0.78)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
        borderRadius: '24px',
        padding: '40px 45px',
        color: '#ffffff'
      }}>
        <div style={{ marginBottom: '25px' }}>
          <h1 style={{ fontSize: '36px', margin: '0 0 8px', color: '#ffffff', fontWeight: 'bold' }}>
            Sign up
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', margin: 0, fontSize: '15px' }}>
            Sign up to create your EVCharge account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>First Name</label>
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontSize: '15px',
                  padding: '0 12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Last Name</label>
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  fontSize: '15px',
                  padding: '0 12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginTop: '18px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '15px',
                padding: '0 12px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginTop: '18px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '15px',
                padding: '0 12px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '50px',
              border: 'none',
              borderRadius: '25px',
              backgroundColor: '#04b604',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '25px',
              boxShadow: '0 4px 15px rgba(4, 182, 4, 0.4)'
            }}
          >
            {loading ? 'Creating Account...' : 'Sign up'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          margin: '25px 0',
          width: '100%'
        }}>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.25)' }}></span>
          <p style={{ color: '#8b95a5', fontSize: '13px', margin: 0, textTransform: 'lowercase' }}>or continue with</p>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.25)' }}></span>
        </div>

        {/* Social */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => handleSocialLogin('Google')}
            style={{
              width: '100%',
              height: '46px',
              border: 'none',
              borderRadius: '25px',
              backgroundColor: '#f4f7f4',
              color: '#111111',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <img src="/photos/google.png" alt="Google" style={{ width: '20px', height: '20px' }} />
            Google
          </button>

          <button
            onClick={() => handleSocialLogin('Apple')}
            style={{
              width: '100%',
              height: '46px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '25px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <img src="/photos/apple.png" alt="Apple" style={{ width: '20px', height: '20px' }} />
            Apple
          </button>
        </div>

        {/* End Footer Links */}
        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
          <p style={{ margin: '0 0 15px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#06eb06', textDecoration: 'none', fontWeight: 'bold' }}>
              Login
            </Link>
          </p>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'transparent',
              color: '#d2dad7',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '6px 20px',
              borderRadius: '15px',
              cursor: 'pointer'
            }}>
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
