import { useState, useEffect, useCallback } from 'react';
import { normalizeCardNumber, isValidCardNumber } from '../utils/nfcUtils';

export const useNFCReader = ({ onCardRead, enabled = true }) => {
	const [buffer, setBuffer] = useState('');
	const [isReading, setIsReading] = useState(false);
	const [lastRead, setLastRead] = useState(null);
	const [error, setError] = useState(null);
	const [timeoutId, setTimeoutId] = useState(null);
	const [shouldProcess, setShouldProcess] = useState(false);

	const resetBuffer = useCallback(() => {
		setBuffer('');
		setIsReading(false);
		setShouldProcess(false);
		if (timeoutId) {
			clearTimeout(timeoutId);
			setTimeoutId(null);
		}
	}, [timeoutId]);

	const processCardNumber = useCallback((cardNumber) => {
		try {
			const normalizedNumber = normalizeCardNumber(cardNumber);
			if (isValidCardNumber(normalizedNumber)) {
				setLastRead(normalizedNumber);
				onCardRead(normalizedNumber);
				setError(null);
			} else {
				setError('Formato de cartão inválido');
			}
		} catch (error) {
			setError(error.message);
		}
	}, [onCardRead]);

	// Efeito para processar o cartão quando o buffer estiver pronto
	useEffect(() => {
		if (shouldProcess && buffer.length === 14) {
			processCardNumber(buffer);
			const timeoutId = setTimeout(resetBuffer, 100);
			return () => clearTimeout(timeoutId);
		}
	}, [buffer, shouldProcess, processCardNumber, resetBuffer]);

	const handleKeyPress = useCallback((event) => {
		if (!enabled) return;

		// Inicia a leitura apenas se não estiver lendo
		if (!isReading) {
			setIsReading(true);
		}

		// Adiciona o caractere ao buffer
		setBuffer(prev => {
			const newBuffer = prev + event.key;
			// Se atingiu 14 caracteres, marca para processamento
			if (newBuffer.length === 14) {
				setShouldProcess(true);
			}
			return newBuffer;
		});

		// Reseta o timeout anterior
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		// Define um novo timeout para resetar o buffer após 2 segundos sem entrada
		const newTimeoutId = setTimeout(resetBuffer, 2000);
		setTimeoutId(newTimeoutId);
	}, [enabled, isReading, resetBuffer, timeoutId]);

	useEffect(() => {
		if (!enabled) return;

		window.addEventListener('keypress', handleKeyPress);
		return () => {
			window.removeEventListener('keypress', handleKeyPress);
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [enabled, handleKeyPress, timeoutId]);

	return {
		isReading,
		lastRead,
		error,
		clearError: () => setError(null)
	};
};