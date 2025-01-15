<?php

use App\Controllers\AuthController;
use App\Controllers\EmployeeController;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Middleware para tratar requisições OPTIONS
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

// Rotas de autenticação
$app->post('/api/login', [AuthController::class, 'login']);

// Rotas de colaboradores
$app->group('/api/employees', function ($app) {
    $app->get('', [EmployeeController::class, 'getAll']);
    $app->get('/units', [EmployeeController::class, 'getUnits']);
    $app->get('/positions', [EmployeeController::class, 'getPositions']);
    $app->get('/{id}', [EmployeeController::class, 'getOne']);
    $app->post('', [EmployeeController::class, 'create']);
    $app->put('/{id}', [EmployeeController::class, 'update']);
    $app->delete('/{id}', [EmployeeController::class, 'delete']);
});