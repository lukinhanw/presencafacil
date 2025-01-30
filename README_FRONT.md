# Presença Fácil - Frontend

## Visão Geral
Sistema de gerenciamento de presenças desenvolvido com React + Vite, utilizando TailwindCSS para estilização e Context API para gerenciamento de estado.

## Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos (imagens, animações)
├── components/      # Componentes reutilizáveis
│   ├── General/    # Componentes gerais (Toast, Modal, etc)
│   ├── Layout/     # Componentes de layout (Sidebar, Header)
│   └── Forms/      # Componentes de formulário
├── contexts/       # Contextos React (AuthContext, etc)
├── pages/          # Páginas da aplicação
├── services/       # Serviços de API
└── utils/          # Funções utilitárias
```

## Principais Características

### Autenticação
- Gerenciada pelo `AuthContext` (`src/contexts/AuthContext.jsx`)
- Sistema de roles para controle de acesso
- Armazenamento de token JWT
- Verificação de termos de uso

### Chamadas API
- Utilizamos `fetch` para todas as chamadas ao backend
- Padrão de serviços em `src/services/`
- Exemplo de estrutura de serviço:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const someService = async () => {
    try {
        const { token } = getStoredAuth();
        const response = await fetch(`${API_URL}/endpoint`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Erro na requisição');
        return await response.json();
    } catch (error) {
        throw error.message;
    }
};
```

### Rotas
- Definidas em `App.jsx`
- Sistema de rotas protegidas baseado em roles
- Middleware de autenticação integrado

### Componentes Principais
- `MobileSidebar.jsx`: Menu lateral responsivo
- `Welcome.jsx`: Página de boas-vindas e aceitação de termos
- `Dashboard.jsx`: Página principal do sistema

### Fluxo de Autenticação
1. Login via `/login`
2. Verificação de termos de uso
3. Redirecionamento para welcome se necessário
4. Acesso ao dashboard

### Variáveis de Ambiente
```env
VITE_API_URL=http://localhost:5000/api
```

## Funcionalidades Principais
- Gerenciamento de presenças
- Administração de usuários
- Gestão de turmas
- Sistema de tickets/suporte
- Controle de acesso baseado em roles

## Padrões de Código
- Componentes funcionais com hooks
- Context API para estado global
- Tratamento consistente de erros
- Toast notifications para feedback
- Formulários com React Hook Form

## Dependências Principais
- React + Vite
- TailwindCSS
- React Router DOM
- React Hook Form
- Framer Motion
- Heroicons

## Scripts Disponíveis
```bash
npm install     # Instala dependências
npm run dev     # Inicia servidor de desenvolvimento
npm run build   # Gera build de produção
npm run preview # Visualiza build de produção
```