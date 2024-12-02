import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { generateInviteLink } from '../../../services/classService';
import { showToast } from '../../../components/Toast';

export default function InviteLink({ classId }) {
	const [inviteLink, setInviteLink] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleGenerateLink = async () => {
		try {
			setIsLoading(true);
			const link = await generateInviteLink(classId);
			setInviteLink(link);
		} catch (error) {
			showToast.error('Erro', 'Não foi possível gerar o link de convite');
		} finally {
			setIsLoading(false);
		}
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(inviteLink);
		showToast.success('Sucesso', 'Link copiado para a área de transferência!');
	};

	return (
		<div className="space-y-6">
			{!inviteLink ? (
				<div className="text-center">
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						Gere um link de convite para que os colaboradores possam registrar presença de forma autônoma.
					</p>
					<button
						onClick={handleGenerateLink}
						disabled={isLoading}
						className="btn-gradient"
					>
						{isLoading ? 'Gerando...' : 'Gerar Link'}
					</button>
				</div>
			) : (
				<div className="space-y-6">
					<div className="flex justify-center">
						<QRCodeSVG
							value={inviteLink}
							size={200}
							level="H"
							includeMargin
							className="p-2 bg-white rounded-lg"
						/>
					</div>

					<div className="space-y-2">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Link de convite:
						</p>
						<div className="flex gap-2">
							<input
								type="text"
								value={inviteLink}
								readOnly
								className="input-field flex-1"
							/>
							<button
								onClick={handleCopyLink}
								className="btn-gradient"
							>
								Copiar
							</button>
						</div>
					</div>

					<p className="text-sm text-gray-500 dark:text-gray-400">
						Compartilhe este link ou QR Code com os colaboradores para que eles possam registrar presença.
					</p>
				</div>
			)}
		</div>
	);
}