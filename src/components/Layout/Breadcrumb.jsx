import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const routeNames = {
  '/': 'Home',
  '/aulas': 'Aulas',
  '/treinamentos': 'Treinamentos',
  '/colaboradores': 'Colaboradores',
  '/instrutores': 'Instrutores'
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link to="/" className="flex items-center hover:text-primary-600 dark:hover:text-primary-400">
            <HomeIcon className="h-4 w-4" />
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={routeTo} className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 mx-1" />
              {isLast ? (
                <span className="text-gray-900 dark:text-white">
                  {routeNames[routeTo] || name}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {routeNames[routeTo] || name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}