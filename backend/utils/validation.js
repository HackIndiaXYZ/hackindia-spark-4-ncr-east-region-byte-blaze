/**
 * Input validation utilities for InsuChain
 */

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * - Minimum 6 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function isValidPassword(password) {
  if (!password || password.length < 6) {
    return false;
  }
  return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}

/**
 * Validate Ethereum wallet address format
 */
export function isValidWalletAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate positive number
 */
export function isValidPositiveNumber(num) {
  const parsed = parseFloat(num);
  return !isNaN(parsed) && parsed > 0;
}

/**
 * Sanitize string input (trim whitespace)
 */
export function sanitizeString(str) {
  return typeof str === 'string' ? str.trim() : '';
}

/**
 * Validate policy creation input
 */
export function validatePolicyInput(policyData) {
  const errors = [];

  if (!policyData.name || typeof policyData.name !== 'string' || policyData.name.trim().length === 0) {
    errors.push('Policy name is required');
  }

  if (!isValidPositiveNumber(policyData.premium)) {
    errors.push('Premium must be a positive number');
  }

  if (!isValidPositiveNumber(policyData.payout)) {
    errors.push('Payout must be a positive number');
  }

  if (!isValidPositiveNumber(policyData.rainfall_threshold)) {
    errors.push('Rainfall threshold must be a positive number');
  }

  if (isNaN(policyData.temperature_min) || isNaN(policyData.temperature_max)) {
    errors.push('Temperature values must be valid numbers');
  }

  if (policyData.temperature_min >= policyData.temperature_max) {
    errors.push('Minimum temperature must be less than maximum temperature');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate user registration input
 */
export function validateRegistrationInput(data) {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!isValidPassword(data.password)) {
    errors.push('Password must be at least 6 characters with uppercase, lowercase, and numbers');
  }

  if (data.walletAddress && !isValidWalletAddress(data.walletAddress)) {
    errors.push('Invalid wallet address format');
  }

  if (data.role && !['farmer', 'admin'].includes(data.role)) {
    errors.push('Role must be farmer or admin');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate login input
 */
export function validateLoginInput(data) {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.password || data.password.length === 0) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
