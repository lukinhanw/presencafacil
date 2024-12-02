import { useState, useEffect, useCallback } from 'react';
import { normalizeCardNumber, isValidCardNumber } from '../utils/nfcUtils';

export const useNFCReader = ({ onCardRead, enabled = true }) => {
  const [buffer, setBuffer] = useState('');
  const [isReading, setIsReading] = useState(false);
  const [lastRead, setLastRead] = useState(null);
  const [error, setError] = useState(null);

  const resetBuffer = useCallback(() => {
    setBuffer('');
    setIsReading(false);
  }, []);

  const handleKeyPress = useCallback((event) => {
    if (!enabled) return;

    // Start reading when we receive input
    if (!isReading) {
      setIsReading(true);
    }

    // Add character to buffer
    setBuffer(prev => prev + event.key);

    // Reset after 100ms of no input
    const timeoutId = setTimeout(resetBuffer, 100);
    return () => clearTimeout(timeoutId);
  }, [enabled, isReading, resetBuffer]);

  const processCardNumber = useCallback((rawNumber) => {
    try {
      // Remove the Enter key from the end
      const cardInput = rawNumber.slice(0, -1);
      
      // Normalize the card number
      const normalizedNumber = normalizeCardNumber(cardInput);

      // Validate the card number
      if (!isValidCardNumber(normalizedNumber)) {
        throw new Error('Formato de cartão inválido');
      }

      setLastRead(normalizedNumber);
      onCardRead(normalizedNumber);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      resetBuffer();
    }
  }, [onCardRead, resetBuffer]);

  useEffect(() => {
    if (!enabled) return;

    // Process the buffer when Enter is pressed
    if (buffer.endsWith('Enter')) {
      processCardNumber(buffer);
    }
  }, [buffer, enabled, processCardNumber]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [enabled, handleKeyPress]);

  return {
    isReading,
    lastRead,
    error,
    clearError: () => setError(null)
  };
};