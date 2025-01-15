<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Employee {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findAll(array $filters = []): array {
        $sql = 'SELECT * FROM users WHERE roles LIKE :role';
        $params = ['role' => '%"EMPLOYEE_ROLE"%'];

        // Adiciona filtros se existirem
        if (!empty($filters['search'])) {
            $sql .= ' AND (name LIKE :search OR email LIKE :search OR registration LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['unit'])) {
            $sql .= ' AND unit = :unit';
            $params['unit'] = $filters['unit'];
        }

        // Ordenação
        $sql .= ' ORDER BY name ASC';

        // Paginação
        if (isset($filters['page']) && isset($filters['limit'])) {
            $offset = ($filters['page'] - 1) * $filters['limit'];
            $sql .= ' LIMIT :limit OFFSET :offset';
            $params['limit'] = $filters['limit'];
            $params['offset'] = $offset;
        }

        $stmt = $this->db->prepare($sql);

        // Bind dos parâmetros
        foreach ($params as $key => $value) {
            if ($key === 'limit' || $key === 'offset') {
                $stmt->bindValue(':' . $key, $value, PDO::PARAM_INT);
            } else {
                $stmt->bindValue(':' . $key, $value);
            }
        }

        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function count(array $filters = []): int {
        $sql = 'SELECT COUNT(*) FROM users WHERE roles LIKE :role';
        $params = ['role' => '%"EMPLOYEE_ROLE"%'];

        if (!empty($filters['search'])) {
            $sql .= ' AND (name LIKE :search OR email LIKE :search OR registration LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['unit'])) {
            $sql .= ' AND unit = :unit';
            $params['unit'] = $filters['unit'];
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return (int)$stmt->fetchColumn();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = :id AND roles LIKE :role');
        $stmt->execute([
            'id' => $id,
            'role' => '%"EMPLOYEE_ROLE"%'
        ]);
        
        $employee = $stmt->fetch();
        return $employee ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare('
            INSERT INTO users (name, email, password, roles, position, unit, registration)
            VALUES (:name, :email, :password, :roles, :position, :unit, :registration)
        ');

        // Garante que o role de colaborador está presente
        $roles = isset($data['roles']) ? $data['roles'] : [];
        if (!in_array('EMPLOYEE_ROLE', $roles)) {
            $roles[] = 'EMPLOYEE_ROLE';
        }

        $stmt->execute([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'roles' => json_encode($roles),
            'position' => $data['position'],
            'unit' => $data['unit'],
            'registration' => $data['registration']
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $fields = [];
        $params = ['id' => $id];

        // Lista de campos permitidos para atualização
        $allowedFields = ['name', 'email', 'position', 'unit', 'registration'];
        
        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                $fields[] = "$key = :$key";
                $params[$key] = $value;
            }
        }

        // Se houver uma nova senha, inclui no update
        if (!empty($data['password'])) {
            $fields[] = "password = :password";
            $params['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (empty($fields)) {
            return false;
        }

        $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = :id AND roles LIKE :role';
        $params['role'] = '%"EMPLOYEE_ROLE"%';

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM users WHERE id = :id AND roles LIKE :role');
        return $stmt->execute([
            'id' => $id,
            'role' => '%"EMPLOYEE_ROLE"%'
        ]);
    }

    public function getUnits(): array {
        $stmt = $this->db->prepare('SELECT DISTINCT unit FROM users WHERE roles LIKE :role ORDER BY unit');
        $stmt->execute(['role' => '%"EMPLOYEE_ROLE"%']);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
} 