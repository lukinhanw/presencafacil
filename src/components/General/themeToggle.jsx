import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
	const { isDark, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-lg bg-white/5 hover:bg-primary-50/50 dark:hover:bg-white/20 
                transition-all duration-300 border border-white/20"
			aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
		>
			{isDark ? (
				<SunIcon className="h-5 w-5 text-yellow-400" />
			) : (
				<MoonIcon className="h-5 w-5 text-gray-600 hover:text-primary-600" />
			)}
		</button>
	);
}