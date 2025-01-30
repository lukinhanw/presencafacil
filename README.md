# Presença Fácil - Backend

## Visão Geral
API REST desenvolvida com Node.js e Express para o sistema de gerenciamento de presenças. Utiliza PostgreSQL como banco de dados e JWT para autenticação.

## Estrutura do Projeto

```
src/
├── config/         # Configurações (banco de dados, auth, etc)
├── controllers/    # Controladores da aplicação
├── middlewares/   # Middlewares personalizados
├── models/        # Modelos do Sequelize
├── routes/        # Definição das rotas
├── services/      # Lógica de negócio
└── utils/         # Funções utilitárias
```

## Principais Características

### Banco de Dados
- PostgreSQL com Sequelize ORM
- Migrations para versionamento do banco
- Seeds para dados iniciais
- Relacionamentos complexos entre entidades

### Autenticação e Autorização
- JWT (JSON Web Token)
- Middleware de autenticação
- Sistema de roles (ADMIN, INSTRUCTOR, USER)
- Verificação de termos de uso

### Endpoints Principais

#### Autenticação
```
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
```

#### Usuários
```
GET    /api/users
POST   /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

#### Termos de Uso
```
POST /api/terms/accept
GET  /api/terms/status
```

#### Aulas
```
GET    /api/classes
POST   /api/classes
GET    /api/classes/:id
PUT    /api/classes/:id
DELETE /api/classes/:id
```

#### Presenças
```
POST   /api/attendance/register
PUT    /api/attendance/update
DELETE /api/attendance/remove
```

### Middlewares
- `authMiddleware`: Validação de token JWT
- `roleMiddleware`: Verificação de roles
- `errorHandler`: Tratamento global de erros
- `requestLogger`: Log de requisições

### Modelos Principais
- `User`: Usuários do sistema
- `Instructor`: Instrutores
- `Class`: Aulas e treinamentos
- `Attendance`: Registro de presenças
- `Terms`: Controle de termos de uso

## Variáveis de Ambiente
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=presenca_facil
```

## Padrões de Código
- Arquitetura em camadas (MVC)
- Tratamento consistente de erros
- Validação de dados com Joi
- Logs estruturados
- Documentação com JSDoc

## Segurança
- Sanitização de inputs
- Rate limiting
- CORS configurado
- Helmet para headers HTTP
- Senhas hasheadas com bcrypt

## Scripts Disponíveis
```bash
npm install        # Instala dependências
npm run dev       # Inicia servidor de desenvolvimento
npm run start     # Inicia servidor de produção
npm run migrate   # Executa migrations
npm run seed      # Executa seeds
npm run test      # Executa testes
```

## Testes
- Jest para testes unitários
- Supertest para testes de integração
- Coverage report
- Testes automatizados em CI/CD

## Documentação API
- Swagger UI em `/api-docs`
- Postman Collection disponível
- Exemplos de requisições e respostas

## Deploy
- Docker support
- PM2 para gestão de processos
- Scripts de deploy automatizado
- Backup automático do banco de dados 