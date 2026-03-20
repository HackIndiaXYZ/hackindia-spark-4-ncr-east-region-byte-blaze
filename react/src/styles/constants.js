/**
 * UI Constants and Style Definitions
 * Central location for all color schemes, spacing, and common style objects
 */

export const colors = {
  primary: '#1B5E20',
  primaryDark: '#145a1f',
  primaryLight: '#2d7a2d',
  accent: '#FFA500',
  accentDark: '#e69500',
  success: '#10b981',
  error: '#ef4444',
  errorDark: '#dc2626',
  warning: '#f59e0b',
  info: '#3b82f6',
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    muted: '#d1d5db',
  },
  bg: {
    light: '#fafafa',
    lighter: '#f9fafb',
    white: '#ffffff',
    overlay: 'rgba(0,0,0,0.5)',
  },
  border: '#e5e7eb',
  borderLight: '#f0f0f0',
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  base: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '2.5rem',
  xxl: '3rem',
  xxxl: '4rem',
  full: '5rem',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 2px 8px rgba(0, 0, 0, 0.06)',
  md: '0 4px 16px rgba(0, 0, 0, 0.08)',
  lg: '0 8px 32px rgba(0, 0, 0, 0.1)',
  xl: '0 12px 40px rgba(0, 0, 0, 0.12)',
  xxl: '0 16px 48px rgba(0, 0, 0, 0.15)',
  hover: '0 16px 32px rgba(0, 0, 0, 0.12)',
};

export const transitions = {
  fast: 'all 0.2s ease',
  base: 'all 0.3s ease',
  slow: 'all 0.4s ease',
  bezier: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

export const borderRadius = {
  sm: '6px',
  base: '10px',
  md: '12px',
  lg: '16px',
  full: '9999px',
};

// Common component styles
export const commonStyles = {
  // Hero sections
  heroGradient: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
    color: colors.bg.white,
    paddingTop: '100px',
    paddingBottom: '100px',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    textAlign: 'center',
  },

  // Card styles
  card: {
    backgroundColor: colors.bg.white,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.borderLight}`,
    boxShadow: shadows.base,
    padding: spacing.lg,
    transition: transitions.base,
  },

  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: shadows.hover,
    borderColor: colors.primary,
  },

  // Button styles
  button: (variant = 'primary') => {
    const baseButton = {
      border: 'none',
      borderRadius: borderRadius.base,
      fontSize: '0.95rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: transitions.base,
      padding: `${spacing.sm} ${spacing.md}`,
      display: 'inline-block',
      textDecoration: 'none',
    };

    if (variant === 'primary') {
      return {
        ...baseButton,
        backgroundColor: colors.primary,
        color: colors.bg.white,
      };
    }
    if (variant === 'secondary') {
      return {
        ...baseButton,
        backgroundColor: colors.accent,
        color: colors.primary,
      };
    }
    if (variant === 'outline') {
      return {
        ...baseButton,
        backgroundColor: 'transparent',
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
      };
    }
    if (variant === 'danger') {
      return {
        ...baseButton,
        backgroundColor: colors.error,
        color: colors.bg.white,
      };
    }

    return baseButton;
  },

  // Form styles
  input: {
    width: '100%',
    padding: `${spacing.sm} ${spacing.base}`,
    border: `1.5px solid ${colors.border}`,
    borderRadius: borderRadius.base,
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: transitions.base,
    boxSizing: 'border-box',
    backgroundColor: colors.bg.white,
  },

  inputFocus: {
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px rgba(27, 94, 32, 0.1)`,
    outline: 'none',
  },

  label: {
    display: 'block',
    marginBottom: spacing.sm,
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
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderColor: '#fecaca',
      };
    }
    if (type === 'success') {
      return {
        ...baseAlert,
        backgroundColor: '#dcfce7',
        color: '#166534',
        borderColor: '#bbf7d0',
      };
    }
    if (type === 'warning') {
      return {
        ...baseAlert,
        backgroundColor: '#fef3c7',
        color: '#92400e',
        borderColor: '#fde68a',
      };
    }
    if (type === 'info') {
      return {
        ...baseAlert,
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        borderColor: '#bfdbfe',
      };
    }

    return baseAlert;
  },

  // Container styles
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },

  section: (bgColor = 'white') => ({
    paddingTop: spacing.full,
    paddingBottom: spacing.full,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    backgroundColor: bgColor === 'light' ? colors.bg.light : colors.bg.white,
  }),

  grid: {
    autoFit: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: spacing.lg,
    },

    autofill: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: spacing.lg,
    },

    twoEqual: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: spacing.lg,
    },

    threeEqual: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: spacing.lg,
    },
  },

  // Heading styles
  heading: (level = 'h1') => {
    const headings = {
      h1: {
        fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
        fontWeight: 800,
        marginBottom: spacing.md,
        lineHeight: 1.1,
        letterSpacing: '-1px',
      },
      h2: {
        fontSize: 'clamp(2rem, 5vw, 2.8rem)',
        fontWeight: 800,
        marginBottom: spacing.md,
        letterSpacing: '-0.5px',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: spacing.base,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 700,
        marginBottom: spacing.sm,
      },
    };

    return headings[level] || headings.h1;
  },

  // Badge/tag styles
  badge: {
    display: 'inline-block',
    backgroundColor: colors.accent,
    color: colors.primary,
    padding: `0.4rem 0.8rem`,
    borderRadius: borderRadius.sm,
    fontSize: '0.75rem',
    fontWeight: 700,
  },

  // Loading spinner
  loadingSpinner: {
    textAlign: 'center',
    padding: spacing.full,
    fontSize: '1.2rem',
    color: colors.primary,
  },
};

// Responsive utilities
export const media = {
  mobile: '@media (max-width: 640px)',
  tablet: '@media (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)',
};

// Animation keyframes as strings
export const animations = {
  slideDown: `@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }`,

  slideUp: `@keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }`,

  fadeIn: `@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }`,

  pulse: `@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }`,
};
