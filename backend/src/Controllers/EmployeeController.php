<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Employee;

class EmployeeController {
    private Employee $employeeModel;

    public function __construct() {
        $this->employeeModel = new Employee();
    }

    public function getAll(Request $request, Response $response): Response {
        // Obtém os parâmetros de query
        $params = $request->getQueryParams();
        
        // Prepara os filtros
        $filters = [
            'search' => $params['search'] ?? '',
            'unit' => $params['unit'] ?? '',
            'page' => isset($params['page']) ? (int)$params['page'] : 1,
            'limit' => isset($params['limit']) ? (int)$params['limit'] : 10
        ];

        // Obtém os dados
        $employees = $this->employeeModel->findAll($filters);
        $total = $this->employeeModel->count($filters);

        // Remove senhas e formata roles
        foreach ($employees as &$employee) {
            unset($employee['password']);
            $employee['roles'] = json_decode($employee['roles'], true);
        }

        // Prepara a resposta paginada
        $response->getBody()->write(json_encode([
            'data' => $employees,
            'pagination' => [
                'total' => $total,
                'page' => $filters['page'],
                'limit' => $filters['limit'],
                'pages' => ceil($total / $filters['limit'])
            ]
        ]));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public function getOne(Request $request, Response $response, array $args): Response {
        $id = (int)$args['id'];
        $employee = $this->employeeModel->findById($id);

        if (!$employee) {
            $response->getBody()->write(json_encode([
                'error' => 'Colaborador não encontrado'
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        // Remove senha e formata roles
        unset($employee['password']);
        $employee['roles'] = json_decode($employee['roles'], true);

        $response->getBody()->write(json_encode($employee));
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response {
        $data = $request->getParsedBody();

        // Validação básica
        $requiredFields = ['name', 'email', 'password', 'position', 'unit', 'registration'];
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $response->getBody()->write(json_encode([
                    'error' => "O campo '$field' é obrigatório"
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
        }

        try {
            $id = $this->employeeModel->create($data);
            $employee = $this->employeeModel->findById($id);
            
            // Remove senha e formata roles
            unset($employee['password']);
            $employee['roles'] = json_decode($employee['roles'], true);

            $response->getBody()->write(json_encode($employee));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\PDOException $e) {
            // Verifica se é erro de duplicidade
            if ($e->getCode() == 23000) {
                $response->getBody()->write(json_encode([
                    'error' => 'Email ou matrícula já cadastrados'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }
            throw $e;
        }
    }

    public function update(Request $request, Response $response, array $args): Response {
        $id = (int)$args['id'];
        $data = $request->getParsedBody();

        // Verifica se o colaborador existe
        $employee = $this->employeeModel->findById($id);
        if (!$employee) {
            $response->getBody()->write(json_encode([
                'error' => 'Colaborador não encontrado'
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        try {
            $this->employeeModel->update($id, $data);
            
            // Retorna os dados atualizados
            $updated = $this->employeeModel->findById($id);
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
            throw $e;
        }
    }

    public function delete(Request $request, Response $response, array $args): Response {
        $id = (int)$args['id'];
        
        // Verifica se o colaborador existe
        $employee = $this->employeeModel->findById($id);
        if (!$employee) {
            $response->getBody()->write(json_encode([
                'error' => 'Colaborador não encontrado'
            ]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $this->employeeModel->delete($id);
        return $response->withStatus(204);
    }

    public function getUnits(Request $request, Response $response): Response {
        $units = $this->employeeModel->getUnits();
        
        $response->getBody()->write(json_encode($units));
        return $response->withHeader('Content-Type', 'application/json');
    }
} 