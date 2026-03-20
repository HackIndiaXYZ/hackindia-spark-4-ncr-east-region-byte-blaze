import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(0);

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
    maxWidth: '900px',
    margin: '0 auto',
  };

  const faqs = [
    { q: 'What is InsuChain?', a: 'InsuChain is a decentralized, blockchain-based crop insurance platform that uses real-time weather data and smart contracts to provide instant, transparent insurance payouts to farmers. No intermediaries, no paperwork, just automatic protection.' },
    { q: 'How do I create an account?', a: 'Simply visit our registration page, enter your email, create a secure password, and select your role (Farmer or Admin). You can optionally add your blockchain wallet address for receiving payouts. Your account is instantly activated!' },
    { q: 'Do I need cryptocurrency to use InsuChain?', a: 'While adding a blockchain wallet is optional initially, it enables direct payouts. You can use traditional payments to purchase policies, but blockchain wallets make the process faster and more transparent.' },
    { q: 'How are policies priced?', a: 'Policy pricing depends on several factors: coverage amount, location, crop type, and historical weather patterns in your area. We analyze data to ensure fair, competitive pricing that reflects actual risk.' },
    { q: 'When do I get paid if there\'s bad weather?', a: 'Once weather conditions match your policy thresholds (e.g., excessive rainfall or low temperature), our smart contracts automatically detect it and trigger instant payouts within minutes. No waiting, no manual claims!' },
    { q: 'How does InsuChain verify weather data?', a: 'We integrate with OpenWeatherMap API which provides real-time, verified weather data from thousands of weather stations globally. All data is immutably recorded on the blockchain for complete transparency.' },
    { q: 'What if the weather data is wrong?', a: 'OpenWeatherMap data is collected from multiple weather stations and verified through independent sources. Our smart contracts follow the exact data published. If you believe data is inaccurate, our support team can review it.' },
    { q: 'Can I cancel my policy?', a: 'Yes! You can cancel any active policy. Cancellation terms depend on the specific policy conditions. Most policies allow cancellation with pro-rata refunds of premium amounts not yet used.' },
    { q: 'Is my data safe on the blockchain?', a: 'Yes! Blockchain technology uses cryptographic security to protect your data. Your transactions are immutable and cannot be altered or hacked. Only you can authorize transactions with your private keys.' },
    { q: 'How do I choose which policy is right for me?', a: 'Compare policies based on your crop type, geographic location, and budget. Each policy shows coverage details, premium, expected payout, and weather thresholds. Our experts recommend policies matching your specific needs.' },
    { q: 'Can I purchase multiple policies?', a: 'Yes! You can purchase multiple policies to cover different crops or locations. This is actually recommended for comprehensive protection across your entire farming operation.' },
    { q: 'What if I have technical issues?', a: 'Our support team is available 24/7 to help. Check our in-app FAQ, contact support via email, or browse our knowledge base. Most issues are resolved within 1 hour.' },
  ];

  return (
    <div>
      <section style={heroStyle}>
        <h1 style={{ ...pageHeading, color: '#ffffff' }}>❓ Frequently Asked Questions</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>Everything you need to know about InsuChain and crop insurance</p>
      </section>

      <section style={{ ...sectionStyle, backgroundColor: '#ffffff' }}>
        <div style={containerStyle}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1B5E20', marginBottom: '0.5rem' }}>General Questions</h2>
            <p style={{ color: '#6b7280' }}>Learn more about our platform and services</p>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {faqs.slice(0, 6).map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '2px solid',
                  borderColor: expanded === idx ? '#1B5E20' : '#e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  backgroundColor: expanded === idx ? '#f0fdf4' : '#ffffff',
                }}
              >
                <button
                  onClick={() => setExpanded(expanded === idx ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    backgroundColor: expanded === idx ? '#f0fdf4' : '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: expanded === idx ? '#1B5E20' : '#1f2937',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{
                    fontSize: '1.5rem',
                    transform: expanded === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: expanded === idx ? '#1B5E20' : '#9ca3af',
                  }}>
                    ▼
                  </span>
                </button>

                {expanded === idx && (
                  <div style={{
                    padding: '1.5rem',
                    paddingTop: '0',
                    borderTop: '2px solid #dcfce7',
                    backgroundColor: '#ffffff',
                    animation: 'slideDown 0.3s ease',
                  }}>
                    <p style={{ color: '#6b7280', lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...sectionStyle, backgroundColor: '#f9fafb' }}>
        <div style={containerStyle}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1B5E20', marginBottom: '0.5rem' }}>Policies & Payments</h2>
            <p style={{ color: '#6b7280' }}>Questions about policies and how to purchase them</p>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {faqs.slice(6, 12).map((faq, idx) => (
              <div
                key={6 + idx}
                style={{
                  border: '2px solid',
                  borderColor: expanded === (6 + idx) ? '#1B5E20' : '#e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  backgroundColor: expanded === (6 + idx) ? '#f0fdf4' : '#ffffff',
                }}
              >
                <button
                  onClick={() => setExpanded(expanded === (6 + idx) ? -1 : (6 + idx))}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    backgroundColor: expanded === (6 + idx) ? '#f0fdf4' : '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: expanded === (6 + idx) ? '#1B5E20' : '#1f2937',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{
                    fontSize: '1.5rem',
                    transform: expanded === (6 + idx) ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: expanded === (6 + idx) ? '#1B5E20' : '#9ca3af',
                  }}>
                    ▼
                  </span>
                </button>

                {expanded === (6 + idx) && (
                  <div style={{
                    padding: '1.5rem',
                    paddingTop: '0',
                    borderTop: '2px solid #dcfce7',
                    backgroundColor: '#ffffff',
                    animation: 'slideDown 0.3s ease',
                  }}>
                    <p style={{ color: '#6b7280', lineHeight: 1.8, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ ...sectionStyle, backgroundColor: '#ffffff' }}>
        <div style={containerStyle}>
          <div style={{
            background: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            color: '#ffffff',
          }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.5px' }}>Still have questions?</h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>Our support team is here to help 24/7. Get in touch with us for any assistance.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{
                padding: '0.875rem 2rem',
                backgroundColor: '#FFA500',
                color: '#1B5E20',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                📧 Contact Support
              </button>
              <button style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                📞 Call Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FAQ;
