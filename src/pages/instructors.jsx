import { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import DataTable from '../components/General/datatable';
import Modal from '../components/General/modal';
import Alert from '../components/General/alert';
import InstructorForm from '../components/Instructor/instructorForm';
import InstructorFilters from '../components/Instructor/instructorFilters';
import { getInstructors, createInstructor, updateInstructor, deleteInstructor } from '../services/instructorService';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/General/toast';

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    units: [],
    positions: []
  });
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState({ isOpen: false, instructorId: null });
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN_ROLE');

  const fetchInstructors = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getInstructors({
        search: filters.search,
        units: filters.units?.map(u => u.value) || [],
        positions: filters.positions?.map(p => p.value) || []
      });
      setInstructors(data);
    } catch (error) {
      showToast.error('Erro', 'Não foi possível carregar os instrutores');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const handleOpenModal = (instructor = null) => {
    setSelectedInstructor(instructor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedInstructor(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (selectedInstructor) {
        await updateInstructor(selectedInstructor.id, data);
        showToast.success('Sucesso', 'Instrutor atualizado com sucesso!');
      } else {
        await createInstructor(data);
        showToast.success('Sucesso', 'Instrutor cadastrado com sucesso!');
      }
      handleCloseModal();
      fetchInstructors();
    } catch (error) {
      showToast.error('Erro', error.message || 'Erro ao salvar instrutor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteInstructor(deleteAlert.instructorId);
      showToast.success('Sucesso', 'Instrutor excluído com sucesso!');
      setDeleteAlert({ isOpen: false, instructorId: null });
      fetchInstructors();
    } catch (error) {
      showToast.error('Erro', 'Não foi possível excluir o instrutor');
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
      accessorKey: 'unit',
      header: 'Unidade',
      cell: (row) => row.unit
    },
    {
      accessorKey: 'position',
      header: 'Cargo',
      cell: (row) => row.position
    }
  ];

  const actions = (row) => isAdmin ? (
    <>
      <button
        onClick={() => handleOpenModal(row)}
        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setDeleteAlert({ isOpen: true, instructorId: row.id })}
        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </>
  ) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Instrutores
        </h1>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="btn-gradient flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Instrutor
          </button>
        )}
      </div>

      <InstructorFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      <DataTable
        columns={columns}
        data={instructors}
        actions={actions}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedInstructor ? 'Editar Instrutor' : 'Novo Instrutor'}
        size="xl"
      >
        <InstructorForm
          onSubmit={handleSubmit}
          initialData={selectedInstructor}
          isLoading={isLoading}
        />
      </Modal>

      <Alert
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, instructorId: null })}
        onConfirm={handleDelete}
        title="Excluir Instrutor"
        message="Tem certeza que deseja excluir este instrutor? Esta ação não pode ser desfeita."
        type="danger"
      />
    </div>
  );
}