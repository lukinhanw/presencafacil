<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Training {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findAll(array $filters = []): array {
        $sql = 'SELECT * FROM trainings WHERE 1=1';
        $params = [];
        
        // Adiciona filtros se existirem
        if (!empty($filters['search'])) {
            $sql .= ' AND (name LIKE :search OR code LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['provider'])) {
            $sql .= ' AND provider = :provider';
            $params['provider'] = $filters['provider'];
        }

        if (!empty($filters['classification'])) {
            $sql .= ' AND classification = :classification';
            $params['classification'] = $filters['classification'];
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
        $sql = 'SELECT COUNT(*) FROM trainings WHERE 1=1';
        $params = [];

        if (!empty($filters['search'])) {
            $sql .= ' AND (name LIKE :search OR code LIKE :search)';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['provider'])) {
            $sql .= ' AND provider = :provider';
            $params['provider'] = $filters['provider'];
        }

        if (!empty($filters['classification'])) {
            $sql .= ' AND classification = :classification';
            $params['classification'] = $filters['classification'];
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return (int)$stmt->fetchColumn();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM trainings WHERE id = :id');
        $stmt->execute(['id' => $id]);
        
        $training = $stmt->fetch();
        return $training ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare('
            INSERT INTO trainings (name, code, duration, provider, content, classification, objective)
            VALUES (:name, :code, :duration, :provider, :content, :classification, :objective)
        ');

        $stmt->execute([
            'name' => $data['name'],
            'code' => $data['code'],
            'duration' => $data['duration'],
            'provider' => $data['provider'],
            'content' => $data['content'],
            'classification' => $data['classification'],
            'objective' => $data['objective']
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $fields = [];
        $params = ['id' => $id];

        // Lista de campos permitidos para atualização
        $allowedFields = ['name', 'code', 'duration', 'provider', 'content', 'classification', 'objective'];
        
        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                $fields[] = "$key = :$key";
                $params[$key] = $value;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = 'UPDATE trainings SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM trainings WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }

    public function getProviders(): array {
        $stmt = $this->db->prepare('SELECT DISTINCT provider FROM trainings ORDER BY provider');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getClassifications(): array {
        $stmt = $this->db->prepare('SELECT DISTINCT classification FROM trainings ORDER BY classification');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
} 