import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { PlusCircle, ArrowDownLeft, ArrowUpRight, Gift, Heart, Star } from 'lucide-react';

export const WalletPage = () => {
  const { profile, reloadProfile } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [addAmount, setAddAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await API.get('/wallet');
        if (res.data?.success) {
          setTransactions(res.data.data.transactions || []);
        }
      } catch (err) {
        console.error('Wallet error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    const val = Number(addAmount);
    if (!val || val < 10) {
      toast.error('Minimum top-up amount is ₹10');
      return;
    }

    try {
      const res = await API.post('/wallet/add-money', { amount: val });
      if (res.data?.success) {
        toast.success(`₹${val} added to your EVCharge Wallet!`);
        setAddAmount('');
        setIsAdding(false);
        reloadProfile();
        const refresh = await API.get('/wallet');
        if (refresh.data?.success) setTransactions(refresh.data.data.transactions || []);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add money');
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', color: '#222222', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      <Toaster position="top-right" />
      <Navbar />

      <main style={{ width: '92%', maxWidth: '900px', margin: '30px auto', flex: 1 }}>
        {/* =========================================
             MONETARY WALLET HERO CARD
        ========================================= */}
        <section style={{
          background: 'linear-gradient(145deg, #197e87, #0f5132)',
          color: '#ffffff',
          borderRadius: '18px',
          padding: '30px 35px',
          boxShadow: '8px 8px 0px #083c25, 12px 12px 20px rgba(2, 87, 102, 0.25)',
          marginBottom: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '15px', opacity: 0.9 }}>Digital Monetary Wallet</p>
            <h1 style={{ fontSize: '42px', margin: '0 0 6px', fontWeight: 'bold' }}>
              ₹{Number(profile?.wallet_balance || 0).toFixed(2)}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.85 }}>Available for charging sessions & slot reservations</p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            style={{
              background: '#00c878',
              color: '#002014',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <PlusCircle size={18} /> Add Money
          </button>
        </section>

        {/* TOP UP FORM MODAL/DRAWER */}
        {isAdding && (
          <form onSubmit={handleAddMoney} style={{
            background: '#ffffff',
            padding: '20px',
            borderRadius: '14px',
            marginBottom: '25px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontWeight: 'bold', color: '#173b2b' }}>Top-up Amount (₹):</span>
            <input
              type="number"
              placeholder="e.g. 500"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #198754',
                fontSize: '16px',
                width: '160px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#198754',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Confirm Deposit
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              style={{
                background: 'transparent',
                color: '#666',
                border: '1px solid #ccc',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </form>
        )}

        {/* =========================================
             PRESERVED EV POINTS CARD
        ========================================= */}
        <section style={{
          background: 'linear-gradient(135deg, #198754, #0f5132)',
          color: 'white',
          padding: '25px 30px',
          borderRadius: '18px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          marginBottom: '25px'
        }}>
          <p style={{ margin: 0, fontSize: '15px', opacity: 0.9 }}>Community EV Reward Points</p>
          <h2 style={{ fontSize: '38px', margin: '6px 0', fontWeight: 'bold' }}>
            {profile?.ev_points || 0}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.85 }}>Earn 50 pts per completed session & 10 pts per review</p>
        </section>

        {/* =========================================
             PRESERVED QUICK ACTIONS
        ========================================= */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px 15px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer'
          }}>
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>🎁</span>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>Rewards Program</p>
          </div>

          <div style={{
            background: 'white',
            padding: '20px 15px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer'
          }} onClick={() => toast('Saved stations in your profile!', { icon: '❤️' })}>
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>❤️</span>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>Favorite Stations</p>
          </div>

          <div style={{
            background: 'white',
            padding: '20px 15px',
            borderRadius: '15px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer'
          }} onClick={() => toast('Rate completed sessions in My Bookings!', { icon: '⭐' })}>
            <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>⭐</span>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#333' }}>My Reviews</p>
          </div>
        </section>

        {/* =========================================
             TRANSACTION HISTORY
        ========================================= */}
        <section>
          <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#173b2b' }}>Recent Activity & Transactions</h2>

          {transactions.length === 0 ? (
            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#666',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
            }}>
              No transactions yet. Complete charging sessions or add wallet funds.
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} style={{
                background: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderRadius: '12px',
                marginBottom: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft size={20} color="#198754" />
                  ) : (
                    <ArrowUpRight size={20} color="#dc3545" />
                  )}
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600, color: '#333' }}>
                      {tx.description || (tx.category === 'top_up' ? 'Wallet Top-Up' : 'Charging Payment')}
                    </p>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <span style={{
                  color: tx.type === 'credit' ? '#198754' : '#dc3545',
                  fontWeight: 700,
                  fontSize: '16px'
                }}>
                  {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
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
