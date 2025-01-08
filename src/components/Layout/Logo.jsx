import viteLogo from '/vite.svg';

export default function Logo({ className = "h-8 w-8" }) {
    return (
        <div className="flex items-center space-x-3">
            <img
                src={viteLogo}
                alt="Logo do Sistema"
                className={`${className} object-contain`}
            />
            <span className="text-xl font-semibold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                Lista Digital
            </span>
        </div>
    );
} 