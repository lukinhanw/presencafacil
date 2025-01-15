<?php

use App\Controllers\AuthController;

// Rotas de autenticação
$app->post('/api/login', [AuthController::class, 'login']);
