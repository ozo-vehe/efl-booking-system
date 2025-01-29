import type { ResponseValidity } from '@/interface/response';

/**
 * Validates if password and confirm password match
 * @param {string} password - The password to validate
 * @param {string} confirm_password - The confirmation password
 * @returns {ResponseValidity} Validation result with status and message
 */
export const is_password_the_same = (password: string, confirm_password: string): ResponseValidity => {
  if (password === confirm_password) {
    return { valid: true, message: '' }
  }
  return { valid: false, message: 'Password and confirm password does not match' }
}

/**
 * Validates password strength requirements
 * @param {string} password - The password to validate
 * @returns {ResponseValidity} Validation result with status and message
 */
export const is_password_valid = (password: string): ResponseValidity => {
  // Check if password length is at least 8 characters
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter' }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter' }

  // Check for numbers
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain at least one number' }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { valid: false, message: 'Password must contain at least one special character' }

  return { valid: true, message: '' }
}

/**
 * Validates email format using regex
 * @param {string} email - The email address to validate
 * @returns {ResponseValidity} Validation result with status and message
 */
export const is_email_valid = (email: string): ResponseValidity => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Invalid email address' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates phone number format using regex
 * @param {string} phone - The phone number to validate
 * @returns {ResponseValidity} Validation result with status and message
 */
export const is_phone_valid = (phone: string): ResponseValidity => {
  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: 'Invalid phone number' };
  }
  return { valid: true, message: '' };
}