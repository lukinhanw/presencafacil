import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Mock de relatórios
const MOCK_REPORTS = [
    {
        id: 1,
        title: 'Presença por Treinamento',
        description: 'Relatório detalhado de presenças por treinamento',
        type: 'attendance',
        lastGenerated: '2024-03-20T10:00:00Z',
        filters: {
            dateRange: true,
            training: true,
            unit: true,
            instructor: true
        }
    },
    {
        id: 2,
        title: 'Carga Horária por Colaborador',
        description: 'Total de horas de treinamento por colaborador',
        type: 'workload',
        lastGenerated: '2024-03-19T15:30:00Z',
        filters: {
            dateRange: true,
            employee: true,
            unit: true,
            category: true
        }
    },
    {
        id: 3,
        title: 'Desempenho de Instrutores',
        description: 'Análise de desempenho dos instrutores',
        type: 'instructor',
        lastGenerated: '2024-03-18T09:00:00Z',
        filters: {
            dateRange: true,
            instructor: true,
            category: true
        }
    },
    {
        id: 4,
        title: 'Certificações por Unidade',
        description: 'Relatório de certificações por unidade',
        type: 'certification',
        lastGenerated: '2024-03-17T14:00:00Z',
        filters: {
            dateRange: true,
            unit: true,
            category: true
        }
    }
];

export const REPORT_TYPES = [
    { value: 'attendance', label: 'Presença' },
    { value: 'workload', label: 'Carga Horária' },
    { value: 'instructor', label: 'Instrutores' },
    { value: 'certification', label: 'Certificações' }
];

export const getReports = async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredReports = [...MOCK_REPORTS];

    if (filters.type) {
        filteredReports = filteredReports.filter(report => report.type === filters.type);
    }

    if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredReports = filteredReports.filter(report =>
            report.title.toLowerCase().includes(search) ||
            report.description.toLowerCase().includes(search)
        );
    }

    return filteredReports;
};

const generatePDF = (reportData) => {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(16);
    doc.text(reportData.title || 'Relatório', 14, 15);
    
    // Informações do relatório
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date(reportData.generatedAt).toLocaleString('pt-BR')}`, 14, 25);
    doc.text(`Tipo: ${reportData.type}`, 14, 30);
    
    // Filtros aplicados
    if (reportData.filters) {
        let filterText = 'Filtros: ';
        if (reportData.filters.startDate) {
            filterText += `Período: ${new Date(reportData.filters.startDate).toLocaleDateString('pt-BR')}`;
        }
        if (reportData.filters.unit) {
            filterText += ` | Unidade: ${reportData.filters.unit}`;
        }
        doc.text(filterText, 14, 35);
    }
    
    // Tabela de dados
    const tableData = reportData.data.map(item => [
        item.id,
        item.name,
        item.value.toFixed(2)
    ]);
    
    doc.autoTable({
        startY: 45,
        head: [['ID', 'Nome', 'Valor']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
    });
    
    return doc;
};

const generateExcel = (reportData) => {
    // Preparar os dados para o Excel
    const worksheetData = reportData.data.map(item => {
        // Mapear os dados de acordo com o tipo de relatório
        switch (reportData.type) {
            case 'attendance':
                return {
                    'ID': item.id,
                    'Treinamento': item.name,
                    'Presença (%)': item.value,
                    'Status': item.status
                };
            case 'workload':
                return {
                    'ID': item.id,
                    'Colaborador': item.name,
                    'Carga Horária': item.value,
                    'Cargo': item.cargo
                };
            case 'instructor':
                return {
                    'ID': item.id,
                    'Instrutor': item.name,
                    'Avaliação': item.value,
                    'Nº Avaliações': item.avaliacoes
                };
            case 'certification':
                return {
                    'ID': item.id,
                    'Unidade': item.name,
                    'Total Certificados': item.value,
                    'Status': item.certificados
                };
            default:
                return item;
        }
    });

    // Criar planilha
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    
    // Adicionar metadados
    wb.Props = {
        Title: reportData.title,
        Subject: "Relatório de Treinamentos",
        Author: "Sistema de Treinamentos",
        CreatedDate: new Date()
    };
    
    // Adicionar planilha ao workbook
    XLSX.utils.book_append_sheet(wb, ws, reportData.title);
    
    // Ajustar largura das colunas
    const colWidths = Object.keys(worksheetData[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    return wb;
};

export const downloadReport = async (reportData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
        const format = reportData.format;
        const fileName = `relatorio_${reportData.type}_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        
        if (format === 'excel') {
            const wb = generateExcel(reportData);
            XLSX.writeFile(wb, fileName);
        } else {
            const doc = generatePDF(reportData);
            doc.save(fileName);
        }
        
        return {
            success: true,
            fileName,
            message: `Relatório ${fileName} baixado com sucesso!`
        };
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        throw new Error('Erro ao gerar o relatório. Tente novamente.');
    }
};

export const generateReport = async (type, filters) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockData = {
        attendance: [
            { id: 1, name: 'Treinamento React', value: 85.5, status: 'Concluído' },
            { id: 2, name: 'Workshop UX/UI', value: 92.3, status: 'Em andamento' },
            { id: 3, name: 'Curso de Liderança', value: 78.9, status: 'Concluído' }
        ],
        workload: [
            { id: 1, name: 'João Silva', value: 45.5, cargo: 'Analista' },
            { id: 2, name: 'Maria Santos', value: 32.0, cargo: 'Desenvolvedor' },
            { id: 3, name: 'Pedro Souza', value: 28.5, cargo: 'Designer' }
        ],
        instructor: [
            { id: 1, name: 'Carlos Oliveira', value: 95.2, avaliacoes: 48 },
            { id: 2, name: 'Ana Paula', value: 88.7, avaliacoes: 35 },
            { id: 3, name: 'Roberto Lima', value: 91.4, avaliacoes: 42 }
        ],
        certification: [
            { id: 1, name: 'Matriz', value: 125, certificados: 'Ativos' },
            { id: 2, name: 'Filial 1', value: 85, certificados: 'Ativos' },
            { id: 3, name: 'Filial 2', value: 62, certificados: 'Ativos' }
        ]
    };

    const reportData = {
        type,
        title: REPORT_TYPES.find(t => t.value === type)?.label || 'Relatório',
        generatedAt: new Date().toISOString(),
        filters,
        data: mockData[type] || []
    };

    return reportData;
}; 