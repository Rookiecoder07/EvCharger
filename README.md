# ⚡ EVCharge — Smart & Community-Powered EV Charging Platform

> **Find. Book. Charge. Connect.**

EVCharge is a full-stack **EV charging marketplace** that connects electric vehicle users with public, private, and community-shared charging stations.

The platform allows users to **discover charging stations, check availability, reserve charging slots, manage their EVs, make payments, manage their wallet, and review charging experiences**.

At the same time, EV owners and businesses can become **charger hosts**, list their chargers, manage availability, and receive bookings.

---

## 🚀 Project Overview

Finding a suitable EV charging station can be inconvenient due to limited availability, uncertain waiting times, fragmented charging networks, and lack of reservation support.

EVCharge addresses this problem by bringing **charger discovery, reservation, payments, wallet management, and community charger sharing** into one platform.

### Core Concept

```text
                    EVCharge
                       │
          ┌────────────┴────────────┐
          │                         │
      EV Users                  Charger Hosts
          │                         │
          ▼                         ▼
   Find & Reserve             List Chargers
   Charging Slots             Manage Chargers
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
                EVCharge Platform
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Booking      Payment      Reviews
```

---

# ✨ Key Features

## 🔐 Authentication

* User registration
* Email/password login
* Password reset
* Supabase authentication
* Protected application routes
* Session management

## 👤 User Profile

Users can manage:

* Personal information
* EV vehicles
* Charging preferences
* Charging statistics
* Booking activity

## 🚗 EV Vehicle Management

Users can add and manage their electric vehicles.

Vehicle information includes:

* Brand
* Model
* Battery capacity
* Connector type

## ⚡ Charger Discovery

Users can discover charging stations using filters such as:

* Location
* Connector type
* Charging speed

Supported connector types include:

* CCS2
* Type 2
* CHAdeMO

## 🔎 Charger Details

Each charger provides:

* Station information
* Location
* Charging power
* Connector type
* Pricing
* Operating hours
* Availability
* Reviews and ratings

## 📅 Slot Reservation

EVCharge provides a multi-step booking experience:

```text
Select Charger
      ↓
Select Date & Time
      ↓
Select Vehicle
      ↓
Select Duration
      ↓
Calculate Cost
      ↓
Confirm Booking
      ↓
Payment
      ↓
Booking Confirmation
```

## 🛡️ Double-Booking Prevention

EVCharge performs **server-side booking conflict validation** before confirming a reservation.

```text
User Requests Slot
        ↓
Backend Validation
        ↓
Check Existing Reservations
        ↓
   ┌────┴────┐
   │         │
Available  Conflict
   │         │
   ▼         ▼
Confirm    Reject
Booking    Booking
```

This prevents overlapping reservations for the same charger and time period.

## 💳 Payments

The platform is designed to support:

* EVCharge Wallet
* UPI
* Debit/Credit Card

Payment information is associated with the corresponding booking.

## 💰 Digital Wallet

Users can:

* View wallet balance
* Add funds
* Pay for charging
* View transaction history
* Receive eligible booking refunds

## 🏆 EV Points

EVCharge maintains a separate reward-point system for community participation.

Users can view:

* EV Points
* Reward activity
* Community transactions

## 📖 Booking Management

Users can manage:

* Upcoming bookings
* Completed bookings
* Cancelled bookings
* Booking details
* Payment information
* Charging history

Eligible cancelled bookings can trigger wallet refunds according to the platform's business logic.

## ⭐ Reviews & Ratings

After completing a charging session, users can provide:

* Ratings
* Feedback
* Charger reviews

This creates a community-driven reputation system.

---

# 🏠 Community Charger Hosting

EVCharge allows individuals and businesses to share their private or commercial charging infrastructure.

Hosts can:

* Add chargers
* Configure charger details
* Set pricing
* Manage availability
* View bookings
* Manage their chargers

### Host Workflow

```text
Become Host
     ↓
Add Charger
     ↓
Set Pricing & Availability
     ↓
Receive Bookings
     ↓
Manage Reservations
     ↓
Track Charger Activity
```

This creates a two-sided marketplace:

```text
             EVCharge Marketplace

       EV Users          Charger Hosts
           │                   │
           │                   │
           ▼                   ▼
      Find Chargers       List Chargers
      Reserve Slots       Set Availability
      Make Payments       Manage Bookings
           │                   │
           └─────────┬─────────┘
                     ▼
                EVCharge
```

---

# 🏗️ Technology Stack

### Frontend

* React 18
* Vite
* React Router v6
* Lucide Icons
* React Hot Toast

### Backend

* Node.js
* Express.js
* ES Modules
* REST APIs
* Helmet
* CORS
* Morgan

### Database & Authentication

* Supabase
* PostgreSQL
* Supabase Auth
* Row Level Security (RLS)

### Styling

* Native CSS
* Dark green glassmorphism visual identity

---

# 🏛️ System Architecture

```text
┌─────────────────────────────────────┐
│            React Frontend           │
│                                     │
│ Pages • Components • Routing        │
│ Context • API Services              │
└─────────────────┬───────────────────┘
                  │
                  │ REST API
                  ▼
┌─────────────────────────────────────┐
│         Node.js + Express           │
│                                     │
│ Routes • Controllers                │
│ Middleware • Business Logic         │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│              Supabase               │
│                                     │
│ PostgreSQL • Authentication • RLS   │
└─────────────────────────────────────┘
```

---

# 📁 Project Structure

