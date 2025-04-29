/**
 * Implementação de banco de dados robusto para o site Quarentei da Bruna
 * Esta implementação usa Google Sheets como armazenamento persistente.
 */

import { google } from 'googleapis';

// Configuração da autenticação com Google Sheets
// As credenciais devem ser configuradas como variáveis de ambiente no Vercel
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Substituir \n por quebras de linha reais
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Confirmacoes'; // Nome da aba onde os dados serão armazenados

// Escopos necessários para a API do Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Função para obter o cliente autenticado do Google Sheets
const getSheetsClient = async () => {
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY || !SHEET_ID) {
    throw new Error('Credenciais do Google Sheets não configuradas nas variáveis de ambiente.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: SERVICE_ACCOUNT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: SCOPES,
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  return sheets;
};

// Mapeamento das colunas na planilha (ajuste conforme necessário)
const COLUMN_MAP = {
  id: 0,
  nome: 1,
  email: 2,
  telefone: 3,
  acompanhantes: 4,
  acompanhantesConfirmados: 5, // Armazenar como JSON string
  mensagem: 6,
  naoComparecera: 7,
  dataConfirmacao: 8,
  grupo: 9,
};

// Função auxiliar para converter linha da planilha em objeto Confirmacao
const rowToConfirmation = (row) => {
  if (!row || row.length === 0) return null;
  try {
    return {
      id: row[COLUMN_MAP.id] || '',
      nome: row[COLUMN_MAP.nome] || '',
      email: row[COLUMN_MAP.email] || '',
      telefone: row[COLUMN_MAP.telefone] || '',
      acompanhantes: parseInt(row[COLUMN_MAP.acompanhantes] || '0', 10),
      acompanhantesConfirmados: JSON.parse(row[COLUMN_MAP.acompanhantesConfirmados] || '{}'),
      mensagem: row[COLUMN_MAP.mensagem] || '',
      naoComparecera: row[COLUMN_MAP.naoComparecera] === 'TRUE',
      dataConfirmacao: row[COLUMN_MAP.dataConfirmacao] || '',
      grupo: row[COLUMN_MAP.grupo] || '',
    };
  } catch (error) {
    console.error('Erro ao converter linha para confirmação:', row, error);
    return null; // Retorna null se houver erro na conversão (ex: JSON inválido)
  }
};

// Função auxiliar para converter objeto Confirmacao em linha para a planilha
const confirmationToRow = (confirmation) => {
  const row = [];
  row[COLUMN_MAP.id] = confirmation.id;
  row[COLUMN_MAP.nome] = confirmation.nome;
  row[COLUMN_MAP.email] = confirmation.email;
  row[COLUMN_MAP.telefone] = confirmation.telefone;
  row[COLUMN_MAP.acompanhantes] = confirmation.acompanhantes;
  row[COLUMN_MAP.acompanhantesConfirmados] = JSON.stringify(confirmation.acompanhantesConfirmados || {});
  row[COLUMN_MAP.mensagem] = confirmation.mensagem;
  row[COLUMN_MAP.naoComparecera] = confirmation.naoComparecera ? 'TRUE' : 'FALSE';
  row[COLUMN_MAP.dataConfirmacao] = confirmation.dataConfirmacao;
  row[COLUMN_MAP.grupo] = confirmation.grupo;
  // Garantir que a linha tenha o tamanho correto preenchendo com strings vazias
  const maxColIndex = Math.max(...Object.values(COLUMN_MAP));
  for (let i = 0; i <= maxColIndex; i++) {
    if (row[i] === undefined || row[i] === null) {
      row[i] = '';
    }
  }
  return row;
};

/**
 * Obtém todas as confirmações do Google Sheets
 * @returns {Promise<Array>} Lista de confirmações
 */
export const getAllConfirmations = async () => {
  try {
    const sheets = await getSheetsClient();
    const range = `${SHEET_NAME}!A2:J`; // Começa da linha 2 para ignorar cabeçalho

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('Nenhuma confirmação encontrada na planilha.');
      return [];
    }

    // Mapear linhas para objetos de confirmação, filtrando nulos
    const confirmations = rows.map(rowToConfirmation).filter(conf => conf !== null);
    console.log(`Retornando ${confirmations.length} confirmações da planilha.`);
    return confirmations;

  } catch (error) {
    console.error('Erro ao obter confirmações do Google Sheets:', error);
    // Em caso de erro, retorna array vazio para não quebrar a aplicação
    return [];
  }
};

