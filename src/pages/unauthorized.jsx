import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-card p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Acesso Não Autorizado
        </h2>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );
}