Contexto do Projeto:

Estamos desenvolvendo uma "Lista de Presença Digital" utilizando React.js, Vite, TailwindCSS e JavaScript. O objetivo do sistema é permitir o gerenciamento eficiente de aulas e treinamentos corporativos, incluindo registro de presença, controle de colaboradores e instrutores, e geração de relatórios de participação.

O projeto foi estruturado com base em princípios modernos de desenvolvimento web, garantindo escalabilidade, responsividade e uma excelente experiência para o usuário.

Características Principais do Sistema:
Tecnologias Utilizadas:

Frontend: React.js com Vite para alta performance.
Estilização: TailwindCSS com suporte a temas claro e escuro.
Serviços: Simulação de API com JSON para leitura e escrita de dados.
Páginas e Funcionalidades Implementadas:

Treinamentos (/treinamentos):
CRUD completo de treinamentos.
Campos dinâmicos como Nome, Código, Duração, Fornecedor, Conteúdo Programático, Classificação e Objetivo.
Busca com debounce e filtros persistentes.
Controle de acesso baseado em roles:
ADMIN_ROLE: Acesso total.
INSTRUCTOR_ROLE: Permissões limitadas (somente visualização).
Paginação e tabela responsiva.

Colaboradores (/colaboradores):
CRUD de colaboradores com campos como Matrícula, Nome, Unidade e Cargo.
Busca e filtros para localizar colaboradores facilmente.
Paginação e ordenação.

Instrutores (/instrutores):
Gerenciamento de instrutores com campos específicos como Área de Especialização e Experiência.
CRUD com as mesmas permissões de acesso utilizadas nas outras páginas.

Aulas (/aulas):
CRUD de aulas com campos dinâmicos baseados no tipo da aula (Portfólio, Externo, DDS, Outros).
População automática de informações no tipo "Portfólio", utilizando dados dos treinamentos cadastrados.
Exibição de uma tabela simplificada com campos como Nome, Código, Tipo, Data de Início, Presentes, Instrutor e Ações.
Ações incluem entrar na instância da aula e deletar aulas (apenas para ADMIN_ROLE).
Página de Instância da Aula (/aulas/:id):
A página mais importante do sistema, dedicada à gestão da lista de presença em tempo real.

Funcionalidades:
Visualização dos Dados da Aula: Exibe título, instrutor e horário de início, com um modal para mais detalhes.

Registro de Presença:
Manual: Busca pelo colaborador, captura de foto via webcam e registro do horário.
Link de Convite: Geração de link/QR Code, registro através do código e captura de foto.
Cartão NFC: Leitura do código do cartão, validação com o cadastro e registro automático.
Gestão de Presença: Inserir/remover colaboradores, marcar saída antecipada, e finalizar aula.
Design e Usabilidade:

Responsividade: Mobile-first com breakpoints (sm, md, lg).
UX: Animações suaves (transition: all 0.3s ease-in-out), skeleton loading e toasts para feedback visual.
Tema: Suporte a temas claro e escuro, com Glassmorphism/Neomorphism.
Componentes Reutilizáveis:

DataTable: Tabelas com paginação, ordenação e filtros.
Modal: Para exibição de informações e ações.
Toast Notifications: Feedback visual para sucesso e erros.
Filtros: Busca com debounce e persistência no localStorage.
WebcamCapture: Captura de fotos via webcam.
NFCReader: Leitor para registro por cartão NFC.
InviteLink: Geração de links e QR Codes para auto registro.