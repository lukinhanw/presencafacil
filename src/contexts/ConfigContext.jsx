import { createContext, useContext, useState, useEffect } from 'react';
import { getConfig } from '../services/configService';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState({
        titulo: 'Lista de Presença Digital',
        logo: null
    });
    const [isLoading, setIsLoading] = useState(true);

    const loadConfig = async () => {
        try {
            const data = await getConfig();
            setConfig(data);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    const updateConfigData = (newConfig) => {
        setConfig(newConfig);
    };

    return (
        <ConfigContext.Provider value={{ config, isLoading, updateConfigData }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig deve ser usado dentro de um ConfigProvider');
    }
    return context;
} 