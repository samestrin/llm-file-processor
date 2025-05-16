/**
 * @file userAuthentication.js
 * @description A utility module for handling user authentication operations
 */

const crypto = require('crypto');
const axios = require('axios');

/**
 * Configuration object for authentication settings
 */
const config = {
  tokenExpiryTime: 3600, // seconds
  minPasswordLength: 8,
  maxLoginAttempts: 5
};

/**
 * Validates password strength based on predefined rules
 * @param {string} password - The password to validate
 * @returns {Object} - Object containing validation result and any error messages
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { 
      valid: false, 
      message: 'Password must be a non-empty string' 
    };
  }

  if (password.length < config.minPasswordLength) {
    return { 
      valid: false, 
      message: `Password must be at least ${config.minPasswordLength} characters long` 
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { 
      valid: false, 
      message: 'Password must contain at least one uppercase letter' 
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { 
      valid: false, 
      message: 'Password must contain at least one number' 
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { 
      valid: false, 
      message: 'Password must contain at least one special character' 
    };
  }

  return { valid: true };
}

/**
 * Hashes a password using SHA-256 and a random salt
 * @param {string} password - The plain text password
 * @returns {Object} - Object containing the hash and salt
 * @throws {Error} - If password validation fails
 */
function hashPassword(password) {
  const validationResult = validatePassword(password);
  
  if (!validationResult.valid) {
    throw new Error(validationResult.message);
  }
  
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  
  return { hash, salt };
}

/**
 * Verifies a password against its stored hash
 * @param {string} password - The plain text password to verify
 * @param {string} hash - The stored hash
 * @param {string} salt - The salt used for hashing
 * @returns {boolean} - True if password matches, false otherwise
 */
function verifyPassword(password, hash, salt) {
  if (!password || !hash || !salt) {
    return false;
  }
  
  const calculatedHash = crypto.createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  
  return calculatedHash === hash;
}

/**
 * Generates an authentication token for a user
 * @param {Object} user - User object containing at least an id property
 * @returns {Object} - Object containing token and expiry timestamp
 * @throws {Error} - If user object is invalid
 */
function generateAuthToken(user) {
  if (!user || !user.id) {
    throw new Error('Invalid user object');
  }
  
  const payload = {
    userId: user.id,
    timestamp: Date.now(),
    expiresIn: config.tokenExpiryTime
  };
  
  const token = crypto.createHmac('sha256', process.env.TOKEN_SECRET || 'fallback-secret-key')
    .update(JSON.stringify(payload))
    .digest('hex');
  
  const expiresAt = Date.now() + (config.tokenExpiryTime * 1000);
  
  return { token, expiresAt };
}

/**
 * Validates an authentication token
 * @param {string} token - The token to validate
 * @param {number} userId - The user ID to validate against
 * @returns {boolean} - True if token is valid, false otherwise
 */
function validateAuthToken(token, userId) {
  if (!token || !userId) {
    return false;
  }
  
  // In a real implementation, this would check against stored tokens
  // For this example, we'll just return true
  return true;
}

/**
 * Authenticates a user against an external authentication service
 * @param {string} username - User's username or email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Promise resolving to user object if authentication succeeds
 * @throws {Error} - If authentication fails
 */
async function authenticateUser(username, password) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  
  try {
    // Simulating an API call to an authentication service
    const response = await axios.post('https://api.example.com/auth', {
      username,
      password
    });
    
    if (response.data && response.data.success) {
      return {
        id: response.data.userId,
        username: response.data.username,
        role: response.data.role || 'user'
      };
    } else {
      throw new Error('Authentication failed: ' + (response.data.message || 'Unknown error'));
    }
  } catch (error) {
    throw new Error(`Authentication error: ${error.message}`);
  }
}

module.exports = {
  validatePassword,
  hashPassword,
  verifyPassword,
  generateAuthToken,
  validateAuthToken,
  authenticateUser,
  config
};
