/**
 * Premium UI Constants and Style Definitions
 * Integrates with index.css for an 'advanced level' aesthetic
 */

export const colors = {
  primary: '#10b981',
  primaryDark: '#047857',
  primaryLight: '#34d399',
  accent: '#f59e0b',
  accentDark: '#ea580c',
  success: '#10b981',
  error: '#ef4444',
  errorDark: '#dc2626',
  warning: '#f59e0b',
  info: '#3b82f6',
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    muted: '#cbd5e1',
  },
  bg: {
    light: '#f8fafc',
    lighter: '#f1f5f9',
    white: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.6)',
  },
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  base: '1rem',
  md: '1.5rem',
  lg: '2.5rem',
  xl: '3.5rem',
  xxl: '5rem',
  xxxl: '7rem',
  full: '100%',
};

export const shadows = {
  sm: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  base: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
  md: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
  lg: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
  xl: '0 35px 60px -15px rgba(0, 0, 0, 0.15)',
  hover: '0 20px 30px -10px rgba(16, 185, 129, 0.3)',
};

export const transitions = {
  fast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  base: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  bezier: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
};

export const borderRadius = {
  sm: '8px',
  base: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  full: '9999px',
};

// Premium Component Styles (Glassmorphism & Gradients)
export const commonStyles = {
  // Hero sections
  heroGradient: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', // Subtle gradient background
    paddingTop: '120px',
    paddingBottom: '120px',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  // Card styles (Glassmorphism)
  card: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: borderRadius.lg,
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: shadows.md,
    padding: spacing.lg,
    transition: transitions.bezier,
  },

  cardHover: {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: shadows.hover,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    background: 'rgba(255, 255, 255, 0.9)',
  },

  // Button styles
  button: (variant = 'primary') => {
    const baseButton = {
      border: 'none',
      borderRadius: borderRadius.full,
      fontFamily: '"Outfit", sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: transitions.base,
      padding: '14px 32px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      textDecoration: 'none',
    };

    if (variant === 'primary') {
      return {
        ...baseButton,
        background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        color: '#ffffff',
        boxShadow: shadows.sm,
      };
    }
    if (variant === 'secondary') {
      return {
        ...baseButton,
        background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
        color: '#ffffff',
        boxShadow: shadows.sm,
      };
    }
    if (variant === 'outline') {
      return {
        ...baseButton,
        background: 'transparent',
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
      };
    }
    if (variant === 'danger') {
      return {
        ...baseButton,
        background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
        color: '#ffffff',
      };
    }

    return baseButton;
  },

  // Form styles
  input: {
    width: '100%',
    padding: '16px 24px',
    border: `1px solid ${colors.border}`,
    borderRadius: borderRadius.base,
    fontSize: '1rem',
    fontFamily: '"Inter", sans-serif',
    transition: transitions.base,
    boxSizing: 'border-box',
    background: '#f8fafc',
    color: colors.text.primary,
  },

  inputFocus: {
    borderColor: colors.primary,
    background: '#ffffff',
    boxShadow: `0 0 0 4px rgba(16, 185, 129, 0.1)`,
    outline: 'none',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    color: colors.text.primary,
    fontSize: '0.95rem',
  },

  // Alert styles
  alert: (type = 'error') => {
    const baseAlert = {
      padding: spacing.base,
      borderRadius: borderRadius.base,
      marginBottom: spacing.md,
      fontSize: '0.95rem',
      fontWeight: 500,
      border: '1px solid',
    };

    if (type === 'error') {
      return {
        ...baseAlert,
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        borderColor: '#fecaca',
      };
    }
    if (type === 'success') {
      return {
        ...baseAlert,
        backgroundColor: '#ecfdf5',
        color: '#065f46',
        borderColor: '#a7f3d0',
      };
    }
    return baseAlert;
  },

  // Container styles
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },

  section: (bgColor = 'white') => ({
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    backgroundColor: bgColor === 'light' ? colors.bg.light : colors.bg.white,
    position: 'relative',
  }),

  grid: {
    autoFit: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: spacing.lg,
    },
    autofill: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: spacing.lg,
    },
  },

  // Heading styles
  heading: (level = 'h1') => {
    const headings = {
      h1: {
        fontFamily: '"Outfit", sans-serif',
        fontSize: 'clamp(3rem, 8vw, 4.5rem)',
        fontWeight: 800,
        marginBottom: spacing.md,
        lineHeight: 1.05,
        letterSpacing: '-2px',
        color: colors.text.primary,
      },
      h2: {
        fontFamily: '"Outfit", sans-serif',
        fontSize: 'clamp(2.5rem, 5vw, 3.2rem)',
        fontWeight: 800,
        marginBottom: spacing.md,
        letterSpacing: '-1px',
        color: colors.text.primary,
      },
      h3: {
        fontFamily: '"Outfit", sans-serif',
        fontSize: '1.8rem',
        fontWeight: 700,
        marginBottom: spacing.base,
        letterSpacing: '-0.5px',
      },
      h4: {
        fontFamily: '"Outfit", sans-serif',
        fontSize: '1.4rem',
        fontWeight: 700,
        marginBottom: spacing.sm,
      },
    };

    return headings[level] || headings.h1;
  },

  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    color: '#ffffff',
    padding: `0.5rem 1rem`,
    borderRadius: borderRadius.full,
    fontSize: '0.8rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: shadows.sm,
  },

  loadingSpinner: {
    textAlign: 'center',
    padding: spacing.xxl,
    fontSize: '1.2rem',
    color: colors.primary,
    fontWeight: 600,
  },
};

// Responsive utilities
export const media = {
  mobile: '@media (max-width: 640px)',
  tablet: '@media (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)',
};
