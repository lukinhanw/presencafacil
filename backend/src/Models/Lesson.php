<?php

namespace App\Models;

use App\Config\Database;
use PDO;
use PDOException;

class Lesson {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findAll(array $filters = []): array {
        $sql = 'SELECT l.*, 
                COUNT(la.id) as presents,
                u.name as instructor_name
                FROM lessons l
                LEFT JOIN lesson_attendees la ON l.id = la.lesson_id
                LEFT JOIN users u ON l.instructor_id = u.id
                WHERE 1=1';
        
        $params = [];
        $conditions = [];

        // Adiciona filtros se existirem
        if (!empty($filters['search'])) {
            $conditions[] = '(
                JSON_EXTRACT(l.training_data, "$.name") LIKE :search OR
                JSON_EXTRACT(l.training_data, "$.code") LIKE :search OR
                u.name LIKE :search
            )';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['types'])) {
            $placeholders = [];
            foreach ($filters['types'] as $i => $type) {
                $key = "type_$i";
                $placeholders[] = ":$key";
                $params[$key] = $type;
            }
            $conditions[] = 'l.type IN (' . implode(', ', $placeholders) . ')';
        }

        if (!empty($filters['units'])) {
            $placeholders = [];
            foreach ($filters['units'] as $i => $unit) {
                $key = "unit_$i";
                $placeholders[] = ":$key";
                $params[$key] = $unit;
            }
            $conditions[] = 'l.unit IN (' . implode(', ', $placeholders) . ')';
        }

        if (!empty($filters['instructor_id'])) {
            $conditions[] = 'l.instructor_id = :instructor_id';
            $params['instructor_id'] = $filters['instructor_id'];
        }

        if (!empty($filters['start_date'])) {
            $conditions[] = 'DATE(l.date_start) >= :start_date';
            $params['start_date'] = $filters['start_date'];
        }

        if (!empty($filters['end_date'])) {
            $conditions[] = 'DATE(l.date_start) <= :end_date';
            $params['end_date'] = $filters['end_date'];
        }

        // Adiciona as condições à query
        if (!empty($conditions)) {
            $sql .= ' AND ' . implode(' AND ', $conditions);
        }

        // Agrupa para contar presenças corretamente
        $sql .= ' GROUP BY l.id';

        // Ordenação
        $sql .= ' ORDER BY l.date_start DESC';

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
        $sql = 'SELECT COUNT(DISTINCT l.id) FROM lessons l
                LEFT JOIN users u ON l.instructor_id = u.id
                WHERE 1=1';
        
        $params = [];
        $conditions = [];

        if (!empty($filters['search'])) {
            $conditions[] = '(
                JSON_EXTRACT(l.training_data, "$.name") LIKE :search OR
                JSON_EXTRACT(l.training_data, "$.code") LIKE :search OR
                u.name LIKE :search
            )';
            $params['search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['types'])) {
            $placeholders = [];
            foreach ($filters['types'] as $i => $type) {
                $key = "type_$i";
                $placeholders[] = ":$key";
                $params[$key] = $type;
            }
            $conditions[] = 'l.type IN (' . implode(', ', $placeholders) . ')';
        }

        if (!empty($filters['units'])) {
            $placeholders = [];
            foreach ($filters['units'] as $i => $unit) {
                $key = "unit_$i";
                $placeholders[] = ":$key";
                $params[$key] = $unit;
            }
            $conditions[] = 'l.unit IN (' . implode(', ', $placeholders) . ')';
        }

        if (!empty($conditions)) {
            $sql .= ' AND ' . implode(' AND ', $conditions);
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return (int)$stmt->fetchColumn();
    }

