import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  const heroStyle = {
    background: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)',
    color: '#ffffff',
    paddingTop: '120px',
    paddingBottom: '120px',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const heroContentStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  };

  const heroTitleStyle = {
    fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
    fontWeight: 800,
    marginBottom: '1.5rem',
    lineHeight: 1.1,
    letterSpacing: '-1px',
  };

  const heroSubtitleStyle = {
    fontSize: 'clamp(1.1rem, 4vw, 1.4rem)',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '2.5rem',
    fontWeight: 400,
    lineHeight: 1.6,
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const primaryBtnStyle = {
    padding: '1rem 2.5rem',
    fontSize: '1.05rem',
    fontWeight: 700,
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#FFA500',
    color: '#1B5E20',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 8px 20px rgba(255, 165, 0, 0.3)',
  };

  const secondaryBtnStyle = {
    padding: '1rem 2.5rem',
    fontSize: '1.05rem',
    fontWeight: 700,
    borderRadius: '12px',
    border: '2px solid #ffffff',
    backgroundColor: 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const sectionStyle = {
    paddingTop: '5rem',
    paddingBottom: '5rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    backgroundColor: '#fafafa',
  };

  const sectionAltStyle = {
    ...sectionStyle,
    backgroundColor: '#ffffff',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const sectionHeaderStyle = {
    textAlign: 'center',
    marginBottom: '4rem',
  };

  const sectionTitleStyle = {
    fontSize: 'clamp(2rem, 5vw, 2.8rem)',
    fontWeight: 800,
    color: '#1B5E20',
    marginBottom: '1rem',
    letterSpacing: '-0.5px',
  };

  const sectionSubtitleStyle = {
    fontSize: '1.2rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto',
    fontWeight: 400,
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  };

  const cardStyle = {
    padding: '2.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f0f0f0',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  };

  const cardHoverStyle = {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(0, 0, 0, 0.12)',
    borderColor: '#1B5E20',
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1B5E20',
    marginBottom: '1rem',
  };

  const cardDescStyle = {
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: 1.7,
    fontWeight: 400,
  };

  const ctaSectionStyle = {
    ...sectionStyle,
    backgroundColor: 'linear-gradient(135deg, #1B5E20 0%, #2d7a2d 100%)',
    textAlign: 'center',
    color: '#ffffff',
  };

  const ctaTitleStyle = {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    fontWeight: 800,
    marginBottom: '1.5rem',
    letterSpacing: '-0.5px',
  };

  const ctaSubtitleStyle = {
    fontSize: '1.2rem',
    marginBottom: '2.5rem',
    fontWeight: 400,
    opacity: 0.95,
  };

  const features = [
    {
      title: t.home.decentralized,
      emoji: '⛓️',
      desc: t.home.decentralizedDesc,
    },
    {
      title: t.home.realtimeData,
      emoji: '🌍',
      desc: t.home.realtimeDataDesc,
    },
    {
      title: t.home.instantPayouts,
      emoji: '💰',
      desc: t.home.instantPayoutsDesc,
    },
    {
      title: t.home.secure,
      emoji: '🔒',
      desc: t.home.secureDesc,
    },
    {
      title: t.home.easyToUse,
      emoji: '📱',
      desc: t.home.easyToUseDesc,
    },
    {
      title: t.home.affordable,
      emoji: '💡',
      desc: t.home.affordableDesc,
    },
  ];

  const steps = [
    {
      title: t.home.step1Register,
      desc: t.home.step1RegisterDesc,
      emoji: '📝',
    },
    {
      title: t.home.step2Choose,
      desc: t.home.step2ChooseDesc,
      emoji: '🎯',
    },
    {
      title: t.home.step3Purchase,
      desc: t.home.step3PurchaseDesc,
      emoji: '💳',
    },
    {
      title: t.home.step4GetPaid,
      desc: t.home.step4GetPaidDesc,
      emoji: '✅',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>{t.home.heroTitle}</h1>
          <p style={heroSubtitleStyle}>{t.home.heroSubtitle}</p>
          <div style={buttonContainerStyle}>
            <Link to="/policies" style={{ textDecoration: 'none' }}>
              <button
                style={primaryBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(255, 165, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 165, 0, 0.3)';
                }}
              >
                {t.home.exploreBtn}
              </button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button
                style={secondaryBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {t.home.getStartedBtn}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={sectionStyle}>
        <div style={containerStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>{t.home.whyChoose}</h2>
            <p style={sectionSubtitleStyle}>{t.home.whyChooseSubtitle}</p>
          </div>

          <div style={gridStyle}>
            {features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  ...cardStyle,
                  ...(hoveredCard === idx ? cardHoverStyle : {}),
                }}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ fontSize: '2.8rem', marginBottom: '1.5rem' }}>
                  {feature.emoji}
                </div>
                <h3 style={cardTitleStyle}>{feature.title}</h3>
                <p style={cardDescStyle}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={sectionAltStyle}>
        <div style={containerStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>{t.home.howItWorks}</h2>
            <p style={sectionSubtitleStyle}>{t.home.howItWorksSubtitle}</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2.5rem',
            }}
          >
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  ...cardStyle,
                  backgroundColor: '#fafafa',
                  ...(hoveredCard === `step-${idx}` ? cardHoverStyle : {}),
                  position: 'relative',
                }}
                onMouseEnter={() => setHoveredCard(`step-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '-15px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#1B5E20',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
                  {step.emoji}
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1B5E20', marginBottom: '0.75rem' }}>
                  {step.title}
                </h4>
                <p style={cardDescStyle}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSectionStyle}>
        <div style={containerStyle}>
          <h2 style={ctaTitleStyle}>{t.home.readyToProtect}</h2>
          <p style={ctaSubtitleStyle}>{t.home.joinFarmers}</p>

          <div style={buttonContainerStyle}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  ...primaryBtnStyle,
                  backgroundColor: '#FFA500',
                  color: '#1B5E20',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(255, 165, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 165, 0, 0.3)';
                }}
              >
                {t.home.startToday}
              </button>
            </Link>
            <Link to="/policies" style={{ textDecoration: 'none' }}>
              <button
                style={secondaryBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {t.home.viewPolicies}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
