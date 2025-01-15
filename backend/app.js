const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Configuração do CORS
app.use(cors());

// Configuração para processar JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuração para servir arquivos estáticos
const uploadsDir = path.join(__dirname, 'uploads');
// Cria o diretório uploads se não existir
if (!require('fs').existsSync(uploadsDir)) {
    require('fs').mkdirSync(uploadsDir, { recursive: true });
}

// Rotas da API
app.use('/api', routes);
// Arquivos estáticos dentro da API
app.use('/api/uploads', express.static(uploadsDir));

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app; 