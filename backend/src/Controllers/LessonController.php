<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Lesson;
use Exception;

class LessonController {
    private Lesson $lessonModel;

    public function __construct() {
        $this->lessonModel = new Lesson();
    }

    public function getAll(Request $request, Response $response): Response {
        try {
            // Obtém os parâmetros de query
            $params = $request->getQueryParams();
            
            // Prepara os filtros
            $filters = [
                'search' => $params['search'] ?? '',
                'types' => isset($params['types']) ? explode(',', $params['types']) : [],
                'units' => isset($params['units']) ? explode(',', $params['units']) : [],
                'instructor_id' => $params['instructor_id'] ?? null,
                'start_date' => $params['start_date'] ?? null,
                'end_date' => $params['end_date'] ?? null,
                'page' => isset($params['page']) ? (int)$params['page'] : 1,
                'limit' => isset($params['limit']) ? (int)$params['limit'] : 10
            ];

            // Obtém os dados
            $lessons = $this->lessonModel->findAll($filters);
            $total = $this->lessonModel->count($filters);

            // Decodifica os dados do treinamento
            foreach ($lessons as &$lesson) {
                if ($lesson['training_data']) {
                    $lesson['training_data'] = json_decode($lesson['training_data'], true);
                }
            }

            // Prepara a resposta paginada
            $response->getBody()->write(json_encode([
                'data' => $lessons,
                'pagination' => [
                    'total' => $total,
                    'page' => $filters['page'],
                    'limit' => $filters['limit'],
                    'pages' => ceil($total / $filters['limit'])
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao buscar aulas'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getOne(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            $lesson = $this->lessonModel->findById($id);

            if (!$lesson) {
                $response->getBody()->write(json_encode([
                    'error' => 'Aula não encontrada'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Decodifica os dados do treinamento
            if ($lesson['training_data']) {
                $lesson['training_data'] = json_decode($lesson['training_data'], true);
            }

            $response->getBody()->write(json_encode($lesson));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao buscar aula'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function create(Request $request, Response $response): Response {
        $data = $request->getParsedBody();

        // Validação básica
        $requiredFields = ['type', 'date_start', 'instructor_id', 'unit'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $response->getBody()->write(json_encode([
                    'error' => "O campo '$field' é obrigatório"
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
        }

        // Validação adicional para tipo Portfolio
        if ($data['type'] === 'Portfolio' && empty($data['training_data'])) {
            $response->getBody()->write(json_encode([
                'error' => 'Dados do treinamento são obrigatórios para aulas do tipo Portfolio'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        try {
            $id = $this->lessonModel->create($data);
            $lesson = $this->lessonModel->findById($id);
            
            // Decodifica os dados do treinamento
            if ($lesson['training_data']) {
                $lesson['training_data'] = json_decode($lesson['training_data'], true);
            }

            $response->getBody()->write(json_encode($lesson));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao criar aula'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function update(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            $data = $request->getParsedBody();

            // Verifica se a aula existe
            $lesson = $this->lessonModel->findById($id);
            if (!$lesson) {
                $response->getBody()->write(json_encode([
                    'error' => 'Aula não encontrada'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $this->lessonModel->update($id, $data);
            
            // Retorna os dados atualizados
            $updated = $this->lessonModel->findById($id);
            if ($updated['training_data']) {
                $updated['training_data'] = json_decode($updated['training_data'], true);
            }

            $response->getBody()->write(json_encode($updated));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao atualizar aula'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function delete(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            
            // Verifica se a aula existe
            $lesson = $this->lessonModel->findById($id);
            if (!$lesson) {
                $response->getBody()->write(json_encode([
                    'error' => 'Aula não encontrada'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $this->lessonModel->delete($id);
            return $response->withStatus(204);
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao excluir aula'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getUnits(Request $request, Response $response): Response {
        try {
            $units = $this->lessonModel->getUnits();
            $response->getBody()->write(json_encode($units));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao buscar unidades'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function registerAttendance(Request $request, Response $response, array $args): Response {
        try {
            $lessonId = (int)$args['id'];
            $data = $request->getParsedBody();

            if (empty($data['employee_id'])) {
                $response->getBody()->write(json_encode([
                    'error' => 'ID do colaborador é obrigatório'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $success = $this->lessonModel->registerAttendance($lessonId, $data['employee_id']);
            if (!$success) {
                $response->getBody()->write(json_encode([
                    'error' => 'Colaborador já registrado nesta aula'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Retorna a aula atualizada
            $lesson = $this->lessonModel->findById($lessonId);
            if ($lesson['training_data']) {
                $lesson['training_data'] = json_decode($lesson['training_data'], true);
            }

            $response->getBody()->write(json_encode($lesson));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao registrar presença'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function registerEarlyLeave(Request $request, Response $response, array $args): Response {
        try {
            $lessonId = (int)$args['id'];
            $data = $request->getParsedBody();

            if (empty($data['employee_id'])) {
                $response->getBody()->write(json_encode([
                    'error' => 'ID do colaborador é obrigatório'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $success = $this->lessonModel->registerEarlyLeave($lessonId, $data['employee_id']);
            if (!$success) {
                $response->getBody()->write(json_encode([
                    'error' => 'Não foi possível registrar a saída antecipada'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Retorna a aula atualizada
            $lesson = $this->lessonModel->findById($lessonId);
            if ($lesson['training_data']) {
                $lesson['training_data'] = json_decode($lesson['training_data'], true);
            }

            $response->getBody()->write(json_encode($lesson));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao registrar saída antecipada'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function removeAttendee(Request $request, Response $response, array $args): Response {
        try {
            $lessonId = (int)$args['id'];
            $employeeId = (int)$args['employee_id'];

            $success = $this->lessonModel->removeAttendee($lessonId, $employeeId);
            if (!$success) {
                $response->getBody()->write(json_encode([
                    'error' => 'Não foi possível remover o participante'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Retorna a aula atualizada
            $lesson = $this->lessonModel->findById($lessonId);
            if ($lesson['training_data']) {
                $lesson['training_data'] = json_decode($lesson['training_data'], true);
            }

            $response->getBody()->write(json_encode($lesson));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao remover participante'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function finishLesson(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            
            $success = $this->lessonModel->finishLesson($id);
            if (!$success) {
                $response->getBody()->write(json_encode([
                    'error' => 'Não foi possível finalizar a aula'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Retorna a aula atualizada
            $lesson = $this->lessonModel->findById($id);
            if ($lesson['training_data']) {
                $lesson['training_data'] = json_decode($lesson['training_data'], true);
            }

            $response->getBody()->write(json_encode($lesson));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao finalizar aula'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function cancelLesson(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            
            $success = $this->lessonModel->cancelLesson($id);
            if (!$success) {
                $response->getBody()->write(json_encode([
                    'error' => 'Não foi possível cancelar a aula'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Retorna a aula atualizada
            $lesson = $this->lessonModel->findById($id);
            if ($lesson['training_data']) {
                $lesson['training_data'] = json_decode($lesson['training_data'], true);
            }

            $response->getBody()->write(json_encode($lesson));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao cancelar aula'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
} 