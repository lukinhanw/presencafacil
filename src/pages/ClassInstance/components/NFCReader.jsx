import { useState, useEffect } from 'react';
import { registerAttendanceByCard } from '../../../services/classService';
import { showToast } from '../../../components/Toast';

export default function NFCReader({ classId, onSuccess }) {
  const [lastCardRead, setLastCardRead] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let buffer = '';
    let timeout;

    const handleKeyPress = async (event) => {
      if (isProcessing) return;

      // Clear buffer after 100ms of no input
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        buffer = '';
      }, 100);

      // Add character to buffer
      buffer += event.key;

      // Check if it's a complete card number (ends with Enter)
      if (event.key === 'Enter' && buffer.length > 1) {
        const cardNumber = buffer.slice(0, -1); // Remove Enter
        setLastCardRead(cardNumber);
        buffer = '';

        try {
          setIsProcessing(true);
          await registerAttendanceByCard(classId, cardNumber);
          showToast.success('Sucesso', 'Presença registrada com sucesso!');
          onSuccess();
        } catch (error) {
          showToast.error('Erro', error.message || 'Não foi possível registrar a presença');
        } finally {
          setIsProcessing(false);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeout);
    };
  }, [classId, onSuccess, isProcessing]);

  return (
    <div className="text-center space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Leitor NFC Ativo
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Aproxime o cartão do leitor para registrar presença
        </p>
      </div>

      {lastCardRead && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Último cartão lido: {lastCardRead}
        </div>
      )}
    </div>
  );
}