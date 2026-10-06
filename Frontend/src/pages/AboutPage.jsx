import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const AboutPage = () => {
  return (
    <div style={{ backgroundColor: '#06130f', color: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px', flex: 1 }}>
        <section style={{ textAlign: 'center', marginBottom: '50px' }}>
          <p style={{ color: '#00c878', letterSpacing: '2px', fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>
            ABOUT EVCHARGE
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 'bold', marginBottom: '20px' }}>
            Powering the Future of Electric Mobility
          </h1>
          <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#d2dad7', maxWidth: '800px', margin: '0 auto 15px' }}>
            EVCharge is India's peer-to-peer EV charging platform designed to make electric vehicle charging simple,
            accessible, and community-driven. Our platform helps EV users discover charging stations, verify connector
            compatibility, book guaranteed time slots, and pay securely.
          </p>
          <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#d2dad7', maxWidth: '800px', margin: '0 auto' }}>
            We aim to build a decentralized charging grid where EV drivers connect directly with charger owners,
            turning idle private parking spots and commercial chargers into shared neighborhood hubs.
          </p>
        </section>

        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '16px',
          padding: '35px',
          marginBottom: '40px'
        }}>
          <h2 style={{ color: '#00c878', fontSize: '26px', marginBottom: '15px' }}>Our Mission</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#cbd5e1' }}>
            Our mission is to eliminate range anxiety and democratize charging infrastructure across India.
            By connecting EV drivers with local charger hosts, we make electric mobility accessible in every neighborhood,
            tier-1 city, and highway route without waiting years for massive grid upgrades.
          </p>
        </section>

        <section style={{
          background: '#111613',
          border: '1px solid #1f3026',
          borderRadius: '16px',
          padding: '35px',
          marginBottom: '40px'
        }}>
          <h2 style={{ color: '#00c878', fontSize: '26px', marginBottom: '20px' }}>What We Do</h2>
          <ul style={{ fontSize: '16px', lineHeight: 2, color: '#cbd5e1', paddingLeft: '20px' }}>
            <li>📍 Discover nearby peer-to-peer and public EV charging points with verified real-time availability</li>
            <li>🔌 Filter chargers precisely by connector (CCS2, Type 2, CHAdeMO) and power speed (AC Slow, DC Fast, Rapid)</li>
            <li>⚡ Book slots in advance with server-side double-booking prevention</li>
            <li>💳 Flexible payment handling via EV Points or built-in digital monetary wallet</li>
            <li>🏠 Empower homeowners and businesses to list their chargers, manage slots, and earn passive income</li>
          </ul>
        </section>

        <section style={{ marginBottom: '50px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '10px' }}>Meet Our Founders</h2>
          <p style={{ textAlign: 'center', color: '#8d9994', marginBottom: '40px' }}>
            EVCharge was created by passionate innovators dedicated to sustainable electric mobility.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div style={{
              background: '#111613',
              border: '1px solid #1f3026',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <img
                src="/image/manjeet.png"
                alt="Tejas Shukla"
                style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00c878', marginBottom: '15px' }}
              />
              <h3 style={{ fontSize: '22px', margin: '0 0 5px' }}>Tejas Shukla</h3>
              <p style={{ color: '#00c878', fontWeight: 'bold', margin: '0 0 12px' }}>Co-Founder & Tech Lead</p>
              <p style={{ color: '#a0aec0', fontSize: '14px', lineHeight: 1.6 }}>
                Passionate about building scalable distributed systems and clean-tech infrastructure to power the future of transportation.
              </p>
            </div>

            <div style={{
              background: '#111613',
              border: '1px solid #1f3026',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <img
                src="/image/manjeet.png"
                alt="Manjeet Maurya"
                style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #00c878', marginBottom: '15px' }}
              />
              <h3 style={{ fontSize: '22px', margin: '0 0 5px' }}>Manjeet Maurya</h3>
              <p style={{ color: '#00c878', fontWeight: 'bold', margin: '0 0 12px' }}>Co-Founder & Product Lead</p>
              <p style={{ color: '#a0aec0', fontSize: '14px', lineHeight: 1.6 }}>
                Interested in full-stack architecture, clean user experiences, and solving real-world electric vehicle infrastructure challenges.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
