import { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, CheckCircleIcon, XCircleIcon, KeyIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/General/datatable';
import Modal from '../components/General/modal';
import Alert from '../components/General/alert';
import ConfirmationDialog from '../components/General/confirmationDialog';
import AdminForm from '../components/Admin/adminForm';
import AdminFilters from '../components/Admin/adminFilters';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, toggleAdminStatus, resetAdminPassword } from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/General/toast';
import Tooltip from '../components/General/Tooltip';

export default function Administrators() {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        units: [],
        positions: []
    });
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, admin: null });
    const [statusAlert, setStatusAlert] = useState({ isOpen: false, admin: null });
    const [resetPasswordAlert, setResetPasswordAlert] = useState({ isOpen: false, admin: null });
    const { hasRole } = useAuth();
    const isAdmin = hasRole('ADMIN_ROLE');

    const fetchAdmins = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getAdmins({
                search: filters.search,
                units: filters.units?.map(u => u.value) || [],
                positions: filters.positions?.map(p => p.value) || []
            });
            setAdmins(data);
        } catch (error) {
            showToast.error('Erro', error.message || 'Não foi possível carregar os administradores');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const handleOpenModal = (admin = null) => {
        setSelectedAdmin(admin);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedAdmin(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true);
            if (selectedAdmin) {
                await updateAdmin(selectedAdmin.id, data);
                showToast.success('Sucesso', 'Administrador atualizado com sucesso!');
            } else {
                await createAdmin(data);
                showToast.success('Sucesso', 'Administrador cadastrado com sucesso!');
            }
            handleCloseModal();
            fetchAdmins();
        } catch (error) {
            showToast.error('Erro', error.message || 'Erro ao salvar administrador');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await deleteAdmin(deleteAlert.admin.id);
            showToast.success('Sucesso', 'Administrador excluído permanentemente!');
            setDeleteAlert({ isOpen: false, admin: null });
            fetchAdmins();
        } catch (error) {
            showToast.error('Erro', error.message || 'Não foi possível excluir o administrador');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            setIsLoading(true);
            await toggleAdminStatus(statusAlert.admin.id);
            showToast.success('Sucesso', `Administrador ${statusAlert.admin.isActive ? 'desativado' : 'ativado'} com sucesso!`);
            setStatusAlert({ isOpen: false, admin: null });
            fetchAdmins();
        } catch (error) {
            showToast.error('Erro', error.message || 'Não foi possível alterar o status do administrador');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        try {
            setIsLoading(true);
            await resetAdminPassword(resetPasswordAlert.admin.id);
            showToast.success('Sucesso', `Senha do administrador ${resetPasswordAlert.admin.name} resetada com sucesso! A nova senha é igual à matrícula.`);
            setResetPasswordAlert({ isOpen: false, admin: null });
        } catch (error) {
            showToast.error('Erro', error.message || 'Não foi possível resetar a senha do administrador');
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            accessorKey: 'registration',
            header: 'Matrícula',
            cell: (row) => row.registration
        },
        {
            accessorKey: 'name',
            header: 'Nome',
            cell: (row) => row.name
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: (row) => row.email
        },
        {
            accessorKey: 'unit',
            header: 'Unidade',
            cell: (row) => row.unit
        },
        {
            accessorKey: 'position',
            header: 'Cargo',
            cell: (row) => row.position
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: (row) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {row.isActive ? 'Ativo' : 'Inativo'}
                </span>
            )
        }
    ];

    const actions = (row) => isAdmin ? (
        <>
            <Tooltip content="Editar administrador">
                <button
                    onClick={() => handleOpenModal(row)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                >
                    <PencilIcon className="h-5 w-5" />
                </button>
            </Tooltip>
            <Tooltip content={row.isActive ? "Desativar administrador" : "Ativar administrador"}>
                <button
                    onClick={() => setStatusAlert({ isOpen: true, admin: row })}
                    className={`${row.isActive
                            ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300'
                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                        }`}
                >
                    {row.isActive ? (
                        <XCircleIcon className="h-5 w-5" />
                    ) : (
                        <CheckCircleIcon className="h-5 w-5" />
                    )}
                </button>
            </Tooltip>
            <Tooltip content="Resetar senha">
                <button
                    onClick={() => setResetPasswordAlert({ isOpen: true, admin: row })}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    <KeyIcon className="h-5 w-5" />
                </button>
            </Tooltip>
            <Tooltip content="Excluir administrador permanentemente">
                <button
                    onClick={() => setDeleteAlert({ isOpen: true, admin: row })}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </Tooltip>
        </>
    ) : null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Administradores
                </h1>
                {isAdmin && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-gradient flex items-center"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Novo Administrador
                    </button>
                )}
            </div>

            <AdminFilters
                filters={filters}
                onFilterChange={setFilters}
            />

            <DataTable
                columns={columns}
                data={admins}
                actions={actions}
                isLoading={isLoading}
                rowClassName={(row) => !row.isActive ? 'opacity-60 dark:opacity-50' : ''}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedAdmin ? 'Editar Administrador' : 'Novo Administrador'}
                size="xl"
            >
                <AdminForm
                    onSubmit={handleSubmit}
                    initialData={selectedAdmin}
                    isLoading={isLoading}
                />
            </Modal>

            <Alert
                isOpen={statusAlert.isOpen}
                onClose={() => setStatusAlert({ isOpen: false, admin: null })}
                onConfirm={handleToggleStatus}
                title={statusAlert.admin?.isActive ? "Desativar Administrador" : "Ativar Administrador"}
                message={statusAlert.admin?.isActive 
                    ? `Tem certeza que deseja desativar o administrador ${statusAlert.admin?.name}?` 
                    : `Tem certeza que deseja ativar o administrador ${statusAlert.admin?.name}?`}
                type={statusAlert.admin?.isActive ? "warning" : "success"}
            />

            <ConfirmationDialog
                isOpen={deleteAlert.isOpen}
                onClose={() => setDeleteAlert({ isOpen: false, admin: null })}
                onConfirm={handleDelete}
                title="Excluir Administrador Permanentemente"
                message={`Esta ação não pode ser desfeita. O administrador ${deleteAlert.admin?.name} será excluído permanentemente do sistema, junto com todos os seus dados e histórico.`}
                confirmationText="eu confirmo"
                confirmText="Excluir Permanentemente"
                type="danger"
            />

            <ConfirmationDialog
                isOpen={resetPasswordAlert.isOpen}
                onClose={() => setResetPasswordAlert({ isOpen: false, admin: null })}
                onConfirm={handleResetPassword}
                title="Resetar Senha do Administrador"
                message={`A senha do administrador ${resetPasswordAlert.admin?.name} será resetada para o valor da sua matrícula (${resetPasswordAlert.admin?.registration}). Esta ação não pode ser desfeita.`}
                confirmationText="eu confirmo"
                confirmText="Resetar Senha"
                type="warning"
            />
        </div>
    );
}