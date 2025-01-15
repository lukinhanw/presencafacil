<?php

use App\Controllers\AuthController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Middleware para tratar requisições OPTIONS
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

// Rotas de autenticação
$app->post('/api/login', [AuthController::class, 'login']);