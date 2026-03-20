import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();
  
  const heroStyle = {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)',
    color: '#ffffff',
    paddingTop: '100px',
    paddingBottom: '100px',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    textAlign: 'center',
  };

  const pageHeading = {
    fontSize: 'clamp(2.5rem, 8vw, 3.2rem)',
    fontWeight: 800,
    marginBottom: '1rem',
    letterSpacing: '-0.5px',
  };

  const sectionStyle = {
    paddingTop: '4rem',
    paddingBottom: '4rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f0f0',
  };

  const stepGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '3rem',
    alignItems: 'center',
    marginBottom: '4rem',
  };

  const techGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  };

  const heading2Style = {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#1B5E20',
    marginBottom: '1.5rem',
    letterSpacing: '-0.5px',
  };

  return (
    <div>
      <section style={heroStyle}>
        <h1 style={{ ...pageHeading, color: '#ffffff' }}>⚙️ How InsuChain Works</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>Revolutionizing crop insurance through blockchain and real-time weather data</p>
      </section>

      {/* Steps */}
      {[
        { num: '1️⃣', title: 'Register & Verify', desc: 'Create your InsuChain account with just an email and password. Choose your role as a farmer and optionally add your blockchain wallet address for transactions. Instant account activation - no lengthy paperwork!', items: ['Valid email address', 'Secure password', 'Optional: Wallet address for payouts', 'Basic farm information'] },
        { num: '2️⃣', title: 'Select Policy', desc: 'Browse our comprehensive collection of insurance policies. Each policy is designed for specific weather conditions and coverage levels. Compare premiums, payouts, and conditions to find the perfect fit for your farm and crops.', items: ['Browse 14+ policy options', 'Compare premiums and payouts', 'Check rainfall & temperature thresholds', 'Choose based on your crop & location'], reverse: true },
        { num: '3️⃣', title: 'Purchase & Confirm', desc: 'Complete your purchase through our secure blockchain-based payment system. Your transaction is recorded on the blockchain for transparency and security. You immediately own the policy - no waiting period!', items: ['Select your desired policy', 'Review coverage details', 'Confirm purchase amount', 'Complete blockchain transaction', 'Receive confirmation and TX hash'] },
        { num: '4️⃣', title: 'Monitor & Get Paid', desc: 'Our system continuously monitors weather conditions in real-time. When weather reaches your policy thresholds, automatic payouts are triggered instantly through smart contracts. No waiting, no paperwork, completely transparent!', items: ['24/7 real-time weather monitoring', 'OpenWeatherMap API integration', 'Instant threshold detection', 'Smart contract automation', 'No manual claims needed'], reverse: true },
      ].map((step, idx) => {
        const content = (
          <>
            <div>
              <h2 style={heading2Style}>{step.num} {step.title}</h2>
              <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: 1.8, marginBottom: '1.5rem' }}>{step.desc}</p>
            </div>
            <div style={cardStyle}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1B5E20', marginBottom: '1rem' }}>📋 {step.num === '1️⃣' ? 'What You Need:' : step.num === '2️⃣' ? 'How to Choose:' : step.num === '3️⃣' ? 'The Process:' : 'Automatic Monitoring:'}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {step.items.map((item, i) => (
                  <li key={i} style={{ padding: '0.75rem 0', color: '#6b7280', display: 'flex', gap: '0.75rem' }}>
                    <span style={{ color: '#1B5E20', fontWeight: 700 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        );

        return (
          <section key={idx} style={{ ...sectionStyle, backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
            <div style={containerStyle}>
              <div style={{ ...stepGridStyle, ...(step.reverse ? { direction: 'rtl' } : {}) }}>
                {content}
              </div>
            </div>
          </section>
        );
      })}

      {/* Technology Stack */}
      <section style={{ ...sectionStyle, backgroundColor: '#ffffff' }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={heading2Style}>🔧 Technology Behind InsuChain</h2>
            <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Built with cutting-edge blockchain and web technologies</p>
          </div>
          <div style={techGridStyle}>
            {[{ emoji: '⛓️', title: 'Blockchain', desc: 'Smart contracts ensure transparent, trustless transactions with automatic payouts when conditions are met.' }, { emoji: '🌦️', title: 'Weather Data', desc: 'Real-time integration with OpenWeatherMap API provides accurate, reliable weather metrics for triggering claims.' }, { emoji: '🔐', title: 'Security', desc: 'Cryptographic security with blockchain immutability ensures your data and transactions are always secure.' }, { emoji: '⚡', title: 'Speed', desc: 'Instant payouts powered by smart contracts - no intermediaries, no delays, pure speed.' }, { emoji: '💯', title: 'Transparency', desc: 'All transactions recorded on-chain. You can verify every aspect of your policies and payouts.' }, { emoji: '🌐', title: 'Decentralized', desc: 'No central authority. InsuChain runs on distributed networks ensuring freedom and independence.' }].map((tech, idx) => (
              <div key={idx} style={cardStyle} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)'; }} style={{ ...cardStyle, transition: 'all 0.4s ease', cursor: 'pointer' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{tech.emoji}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '0.75rem' }}>{tech.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: 1.7 }}>{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ ...sectionStyle, backgroundColor: '#f9fafb' }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={heading2Style}>✨ Key Benefits</h2>
            <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Why farmers choose InsuChain</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[{ emoji: '🚀', title: 'No Paperwork', desc: 'Everything is digital and automated. No need to file claim forms or wait for manual reviews.' }, { emoji: '⏱️', title: 'Instant Payouts', desc: 'Once weather conditions trigger the policy, payouts happen automatically within minutes.' }, { emoji: '💰', title: 'Lower Costs', desc: 'No intermediaries means lower premiums and direct payments to you.' }, { emoji: '🌍', title: 'Global Access', desc: 'Access insurance from anywhere in the world with just an internet connection.' }, { emoji: '🔍', title: 'Full Transparency', desc: 'All data and transactions are verified on the blockchain. See everything that happens.' }, { emoji: '🛡️', title: 'Fair & Equal', desc: 'Same terms and conditions for all farmers. No discrimination based on location or size.' }].map((benefit, idx) => (
              <div key={idx} style={cardStyle} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)'; }} style={{ ...cardStyle, transition: 'all 0.4s ease', cursor: 'pointer' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{benefit.emoji}</div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1B5E20', marginBottom: '0.75rem' }}>{benefit.title}</h4>
                <p style={{ color: '#6b7280', lineHeight: 1.7 }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
