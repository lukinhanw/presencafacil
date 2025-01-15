<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class User {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // Busca um usuário pelo email
    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);

        $user = $stmt->fetch();
        return $user ?: null;
    }

    // Busca um usuário pelo ID
    public function findById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = :id');
        $stmt->execute(['id' => $id]);

        $user = $stmt->fetch();
        return $user ?: null;
    }

    // Cria um novo usuário
    public function create(array $data): int {
        $stmt = $this->db->prepare('
            INSERT INTO users (name, email, password, roles, position, unit, registration)
            VALUES (:name, :email, :password, :roles, :position, :unit, :registration)
        ');

        $stmt->execute([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'roles' => json_encode($data['roles']),
            'position' => $data['position'],
            'unit' => $data['unit'],
            'registration' => $data['registration']
        ]);

        return (int)$this->db->lastInsertId();
    }

    // Atualiza um usuário existente
    public function update(int $id, array $data): bool {
        $fields = [];
        $params = ['id' => $id];

        foreach ($data as $key => $value) {
            if ($key !== 'id' && $key !== 'created_at') {
                $fields[] = "$key = :$key";
                $params[$key] = $key === 'roles' ? json_encode($value) : $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);

        return $stmt->execute($params);
    }

    // Deleta um usuário existente
    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM users WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }
}
