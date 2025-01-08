import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx-js-style';
import { getClasses } from './classService';
import viteLogo from '/vite.svg';

export const REPORT_TYPES = [
    { value: 'attendance_list', label: 'Lista de Presença Digital' }
];

// Função auxiliar para formatar data
const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getReports = async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        
        // Mapear os filtros para o formato esperado pelo getClasses
        const classFilters = {
            // Busca combinada de nome ou código do treinamento
            search: filters.trainingName || filters.trainingCode,
            
            // Filtro de tipos de treinamento
            types: filters.classType ? [{ value: filters.classType }] : [],
            
            // Filtro de unidade
            units: filters.unit ? [{ value: filters.unit }] : [],
            
            // Filtros de data
            startDate: filters.startDate,
            endDate: filters.endDate,
            
            // Filtro de instrutor
            instructor: filters.instructor,
            
            // Filtro de fornecedor
            provider: filters.provider
        };
        
        const classes = await getClasses(classFilters);
        
        return Array.isArray(classes) ? classes : [];
    } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
        return [];
    }
};

const generateAttendanceListContent = (doc, classData) => {
    // Mover todo o código de geração do conteúdo para cá
    // (todo o código que estava em generateAttendanceListPDF, exceto a criação do doc)
    
    // Configurações de cores
    const primaryColor = [0, 82, 156];
    const secondaryColor = [128, 128, 128];
    const backgroundColor = [240, 240, 240];
    
    // Margens ajustadas
    const margin = 7;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Adicionar logo
    const logoUrl = new URL('/logo.png', window.location.origin).href;
    doc.addImage(logoUrl, 'PNG', margin, margin, 10, 10);
    
    // Título principal
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Lista de Presença Digital', 20, margin + 7);
    
    // Linhas de informação em formato de grid
    const startY = margin + 15;
    const lineHeight = 12;
    const colWidth = (pageWidth - (margin * 2)) / 4;
    
    // Função para renderizar campo com label
    const renderField = (label, value, x, y, width) => {
        // Fundo cinza claro
        doc.setFillColor(...backgroundColor);
        doc.rect(x, y, width, lineHeight, 'F');
        
        // Label
        doc.setFontSize(8);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text(label, x + 1, y + 4);
        
        // Valor
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(value || '-', x + 1, y + 9);
    };
    
    // Primeira linha
    renderField('Treinamento:', classData.training.name, margin, startY, colWidth);
    renderField('Código:', classData.training.code, margin + colWidth, startY, colWidth);
    renderField('Data Início:', formatDate(classData.date_start), margin + (colWidth * 2), startY, colWidth);
    renderField('Duração:', classData.training.duration, margin + (colWidth * 3), startY, colWidth);
    
    // Segunda linha
    renderField('Instrutor:', classData.instructor.name, margin, startY + lineHeight, colWidth);
    renderField('Unidade:', classData.unit, margin + colWidth, startY + lineHeight, colWidth);
    renderField('Fornecedor:', classData.training.provider, margin + (colWidth * 2), startY + lineHeight, colWidth);
    renderField('Status:', classData.status, margin + (colWidth * 3), startY + lineHeight, colWidth);
    
    // Conteúdo e Objetivo em duas colunas
    const contentY = startY + (lineHeight * 2);
    const contentHeight = 15;
    
    // Conteúdo Programático
    doc.setFillColor(...backgroundColor);
    doc.rect(margin, contentY, pageWidth/2 - margin, contentHeight, 'F');
    doc.setFontSize(8);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Conteúdo Programático:', margin + 1, contentY + 4);
    doc.setTextColor(0, 0, 0);
    doc.text(classData.training.content, margin + 1, contentY + 9, {
        maxWidth: pageWidth/2 - margin - 4
    });
    
    // Objetivo - Começa exatamente onde termina o Conteúdo Programático
    doc.setFillColor(...backgroundColor);
    doc.rect(pageWidth/2, contentY, pageWidth/2 - margin, contentHeight, 'F');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Objetivo:', pageWidth/2 + 1, contentY + 4);
    doc.setTextColor(0, 0, 0);
    doc.text(classData.training.objective, pageWidth/2 + 1, contentY + 9, {
        maxWidth: pageWidth/2 - margin - 4
    });
    
    // Lista de presença
    const tableStartY = contentY + contentHeight + 5;
    const tableData = classData.attendees.map((attendee, index) => [
        (index + 1).toString(),
        attendee.name,
        attendee.registration,
        attendee.position,
        `Assinado Digitalmente em ${formatDate(attendee.timestamp)}`,
        attendee.early_leave ? `Saída Antecipada: ${formatDate(attendee.early_leave_time)}` : ''
    ]);
    
    // Tabela ocupando toda a largura disponível
    doc.autoTable({
        startY: tableStartY,
        head: [['Nº', 'Nome', 'Matrícula', 'Cargo', 'Assinatura', 'Observações']],
        body: tableData,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 1,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
            minCellHeight: 6
        },
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'left',
            cellPadding: 2
        },
        // Recálculo das larguras das colunas
        // A página A4 em paisagem tem 297mm de largura
        // Subtraindo as margens (7mm * 2 = 14mm), temos 283mm disponíveis
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' },     // Nº
            1: { cellWidth: 75 },                       // Nome
            2: { cellWidth: 35 },                       // Matrícula
            3: { cellWidth: 40 },                       // Cargo
            4: { cellWidth: 70 },                       // Assinatura
            5: { cellWidth: 51 }                        // Observações
            // Total: 283mm (12 + 75 + 35 + 40 + 70 + 51 = 283)
        },
        alternateRowStyles: {
            fillColor: [248, 248, 248]
        },
        margin: { left: margin, right: margin },
        tableWidth: pageWidth - (margin * 2), // Forçar largura total
        startX: margin,
        didDrawCell: function(data) {
            if (data.cell.styles.lineWidth > 0.1) {
                data.cell.styles.lineWidth = 0.1;
            }
        }
    });
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(128, 128, 128);
        doc.text(
            `Página ${i} de ${pageCount} - Gerado em ${formatDate(new Date())}`,
            pageWidth/2,
            pageHeight - 3,
            { align: 'center' }
        );
    }
};

