import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/General/toast';
import { updateUserProfile, updateUserPassword, getUserProfile } from '../services/userService';
import { UserCircleIcon, KeyIcon, CameraIcon } from '@heroicons/react/24/outline';
import { selectStyles } from '../components/Shared/selectStyles';
import { selectStylesDark } from '../components/Shared/selectStylesDark';
import { useTheme } from '../contexts/ThemeContext';
import { UNITS, POSITIONS } from '../utils/constants';

export default function Profile() {
    const { user, updateUserData } = useAuth();
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(user?.avatar);
    const fileInputRef = useRef(null);

    const stylesSelect = isDark ? selectStylesDark : selectStyles;

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: errorsProfile },
        control,
        reset: resetProfile
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            registration: user?.registration || '',
            position: user?.position ? { value: user.position, label: user.position } : null,
            unit: user?.unit ? { value: user.unit, label: user.unit } : null
        }
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: errorsPassword },
        watch,
        reset: resetPassword,
    } = useForm({
        onChange: (data) => {
            console.log('Mudança no formulário de senha:', {
                currentPassword: data.currentPassword ? '***' : undefined,
                newPassword: data.newPassword ? '***' : undefined,
                confirmPassword: data.confirmPassword ? '***' : undefined
            });
        }
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsLoading(true);
                const profile = await getUserProfile();
                updateUserData(profile);
                setPreviewImage(profile.avatar);
                resetProfile({
                    name: profile.name,
                    email: profile.email,
                    registration: profile.registration,
                    position: profile.position ? { value: profile.position, label: profile.position } : null,
                    unit: profile.unit ? { value: profile.unit, label: profile.unit } : null
                });
            } catch (error) {
                showToast.error('Erro', error.message || 'Erro ao carregar perfil');
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmitProfile = async (data) => {
        try {
            setIsLoading(true);
            const formData = {
                ...data,
                position: data.position?.value,
                unit: data.unit?.value,
                avatar: previewImage
            };
            const updatedUser = await updateUserProfile(formData);
            updateUserData(updatedUser);
            showToast.success('Sucesso', 'Perfil atualizado com sucesso!');
        } catch (error) {
            showToast.error('Erro', error.message || 'Erro ao atualizar perfil');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitPassword = async (data) => {
        try {
            console.log('Iniciando processo de alteração de senha...');
            console.log('Dados do formulário:', {
                currentPassword: data.currentPassword ? '***' : undefined,
                newPassword: data.newPassword ? '***' : undefined,
                confirmPassword: data.confirmPassword ? '***' : undefined,
                formErrors: errorsPassword
            });

            setIsLoading(true);
            await updateUserPassword(data);
            console.log('Senha atualizada com sucesso!');
            showToast.success('Sucesso', 'Senha atualizada com sucesso!');
            resetPassword();
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            showToast.error('Erro', error.message || 'Erro ao atualizar senha');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Meu Perfil
                </h1>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`pb-4 px-1 ${activeTab === 'profile'
                                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <UserCircleIcon className="h-5 w-5" />
                                <span>Dados Pessoais</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`pb-4 px-1 ${activeTab === 'password'
                                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <KeyIcon className="h-5 w-5" />
                                <span>Alterar Senha</span>
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Formulário de Perfil */}
                {activeTab === 'profile' && (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleSubmitProfile(onSubmitProfile)}
                        className="space-y-6"
                    >
                        {/* Avatar */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserCircleIcon className="w-full h-full text-gray-400" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                >
                                    <CameraIcon className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Clique para alterar sua foto
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Matrícula (readonly) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Matrícula
                                </label>
                                <input
                                    type="text"
                                    {...registerProfile('registration')}
                                    className="input-field mt-1 bg-gray-50 dark:bg-gray-800"
                                    readOnly
                                />
                            </div>

                            {/* Nome */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nome Completo
                                </label>
                                <input
                                    type="text"
                                    {...registerProfile('name', { required: 'Nome é obrigatório' })}
                                    className="input-field mt-1"
                                />
                                {errorsProfile.name && (
                                    <p className="mt-1 text-sm text-red-500">{errorsProfile.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    {...registerProfile('email', {
                                        required: 'Email é obrigatório',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email inválido'
                                        }
                                    })}
                                    className="input-field mt-1"
                                />
                                {errorsProfile.email && (
                                    <p className="mt-1 text-sm text-red-500">{errorsProfile.email.message}</p>
                                )}
                            </div>

                            {/* Cargo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Cargo
                                </label>
                                <Controller
                                    name="position"
                                    control={control}
                                    rules={{ required: 'Cargo é obrigatório' }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Select
                                            {...field}
                                            value={value}
                                            onChange={(option) => onChange(option)}
                                            options={POSITIONS.map(pos => ({ value: pos, label: pos }))}
                                            styles={stylesSelect}
                                            placeholder="Selecione um cargo"
                                            className="mt-1"
                                            classNamePrefix="select"
                                        />
                                    )}
                                />
                                {errorsProfile.position && (
                                    <p className="mt-1 text-sm text-red-500">{errorsProfile.position.message}</p>
                                )}
                            </div>

                            {/* Unidade */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Unidade
                                </label>
                                <Controller
                                    name="unit"
                                    control={control}
                                    rules={{ required: 'Unidade é obrigatória' }}
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <Select
                                            {...field}
                                            value={value}
                                            onChange={(option) => onChange(option)}
                                            options={UNITS.map(unit => ({ value: unit, label: unit }))}
                                            styles={stylesSelect}
                                            placeholder="Selecione uma unidade"
                                            className="mt-1"
                                            classNamePrefix="select"
                                        />
                                    )}
                                />
                                {errorsProfile.unit && (
                                    <p className="mt-1 text-sm text-red-500">{errorsProfile.unit.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-gradient"
                            >
                                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </motion.form>
                )}

                {/* Formulário de Senha */}
                {activeTab === 'password' && (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleSubmitPassword(onSubmitPassword)}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Senha Atual
                                </label>
                                <input
                                    type="password"
                                    {...registerPassword('currentPassword', {
                                        required: 'Senha atual é obrigatória',
                                        onChange: (e) => console.log('Senha atual alterada')
                                    })}
                                    className="input-field mt-1"
                                />
                                {errorsPassword.currentPassword && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errorsPassword.currentPassword.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nova Senha
                                </label>
                                <input
                                    type="password"
                                    {...registerPassword('newPassword', {
                                        required: 'Nova senha é obrigatória',
                                        minLength: {
                                            value: 6,
                                            message: 'A senha deve ter no mínimo 6 caracteres'
                                        },
                                        onChange: (e) => console.log('Nova senha alterada')
                                    })}
                                    className="input-field mt-1"
                                />
                                {errorsPassword.newPassword && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errorsPassword.newPassword.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirmar Nova Senha
                                </label>
                                <input
                                    type="password"
                                    {...registerPassword('confirmPassword', {
                                        required: 'Confirmação de senha é obrigatória',
                                        validate: (value) => {
                                            const newPassword = watch('newPassword');
                                            console.log('Validando confirmação de senha:', {
                                                newPassword: newPassword ? '***' : undefined,
                                                confirmPassword: value ? '***' : undefined,
                                                match: value === newPassword
                                            });
                                            return value === newPassword || 'As senhas não coincidem';
                                        },
                                        onChange: (e) => console.log('Confirmação de senha alterada')
                                    })}
                                    className="input-field mt-1"
                                />
                                {errorsPassword.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errorsPassword.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-gradient"
                            >
                                {isLoading ? 'Alterando...' : 'Alterar Senha'}
                            </button>
                        </div>
                    </motion.form>
                )}
            </motion.div>
        </div>
    );
} 