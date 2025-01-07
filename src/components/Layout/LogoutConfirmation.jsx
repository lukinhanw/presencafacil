import { useAuth } from '../../contexts/AuthContext';
import Alert from '../General/alert';

export default function LogoutConfirmation({ isOpen, onClose }) {
	const { logout } = useAuth();

	const handleConfirm = () => {
		logout();
		onClose();
	};

	return (
		<Alert
			isOpen={isOpen}
			onClose={onClose}
			onConfirm={handleConfirm}
			title="Confirmar Saída"
			message="Tem certeza que deseja sair do sistema?"
			confirmText="Sair"
			cancelText="Cancelar"
			type="warning"
		/>
	);
}