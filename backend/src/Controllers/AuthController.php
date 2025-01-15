<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Firebase\JWT\JWT;
use App\Models\User;

class AuthController {
    private User $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function login(Request $request, Response $response): Response {
        $data = $request->getParsedBody();

        // Validação básica
        if (!isset($data['email']) || !isset($data['password'])) {
            $response->getBody()->write(json_encode([
                'error' => 'Email e senha são obrigatórios'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Busca o usuário no banco de dados
        $user = $this->userModel->findByEmail($data['email']);

        // Verifica se o usuário existe e a senha está correta
        if (!$user || !password_verify($data['password'], $user['password'])) {
            $response->getBody()->write(json_encode([
                'error' => 'Credenciais inválidas'
            ]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        // Remove a senha do objeto do usuário
        unset($user['password']);

        // Decodifica os roles do JSON para array
        $user['roles'] = json_decode($user['roles'], true);

        // Gera o token JWT
        $token = JWT::encode([
            'user' => $user,
            'exp' => time() + (60 * 60 * 24) // Token válido por 24 horas
        ], $_ENV['JWT_SECRET'], 'HS256');

        // Retorna os dados do usuário e o token
        $response->getBody()->write(json_encode([
            'user' => $user,
            'token' => $token
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }
}