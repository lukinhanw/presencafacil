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

## 🗄️ Banco de Dados: Presença Fácil

### Tabelas Principais

#### 1. Classes (Aulas)
Armazena informações sobre as aulas.

| Campo | Descrição |
|-------|-----------|
| id | ID único |
| type | Tipo da aula (Portfolio, External, DDS, Others) |
| instructor_id | ID do instrutor |
| date_start | Data/hora de início |
| date_end | Data/hora de término |
| status | Status (scheduled, completed, cancelled) |
| name | Nome da aula |

#### 2. Class_Invites (Convites)
Gerencia os convites para aulas.

| Campo | Descrição |
|-------|-----------|
| id | ID único |
| class_id | ID da aula |
| token | Token do convite |
| expires_at | Data de validade do convite |


#### 3. Class_Participants (Participantes)
Registra informações dos participantes das aulas.

| Campo | Descrição |
|-------|-----------|
| id | ID único |
| class_id | ID da aula |
| name | Nome do participante |
| registration | Matrícula do participante |
| unit | Unidade do participante |

#### 4. Employees (Funcionários)
Mantém dados dos funcionários.

| Campo | Descrição |
|-------|-----------|
| id | ID único |
| name | Nome do funcionário |
| registration | Matrícula |
| unit | Unidade |
| position | Cargo |

#### 5. Instructors (Instrutores)
Armazena informações dos instrutores.

| Campo | Descrição |
|-------|-----------|
| id | ID único |
| name | Nome do instrutor |
| registration | Matrícula |
| unit | Unidade |
| position | Cargo |

#### 6. Trainings (Treinamentos)
Contém dados sobre treinamentos.

| Campo | Descrição |
|-------|-----------|
| id | ID único |
| name | Nome do treinamento |
| code | Código do treinamento |
| duration | Duração |
| provider | Provedor |

#### 7. Users (Usuários)
Gerencia informações dos usuários do sistema.

| Campo | Descrição |
|-------|-----------|
| id | ID único |
| name | Nome do usuário |
| email | E-mail |
| password | Senha |
| roles | Permissões do usuário |

#### 8. Tickets (Tickets de Suporte)
Gerencia os tickets de suporte do sistema.

| Campo | Descrição |
|-------|-----------|
| id | ID único |
| title | Título do ticket |
| description | Descrição detalhada |
| status | Status (open, in-progress, closed) |
| priority | Prioridade (low, medium, high) |
| category | Categoria (technical, doubt, error, suggestion) |
| creator_id | ID do criador (pode ser user_id ou instructor_id) |
| creator_type | Tipo do criador ('user' ou 'instructor') |
| created_at | Data de criação |
| updated_at | Data de atualização |

#### 9. Ticket_Messages (Mensagens dos Tickets)
Armazena as mensagens trocadas em cada ticket.

| Campo | Descrição |
|-------|-----------|
| id | ID único |
| message | Conteúdo da mensagem |
| is_support | Flag se é mensagem do suporte |
| user_id | ID do usuário que enviou |
| ticket_id | ID do ticket relacionado |
| attachments | Anexos em formato JSON |
| created_at | Data de criação |
| updated_at | Data de atualização |