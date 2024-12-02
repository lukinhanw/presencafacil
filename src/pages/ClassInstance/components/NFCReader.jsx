import { useState } from 'react';
import NFCReader from '../../../components/NFCReader';
import { getEmployeeByCardNumber } from '../../../services/employeeService';
import { registerAttendance } from '../../../services/classService';
import { showToast } from '../../../components/Toast';

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
        cardNumber: cardNumber,
        type: 'NFC'
      });

      showToast.success('Sucesso', 'Presença registrada com sucesso!');
      onSuccess();
    } catch (error) {
      showToast.error('Erro', error.message || 'Não foi possível registrar a presença');
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