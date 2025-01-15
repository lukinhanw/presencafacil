<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Training;
use Exception;

class TrainingController {
    private Training $trainingModel;

    public function __construct() {
        $this->trainingModel = new Training();
    }

    public function getAll(Request $request, Response $response): Response {
        try {
            // Obtém os parâmetros de query
            $params = $request->getQueryParams();
            
            // Prepara os filtros
            $filters = [
                'search' => $params['search'] ?? '',
                'provider' => $params['provider'] ?? '',
                'classification' => $params['classification'] ?? '',
                'page' => isset($params['page']) ? (int)$params['page'] : 1,
                'limit' => isset($params['limit']) ? (int)$params['limit'] : 10
            ];

            // Obtém os dados
            $trainings = $this->trainingModel->findAll($filters);
            $total = $this->trainingModel->count($filters);

            // Prepara a resposta paginada
            $response->getBody()->write(json_encode([
                'data' => $trainings,
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
                'error' => 'Erro ao buscar treinamentos'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getOne(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            $training = $this->trainingModel->findById($id);

            if (!$training) {
                $response->getBody()->write(json_encode([
                    'error' => 'Treinamento não encontrado'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode($training));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao buscar treinamento'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function create(Request $request, Response $response): Response {
        $data = $request->getParsedBody();

        // Validação básica
        $requiredFields = ['name', 'code', 'duration', 'provider', 'content', 'classification', 'objective'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $response->getBody()->write(json_encode([
                    'error' => "O campo '$field' é obrigatório"
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
        }

        try {
            $id = $this->trainingModel->create($data);
            $training = $this->trainingModel->findById($id);

            $response->getBody()->write(json_encode($training));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\PDOException $e) {
            // Verifica se é erro de duplicidade
            if ($e->getCode() == 23000) {
                $response->getBody()->write(json_encode([
                    'error' => 'Código do treinamento já cadastrado'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
            
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao criar treinamento'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function update(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            $data = $request->getParsedBody();

            // Verifica se o treinamento existe
            $training = $this->trainingModel->findById($id);
            if (!$training) {
                $response->getBody()->write(json_encode([
                    'error' => 'Treinamento não encontrado'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $this->trainingModel->update($id, $data);
            
            // Retorna os dados atualizados
            $updated = $this->trainingModel->findById($id);
            $response->getBody()->write(json_encode($updated));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (\PDOException $e) {
            // Verifica se é erro de duplicidade
            if ($e->getCode() == 23000) {
                $response->getBody()->write(json_encode([
                    'error' => 'Código do treinamento já cadastrado'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
            
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao atualizar treinamento'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function delete(Request $request, Response $response, array $args): Response {
        try {
            $id = (int)$args['id'];
            
            // Verifica se o treinamento existe
            $training = $this->trainingModel->findById($id);
            if (!$training) {
                $response->getBody()->write(json_encode([
                    'error' => 'Treinamento não encontrado'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $this->trainingModel->delete($id);
            return $response->withStatus(204);
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao excluir treinamento'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getProviders(Request $request, Response $response): Response {
        try {
            $providers = $this->trainingModel->getProviders();
            $response->getBody()->write(json_encode($providers));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao buscar fornecedores'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getClassifications(Request $request, Response $response): Response {
        try {
            $classifications = $this->trainingModel->getClassifications();
            $response->getBody()->write(json_encode($classifications));
            return $response->withHeader('Content-Type', 'application/json');
        } catch (Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Erro ao buscar classificações'
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
} 