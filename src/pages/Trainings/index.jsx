import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import TrainingForm from '../../components/TrainingForm';
import { getTrainings, createTraining, updateTraining, deleteTraining } from '../../services/trainingService';
import { useAuth } from '../../contexts/AuthContext';

export default function Trainings() {
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN_ROLE');

  const fetchTrainings = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getTrainings({ search: searchTerm });
      setTrainings(data);
    } catch (error) {
      toast.error('Erro ao carregar treinamentos');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const handleOpenModal = (training = null) => {
    setSelectedTraining(training);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTraining(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (selectedTraining) {
        await updateTraining(selectedTraining.id, data);
        toast.success('Treinamento atualizado com sucesso!');
      } else {
        await createTraining(data);
        toast.success('Treinamento criado com sucesso!');
      }
      handleCloseModal();
      fetchTrainings();
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar treinamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este treinamento?')) return;
    
    try {
      setIsLoading(true);
      await deleteTraining(id);
      toast.success('Treinamento excluído com sucesso!');
      fetchTrainings();
    } catch (error) {
      toast.error('Erro ao excluir treinamento');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'code', header: 'Código' },
    { key: 'duration', header: 'Duração' },
    { key: 'provider', header: 'Fornecedor' },
    { key: 'classification', header: 'Classificação' }
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
        onClick={() => handleDelete(row.id)}
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
          Treinamentos
        </h1>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="btn-gradient flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Treinamento
          </button>
        )}
      </div>

      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Buscar treinamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full md:w-64"
        />
      </div>

      <DataTable
        columns={columns}
        data={trainings}
        actions={actions}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTraining ? 'Editar Treinamento' : 'Novo Treinamento'}
        size="xl"
      >
        <TrainingForm
          onSubmit={handleSubmit}
          initialData={selectedTraining}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}