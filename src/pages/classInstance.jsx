import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
	UserPlusIcon,
	QrCodeIcon,
	CreditCardIcon
} from '@heroicons/react/24/outline';
import { getClassById, finishClass } from '../services/classService';
import Modal from '../components/General/modal';
import Alert from '../components/General/alert';
import ClassDetails from '../components/ClassInstance/ClassDetails';
import AttendanceList from '../components/ClassInstance/AttendanceList';
import ManualAttendance from '../components/ClassInstance/ManualAttendance';
import InviteLink from '../components/ClassInstance/InviteLink';
import NFCReader from '../components/ClassInstance/NFCReader';
import ClassHeader from '../components/ClassInstance/ClassHeader';
import AttendanceStats from '../components/ClassInstance/AttendanceStats';
import { showToast } from '../components/General/toast';
import { isClassFinished } from '../utils/dateUtils';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function ClassInstance() {
	const { id } = useParams();
	const { hasRole } = useAuth();
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

	if (isLoading || !classData) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	const finished = isClassFinished(classData);

	// Variantes de animação
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 100,
				damping: 12
			}
		}
	};

	return (
		<motion.div 
			className="space-y-6"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<motion.div variants={itemVariants}>
				<ClassHeader
					classData={classData}
					onOpenDetails={() => setIsDetailsModalOpen(true)}
					onFinishClass={() => setFinishAlert(true)}
					isFinished={finished}
				/>
			</motion.div>

			<div className="flex flex-col md:flex-row gap-6">
				<motion.div 
					className="w-full md:w-3/4"
					variants={itemVariants}
				>
					<AttendanceList
						classId={id}
						attendees={classData.attendees || []}
						onUpdate={fetchClassData}
						isFinished={finished}
					/>
				</motion.div>

				<motion.div 
					className="w-full md:w-1/4 space-y-4"
					variants={itemVariants}
				>
					<AttendanceStats attendees={classData.attendees || []} />

					{!finished && (
						<motion.div 
							className="glass-card p-3 space-y-2"
							whileHover={{ scale: 1.02 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							<motion.button
								onClick={() => setIsManualModalOpen(true)}
								className="w-full btn-gradient py-2 flex items-center justify-center gap-2 text-sm"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<UserPlusIcon className="h-4 w-4" />
								<span>Registrar Presença</span>
							</motion.button>

							{hasRole('ADMIN_ROLE') && (
								<motion.button
									onClick={() => setIsInviteModalOpen(true)}
									className="w-full btn-gradient py-2 flex items-center justify-center gap-2 text-sm"
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<QrCodeIcon className="h-4 w-4" />
									<span>Gerar Link</span>
								</motion.button>
							)}

							<motion.button
								onClick={() => setIsNFCModalOpen(true)}
								className="w-full btn-gradient py-2 flex items-center justify-center gap-2 text-sm"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<CreditCardIcon className="h-4 w-4" />
								<span>Cartão NFC</span>
							</motion.button>
						</motion.div>
					)}
				</motion.div>
			</div>

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
		</motion.div>
	);
}