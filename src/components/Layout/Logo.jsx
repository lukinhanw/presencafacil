import { useConfig } from '../../contexts/ConfigContext';

export default function Logo({ className = "h-8 w-8" }) {
    const { config } = useConfig();

    return (
        <div className="flex items-center space-x-3">
            {config.logo ? (
                <img
                    src={config.logo}
                    alt="Logo do Sistema"
                    className={`${className} object-contain`}
                />
            ) : (
                <div className={`${className} bg-primary-500/10 rounded-lg flex items-center justify-center`}>
                    <span className="text-primary-500 font-bold text-lg">
                        {config.titulo?.charAt(0) || 'L'}
                    </span>
                </div>
            )}
            <span className="text-xl font-semibold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                {config.titulo || 'Lista Digital'}
            </span>
        </div>
    );
} 