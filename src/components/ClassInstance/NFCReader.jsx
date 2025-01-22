import { useState } from 'react';
import NFCReader from '../General/nfcReader';
import { getEmployeeByCardNumber } from '../../services/employeeService';
import { registerAttendance } from '../../services/classService';
import { showToast } from '../General/toast';

export default function NFCAttendance({ classId, onSuccess }) {
	const [isProcessing, setIsProcessing] = useState(false);

	const handleCardRead = async (cardNumber) => {
		if (isProcessing) return;

		try {
			setIsProcessing(true);

			// Get employee data from card number
			const employee = await getEmployeeByCardNumber(cardNumber);

			// Register attendance
			await registerAttendance(classId, {
				id: employee.id,
				name: employee.name,
				registration: employee.registration,
				unit: employee.unit,
				position: employee.position,
				cardNumber: cardNumber,
				type: 'NFC'
			});

			showToast.success('Sucesso', 'Presença registrada com sucesso!');
			onSuccess();
		} catch (error) {
			const errorMessage = error.error || error.message || 'Não foi possível registrar a presença';
			showToast.error('Erro', errorMessage);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<NFCReader
			onCardRead={handleCardRead}
			enabled={!isProcessing}
		/>
	);
}