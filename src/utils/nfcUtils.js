/**
 * Normalizes the NFC card number by removing any special characters
 * and converting to a standard format
 * @param {string} cardNumber - Raw card number from NFC reader
 * @returns {string} Normalized card number
 */
export const normalizeCardNumber = (cardNumber) => {
  // Remove any non-alphanumeric characters
  return cardNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

/**
 * Validates if the card number follows the expected format
 * @param {string} cardNumber - Normalized card number
 * @returns {boolean} Whether the card number is valid
 */
export const isValidCardNumber = (cardNumber) => {
  // Card number should be exactly 14 characters long and alphanumeric
  const cardNumberRegex = /^[a-z0-9]{14}$/;
  return cardNumberRegex.test(cardNumber);
};

/**
 * Formats a card number for display
 * @param {string} cardNumber - Normalized card number
 * @returns {string} Formatted card number for display
 */
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  // Format as XXXXX-XX-XXXXXX
  return cardNumber.replace(/^(.{5})(.{2})(.{6})$/, '$1-$2-$3');
};