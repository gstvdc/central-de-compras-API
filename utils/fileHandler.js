import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readData = async (fileName) => {
  const filePath = path.join(__dirname, '..', 'db', fileName);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    try {
      return JSON.parse(data);
    } catch (parseErr) {
      // Se o JSON estiver inválido, movemos o arquivo para um backup antes de sobrescrever
      try {
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `${fileName}.corrupt.${ts}.json`;
        const backupPath = path.join(__dirname, '..', 'db', backupName);
        await fs.rename(filePath, backupPath);
        console.error(`Arquivo ${fileName} contem JSON invalido. Movido para backup: ${backupName}`);
      } catch (moveErr) {
        console.error(`Falha ao mover arquivo corrompido ${fileName} para backup:`, moveErr);
      }
      // Escreve um array vazio formatado para retomar operação
      await fs.writeFile(filePath, JSON.stringify([], null, 2) + '\n', 'utf-8');
      return [];
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Cria arquivo com JSON formatado
      await fs.writeFile(filePath, JSON.stringify([], null, 2) + '\n', 'utf-8');
      return [];
    }
    console.error(`Erro ao ler o arquivo ${fileName}:`, error);
    throw error;
  }
};

const writeData = async (fileName, data) => {
  const filePath = path.join(__dirname, '..', 'db', fileName);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  } catch (error) {
    console.error(`Erro ao escrever no arquivo ${fileName}:`, error);
    throw error;
  }
};

export { readData, writeData };