/**
 * Salva uma nova confirmação ou atualiza uma existente no Google Sheets
 * @param {Object} confirmation Dados da confirmação
 * @returns {Promise<Object>} Resultado da operação
 */
export const saveConfirmation = async (confirmation) => {
  try {
    const sheets = await getSheetsClient();
    const range = `${SHEET_NAME}!A:J`; // Ler a planilha inteira para encontrar a linha

    // Ler dados existentes para encontrar se a confirmação já existe
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: range,
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row && row[COLUMN_MAP.id] === confirmation.id);

    const newRowData = confirmationToRow(confirmation);

    if (rowIndex >= 0) {
      // Atualizar linha existente (rowIndex é 0-based, mas a planilha é 1-based)
      const updateRange = `${SHEET_NAME}!A${rowIndex + 1}:J${rowIndex + 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: updateRange,
        valueInputOption: 'USER_ENTERED', // ou 'RAW'
        requestBody: {
          values: [newRowData],
        },
      });
      console.log(`Confirmação atualizada na linha ${rowIndex + 1}: ${confirmation.id}`);
    } else {
      // Adicionar nova linha
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A:J`, // Append anexa na próxima linha vazia
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [newRowData],
        },
      });
      console.log(`Nova confirmação adicionada: ${confirmation.id}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar confirmação no Google Sheets:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Exclui uma confirmação do Google Sheets (limpando a linha)
 * @param {string} id ID da confirmação
 * @returns {Promise<Object>} Resultado da operação
 */
export const deleteConfirmation = async (id) => {
  try {
    const sheets = await getSheetsClient();
    const range = `${SHEET_NAME}!A:A`; // Ler apenas a coluna de IDs

    // Ler IDs para encontrar a linha a ser excluída
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: range,
    });

    const ids = response.data.values ? response.data.values.flat() : [];
    const rowIndex = ids.findIndex(rowId => rowId === id);

    if (rowIndex < 0) {
      console.log(`Confirmação não encontrada para exclusão: ${id}`);
      return { success: false, message: 'Confirmação não encontrada' };
    }

    // Limpar a linha encontrada (rowIndex é 0-based, planilha é 1-based)
    // Nota: A linha 0 geralmente é o cabeçalho, então a primeira linha de dados é rowIndex=1
    const clearRange = `${SHEET_NAME}!A${rowIndex + 1}:J${rowIndex + 1}`;
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SHEET_ID,
      range: clearRange,
    });

    console.log(`Confirmação excluída (linha ${rowIndex + 1} limpa): ${id}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir confirmação do Google Sheets:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Limpa todas as confirmações do Google Sheets (exceto cabeçalho)
 * @returns {Promise<Object>} Resultado da operação
 */
export const clearAllConfirmations = async () => {
  try {
    const sheets = await getSheetsClient();
    const clearRange = `${SHEET_NAME}!A2:J`; // Limpar da linha 2 em diante

    await sheets.spreadsheets.values.clear({
      spreadsheetId: SHEET_ID,
      range: clearRange,
    });

    console.log('Todas as confirmações foram limpas da planilha (exceto cabeçalho).');
    return { success: true };
  } catch (error) {
    console.error('Erro ao limpar confirmações do Google Sheets:', error);
    return { success: false, error: error.message };
  }
};

// Funções syncData e initializeDatabase não são mais necessárias com Google Sheets
// Mantendo a exportação para compatibilidade, mas podem ser removidas se não usadas
export const syncData = async (localData) => {
  console.warn('syncData não é mais necessário com Google Sheets');
  // Apenas retorna os dados atuais da planilha para manter a interface
  const data = await getAllConfirmations();
  return { success: true, data };
};

// A inicialização agora acontece implicitamente ao chamar as funções

