require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const trainingRoutes = require('./routes/training.routes');
const employeeRoutes = require('./routes/employee.routes');
const instructorRoutes = require('./routes/instructor.routes');
const classRoutes = require('./routes/class.routes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Sincroniza o banco de dados
sequelize.sync()
    .then(() => console.log('Banco de dados sincronizado'))
    .catch(err => console.error('Erro ao sincronizar banco de dados:', err));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/classes', classRoutes);

// Rota para ler um arquivo de imagem na pasta uploads
app.use('/api/uploads', express.static('uploads'));

// Middleware de tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 