import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>🌾 Smart Crop Insurance for Modern Farmers</h1>
          <p>Weather-based insurance powered by blockchain technology</p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/policies" className="btn btn-secondary" style={{ marginRight: '1rem' }}>
              Explore Policies
            </Link>
            <Link to="/register" className="btn btn-outline">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose InsuChain?</h2>
            <p>Revolutionary insurance solutions for farmers</p>
          </div>
          <div className="grid-3">
            <div className="card">
              <h3>⛓️ Decentralized</h3>
              <p>Smart contracts ensure transparent and automatic payouts based on real weather data.</p>
            </div>
            <div className="card">
              <h3>🌍 Real-Time Data</h3>
              <p>Live weather monitoring from OpenWeatherMap API for accurate coverage triggers.</p>
            </div>
            <div className="card">
              <h3>💰 Instant Payouts</h3>
              <p>Automated payouts when weather conditions trigger claims - no waiting, no paperwork.</p>
            </div>
            <div className="card">
              <h3>🔒 Secure</h3>
              <p>Built on blockchain with cryptographic security for maximum protection.</p>
            </div>
            <div className="card">
              <h3>📱 Easy to Use</h3>
              <p>Simple registration and policy management through our user-friendly platform.</p>
            </div>
            <div className="card">
              <h3>💡 Affordable</h3>
              <p>Competitive premiums with transparent pricing and no hidden charges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" style={{ background: '#f3f4f6' }}>
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple 4-step process to protect your crops</p>
          </div>
          <div className="grid-2">
            <div className="card">
              <h4>1. Register</h4>
              <p>Create an account and verify your details as a farmer.</p>
            </div>
            <div className="card">
              <h4>2. Choose Policy</h4>
              <p>Select a policy that matches your crop and location needs.</p>
            </div>
            <div className="card">
              <h4>3. Purchase</h4>
              <p>Complete the purchase on blockchain with transparent transaction.</p>
            </div>
            <div className="card">
              <h4>4. Get Paid</h4>
              <p>Automatic payout when weather triggers your insurance claim.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to Protect Your Farm?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
            Join thousands of farmers using InsuChain for weather insurance
          </p>
          <Link to="/register" className="btn btn-primary" style={{ marginRight: '1rem', fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Start Today
          </Link>
          <Link to="/policies" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            View Policies
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
