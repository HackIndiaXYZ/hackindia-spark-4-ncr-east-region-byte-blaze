import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  const features = [
    { title: t.home.decentralized, emoji: '⛓️', desc: t.home.decentralizedDesc },
    { title: t.home.realtimeData, emoji: '🌍', desc: t.home.realtimeDataDesc },
    { title: t.home.instantPayouts, emoji: '💰', desc: t.home.instantPayoutsDesc },
    { title: t.home.secure, emoji: '🔒', desc: t.home.secureDesc },
    { title: t.home.easyToUse, emoji: '📱', desc: t.home.easyToUseDesc },
    { title: t.home.affordable, emoji: '💡', desc: t.home.affordableDesc },
  ];

  const steps = [
    { title: t.home.step1Register, desc: t.home.step1RegisterDesc, emoji: '📝' },
    { title: t.home.step2Choose, desc: t.home.step2ChooseDesc, emoji: '🎯' },
    { title: t.home.step3Purchase, desc: t.home.step3PurchaseDesc, emoji: '💳' },
    { title: t.home.step4GetPaid, desc: t.home.step4GetPaidDesc, emoji: '✅' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '160px 24px', 
        textAlign: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.15) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(245, 158, 11, 0.1) 0%, transparent 40%)'
      }}>
        
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div className="badge animate-fade-in-up" style={{ 
            background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-primary-dark)',
            padding: '8px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '24px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            🌍 The Future of Agricultural Insurance
          </div>
          
          <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(3.5rem, 8vw, 5rem)', animationDelay: '0.1s', lineHeight: 1.1, marginBottom: '24px' }}>
            Protect Your Harvest with <br/>
            <span className="text-gradient">Smart Contracts</span>
          </h1>
          
          <p className="animate-fade-in-up" style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto 40px auto', animationDelay: '0.2s' }}>
            {t.home.heroSubtitle} Experience decentralized, transparent, and instant payouts powered by blockchain technology.
          </p>
          
          <div className="animate-fade-in-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', animationDelay: '0.3s' }}>
            <Link to="/policies" style={{ textDecoration: 'none' }}>
              <button className="btn-premium" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                Explore Policies
              </button>
            </Link>
            <Link to="/how-it-works" style={{ textDecoration: 'none' }}>
              <button className="btn-premium" style={{ 
                background: 'rgba(255, 255, 255, 0.8)', color: 'var(--color-text-main)', 
                border: '1px solid var(--color-border)', padding: '16px 40px', fontSize: '1.1rem',
                backdropFilter: 'blur(10px)'
              }}>
                How It Works
              </button>
            </Link>
          </div>
        </div>

        {/* Decorative Floating Elements */}
        <div className="animate-float" style={{ position: 'absolute', top: '15%', left: '10%', fontSize: '4rem', opacity: 0.5, filter: 'blur(2px)' }}>🌾</div>
        <div className="animate-float" style={{ position: 'absolute', top: '25%', right: '15%', fontSize: '3rem', opacity: 0.6, animationDelay: '1s' }}>🛡️</div>
        <div className="animate-float" style={{ position: 'absolute', bottom: '20%', left: '20%', fontSize: '2.5rem', opacity: 0.4, animationDelay: '2s' }}>☀️</div>
      </section>

      {/* Features Section */}
      <section className="page-container" style={{ padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>Why Choose <span className="text-gradient">InsuChain?</span></h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '16px auto 0' }}>{t.home.whyChooseSubtitle}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {features.map((feature, idx) => (
            <div key={idx} className="glass-panel" style={{ 
              padding: '40px 32px', textAlign: 'left', transition: 'all 0.4s ease', cursor: 'default'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            >
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '20px', background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '24px',
                boxShadow: 'var(--shadow-glow)'
              }}>
                {feature.emoji}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ background: 'var(--color-surface)', padding: '100px 24px' }}>
        <div className="page-container" style={{ padding: '0' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>How It <span className="text-gradient-accent">Works</span></h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '16px auto 0' }}>Four simple steps to absolute peace of mind.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', position: 'relative' }}>
            {steps.map((step, idx) => (
              <div key={idx} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ 
                  width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '50%',
                  background: 'var(--color-surface)', border: '2px solid var(--color-primary)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '32px', position: 'relative',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)'
                }}>
                  {step.emoji}
                  <div style={{
                    position: 'absolute', top: '-10px', right: '-10px', width: '30px', height: '30px',
                    background: 'var(--gradient-accent)', color: 'white', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px'
                  }}>
                    {idx + 1}
                  </div>
                </div>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>{step.title}</h4>
                <p style={{ color: 'var(--color-text-muted)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 24px', background: 'var(--gradient-dark)', color: 'white', textAlign: 'center' }}>
        <div className="page-container" style={{ maxWidth: '800px', padding: '0' }}>
          <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '24px' }}>Ready to Protect Your Harvest?</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '40px' }}>Join thousands of farmers securing their future with smart contracts.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button className="btn-premium" style={{ background: 'var(--gradient-accent)', padding: '16px 40px', fontSize: '1.1rem' }}>
                Start Today
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
