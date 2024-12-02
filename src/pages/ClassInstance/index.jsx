import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
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
import ClassHeader from './components/ClassHeader';
import AttendanceStats from './components/AttendanceStats';
import { showToast } from '../../components/Toast';
import { isClassFinished } from '../../utils/dateUtils';

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
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	const finished = isClassFinished(classData);

	return (
		<div className="space-y-8">
			<ClassHeader
				classData={classData}
				onOpenDetails={() => setIsDetailsModalOpen(true)}
				onFinishClass={() => setFinishAlert(true)}
				isFinished={finished}
			/>

			<AttendanceStats attendees={classData.attendees} />

			{!finished && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<button
						onClick={() => setIsManualModalOpen(true)}
						className="glass-card p-6 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-xl shadow-md hover:shadow-lg flex flex-col items-center"
					>
						<div className="flex items-center gap-3 mb-3">
							<UserPlusIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
							<h3 className="font-medium">Presença Manual</h3>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
							Registrar presença manualmente
						</p>
					</button>

					<button
						onClick={() => setIsInviteModalOpen(true)}
						className="glass-card p-6 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-xl shadow-md hover:shadow-lg flex flex-col items-center"
					>
						<div className="flex items-center gap-3 mb-3">
							<QrCodeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
							<h3 className="font-medium">Link de Convite</h3>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
							Gerar link para auto registro
						</p>
					</button>

					<button
						onClick={() => setIsNFCModalOpen(true)}
						className="glass-card p-6 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 rounded-xl shadow-md hover:shadow-lg flex flex-col items-center"
					>
						<div className="flex items-center gap-3 mb-3">
							<CreditCardIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
							<h3 className="font-medium">Cartão NFC</h3>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
							Registrar via cartão NFC
						</p>
					</button>
				</div>
			)}

			<AttendanceList
				classId={id}
				attendees={classData.attendees}
				onUpdate={fetchClassData}
				isFinished={finished}
			/>

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
					onSuccess={fetchClassData}
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