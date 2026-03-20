import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerStyle = {
    backgroundColor: '#1B5E20',
    color: '#ffffff',
    paddingTop: '4rem',
    paddingBottom: '2rem',
    marginTop: '5rem',
  };

  const contentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem',
    marginBottom: '3rem',
  };

  const sectionStyle = {
    color: '#fafafa',
  };

  const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#ffffff',
    letterSpacing: '0.5px',
  };

  const sectionDescStyle = {
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '1rem',
  };

  const linkListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const linkItemStyle = {
    marginBottom: '0.75rem',
  };

  const linkStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    position: 'relative',
    fontWeight: 500,
  };

  const [hoveredLink, setHoveredLink] = React.useState(null);

  const bottomStyle = {
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    paddingTop: '2rem',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '0.95rem',
    maxWidth: '1400px',
    margin: '0 auto',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    color: '#FFA500',
  };

  return (
    <footer style={footerStyle}>
      <div style={contentStyle}>
        {/* Brand Section */}
        <div style={sectionStyle}>
          <div style={logoStyle}>
            <span style={{ fontSize: '1.8rem' }}>🌾</span>
            InsuChain
          </div>
          <p style={sectionDescStyle}>
            {t.footer.description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            {[
              { icon: '🐙', label: 'GitHub' },
              { icon: '𝕏', label: 'X' },
              { icon: '💼', label: 'LinkedIn' },
              { icon: '💬', label: 'Discord' },
            ].map((social, idx) => (
              <a
                key={idx}
                href="#"
                style={{
                  ...linkStyle,
                  fontSize: '1.2rem',
                  transition: 'transform 0.3s ease',
                  ...(hoveredLink === `social-${idx}` ? {
                    color: '#FFA500',
                    transform: 'scale(1.2)',
                  } : {}),
                }}
                onMouseEnter={() => setHoveredLink(`social-${idx}`)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>⚡ {t.footer.quickLinks}</h3>
          <ul style={linkListStyle}>
            {[
              { href: '/', label: t.navbar.home },
              { href: '/policies', label: t.navbar.policies },
              { href: '/how-it-works', label: t.navbar.howItWorks },
              { href: '/faq', label: t.navbar.faq },
            ].map((link, idx) => (
              <li key={idx} style={linkItemStyle}>
                <a
                  href={link.href}
                  style={{
                    ...linkStyle,
                    ...(hoveredLink === `quick-${idx}` ? {
                      color: '#ffffff',
                      paddingLeft: '0.5rem',
                    } : {}),
                  }}
                  onMouseEnter={() => setHoveredLink(`quick-${idx}`)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  → {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>🤝 {t.footer.support}</h3>
          <ul style={linkListStyle}>
            {[
              { href: '/contact', label: t.navbar.contact },
              { href: '/#faq', label: t.navbar.faq },
              { href: '/', label: 'Documentation' },
              { href: '/', label: t.footer.terms },
            ].map((link, idx) => (
              <li key={idx} style={linkItemStyle}>
                <a
                  href={link.href}
                  style={{
                    ...linkStyle,
                    ...(hoveredLink === `support-${idx}` ? {
                      color: '#ffffff',
                      paddingLeft: '0.5rem',
                    } : {}),
                  }}
                  onMouseEnter={() => setHoveredLink(`support-${idx}`)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  → {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>⚖️ Legal</h3>
          <ul style={linkListStyle}>
            {[
              { href: '/', label: 'Privacy Policy' },
              { href: '/', label: 'Terms of Service' },
              { href: '/', label: 'Disclaimer' },
              { href: '/', label: 'Cookie Policy' },
            ].map((link, idx) => (
              <li key={idx} style={linkItemStyle}>
                <a
                  href={link.href}
                  style={{
                    ...linkStyle,
                    ...(hoveredLink === `legal-${idx}` ? {
                      color: '#ffffff',
                      paddingLeft: '0.5rem',
                    } : {}),
                  }}
                  onMouseEnter={() => setHoveredLink(`legal-${idx}`)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  → {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={bottomStyle}>
        <p style={{ marginBottom: 0 }}>
          © {currentYear} <strong>InsuChain</strong>. {t.footer.copyright}
        </p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', opacity: 0.7 }}>
          Built with ❤️ for farmers | Powered by blockchain technology
        </p>
      </div>
    </footer>
  );
};

export default Footer;
