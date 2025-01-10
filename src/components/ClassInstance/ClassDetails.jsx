export default function ClassDetails({ classData }) {
	return (
		<div className="space-y-6">
			{/* Informações Principais */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="glass-card p-3">
					<h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
						Informações do Treinamento
					</h3>
					<dl className="space-y-3">
						<div>
							<dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Nome</dt>
							<dd className="mt-0.5 text-sm text-gray-900 dark:text-white">{classData.training.name}</dd>
						</div>
						<div>
							<dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Código</dt>
							<dd className="mt-0.5 text-sm text-gray-900 dark:text-white">{classData.training.code}</dd>
						</div>
						<div>
							<dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Duração</dt>
							<dd className="mt-0.5 text-sm text-gray-900 dark:text-white">{classData.training.duration}</dd>
						</div>
					</dl>
				</div>

				<div className="glass-card p-3">
					<h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
						Detalhes da Aula
					</h3>
					<dl className="space-y-3">
						<div>
							<dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Fornecedor</dt>
							<dd className="mt-0.5 text-sm text-gray-900 dark:text-white">{classData.training.provider}</dd>
						</div>
						<div>
							<dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Classificação</dt>
							<dd className="mt-0.5 text-sm text-gray-900 dark:text-white">{classData.training.classification}</dd>
						</div>
						<div>
							<dt className="text-xs font-medium text-gray-500 dark:text-gray-400">Unidade</dt>
							<dd className="mt-0.5 text-sm text-gray-900 dark:text-white">{classData.unit}</dd>
						</div>
					</dl>
				</div>
			</div>

			{/* Conteúdo Programático */}
			<div className="glass-card p-3">
				<h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
					Conteúdo Programático
				</h3>
				<p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
					{classData.training.content}
				</p>
			</div>

			{/* Objetivo */}
			<div className="glass-card p-3">
				<h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
					Objetivo
				</h3>
				<p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
					{classData.training.objective}
				</p>
			</div>
		</div>
	);
}