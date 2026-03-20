import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)',
    color: '#ffffff',
    paddingTop: '100px',
    paddingBottom: '100px',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    textAlign: 'center',
  };

  return (
    <div>
      <section style={heroStyle}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.2rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.5px' }}>📧 {t.navbar.contact}</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>We'd love to hear from you. Get in touch with our team!</p>
      </section>

      <section style={{ backgroundColor: '#fafafa', paddingTop: '3rem', paddingBottom: '5rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Contact Form */}
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', border: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#1B5E20', fontWeight: 700, marginBottom: '2rem' }}>✉️ Send us a Message</h2>
            {submitted && (
              <div style={{ padding: '1rem', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '10px', color: '#166534', marginBottom: '1.5rem', fontWeight: 500 }}>
                ✅ Thank you! Your message has been sent. We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required style={{ width: '100%', padding: '0.875rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', marginBottom: '1.5rem', boxSizing: 'border-box', transition: 'all 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#1B5E20'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 94, 32, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required style={{ width: '100%', padding: '0.875rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', marginBottom: '1.5rem', boxSizing: 'border-box', transition: 'all 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#1B5E20'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 94, 32, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }} />
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="What is this about?" required style={{ width: '100%', padding: '0.875rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', marginBottom: '1.5rem', boxSizing: 'border-box', transition: 'all 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#1B5E20'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 94, 32, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }} />
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your message..." rows="5" required style={{ width: '100%', padding: '0.875rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '1rem', marginBottom: '1.5rem', boxSizing: 'border-box', transition: 'all 0.3s ease', fontFamily: 'inherit', resize: 'vertical' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#1B5E20'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27, 94, 32, 0.1)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }} />
              <button type="submit" style={{ width: '100%', padding: '0.875rem 1.5rem', backgroundColor: '#1B5E20', color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#145a1f'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(27, 94, 32, 0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1B5E20'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>🚀 Send Message</button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#1B5E20', fontWeight: 700, marginBottom: '2rem' }}>🤝 Get in Touch</h2>
            {[{ title: '📍 Office Address', content: 'InsuChain Headquarters\n123 Blockchain Avenue\nTech City, TC 12345\nIndia' }, { title: '📞 Phone', content: '+91 98765 43210' }, { title: '📧 Email', content: 'support@insuchainmail.com\ninfo@insuchainmail.com' }, { title: '🕐 Business Hours', content: 'Monday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 4:00 PM IST\nSunday: Closed\n\n24/7 Support via email' }].map((item, idx) => <div key={idx} style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)', marginBottom: '1.5rem', border: '1px solid #f0f0f0', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)'; }}><div style={{ fontSize: '1rem', fontWeight: 700, color: '#1B5E20', marginBottom: '0.75rem' }}>{item.title}</div><div style={{ color: '#6b7280', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{item.content}</div></div>)}
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)', color: '#ffffff', paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Have Questions?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>Check out our FAQ page for quick answers to common questions</p>
          <a href="/faq" style={{ display: 'inline-block', padding: '0.875rem 2.5rem', backgroundColor: '#FFA500', color: '#1B5E20', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(255, 165, 0, 0.4)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>Visit FAQ →</a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
