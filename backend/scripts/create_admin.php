<?php

require __DIR__ . '/../vendor/autoload.php';

// Carrega as variáveis de ambiente
$envPath = __DIR__ . '/..';
if (!file_exists($envPath . '/.env')) {
    die("Arquivo .env não encontrado em: " . $envPath . "\n");
}

$dotenv = Dotenv\Dotenv::createImmutable($envPath);
$dotenv->load();

use App\Models\User;

// Dados do usuário admin
$adminData = [
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => password_hash('senha123', PASSWORD_DEFAULT),
    'roles' => ['ADMIN_ROLE'],
    'position' => 'Administrador do Sistema',
    'unit' => 'Matriz',
    'registration' => 'ADM001'
];

try {
    $userModel = new User();

    // Primeiro, vamos deletar o usuário se ele já existir
    $existingUser = $userModel->findByEmail($adminData['email']);
    if ($existingUser) {
        $userModel->delete($existingUser['id']);
    }

    // Agora criamos o novo usuário
    $userId = $userModel->create($adminData);
    echo "Usuário admin criado com sucesso!\n";
    echo "Email: admin@example.com\n";
    echo "Senha: senha123\n";
} catch (Exception $e) {
    echo "Erro ao criar usuário: " . $e->getMessage() . "\n";
} 