<?php

use App\Controllers\AuthController;
use App\Controllers\EmployeeController;
use App\Controllers\InstructorController;
use App\Controllers\TrainingController;
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

// Rotas de instrutores
$app->group('/api/instructors', function ($app) {
    $app->get('', [InstructorController::class, 'getAll']);
    $app->get('/units', [InstructorController::class, 'getUnits']);
    $app->get('/positions', [InstructorController::class, 'getPositions']);
    $app->get('/{id}', [InstructorController::class, 'getOne']);
    $app->post('', [InstructorController::class, 'create']);
    $app->put('/{id}', [InstructorController::class, 'update']);
    $app->delete('/{id}', [InstructorController::class, 'delete']);
});

// Rotas de treinamentos
$app->group('/api/trainings', function ($app) {
    $app->get('', [TrainingController::class, 'getAll']);
    $app->get('/providers', [TrainingController::class, 'getProviders']);
    $app->get('/classifications', [TrainingController::class, 'getClassifications']);
    $app->get('/{id}', [TrainingController::class, 'getOne']);
    $app->post('', [TrainingController::class, 'create']);
    $app->put('/{id}', [TrainingController::class, 'update']);
    $app->delete('/{id}', [TrainingController::class, 'delete']);
});