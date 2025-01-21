const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class UploadService {
    constructor() {
        this.uploadDir = path.join(__dirname, '..', 'uploads');
        this.ensureUploadDirectoryExists();
    }

    ensureUploadDirectoryExists() {
        try {
            if (!fs.existsSync(this.uploadDir)) {
                fs.mkdirSync(this.uploadDir, { recursive: true });
                console.log('Diretório de uploads criado:', this.uploadDir);
            }
        } catch (error) {
            console.error('Erro ao criar diretório de uploads:', error);
            throw error;
        }
    }

    async saveBase64Image(base64String, prefix = '') {
        try {
            // Remove o cabeçalho da string base64 se existir
            const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
            
            // Gera um nome único para o arquivo
            const fileName = `${prefix}_${crypto.randomBytes(16).toString('hex')}.jpg`;
            const filePath = path.join(this.uploadDir, fileName);

            // Salva o arquivo
            await fs.promises.writeFile(filePath, base64Data, 'base64');
            console.log('Imagem salva com sucesso:', filePath);

            return fileName;
        } catch (error) {
            console.error('Erro ao salvar imagem:', error);
            throw error;
        }
    }

    async deleteFile(fileName) {
        try {
            const filePath = path.join(this.uploadDir, fileName);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
                console.log('Arquivo deletado com sucesso:', filePath);
            }
        } catch (error) {
            console.error('Erro ao deletar arquivo:', error);
            throw error;
        }
    }

    getFilePath(fileName) {
        const filePath = path.join(this.uploadDir, fileName);
        console.log('Caminho do arquivo solicitado:', filePath);
        return filePath;
    }
}

module.exports = new UploadService(); 