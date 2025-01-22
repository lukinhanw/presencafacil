# Documentação do Backend - PresençaFácil

## Estrutura do Projeto

O backend está organizado em uma arquitetura MVC (Model-View-Controller) com separação clara de responsabilidades. Aqui está a estrutura principal:

### 📁 Diretórios Principais

- `/config` - Configurações do sistema
- `/controllers` - Controladores que gerenciam a lógica de negócios
- `/middleware` - Middlewares para processamento de requisições
- `/models` - Modelos de dados
- `/routes` - Definição das rotas da API
- `/services` - Serviços que contêm a lógica de negócios
- `/uploads` - Diretório para armazenamento de arquivos enviados
- `/scripts` - Scripts utilitários

### 🔧 Arquivos de Configuração

- `server.js` - Ponto de entrada da aplicação
- `.env` - Variáveis de ambiente (não versionado)
- `.env.example` - Exemplo das variáveis de ambiente necessárias
- `package.json` - Dependências e scripts do projeto

## Detalhamento dos Componentes

### 🚀 Inicialização (`server.js`)
- Configura o servidor Express
- Gerencia middlewares globais (CORS, JSON parsing)
- Define as rotas principais da API
- Conecta ao banco de dados via Sequelize
- Configura tratamento de erros global

### 📡 Rotas Principais
- `/api/auth` - Autenticação e autorização
- `/api/trainings` - Gestão de treinamentos
- `/api/employees` - Gestão de funcionários
- `/api/instructors` - Gestão de instrutores
- `/api/classes` - Gestão de aulas/turmas
- `/api/uploads` - Acesso a arquivos estáticos

### 💼 Serviços
Os serviços contêm a lógica de negócios principal. Por exemplo, o `class.service.js` inclui:
- Gerenciamento de aulas/turmas
- Registro de presença
- Geração de links de convite
- Upload de imagens
- Validação de participantes

### 🔐 Middleware
- Tratamento de erros centralizado
- Autenticação e autorização
- Validação de requisições

### 📊 Modelos
Utiliza Sequelize como ORM com modelos para:
- Classes (Aulas)
- Employees (Funcionários)
- Instructors (Instrutores)
- ClassParticipants (Participantes)

### 🗃️ Uploads
- Diretório para armazenamento de imagens e arquivos
- Acessível via `/api/uploads`
- Gerenciado pelo serviço de upload

## Configuração do Ambiente

Para iniciar o desenvolvimento, você precisa:

1. Copiar `.env.example` para `.env`
2. Configurar as variáveis de ambiente
3. Instalar dependências: `npm install`
4. Iniciar o servidor: `npm start`

## Principais Funcionalidades

- Gestão de aulas e treinamentos
- Sistema de presença com captura de fotos
- Geração de links de convite
- Registro de entrada/saída de participantes
- Upload e gerenciamento de arquivos
- Autenticação e autorização de usuários

Esta documentação fornece uma visão geral do backend. O sistema segue boas práticas de desenvolvimento e possui uma estrutura organizada que facilita a manutenção e expansão. 