```text
EvCharger/
│
├── Frontend/
│   ├── public/
│   │   └── Static assets
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ChargerCard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── WalletPage.jsx
│   │   │   ├── FindChargersPage.jsx
│   │   │   ├── ChargerDetailPage.jsx
│   │   │   ├── BookingFlowPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── BookingConfirmationPage.jsx
│   │   │   ├── MyBookingsPage.jsx
│   │   │   ├── OwnerDashboardPage.jsx
│   │   │   ├── AddChargerPage.jsx
│   │   │   └── ManageChargerPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── API & Supabase services
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   │
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
└── README.md
```

---

# 🗄️ Database

EVCharge uses **Supabase PostgreSQL** for application data.

Supabase also provides authentication and Row Level Security.

The database layer supports the major platform entities:

```text
Users
 │
 ├── Vehicles
 │
 ├── Bookings
 │      │
 │      ├── Chargers
 │      └── Payments
 │
 ├── Wallet Transactions
 │
 ├── Reviews
 │
 └── Saved Chargers

Charger Hosts
 │
 └── Chargers
       │
       └── Bookings
```

Database files:

```text
database/
├── schema.sql
└── seed.sql
```

`schema.sql` contains the database schema, security policies, and required database functions.

`seed.sql` contains sample charging station data for testing.

---

# 🔐 Security

EVCharge uses multiple security mechanisms:

* Supabase Authentication
* Protected frontend routes
* Authenticated API requests
* Server-side authorization
* PostgreSQL Row Level Security
* Helmet security middleware
* CORS configuration
* Environment variables
* Server-side booking validation

> Never commit production secrets, service-role keys, passwords, or private credentials to GitHub.

---

# ⚙️ Installation & Setup

## Prerequisites

Install:

* Node.js
* npm
* Git
* Supabase account

---

## 1. Clone the Repository

```bash
git clone https://github.com/Rookiecoder07/EvCharger.git
cd EvCharger
```

---

## 2. Configure Supabase

Create a Supabase project.

Open:

```text
Supabase Dashboard
        ↓
SQL Editor
```

Run:

```text
database/schema.sql
```

For sample charger data, optionally run:

```text
database/seed.sql
```

---

## 3. Configure Environment Variables

### Frontend

Create:

```text
Frontend/.env
```

Add:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

### Backend

Create:

```text
backend/.env
```

Add the required Supabase and server configuration.

> Do not commit `.env` files containing private credentials.

---

# 4. Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

# 5. Run Frontend

Open a second terminal:

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔄 Main User Flow

```text
Register / Login
       ↓
      Home
       ↓
 Find Chargers
       ↓
Charger Details
       ↓
Select Date & Time
       ↓
 Select Vehicle
       ↓
Booking Summary
       ↓
    Payment
       ↓
Booking Confirmation
       ↓
  My Bookings
       ↓
Charging History
       ↓
Review Charger
```

---

# 🔄 Charger Host Flow

```text
Authenticated User
       ↓
 Become Host
       ↓
  Add Charger
       ↓
Set Price & Availability
       ↓
 Receive Booking
       ↓
Manage Charger
       ↓
Track Activity
```

---

# 🧪 Example User Scenario

A typical EVCharge session:

```text
1. User logs in
        ↓
2. Searches for nearby chargers
        ↓
3. Filters by connector and charging speed
        ↓
4. Opens charger details
        ↓
5. Selects date and time
        ↓
6. Selects their EV
        ↓
7. Reviews booking cost
        ↓
8. Selects payment method
        ↓
9. Booking is validated
        ↓
10. Reservation is confirmed
        ↓
11. Booking appears in My Bookings
        ↓
12. User completes charging
        ↓
13. User submits a review
```

---

# 💡 What Makes EVCharge Different?

### 🔹 1. Reservation-Based Charging

Users can reserve charging slots instead of depending entirely on first-come-first-served availability.

### 🔹 2. Double-Booking Protection

Server-side validation prevents overlapping reservations.

### 🔹 3. Community-Powered Charging

Private and commercial chargers can participate in the platform.

### 🔹 4. Two-Sided Marketplace

EVCharge connects:

```text
EV Users
    ↕
EVCharge
    ↕
Charger Hosts
```

### 🔹 5. Integrated Wallet

Users can manage charging payments and transaction history through a dedicated wallet.

### 🔹 6. EV-Centric Experience

The platform combines vehicles, charging preferences, reservations, payments, reviews, and charger hosting into one ecosystem.

---

# 🛣️ Future Scope

The current architecture can be extended with:

* Live charger occupancy
* IoT charger integration
* OCPP support
* Real-time charging session monitoring
* Push notifications
* Google Maps / Mapbox integration
* AI-powered charger recommendations
* Dynamic pricing
* Charging demand prediction
* Predictive maintenance
* Smart energy management
* Solar-powered charging
* Advanced host analytics
* Mobile application

---

# 📌 Project Status

## Implemented

* [x] Authentication
* [x] Protected routes
* [x] User profiles
* [x] EV vehicle management
* [x] Charger discovery
* [x] Charger details
* [x] Slot reservation
* [x] Double-booking prevention
* [x] Wallet
* [x] EV reward points
* [x] Booking management
* [x] Reviews & ratings
* [x] Charger hosting
* [x] Owner dashboard
* [x] Supabase PostgreSQL integration
* [x] REST API architecture

## Future Enhancements

* [ ] Live IoT charger integration
* [ ] OCPP integration
* [ ] Real-time charging sessions
* [ ] AI charger recommendation
* [ ] Advanced analytics
* [ ] Mobile application

---

# 🎯 Project Vision

EVCharge aims to transform EV charging from a fragmented, station-centric experience into a **connected and community-powered charging marketplace**.

Instead of simply asking:

> **"Where is the nearest charging station?"**

EVCharge aims to answer:

> **"Where is the best charger for me, when I need it, at the right price?"**

---

# ⚡ EVCharge

### Find. Book. Charge. Connect.

**Smart charging infrastructure powered by technology and community.**
