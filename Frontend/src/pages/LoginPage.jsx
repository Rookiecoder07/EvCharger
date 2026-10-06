import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/profile');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast(`${provider} login will be available soon!`, { icon: 'ℹ️' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("/photos/login2.png")',
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
        background: 'rgba(5, 20, 15, 0.75)',
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
            Welcome Back
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', margin: 0, fontSize: '15px' }}>
            Login to continue into your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '15px', marginBottom: '8px', color: '#ffffff' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
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

          {/* Password */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '15px', marginBottom: '8px', color: '#ffffff' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

          {/* Remember me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '20px 0 25px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" style={{ color: '#06eb06', textDecoration: 'none', fontSize: '14px' }}>
              Forgot Password?
            </Link>
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
              transition: 'background-color 0.2s',
              boxShadow: '0 4px 15px rgba(4, 182, 4, 0.4)'
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          margin: '28px 0',
          width: '100%'
        }}>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.25)' }}></span>
          <p style={{ color: '#8b95a5', fontSize: '13px', margin: 0, textTransform: 'lowercase' }}>or continue with</p>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.25)' }}></span>
        </div>

        {/* Social login buttons */}
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
        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
          <p style={{ margin: '0 0 15px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#06eb06', textDecoration: 'none', fontWeight: 'bold' }}>
              Sign up
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
