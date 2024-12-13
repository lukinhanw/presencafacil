import Alert from '../General/alert';

export default function LogoutConfirmation({ isOpen, onClose, onConfirm }) {
	return (
		<Alert
			isOpen={isOpen}
			onClose={onClose}
			onConfirm={onConfirm}
			title="Confirmar Saída"
			message="Tem certeza que deseja sair do sistema?"
			confirmText="Sair"
			cancelText="Cancelar"
			type="warning"
		/>
	);
}