// Manter a função original para compatibilidade, mas simplificada
const generateAttendanceListPDF = (classData) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });
    
    generateAttendanceListContent(doc, classData);
    return doc;
};

const generateAttendanceListExcel = (classes) => {
    const wb = XLSX.utils.book_new();
    let allData = [];

    // Título principal
    allData.push([{
        v: 'LISTA DE PRESENÇA DIGITAL',
        s: {
            font: { bold: true, sz: 16, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '4F81BD' } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } }
            }
        }
    }]);
    allData.push([]);

    classes.forEach((classData, index) => {
        if (index > 0) {
            allData.push([]);
            allData.push([]);
        }

        // Cabeçalho da seção com destaque maior
        allData.push([{
            v: `Informações do Treinamento - ${classData.training.code}`,
            s: {
                font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
                fill: { fgColor: { rgb: '1F4E79' } },
                alignment: { horizontal: 'center', vertical: 'center' },
                border: {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } }
                }
            }
        }]);

        // Estilos refinados
        const labelStyle = {
            font: { bold: true, sz: 10, color: { rgb: '1F4E79' } },
            fill: { fgColor: { rgb: 'F8FAFC' } },
            alignment: { horizontal: 'right', vertical: 'center' },
            border: { bottom: { style: 'thin', color: { rgb: 'E2E8F0' } } }
        };

        const valueStyle = {
            font: { sz: 10 },
            fill: { fgColor: { rgb: 'FFFFFF' } },
            alignment: { horizontal: 'left', vertical: 'center' },
            border: { bottom: { style: 'thin', color: { rgb: 'E2E8F0' } } }
        };

        // Informações do treinamento em formato de grid
        allData.push([
            { v: 'Treinamento:', s: labelStyle },
            { v: classData.training.name, s: valueStyle },
            { v: 'Código:', s: labelStyle },
            { v: classData.training.code, s: valueStyle },
            { v: 'Data:', s: labelStyle },
            { v: formatDate(classData.date_start), s: valueStyle }
        ]);

        allData.push([
            { v: 'Instrutor:', s: labelStyle },
            { v: classData.instructor.name, s: valueStyle },
            { v: 'Unidade:', s: labelStyle },
            { v: classData.unit, s: valueStyle },
            { v: 'Duração:', s: labelStyle },
            { v: classData.training.duration, s: valueStyle }
        ]);

        allData.push([
            { v: 'Fornecedor:', s: labelStyle },
            { v: classData.training.provider, s: valueStyle },
            { v: 'Status:', s: labelStyle },
            { v: classData.status, s: valueStyle },
            { v: '', s: valueStyle },
            { v: '', s: valueStyle }
        ]);

        allData.push([{ v: '', s: { border: { bottom: { style: 'none' } } } }]);

        // Cabeçalho da tabela
        const tableHeaderStyle = {
            font: { bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '444444' } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } }
            }
        };

        // Estilo para células de dados
        const dataCellStyle = {
            font: { sz: 10 },
            alignment: { vertical: 'center', wrapText: true },
            border: {
                bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
                left: { style: 'thin', color: { rgb: 'E2E8F0' } },
                right: { style: 'thin', color: { rgb: 'E2E8F0' } }
            }
        };

        // Cabeçalho da tabela
        allData.push([
            { v: 'Nº', s: tableHeaderStyle },
            { v: 'Nome', s: tableHeaderStyle },
            { v: 'Matrícula', s: tableHeaderStyle },
            { v: 'Cargo', s: tableHeaderStyle },
            { v: 'Assinatura', s: tableHeaderStyle },
            { v: 'Observações', s: tableHeaderStyle }
        ]);

        // Dados dos participantes
        classData.attendees.forEach((attendee, idx) => {
            allData.push([
                { v: idx + 1, s: { ...dataCellStyle, alignment: { horizontal: 'center', vertical: 'center' } } },
                { v: attendee.name, s: dataCellStyle },
                { v: attendee.registration, s: dataCellStyle },
                { v: attendee.position, s: dataCellStyle },
                { v: `Assinado Digitalmente em ${formatDate(attendee.timestamp)}`, s: dataCellStyle },
                { v: attendee.early_leave ? `Saída Antecipada: ${formatDate(attendee.early_leave_time)}` : '', s: dataCellStyle }
            ]);
        });
    });

    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Ajuste nas larguras das colunas
    ws['!cols'] = [
        { wch: 20 },    // A - Nº
        { wch: 40 },   // B - Nome
        { wch: 12 },   // C - Matrícula
        { wch: 20 },   // D - Cargo
        { wch: 40 },   // E - Assinatura
        { wch: 40 }    // F - Observações
    ];

    // Ajuste nas alturas das linhas
    ws['!rows'] = allData.map(() => ({ hpt: 25 })); // Altura padrão para todas as linhas

    // Mesclar células do título e cabeçalhos de seção
    if (!ws['!merges']) ws['!merges'] = [];
    
    // Mesclar título principal
    ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });

    // Mesclar cabeçalhos de seção
    let currentRow = 2; // Começa após o título e linha em branco
    classes.forEach((classData) => {
        // Mesclar o cabeçalho da seção atual
        ws['!merges'].push({
            s: { r: currentRow, c: 0 },
            e: { r: currentRow, c: 5 }
        });

        // Calcular a próxima posição
        // 6 linhas fixas: cabeçalho + 3 linhas de info + linha em branco + cabeçalho da tabela
        const fixedRows = 6;
        // Avançar para a próxima seção: linhas fixas + número de participantes + 2 linhas de espaço
        currentRow += fixedRows + classData.attendees.length + 2;
    });

    // Adicionar a worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Listas de Presença');

    // Gerar o arquivo
    const fileName = classes.length > 1 
        ? `listas_presenca_${new Date().getTime()}.xlsx`
        : `lista_presenca_${classes[0].training.code}_${new Date().getTime()}.xlsx`;

    XLSX.writeFile(wb, fileName);
};

export const downloadReport = async (reportData) => {
    try {
        let classesToProcess = [];
        
        if (reportData.selectedClasses?.length > 0) {
            classesToProcess = reportData.selectedClasses;
        } else if (reportData.allClasses?.length > 0) {
            classesToProcess = reportData.allClasses;
        } else if (reportData.classData) {
            classesToProcess = [reportData.classData];
        }

        if (classesToProcess.length > 0) {
            // Verificar o formato solicitado
            if (reportData.format === 'excel') {
                generateAttendanceListExcel(classesToProcess);
            } else {
                // Criar documento PDF (código existente)
                const doc = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4'
                });

                classesToProcess.forEach((classData, index) => {
                    if (index > 0) {
                        doc.addPage();
                    }
                    generateAttendanceListContent(doc, classData);
                });

                const fileName = classesToProcess.length > 1 
                    ? `listas_presenca_${new Date().getTime()}.pdf`
                    : `lista_presenca_${classesToProcess[0].training.code}_${new Date().getTime()}.pdf`;
                
                doc.save(fileName);
            }
        }
        
        return {
            success: true,
            message: 'Relatório(s) gerado(s) com sucesso!'
        };
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        throw new Error('Erro ao gerar o relatório. Tente novamente.');
    }
}; 