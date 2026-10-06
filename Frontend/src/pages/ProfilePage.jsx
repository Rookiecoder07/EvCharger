import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Heart, Calendar, Zap, Shield, HelpCircle, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const { user, profile, reloadProfile, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [vehicles, setVehicles] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [savedChargers, setSavedChargers] = useState([]);
  const [myChargers, setMyChargers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Edit personal info modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  // Add vehicle modal
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    battery_capacity_kwh: '',
    connector_type: 'CCS2',
    registration_number: ''
  });

  useEffect(() => {
    if (profile) {
      setNameInput(profile.full_name || '');
      setPhoneInput(profile.phone || '');
      setLocationInput(profile.location || '');
    }
  }, [profile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, bRes, sRes, cRes] = await Promise.allSettled([
          API.get('/vehicles'),
          API.get('/bookings?upcoming=true'),
          API.get('/saved-chargers'),
          API.get('/owner/chargers')
        ]);

        if (vRes.status === 'fulfilled' && vRes.value.data?.success) setVehicles(vRes.value.data.data || []);
        if (bRes.status === 'fulfilled' && bRes.value.data?.success) setUpcomingBookings(bRes.value.data.data || []);
        if (sRes.status === 'fulfilled' && sRes.value.data?.success) setSavedChargers(sRes.value.data.data || []);
        if (cRes.status === 'fulfilled' && cRes.value.data?.success) setMyChargers(cRes.value.data.data || []);
      } catch (err) {
        console.error('Data load error:', err);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put('/users/profile', {
        full_name: nameInput,
        phone: phoneInput,
        location: locationInput
      });
      if (res.data?.success) {
        toast.success('Profile updated successfully');
        setIsEditingProfile(false);
        reloadProfile();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/vehicles', newVehicle);
      if (res.data?.success) {
        toast.success('Vehicle added successfully');
        setVehicles(prev => [...prev, res.data.data]);
        setIsAddingVehicle(false);
        setNewVehicle({ brand: '', model: '', battery_capacity_kwh: '', connector_type: 'CCS2', registration_number: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add vehicle');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to remove this vehicle?')) return;
    try {
      await API.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success('Vehicle removed');
    } catch (err) {
      toast.error('Failed to remove vehicle');
    }
  };

  return (
    <div style={{ backgroundColor: '#0b0f0d', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      <Toaster position="top-right" />
      <Navbar />

      <main style={{ width: '92%', maxWidth: '1100px', margin: '40px auto', flex: 1 }}>
        {/* =========================
             PROFILE HEADER
        ========================== */}
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '18px',
          padding: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '25px',
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <img
              src={profile?.avatar_url || '/image/manjeet.png'}
              alt="Profile"
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #39ff88'
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <h1 style={{ fontSize: '28px', margin: '0 0 6px', color: '#ffffff' }}>
              {profile?.full_name || user?.email?.split('@')[0] || 'EVCharge Member'}
            </h1>
            <p style={{ margin: '0 0 4px', color: '#a0aec0', fontSize: '15px' }}>{user?.email}</p>
            <p style={{ margin: '0 0 8px', color: '#a0aec0', fontSize: '15px' }}>{profile?.phone || 'Add phone number'}</p>
            <span style={{
              display: 'inline-block',
              background: 'rgba(57, 255, 136, 0.15)',
              color: '#39ff88',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 'bold'
            }}>
              ✓ Verified Account
            </span>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            style={{
              background: '#00a86b',
              color: '#ffffff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        </section>

        {/* EDIT PROFILE MODAL / SECTION */}
        {isEditingProfile && (
          <div style={{
            background: '#161e19',
            border: '1px solid #39ff88',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '25px'
          }}>
            <h3 style={{ margin: '0 0 15px', color: '#39ff88' }}>Update Personal Information</h3>
            <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#a0aec0', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#ffffff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#a0aec0', display: 'block', marginBottom: '6px' }}>Phone</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '10px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#ffffff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#a0aec0', display: 'block', marginBottom: '6px' }}>Location / City</label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Greater Noida, India"
                  style={{ width: '100%', padding: '10px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#ffffff' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#00c878', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setIsEditingProfile(false)} style={{ padding: '10px 15px', background: 'transparent', border: '1px solid #4a5568', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================
             PERSONAL INFORMATION
        ========================== */}
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#ffffff' }}>Personal Information</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '13px', color: '#89968e', marginBottom: '4px' }}>Full Name</span>
              <strong style={{ fontSize: '16px' }}>{profile?.full_name || 'Not set'}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '13px', color: '#89968e', marginBottom: '4px' }}>Email</span>
              <strong style={{ fontSize: '16px' }}>{user?.email}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '13px', color: '#89968e', marginBottom: '4px' }}>Phone</span>
              <strong style={{ fontSize: '16px' }}>{profile?.phone || 'Not added'}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '13px', color: '#89968e', marginBottom: '4px' }}>Location</span>
              <strong style={{ fontSize: '16px' }}>{profile?.location || 'India'}</strong>
            </div>
          </div>
        </section>

        {/* =========================
             MY VEHICLE
        ========================== */}
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#ffffff' }}>My Vehicles</h2>
            <button
              onClick={() => setIsAddingVehicle(!isAddingVehicle)}
              style={{
                background: 'rgba(57, 255, 136, 0.1)',
                color: '#39ff88',
                border: '1px solid #39ff88',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Add Vehicle
            </button>
          </div>

          {/* Add Vehicle Modal */}
          {isAddingVehicle && (
            <form onSubmit={handleAddVehicle} style={{
              background: '#0d1310',
              border: '1px dashed #39ff88',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '15px'
            }}>
              <div>
                <label style={{ fontSize: '13px', color: '#a0aec0', display: 'block', marginBottom: '4px' }}>Brand (e.g. Tata, MG)</label>
                <input
                  type="text"
                  required
                  placeholder="Tata"
                  value={newVehicle.brand}
                  onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                  style={{ width: '100%', padding: '9px', background: '#161e19', border: '1px solid #2d3748', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#a0aec0', display: 'block', marginBottom: '4px' }}>Model (e.g. Nexon EV)</label>
                <input
                  type="text"
                  required
                  placeholder="Nexon EV"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  style={{ width: '100%', padding: '9px', background: '#161e19', border: '1px solid #2d3748', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#a0aec0', display: 'block', marginBottom: '4px' }}>Battery (kWh)</label>
                <input
                  type="number"
                  placeholder="40.5"
                  value={newVehicle.battery_capacity_kwh}
                  onChange={(e) => setNewVehicle({ ...newVehicle, battery_capacity_kwh: e.target.value })}
                  style={{ width: '100%', padding: '9px', background: '#161e19', border: '1px solid #2d3748', borderRadius: '6px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#a0aec0', display: 'block', marginBottom: '4px' }}>Connector</label>
                <select
                  value={newVehicle.connector_type}
                  onChange={(e) => setNewVehicle({ ...newVehicle, connector_type: e.target.value })}
                  style={{ width: '100%', padding: '9px', background: '#161e19', border: '1px solid #2d3748', borderRadius: '6px', color: '#fff' }}
                >
                  <option value="CCS2">CCS2</option>
                  <option value="Type2">Type 2</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="Type1">Type 1</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <button type="submit" style={{ padding: '9px 18px', background: '#39ff88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Save
                </button>
                <button type="button" onClick={() => setIsAddingVehicle(false)} style={{ padding: '9px 12px', background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {vehicles.length === 0 ? (
            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              padding: '20px',
              background: '#0d1310',
              borderRadius: '12px',
              border: '1px solid #1a2920'
            }}>
              <img src="/image/ev.jpg" alt="EV" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
              <div>
                <h3 style={{ margin: '0 0 6px' }}>No vehicle linked yet</h3>
                <p style={{ margin: 0, color: '#89968e', fontSize: '14px' }}>
                  Add your electric vehicle above to check charger compatibility and battery estimation.
                </p>
              </div>
            </div>
          ) : (
            vehicles.map((v) => (
              <article key={v.id} style={{
                display: 'flex',
                gap: '25px',
                alignItems: 'center',
                padding: '20px',
                background: '#0d1310',
                borderRadius: '14px',
                border: '1px solid #1f3026',
                marginBottom: '15px',
                flexWrap: 'wrap'
              }}>
                <img
                  src="/image/ev.jpg"
                  alt={`${v.brand} ${v.model}`}
                  style={{ width: '130px', height: '85px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>{v.brand} {v.model}</h3>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '14px', color: '#cbd5e1' }}>
                    <p style={{ margin: 0 }}><strong>Battery:</strong> {v.battery_capacity_kwh || '40.5'} kWh</p>
                    <p style={{ margin: 0 }}><strong>Connector:</strong> {v.connector_type || 'CCS2'}</p>
                    {v.registration_number && (
                      <p style={{ margin: 0 }}><strong>Reg:</strong> {v.registration_number}</p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleDeleteVehicle(v.id)}
                    style={{
                      background: 'rgba(255, 85, 85, 0.1)',
                      color: '#ff5555',
                      border: '1px solid rgba(255, 85, 85, 0.3)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={15} /> Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        {/* =========================
             CHARGING OVERVIEW STATS
        ========================== */}
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 20px', color: '#ffffff' }}>Charging Overview</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '18px'
          }}>
            <div style={{ background: '#0b0f0d', padding: '18px', borderRadius: '12px', border: '1px solid #1f3026' }}>
              <span style={{ fontSize: '24px' }}>⚡</span>
              <h3 style={{ fontSize: '26px', margin: '8px 0 4px', color: '#39ff88' }}>
                {upcomingBookings.length}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#89968e' }}>Active Bookings</p>
            </div>
            <div style={{ background: '#0b0f0d', padding: '18px', borderRadius: '12px', border: '1px solid #1f3026' }}>
              <span style={{ fontSize: '24px' }}>🔋</span>
              <h3 style={{ fontSize: '26px', margin: '8px 0 4px', color: '#39ff88' }}>
                {profile?.ev_points || 0}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#89968e' }}>EV Reward Points</p>
            </div>
            <div style={{ background: '#0b0f0d', padding: '18px', borderRadius: '12px', border: '1px solid #1f3026' }}>
              <span style={{ fontSize: '24px' }}>₹</span>
              <h3 style={{ fontSize: '26px', margin: '8px 0 4px', color: '#39ff88' }}>
                ₹{Number(profile?.wallet_balance || 0).toFixed(2)}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#89968e' }}>Wallet Balance</p>
            </div>
            <div style={{ background: '#0b0f0d', padding: '18px', borderRadius: '12px', border: '1px solid #1f3026' }}>
              <span style={{ fontSize: '24px' }}>🌱</span>
              <h3 style={{ fontSize: '26px', margin: '8px 0 4px', color: '#39ff88' }}>
                {myChargers.length}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#89968e' }}>Hosted Chargers</p>
            </div>
          </div>
        </section>

        {/* =========================
             UPCOMING BOOKINGS
        ========================== */}
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', margin: 0, color: '#ffffff' }}>Upcoming Bookings</h2>
            <Link to="/bookings" style={{ color: '#39ff88', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
              View All →
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <p style={{ color: '#89968e', margin: 0, fontSize: '15px' }}>
              No upcoming charging slots. Find a charger to schedule a session.
            </p>
          ) : (
            upcomingBookings.slice(0, 2).map((b) => (
              <article key={b.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 20px',
                background: '#0d1310',
                borderRadius: '12px',
                border: '1px solid #1f3026',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px', fontSize: '17px' }}>{b.chargers?.name || 'EV Station'}</h3>
                  <p style={{ margin: '0 0 3px', color: '#89968e', fontSize: '14px' }}>📍 {b.chargers?.city || 'City'}</p>
                  <p style={{ margin: 0, color: '#39ff88', fontSize: '13px' }}>⚡ {b.chargers?.power_kw} kW • {b.chargers?.connector_type}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ display: 'block', fontSize: '15px' }}>{b.booking_date}</strong>
                  <span style={{ color: '#a0aec0', fontSize: '14px' }}>{b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}</span>
                  <div style={{
                    marginTop: '6px',
                    display: 'inline-block',
                    background: 'rgba(0, 200, 120, 0.2)',
                    color: '#00c878',
                    padding: '3px 10px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {b.status?.toUpperCase()}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        {/* =========================
             MY CHARGERS (HOST / OWNER)
        ========================== */}
        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '25px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: '0 0 4px', color: '#ffffff' }}>My Chargers (Host)</h2>
              <p style={{ color: '#89968e', margin: 0, fontSize: '14px' }}>
                Manage chargers you share with the EV community.
              </p>
            </div>
            <Link to="/owner/add-charger">
              <button style={{
                background: '#00a86b',
                color: '#ffffff',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                + Add Charger
              </button>
            </Link>
          </div>

          {myChargers.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              background: '#0b0f0d',
              borderRadius: '12px',
              border: '1px dashed #1f3026'
            }}>
              <p style={{ color: '#89968e', margin: '0 0 12px' }}>
                You haven't listed any EV chargers yet. Monetize your wallbox or commercial plug!
              </p>
              <Link to="/owner/add-charger">
                <button style={{
                  background: 'transparent',
                  color: '#39ff88',
                  border: '1px solid #39ff88',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  List Your Charger
                </button>
              </Link>
            </div>
          ) : (
            myChargers.map((c) => (
              <article key={c.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 20px',
                background: '#0d1310',
                borderRadius: '12px',
                border: '1px solid #1f3026',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '17px' }}>{c.name}</h3>
                  <p style={{ margin: '0 0 2px', color: '#89968e', fontSize: '14px' }}>📍 {c.address}, {c.city}</p>
                  <p style={{ margin: 0, color: '#a0aec0', fontSize: '13px' }}>⚡ {c.power_kw} kW • 💰 ₹{c.price_per_kwh}/kWh</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{
                    color: c.is_active ? '#39ff88' : '#ff5555',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    ● {c.is_active ? 'Active' : 'Disabled'}
                  </span>
                  <Link to={`/owner/manage-charger/${c.id}`}>
                    <button style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      border: '1px solid #2d3748',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}>
                      Manage
                    </button>
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>

        {/* =========================
             SIGN OUT
        ========================== */}
        <section style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              background: 'rgba(255, 85, 85, 0.1)',
              color: '#ff5555',
              border: '1px solid rgba(255, 85, 85, 0.3)',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <LogOut size={18} /> Sign Out of EVCharge
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
};
