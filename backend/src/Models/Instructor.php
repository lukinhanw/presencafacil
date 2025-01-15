<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Instructor {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findAll(array $filters = []): array {
        $sql = 'SELECT * FROM users WHERE roles LIKE :role';
        $params = ['role' => '%"INSTRUCTOR_ROLE"%'];
        $conditions = [];

        // Adiciona filtros se existirem
        if (!empty($filters['search'])) {
            $conditions[] = '(name LIKE :search OR email LIKE :search OR registration LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['unit'])) {
            $conditions[] = 'unit = :unit';
            $params['unit'] = $filters['unit'];
        }

        if (!empty($filters['position'])) {
            $conditions[] = 'position = :position';
            $params['position'] = $filters['position'];
        }

        // Adiciona as condições à query
        if (!empty($conditions)) {
            $sql .= ' AND ' . implode(' AND ', $conditions);
        }

        // Ordenação
        $sql .= ' ORDER BY name ASC';

        // Paginação
        if (isset($filters['page']) && isset($filters['limit'])) {
            $sql .= ' LIMIT :limit OFFSET :offset';
            $params['limit'] = (int)$filters['limit'];
            $params['offset'] = (int)(($filters['page'] - 1) * $filters['limit']);
        }

        $stmt = $this->db->prepare($sql);

        // Bind dos parâmetros
        foreach ($params as $key => $value) {
            if (in_array($key, ['limit', 'offset'])) {
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
        $params = ['role' => '%"INSTRUCTOR_ROLE"%'];
        $conditions = [];

        if (!empty($filters['search'])) {
            $conditions[] = '(name LIKE :search OR email LIKE :search OR registration LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['unit'])) {
            $conditions[] = 'unit = :unit';
            $params['unit'] = $filters['unit'];
        }

        if (!empty($filters['position'])) {
            $conditions[] = 'position = :position';
            $params['position'] = $filters['position'];
        }

        if (!empty($conditions)) {
            $sql .= ' AND ' . implode(' AND ', $conditions);
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return (int)$stmt->fetchColumn();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = :id AND roles LIKE :role');
        $stmt->execute([
            'id' => $id,
            'role' => '%"INSTRUCTOR_ROLE"%'
        ]);
        
        $instructor = $stmt->fetch();
        return $instructor ?: null;
    }

    public function create(array $data): int {
        if (empty($data['email'])) {
            throw new \InvalidArgumentException('O email é obrigatório');
        }

        $stmt = $this->db->prepare('
            INSERT INTO users (name, email, password, roles, position, unit, registration)
            VALUES (:name, :email, :password, :roles, :position, :unit, :registration)
        ');

        // Garante que o role de instrutor está presente
        $roles = isset($data['roles']) ? $data['roles'] : [];
        if (!in_array('INSTRUCTOR_ROLE', $roles)) {
            $roles[] = 'INSTRUCTOR_ROLE';
        }

        // Garante que a senha seja sempre criptografada
        if (empty($data['password'])) {
            throw new \InvalidArgumentException('A senha é obrigatória');
        }
        $password = password_hash($data['password'], PASSWORD_DEFAULT);

        $stmt->execute([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $password,
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
        $allowedFields = ['name', 'email', 'password', 'position', 'unit', 'registration'];
        
        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                // Não permite email vazio
                if ($key === 'email' && empty($value)) {
                    throw new \InvalidArgumentException('O email é obrigatório');
                }

                // Sempre criptografa a senha se estiver sendo atualizada
                if ($key === 'password') {
                    if (empty($value)) {
                        continue; // Pula se não houver nova senha
                    }
                    $value = password_hash($value, PASSWORD_DEFAULT);
                }
                
                $fields[] = "$key = :$key";
                $params[$key] = $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = :id AND roles LIKE :role';
        $params['role'] = '%"INSTRUCTOR_ROLE"%';

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM users WHERE id = :id AND roles LIKE :role');
        return $stmt->execute([
            'id' => $id,
            'role' => '%"INSTRUCTOR_ROLE"%'
        ]);
    }

    public function getUnits(): array {
        $stmt = $this->db->prepare('SELECT DISTINCT unit FROM users WHERE roles LIKE :role ORDER BY unit');
        $stmt->execute(['role' => '%"INSTRUCTOR_ROLE"%']);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getPositions(): array {
        $stmt = $this->db->prepare('SELECT DISTINCT position FROM users WHERE roles LIKE :role ORDER BY position');
        $stmt->execute(['role' => '%"INSTRUCTOR_ROLE"%']);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
} 