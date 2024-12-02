import { useEffect } from 'react';
import { useNFCReader } from '../../hooks/useNFCReader';
import { formatCardNumber } from '../../utils/nfcUtils';
import { showToast } from '../Toast';

export default function NFCReader({ onCardRead, enabled = true }) {
  const { isReading, lastRead, error, clearError } = useNFCReader({
    onCardRead,
    enabled
  });

  useEffect(() => {
    if (error) {
      showToast.error('Erro na Leitura', error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="text-center space-y-6">
      <div className={`glass-card p-6 transition-all duration-300 ${
        isReading ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''
      }`}>
        <div className="flex items-center justify-center mb-4">
          <div className={`h-3 w-3 rounded-full ${
            isReading 
              ? 'bg-primary-500 dark:bg-primary-400 animate-pulse'
              : 'bg-gray-300 dark:bg-gray-600'
          }`} />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {isReading ? 'Lendo cartão...' : 'Aguardando leitura'}
          </span>
        </div>

        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Leitor NFC Ativo
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Aproxime o cartão do leitor para registrar presença
        </p>
      </div>

      {lastRead && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Último cartão lido: {formatCardNumber(lastRead)}
        </div>
      )}
    </div>
  );
}