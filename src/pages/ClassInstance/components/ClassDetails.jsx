export default function ClassDetails({ classData }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Informações do Treinamento
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Nome</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{classData.training.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Código</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{classData.training.code}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Duração</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{classData.training.duration}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fornecedor</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{classData.training.provider}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Classificação</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{classData.training.classification}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Unidade</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{classData.unit}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Conteúdo Programático
        </h4>
        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
          {classData.training.content}
        </p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Objetivo
        </h4>
        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
          {classData.training.objective}
        </p>
      </div>
    </div>
  );
}