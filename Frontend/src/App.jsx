import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { WalletPage } from './pages/WalletPage';
import { FindChargersPage } from './pages/FindChargersPage';
import { ChargerDetailPage } from './pages/ChargerDetailPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { PaymentPage } from './pages/PaymentPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AddChargerPage } from './pages/AddChargerPage';
import { ManageChargerPage } from './pages/ManageChargerPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/find-chargers" element={<FindChargersPage />} />
          <Route path="/charger/:id" element={<ChargerDetailPage />} />

          {/* Protected Customer Routes */}
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute><WalletPage /></ProtectedRoute>
          } />
          <Route path="/book/:chargerId" element={
            <ProtectedRoute><BookingFlowPage /></ProtectedRoute>
          } />
          <Route path="/payment/:bookingId" element={
            <ProtectedRoute><PaymentPage /></ProtectedRoute>
          } />
          <Route path="/booking-confirmation/:bookingId" element={
            <ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
          } />

          {/* Protected Host / Owner Routes */}
          <Route path="/owner/dashboard" element={
            <ProtectedRoute><OwnerDashboardPage /></ProtectedRoute>
          } />
          <Route path="/owner/add-charger" element={
            <ProtectedRoute><AddChargerPage /></ProtectedRoute>
          } />
          <Route path="/owner/manage-charger/:id" element={
            <ProtectedRoute><ManageChargerPage /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
