export default function ReportFilters({ type, onFilter, onGenerate, isLoading }) {
    const handleGenerateReport = (format) => {
        onGenerate(format);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end space-x-3">
                <button
                    onClick={() => handleGenerateReport('pdf')}
                    disabled={isLoading}
                    className="btn-gradient"
                >
                    {isLoading ? 'Gerando...' : 'Gerar PDF'}
                </button>
                <button
                    onClick={() => handleGenerateReport('xlsx')}
                    disabled={isLoading}
                    className="btn-outline"
                >
                    {isLoading ? 'Gerando...' : 'Gerar Excel'}
                </button>
            </div>
        </div>
    );
} 