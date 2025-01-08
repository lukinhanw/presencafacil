import { useLocation } from 'react-router-dom';

const pageNames = {
    '/': 'Dashboard',
    '/aulas': 'Aulas',
    '/aulas/{id}': 'Informações da Aula',
    '/treinamentos': 'Treinamentos',
    '/colaboradores': 'Colaboradores',
    '/instrutores': 'Instrutores',
    '/suporte': 'Suporte',
    '/relatorios': 'Relatórios',
    '/perfil': 'Meu Perfil'
};

export default function PageIndicator() {
    const location = useLocation();
    const currentPath = location.pathname;
    
    const getPageName = (path) => {
        if (/^\/aulas\/\d+$/.test(path)) {
            return pageNames['/aulas/{id}'];
        }
        return pageNames[path] || 'Página';
    };

    const pageName = getPageName(currentPath);

    return (
        <div className="hidden md:flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium">
                {pageName}
            </span>
        </div>
    );
} 