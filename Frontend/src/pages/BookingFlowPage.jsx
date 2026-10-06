import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import API from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar, Clock, Car, CheckCircle, ArrowRight } from 'lucide-react';

export const BookingFlowPage = () => {
  const { chargerId } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [charger, setCharger] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form selections
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, vRes] = await Promise.allSettled([
          API.get(`/chargers/${chargerId}`),
          API.get('/vehicles')
        ]);

        if (cRes.status === 'fulfilled' && cRes.value.data?.success) {
          setCharger(cRes.value.data.data);
        }
        if (vRes.status === 'fulfilled' && vRes.value.data?.success) {
          const vList = vRes.value.data.data || [];
          setVehicles(vList);
          if (vList.length > 0) setSelectedVehicleId(vList[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chargerId]);

  // Calculations
  const calculateEndTime = () => {
    const [hours, mins] = startTime.split(':').map(Number);
    const totalMins = hours * 60 + mins + Number(durationMinutes);
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  const estimatedKwh = charger ? Number((charger.power_kw * (durationMinutes / 60)).toFixed(2)) : 0;
  const estimatedCost = charger ? Number((estimatedKwh * charger.price_per_kwh).toFixed(2)) : 0;

  const handleCreateBooking = async () => {
    setSubmitting(true);
    const endTime = calculateEndTime();

    try {
      const res = await API.post('/bookings', {
        charger_id: chargerId,
        vehicle_id: selectedVehicleId || null,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: durationMinutes,
        estimated_kwh: estimatedKwh,
        amount: estimatedCost
      });

      if (res.data?.success) {
        toast.success('Charging slot reserved! Proceeding to payment...');
        navigate(`/payment/${res.data.data.id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Sorry, this charging slot is no longer available.';
      toast.error(msg, { duration: 5000 });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#06130f', color: '#00c878', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Setting up your session...</h2>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-right" />
      <Navbar />

      <main style={{ maxWidth: '850px', width: '92%', margin: '40px auto', flex: 1 }}>
        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '35px',
          background: '#111613',
          padding: '16px 24px',
          borderRadius: '16px',
          border: '1px solid #1f3026'
        }}>
          {['1. Date & Time', '2. Vehicle', '3. Confirmation'].map((stepLabel, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: step >= idx + 1 ? '#00c878' : '#666',
              fontWeight: step === idx + 1 ? 'bold' : 'normal',
              fontSize: '15px'
            }}>
              <span>{step > idx + 1 ? '✓' : idx + 1}</span>
              {stepLabel}
            </div>
          ))}
        </div>

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <section style={{ background: '#111613', border: '1px solid #1f3026', borderRadius: '18px', padding: '35px' }}>
            <h2 style={{ fontSize: '24px', margin: '0 0 10px' }}>Select Date & Charging Slot</h2>
            <p style={{ color: '#89968e', margin: '0 0 25px' }}>
              Station: <strong style={{ color: '#ffffff' }}>{charger?.name}</strong> (₹{charger?.price_per_kwh}/kWh)
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Booking Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#cbd5e1' }}>Duration</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  style={{ width: '100%', padding: '12px', background: '#0b0f0d', border: '1px solid #2d3748', borderRadius: '8px', color: '#fff', fontSize: '15px' }}
                >
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={90}>1.5 Hours</option>
                  <option value={120}>2 Hours</option>
                  <option value={180}>3 Hours</option>
                </select>
              </div>
            </div>

            <div style={{ background: '#0b0f0d', padding: '18px', borderRadius: '12px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#89968e', fontSize: '13px' }}>Calculated Slot:</span>
                <p style={{ margin: '4px 0 0', fontWeight: 'bold' }}>{startTime} to {calculateEndTime()} ({durationMinutes} mins)</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#89968e', fontSize: '13px' }}>Est. Energy & Cost:</span>
                <p style={{ margin: '4px 0 0', color: '#00c878', fontWeight: 'bold' }}>~{estimatedKwh} kWh • ₹{estimatedCost}</p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                background: '#00b86b',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Next: Select Vehicle <ArrowRight size={18} />
            </button>
          </section>
        )}

        {/* Step 2: Select Vehicle */}
        {step === 2 && (
          <section style={{ background: '#111613', border: '1px solid #1f3026', borderRadius: '18px', padding: '35px' }}>
            <h2 style={{ fontSize: '24px', margin: '0 0 10px' }}>Select EV Vehicle</h2>
            <p style={{ color: '#89968e', margin: '0 0 25px' }}>
              Choose which vehicle you will bring to the station
            </p>

            {vehicles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', background: '#0b0f0d', borderRadius: '12px', marginBottom: '25px' }}>
                <p style={{ color: '#cbd5e1', marginBottom: '15px' }}>No vehicles registered on your profile.</p>
                <button
                  onClick={() => navigate('/profile')}
                  style={{ background: '#00c878', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Add Vehicle in Profile
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      background: selectedVehicleId === v.id ? 'rgba(0, 200, 120, 0.12)' : '#0b0f0d',
                      border: selectedVehicleId === v.id ? '2px solid #00c878' : '1px solid #2d3748',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '17px' }}>{v.brand} {v.model}</h4>
                      <p style={{ margin: 0, color: '#89968e', fontSize: '13px' }}>
                        Battery: {v.battery_capacity_kwh || '40'} kWh • Port: {v.connector_type || 'CCS2'}
                      </p>
                    </div>
                    {selectedVehicleId === v.id && (
                      <CheckCircle color="#00c878" size={22} />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid #4a5568', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                style={{ flex: 2, padding: '14px', background: '#00b86b', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Next: Review & Confirm <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}

        {/* Step 3: Booking Summary */}
        {step === 3 && (
          <section style={{ background: '#111613', border: '1px solid #1f3026', borderRadius: '18px', padding: '35px' }}>
            <h2 style={{ fontSize: '24px', margin: '0 0 20px' }}>Booking Summary</h2>

            <div style={{ background: '#0b0f0d', padding: '24px', borderRadius: '14px', border: '1px solid #1f3026', marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f3026', paddingBottom: '12px', marginBottom: '12px' }}>
                <span style={{ color: '#89968e' }}>Charging Station</span>
                <strong>{charger?.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f3026', paddingBottom: '12px', marginBottom: '12px' }}>
                <span style={{ color: '#89968e' }}>Location</span>
                <strong>{charger?.city}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f3026', paddingBottom: '12px', marginBottom: '12px' }}>
                <span style={{ color: '#89968e' }}>Date</span>
                <strong>{bookingDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f3026', paddingBottom: '12px', marginBottom: '12px' }}>
                <span style={{ color: '#89968e' }}>Time Window</span>
                <strong>{startTime} – {calculateEndTime()} ({durationMinutes}m)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1f3026', paddingBottom: '12px', marginBottom: '12px' }}>
                <span style={{ color: '#89968e' }}>Estimated Output</span>
                <strong>~{estimatedKwh} kWh</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '18px' }}>
                <span style={{ fontWeight: 'bold' }}>Total Estimated Amount</span>
                <strong style={{ color: '#00c878' }}>₹{estimatedCost}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setStep(2)}
                disabled={submitting}
                style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid #4a5568', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Back
              </button>
              <button
                onClick={handleCreateBooking}
                disabled={submitting}
                style={{
                  flex: 2,
                  padding: '14px',
                  background: '#00b86b',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '10px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(0, 184, 107, 0.4)'
                }}
              >
                {submitting ? 'Checking availability...' : 'Proceed to Payment →'}
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};