    public function findById(int $id): ?array {
        try {
            // Busca a aula
            $stmt = $this->db->prepare('
                SELECT l.*, 
                       i.name as instructor_name,
                       i.email as instructor_email,
                       i.position as instructor_position,
                       i.unit as instructor_unit
                FROM lessons l
                LEFT JOIN users i ON l.instructor_id = i.id
                WHERE l.id = :id
            ');
            
            $stmt->execute(['id' => $id]);
            $lesson = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$lesson) {
                return null;
            }

            // Formata os dados do instrutor
            $lesson['instructor'] = [
                'id' => $lesson['instructor_id'],
                'name' => $lesson['instructor_name'] ?? 'Instrutor não encontrado',
                'email' => $lesson['instructor_email'] ?? '',
                'position' => $lesson['instructor_position'] ?? '',
                'unit' => $lesson['instructor_unit'] ?? ''
            ];

            // Remove as colunas individuais do instrutor
            unset(
                $lesson['instructor_name'],
                $lesson['instructor_email'],
                $lesson['instructor_position'],
                $lesson['instructor_unit']
            );

            // Decodifica e formata os dados do treinamento
            if (!empty($lesson['training_data'])) {
                $trainingData = json_decode($lesson['training_data'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $lesson['training'] = $trainingData;
                } else {
                    error_log('Erro ao decodificar training_data: ' . json_last_error_msg());
                    $lesson['training'] = [
                        'name' => $this->getDefaultTrainingName($lesson['type'])
                    ];
                }
            } else {
                $lesson['training'] = [
                    'name' => $this->getDefaultTrainingName($lesson['type'])
                ];
            }
            unset($lesson['training_data']);

            return $lesson;
        } catch (PDOException $e) {
            error_log('Erro ao buscar aula: ' . $e->getMessage());
            throw $e;
        }
    }

    private function getDefaultTrainingName(string $type): string {
        switch ($type) {
            case 'DDS':
                return 'Diálogo Diário de Segurança';
            case 'External':
                return 'Treinamento Externo';
            case 'Others':
                return 'Outro Treinamento';
            default:
                return 'Treinamento';
        }
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare('
            INSERT INTO lessons (type, date_start, instructor_id, unit, training_data)
            VALUES (:type, :date_start, :instructor_id, :unit, :training_data)
        ');

        $stmt->execute([
            'type' => $data['type'],
            'date_start' => $data['date_start'],
            'instructor_id' => $data['instructor_id'],
            'unit' => $data['unit'],
            'training_data' => isset($data['training_data']) ? json_encode($data['training_data']) : null
        ]);

        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $fields = [];
        $params = ['id' => $id];

        // Lista de campos permitidos para atualização
        $allowedFields = ['type', 'date_start', 'date_end', 'status', 'instructor_id', 'unit', 'training_data'];
        
        foreach ($data as $key => $value) {
            if (in_array($key, $allowedFields)) {
                if ($key === 'training_data') {
                    $fields[] = "$key = :$key";
                    $params[$key] = json_encode($value);
                } else {
                    $fields[] = "$key = :$key";
                    $params[$key] = $value;
                }
            }
        }

        if (empty($fields)) {
            return false;
        }

        $sql = 'UPDATE lessons SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM lessons WHERE id = :id');
        return $stmt->execute(['id' => $id]);
    }

    public function getAttendees(int $lessonId): array {
        try {
            $stmt = $this->db->prepare('
                SELECT la.*,
                       u.name,
                       u.registration,
                       u.position,
                       u.unit
                FROM lesson_attendees la
                JOIN users u ON la.employee_id = u.id
                WHERE la.lesson_id = :lesson_id
                ORDER BY la.timestamp ASC
            ');
            
            $stmt->execute(['lesson_id' => $lessonId]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log('Erro ao buscar participantes: ' . $e->getMessage());
            throw $e;
        }
    }

    public function registerAttendance(int $lessonId, int $employeeId): bool {
        try {
            $stmt = $this->db->prepare('
                INSERT INTO lesson_attendees (lesson_id, employee_id, timestamp)
                VALUES (:lesson_id, :employee_id, NOW())
            ');

            return $stmt->execute([
                'lesson_id' => $lessonId,
                'employee_id' => $employeeId
            ]);
        } catch (\PDOException $e) {
            // Se o erro for de duplicidade, retorna false
            if ($e->getCode() == 23000) {
                return false;
            }
            throw $e;
        }
    }

    public function registerEarlyLeave(int $lessonId, int $employeeId): bool {
        $stmt = $this->db->prepare('
            UPDATE lesson_attendees 
            SET early_leave = TRUE, early_leave_time = NOW()
            WHERE lesson_id = :lesson_id AND employee_id = :employee_id
        ');

        return $stmt->execute([
            'lesson_id' => $lessonId,
            'employee_id' => $employeeId
        ]);
    }

    public function removeAttendee(int $lessonId, int $employeeId): bool {
        $stmt = $this->db->prepare('
            DELETE FROM lesson_attendees 
            WHERE lesson_id = :lesson_id AND employee_id = :employee_id
        ');

        return $stmt->execute([
            'lesson_id' => $lessonId,
            'employee_id' => $employeeId
        ]);
    }

    public function finishLesson(int $id): bool {
        $stmt = $this->db->prepare('
            UPDATE lessons 
            SET status = "Finalizado", date_end = NOW()
            WHERE id = :id
        ');

        return $stmt->execute(['id' => $id]);
    }

    public function cancelLesson(int $id): bool {
        $stmt = $this->db->prepare('
            UPDATE lessons 
            SET status = "Cancelado"
            WHERE id = :id
        ');

        return $stmt->execute(['id' => $id]);
    }

    public function getUnits(): array {
        $stmt = $this->db->prepare('SELECT DISTINCT unit FROM lessons ORDER BY unit');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function validateInviteToken(int $lessonId, string $token): bool {
        try {
            $stmt = $this->db->prepare('
                SELECT COUNT(*) FROM lesson_invites 
                WHERE lesson_id = :lesson_id 
                AND token = :token 
                AND expires_at > NOW()
            ');
            
            $stmt->execute([
                'lesson_id' => $lessonId,
                'token' => $token
            ]);
            
            return (bool)$stmt->fetchColumn();
        } catch (PDOException $e) {
            error_log('Erro ao validar token de convite: ' . $e->getMessage());
            throw $e;
        }
    }
} 