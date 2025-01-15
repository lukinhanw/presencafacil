import { useState } from 'react';
import { FiUserPlus, FiUserMinus, FiLogOut } from 'react-icons/fi';
import { registerAttendance, registerEarlyLeave, removeAttendee } from '../../services/classService';
import { showToast } from '../General/toast';

export default function ClassAttendees({ classData, onUpdate }) {
    const [newAttendee, setNewAttendee] = useState({
        name: '',
        registration: '',
        unit: ''
    });

    const handleRegisterAttendance = async (e) => {
        e.preventDefault();
        try {
            await registerAttendance(classData.id, newAttendee);
            showToast('Presença registrada com sucesso', 'success');
            setNewAttendee({ name: '', registration: '', unit: '' });
            onUpdate();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleEarlyLeave = async (registration) => {
        try {
            await registerEarlyLeave(classData.id, registration);
            showToast('Saída antecipada registrada com sucesso', 'success');
            onUpdate();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleRemoveAttendee = async (registration) => {
        try {
            await removeAttendee(classData.id, registration);
            showToast('Participante removido com sucesso', 'success');
            onUpdate();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    return (
        <div className="space-y-4">
            {/* Formulário para adicionar participante */}
            <form onSubmit={handleRegisterAttendance} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Registrar Presença</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Nome"
                        value={newAttendee.name}
                        onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                        className="input-field"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Matrícula"
                        value={newAttendee.registration}
                        onChange={(e) => setNewAttendee({ ...newAttendee, registration: e.target.value })}
                        className="input-field"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Unidade"
                        value={newAttendee.unit}
                        onChange={(e) => setNewAttendee({ ...newAttendee, unit: e.target.value })}
                        className="input-field"
                        required
                    />
                </div>
                <button type="submit" className="btn-primary flex items-center">
                    <FiUserPlus className="mr-2" />
                    Registrar Presença
                </button>
            </form>

            {/* Lista de participantes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold">Participantes ({classData.presents})</h3>
                </div>
                <div className="divide-y dark:divide-gray-700">
                    {classData.attendees?.map((attendee) => (
                        <div key={attendee.registration} className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium">{attendee.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {attendee.registration} - {attendee.unit}
                                </p>
                                {attendee.early_leave && (
                                    <span className="text-xs text-yellow-500">
                                        Saída antecipada: {new Date(attendee.early_leave_time).toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                {!attendee.early_leave && classData.status === 'scheduled' && (
                                    <button
                                        onClick={() => handleEarlyLeave(attendee.registration)}
                                        className="btn-warning btn-sm"
                                        title="Registrar saída antecipada"
                                    >
                                        <FiLogOut />
                                    </button>
                                )}
                                {classData.status === 'scheduled' && (
                                    <button
                                        onClick={() => handleRemoveAttendee(attendee.registration)}
                                        className="btn-danger btn-sm"
                                        title="Remover participante"
                                    >
                                        <FiUserMinus />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {(!classData.attendees || classData.attendees.length === 0) && (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            Nenhum participante registrado
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 