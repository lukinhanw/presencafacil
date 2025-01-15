<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Instructor;
use Exception;

class InstructorController {
    private Instructor $instructorModel;

    public function __construct() {
        $this->instructorModel = new Instructor();
    }

    public function getAll(Request $request, Response $response): Response {
        // Obtém os parâmetros de query
        $params = $request->getQueryParams();
        
        // Prepara os filtros
        $filters = [
            'search' => $params['search'] ?? '',
            'unit' => $params['unit'] ?? '',
            'position' => $params['position'] ?? '',
            'page' => isset($params['page']) ? (int)$params['page'] : 1,
            'limit' => isset($params['limit']) ? (int)$params['limit'] : 10
        ];

        try {
            // Obtém os dados
            $instructors = $this->instructorModel->findAll($filters);
            $total = $this->instructorModel->count($filters);

            // Remove senhas e formata roles
            foreach ($instructors as &$instructor) {
                unset($instructor['password']);
                $instructor['roles'] = json_decode($instructor['roles'], true);
            }

            // Prepara a resposta paginada
            $response->getBody()->write(json_encode([
                'data' => $instructors,
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
                'error' => 'Erro ao buscar instrutores'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getOne(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            $instructor = $this->instructorModel->findById($id);

            if (!$instructor) {
                $response->getBody()->write(json_encode([
                    'error' => 'Instrutor não encontrado'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            // Remove senha e formata roles
            unset($instructor['password']);
            $instructor['roles'] = json_decode($instructor['roles'], true);

            $response->getBody()->write(json_encode($instructor));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao buscar instrutor'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function create(Request $request, Response $response): Response {
        $data = $request->getParsedBody();

        // Validação básica
        $requiredFields = ['name', 'email', 'position', 'unit', 'registration'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $response->getBody()->write(json_encode([
                    'error' => "O campo '$field' é obrigatório"
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
        }

        // Define a senha padrão igual à matrícula
        $data['password'] = $data['registration'];

        try {
            $id = $this->instructorModel->create($data);
            $instructor = $this->instructorModel->findById($id);
            
            // Remove senha e formata roles
            unset($instructor['password']);
            $instructor['roles'] = json_decode($instructor['roles'], true);

            $response->getBody()->write(json_encode($instructor));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\PDOException $e) {
            // Verifica se é erro de duplicidade
            if ($e->getCode() == 23000) {
                $response->getBody()->write(json_encode([
                    'error' => 'Email ou matrícula já cadastrados'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
            
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao criar instrutor'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function update(Request $request, Response $response, array $args): Response {
        $id = (int)$args['id'];
        $data = $request->getParsedBody();

        // Validação do email
        if (isset($data['email']) && empty($data['email'])) {
            $response->getBody()->write(json_encode([
                'error' => 'O campo email é obrigatório'
            ]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        // Se a matrícula for atualizada, atualiza a senha também
        if (isset($data['registration'])) {
            $data['password'] = $data['registration'];
        }

        try {
            // Verifica se o instrutor existe
            $instructor = $this->instructorModel->findById($id);
            if (!$instructor) {
                $response->getBody()->write(json_encode([
                    'error' => 'Instrutor não encontrado'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $this->instructorModel->update($id, $data);
            
            // Retorna os dados atualizados
            $updated = $this->instructorModel->findById($id);
            unset($updated['password']);
            $updated['roles'] = json_decode($updated['roles'], true);

            $response->getBody()->write(json_encode($updated));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\PDOException $e) {
            // Verifica se é erro de duplicidade
            if ($e->getCode() == 23000) {
                $response->getBody()->write(json_encode([
                    'error' => 'Email ou matrícula já cadastrados'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
            
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao atualizar instrutor'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function delete(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            
            // Verifica se o instrutor existe
            $instructor = $this->instructorModel->findById($id);
            if (!$instructor) {
                $response->getBody()->write(json_encode([
                    'error' => 'Instrutor não encontrado'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $this->instructorModel->delete($id);
            return $response->withStatus(204);
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao excluir instrutor'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getUnits(Request $request, Response $response): Response {
        try {
            $units = $this->instructorModel->getUnits();
            $response->getBody()->write(json_encode($units));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao buscar unidades'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getPositions(Request $request, Response $response): Response {
        try {
            $positions = $this->instructorModel->getPositions();
            $response->getBody()->write(json_encode($positions));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao buscar cargos'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
} 