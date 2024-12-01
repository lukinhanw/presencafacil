import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
	InformationCircleIcon,
	UserPlusIcon,
	QrCodeIcon,
	CreditCardIcon
} from '@heroicons/react/24/outline';
import { getClassById, finishClass } from '../../services/classService';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';
import ClassDetails from './components/ClassDetails';
import AttendanceList from './components/AttendanceList';
import ManualAttendance from './components/ManualAttendance';
import InviteLink from './components/InviteLink';
import NFCReader from './components/NFCReader';
import { showToast } from '../../components/Toast';

export default function ClassInstance() {
	const { id } = useParams();
	const [classData, setClassData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isManualModalOpen, setIsManualModalOpen] = useState(false);
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
	const [isNFCModalOpen, setIsNFCModalOpen] = useState(false);
	const [finishAlert, setFinishAlert] = useState(false);

	useEffect(() => {
		fetchClassData();
	}, [id]);

	const fetchClassData = async () => {
		try {
			setIsLoading(true);
			const data = await getClassById(id);
			setClassData(data);
		} catch (error) {
			showToast.error('Erro', 'Não foi possível carregar os dados da aula');
		} finally {
			setIsLoading(false);
		}
	};

	const handleFinishClass = async () => {
		try {
			await finishClass(id);
			showToast.success('Sucesso', 'Aula finalizada com sucesso!');
			fetchClassData();
		} catch (error) {
			showToast.error('Erro', 'Não foi possível finalizar a aula');
		}
		setFinishAlert(false);
	};

	if (isLoading) {
		return <div>Carregando...</div>;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
						{classData.training.name}
					</h1>
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<span>Instrutor: {classData.instructor.name}</span>
						<span>•</span>
						<span>Início: {new Date(classData.date_start).toLocaleString()}</span>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => setIsDetailsModalOpen(true)}
						className="btn-gradient-outline"
					>
						<span className="flex items-center">
							<InformationCircleIcon className="h-5 w-5 mr-2" />
							Detalhes
						</span>
					</button>
					{!classData.date_end && (
						<button
							onClick={() => setFinishAlert(true)}
							className="btn-gradient"
						>
							Finalizar Aula
						</button>
					)}
				</div>
			</div>

			{/* Attendance Methods */}
			{!classData.date_end && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<button
						onClick={() => setIsManualModalOpen(true)}
						className="glass-card p-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
					>
						<UserPlusIcon className="h-8 w-8 mb-2 text-primary-600 dark:text-primary-400" />
						<h3 className="font-medium">Presença Manual</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Registrar presença manualmente
						</p>
					</button>

					<button
						onClick={() => setIsInviteModalOpen(true)}
						className="glass-card p-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
					>
						<QrCodeIcon className="h-8 w-8 mb-2 text-primary-600 dark:text-primary-400" />
						<h3 className="font-medium">Link de Convite</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Gerar link para auto registro
						</p>
					</button>

					<button
						onClick={() => setIsNFCModalOpen(true)}
						className="glass-card p-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
					>
						<CreditCardIcon className="h-8 w-8 mb-2 text-primary-600 dark:text-primary-400" />
						<h3 className="font-medium">Cartão NFC</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Registrar via cartão NFC
						</p>
					</button>
				</div>
			)}

			{/* Attendance List */}
			<AttendanceList
				classId={id}
				attendees={classData.attendees}
				onUpdate={fetchClassData}
				isFinished={!!classData.date_end}
			/>

			{/* Modals */}
			<Modal
				isOpen={isDetailsModalOpen}
				onClose={() => setIsDetailsModalOpen(false)}
				title="Detalhes da Aula"
				size="lg"
			>
				<ClassDetails classData={classData} />
			</Modal>

			<Modal
				isOpen={isManualModalOpen}
				onClose={() => setIsManualModalOpen(false)}
				title="Registrar Presença Manual"
				size="lg"
			>
				<ManualAttendance
					classId={id}
					onSuccess={() => {
						setIsManualModalOpen(false);
						fetchClassData();
					}}
				/>
			</Modal>

			<Modal
				isOpen={isInviteModalOpen}
				onClose={() => setIsInviteModalOpen(false)}
				title="Link de Convite"
				size="md"
			>
				<InviteLink classId={id} />
			</Modal>

			<Modal
				isOpen={isNFCModalOpen}
				onClose={() => setIsNFCModalOpen(false)}
				title="Leitor NFC"
				size="md"
			>
				<NFCReader
					classId={id}
					onSuccess={() => {
						fetchClassData();
					}}
				/>
			</Modal>

			<Alert
				isOpen={finishAlert}
				onClose={() => setFinishAlert(false)}
				onConfirm={handleFinishClass}
				title="Finalizar Aula"
				message="Tem certeza que deseja finalizar esta aula? Após finalizada, não será possível registrar mais presenças."
				type="warning"
			/>
		</div>
	);
}