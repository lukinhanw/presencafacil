import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import DashboardHeader from './DashboardHeader';

const menuItems = [
  { name: 'Aulas', path: '/aulas', icon: AcademicCapIcon },
  { name: 'Treinamentos', path: '/treinamentos', icon: BookOpenIcon },
  { name: 'Colaboradores', path: '/colaboradores', icon: UserGroupIcon },
  { name: 'Instrutores', path: '/instrutores', icon: UserIcon },
];

export default function DashboardMenu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <div className="pt-20 flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12 mt-5">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text mb-2">
            Lista de Presença Digital
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="group p-6 glass-card hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <div className="flex flex-col items-center space-y-4">
                <item.icon className="h-12 w-12 text-primary-600 dark:text-primary-400 group-hover:text-secondary-500 transition-colors duration-300" />
                <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-secondary-500 transition-colors duration-300">
                  {item.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}