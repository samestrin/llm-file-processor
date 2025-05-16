/**
 * @file calculatorUtils.js
 * @description A utility module for performing basic and advanced mathematical operations
 */

/**
 * Configuration for calculation precision and defaults
 */
const config = {
  decimalPrecision: 2,
  defaultDivideByZeroResult: null,
  maxSafeValue: Number.MAX_SAFE_INTEGER
};

/**
 * Adds two or more numbers
 * @param {...number} nums - Numbers to add
 * @returns {number} Sum of all input numbers
 * @throws {Error} If any input is not a valid number
 */
function add(...nums) {
  if (nums.length === 0) {
    return 0;
  }
  
  nums.forEach(num => {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new Error('All inputs must be valid numbers');
    }
  });
  
  return nums.reduce((sum, num) => sum + num, 0);
}

/**
 * Subtracts values from the first number
 * @param {number} first - The starting value
 * @param {...number} nums - Numbers to subtract
 * @returns {number} Result after subtraction
 * @throws {Error} If any input is not a valid number
 */
function subtract(first, ...nums) {
  if (arguments.length === 0) {
    throw new Error('At least one argument is required');
  }
  
  if (typeof first !== 'number' || isNaN(first)) {
    throw new Error('All inputs must be valid numbers');
  }
  
  if (nums.length === 0) {
    return first;
  }
  
  nums.forEach(num => {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new Error('All inputs must be valid numbers');
    }
  });
  
  return nums.reduce((result, num) => result - num, first);
}

/**
 * Multiplies two or more numbers
 * @param {...number} nums - Numbers to multiply
 * @returns {number} Product of all input numbers
 * @throws {Error} If any input is not a valid number
 */
function multiply(...nums) {
  if (nums.length === 0) {
    return 1; // Empty product is 1 (multiplicative identity)
  }
  
  nums.forEach(num => {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new Error('All inputs must be valid numbers');
    }
  });
  
  return nums.reduce((product, num) => product * num, 1);
}

/**
 * Divides the first number by subsequent numbers
 * @param {number} numerator - The starting value
 * @param {...number} denominators - Numbers to divide by
 * @returns {number} Result after division
 * @throws {Error} If any input is not a valid number or divide by zero occurs
 */
function divide(numerator, ...denominators) {
  if (arguments.length === 0) {
    throw new Error('At least one argument is required');
  }
  
  if (typeof numerator !== 'number' || isNaN(numerator)) {
    throw new Error('All inputs must be valid numbers');
  }
  
  if (denominators.length === 0) {
    return numerator;
  }
  
  let result = numerator;
  
  for (const denominator of denominators) {
    if (typeof denominator !== 'number' || isNaN(denominator)) {
      throw new Error('All inputs must be valid numbers');
    }
    
    if (denominator === 0) {
      throw new Error('Division by zero is not allowed');
    }
    
    result /= denominator;
  }
  
  return result;
}

/**
 * Calculates the power of a number
 * @param {number} base - The base number
 * @param {number} exponent - The exponent
 * @returns {number} The base raised to the power of the exponent
 * @throws {Error} If inputs are not valid numbers
 */
function power(base, exponent) {
  if (typeof base !== 'number' || isNaN(base) || 
      typeof exponent !== 'number' || isNaN(exponent)) {
    throw new Error('Base and exponent must be valid numbers');
  }
  
  return Math.pow(base, exponent);
}

/**
 * Calculates the square root of a number
 * @param {number} num - The input number
 * @returns {number} The square root of the input
 * @throws {Error} If input is negative or not a valid number
 */
function squareRoot(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new Error('Input must be a valid number');
  }
  
  if (num < 0) {
    throw new Error('Cannot calculate square root of a negative number');
  }
  
  return Math.sqrt(num);
}

/**
 * Rounds a number to the specified decimal places
 * @param {number} num - The number to round
 * @param {number} [decimalPlaces=2] - Number of decimal places
 * @returns {number} Rounded number
 * @throws {Error} If inputs are not valid
 */
function round(num, decimalPlaces = config.decimalPrecision) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new Error('Input must be a valid number');
  }
  
  if (typeof decimalPlaces !== 'number' || decimalPlaces < 0 || !Number.isInteger(decimalPlaces)) {
    throw new Error('Decimal places must be a non-negative integer');
  }
  
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

/**
 * Calculates the percentage of a number
 * @param {number} value - The value to find percentage of
 * @param {number} percentage - The percentage to calculate
 * @returns {number} The calculated percentage value
 * @throws {Error} If inputs are not valid
 */
function calculatePercentage(value, percentage) {
  if (typeof value !== 'number' || isNaN(value) || 
      typeof percentage !== 'number' || isNaN(percentage)) {
    throw new Error('Inputs must be valid numbers');
  }
  
  return (value * percentage) / 100;
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  round,
  calculatePercentage,
  config
};
