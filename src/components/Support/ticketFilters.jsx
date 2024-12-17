import { useTheme } from '../../contexts/ThemeContext';
import Select from 'react-select';
import { motion } from 'framer-motion';
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUS } from '../../services/supportService';
import { selectStyles } from '../Shared/selectStyles';
import { selectStylesDark } from '../Shared/selectStylesDark';

export default function TicketFilters({ filters, onFilterChange, isAdmin }) {
    const { isDark } = useTheme();
    const stylesSelect = isDark ? selectStylesDark : selectStyles;

    const handleFilterChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                    </label>
                    <Select
                        value={TICKET_STATUS.find(option => option.value === filters.status)}
                        onChange={(option) => handleFilterChange('status', option?.value || '')}
                        options={[
                            { value: '', label: 'Selecione o status' },
                            ...TICKET_STATUS
                        ]}
                        styles={stylesSelect}
                        className="w-full"
                        classNamePrefix="select"
                        isClearable
                        placeholder="Selecione o status"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Categoria
                    </label>
                    <Select
                        value={TICKET_CATEGORIES.find(option => option.value === filters.category)}
                        onChange={(option) => handleFilterChange('category', option?.value || '')}
                        options={[
                            { value: '', label: 'Selecione a categoria' },
                            ...TICKET_CATEGORIES
                        ]}
                        styles={stylesSelect}
                        className="w-full"
                        classNamePrefix="select"
                        isClearable
                        placeholder="Selecione a categoria"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prioridade
                    </label>
                    <Select
                        value={TICKET_PRIORITIES.find(option => option.value === filters.priority)}
                        onChange={(option) => handleFilterChange('priority', option?.value || '')}
                        options={[
                            { value: '', label: 'Selecione a prioridade' },
                            ...TICKET_PRIORITIES
                        ]}
                        styles={stylesSelect}
                        className="w-full"
                        classNamePrefix="select"
                        isClearable
                        placeholder="Selecione a prioridade"
                    />
                </div>

                {isAdmin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Buscar por usuário
                        </label>
                        <input
                            type="text"
                            value={filters.userSearch || ''}
                            onChange={(e) => handleFilterChange('userSearch', e.target.value)}
                            className="input-field w-full"
                            placeholder="Nome do usuário"
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
} 