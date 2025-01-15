# Documentação da API - Sistema de Presença Fácil

## Visão Geral
API REST desenvolvida com Slim Framework para gerenciar o sistema de presença digital.

## Base URL
```
http://localhost:8000/api
```

## Autenticação
A API utiliza autenticação JWT (JSON Web Token). O token deve ser enviado no header `Authorization` como `Bearer {token}`.

### Login
Autentica um usuário e retorna o token JWT.

```http
POST /login
Content-Type: application/json

{
    "email": "string",
    "password": "string"
}
```

**Resposta de Sucesso (200 OK)**
```json
{
    "user": {
        "id": "integer",
        "name": "string",
        "email": "string",
        "roles": ["string"],
        "position": "string",
        "unit": "string",
        "registration": "string",
        "avatar": "string|null",
        "created_at": "datetime",
        "updated_at": "datetime"
    },
    "token": "string"
}
```

**Resposta de Erro (401 Unauthorized)**
```json
{
    "error": "Credenciais inválidas"
}
```

## Colaboradores (Employees)

### Listar Colaboradores
Retorna uma lista paginada de colaboradores.

```http
GET /employees?page=1&limit=10&search=string&unit=string
```

**Parâmetros de Query**
- `page` (opcional): Número da página (default: 1)
- `limit` (opcional): Quantidade de itens por página (default: 10)
- `search` (opcional): Busca por nome, email ou matrícula
- `unit` (opcional): Filtra por unidade

**Resposta de Sucesso (200 OK)**
```json
{
    "data": [
        {
            "id": "integer",
            "name": "string",
            "email": "string",
            "roles": ["string"],
            "position": "string",
            "unit": "string",
            "registration": "string",
            "avatar": "string|null",
            "created_at": "datetime",
            "updated_at": "datetime"
        }
    ],
    "pagination": {
        "total": "integer",
        "page": "integer",
        "limit": "integer",
        "pages": "integer"
    }
}
```

### Obter um Colaborador
Retorna os dados de um colaborador específico.

```http
GET /employees/{id}
```

**Resposta de Sucesso (200 OK)**
```json
{
    "id": "integer",
    "name": "string",
    "email": "string",
    "roles": ["string"],
    "position": "string",
    "unit": "string",
    "registration": "string",
    "avatar": "string|null",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

**Resposta de Erro (404 Not Found)**
```json
{
    "error": "Colaborador não encontrado"
}
```

### Criar Colaborador
Cria um novo colaborador.

```http
POST /employees
Content-Type: application/json

{
    "name": "string",
    "email": "string",
    "password": "string",
    "position": "string",
    "unit": "string",
    "registration": "string"
}
```

**Campos Obrigatórios**
- `name`: Nome do colaborador
- `email`: Email único
- `password`: Senha
- `position`: Cargo/Função
- `unit`: Unidade
- `registration`: Matrícula única

**Resposta de Sucesso (201 Created)**
```json
{
    "id": "integer",
    "name": "string",
    "email": "string",
    "roles": ["EMPLOYEE_ROLE"],
    "position": "string",
    "unit": "string",
    "registration": "string",
    "avatar": null,
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

**Respostas de Erro**
- 400 Bad Request: Campo obrigatório ausente
```json
{
    "error": "O campo 'nome_do_campo' é obrigatório"
}
```
- 400 Bad Request: Email ou matrícula duplicados
```json
{
    "error": "Email ou matrícula já cadastrados"
}
```

### Atualizar Colaborador
Atualiza os dados de um colaborador existente.

```http
PUT /employees/{id}
Content-Type: application/json

{
    "name": "string",
    "email": "string",
    "password": "string", // opcional
    "position": "string",
    "unit": "string",
    "registration": "string"
}
```

**Campos Permitidos**
- `name`: Nome do colaborador
- `email`: Email único
- `password`: Nova senha (opcional)
- `position`: Cargo/Função
- `unit`: Unidade
- `registration`: Matrícula única

**Resposta de Sucesso (200 OK)**
```json
{
    "id": "integer",
    "name": "string",
    "email": "string",
    "roles": ["string"],
    "position": "string",
    "unit": "string",
    "registration": "string",
    "avatar": "string|null",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

**Respostas de Erro**
- 404 Not Found: Colaborador não encontrado
- 400 Bad Request: Email ou matrícula duplicados

### Excluir Colaborador
Remove um colaborador do sistema.

```http
DELETE /employees/{id}
```

**Resposta de Sucesso (204 No Content)**

**Resposta de Erro (404 Not Found)**
```json
{
    "error": "Colaborador não encontrado"
}
```

### Listar Unidades
Retorna uma lista de todas as unidades cadastradas.

```http
GET /employees/units
```

**Resposta de Sucesso (200 OK)**
```json
[
    "string"
]
```