export interface Confirmacao {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  acompanhantes: number;
  acompanhantesConfirmados: Record<string, boolean>;
  mensagem: string;
  naoComparecera: boolean;
  dataConfirmacao: string;
  grupo?: string;
}

// Chaves para armazenamento local (atualizadas para v3)
const LOCAL_STORAGE_KEY = 'quarentei_confirmations_v3';
const LOCAL_STORAGE_LAST_SYNC_KEY = 'quarentei_last_sync_v3';

// Função para gerar dados de amostra
export function gerarDadosAmostra(): Confirmacao[] {
  return [
    {
      id: 'amostra_1',
      nome: 'Bruna Araujo',
      email: 'bruna@exemplo.com',
      telefone: '(11) 99999-9999',
      acompanhantes: 0,
      acompanhantesConfirmados: {},
      mensagem: 'Ansiosa para a festa!',
      naoComparecera: false,
      dataConfirmacao: new Date().toISOString(),
      grupo: 'Família'
    }
  ];
}

// Função para salvar confirmações no localStorage
export function salvarConfirmacoes(confirmacoes: Confirmacao[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(confirmacoes));
    localStorage.setItem(LOCAL_STORAGE_LAST_SYNC_KEY, new Date().toISOString());
  } catch (e) {
    console.error('Erro ao salvar confirmações no localStorage:', e);
  }
}

// Função para carregar confirmações do localStorage
export function carregarConfirmacoes(): Confirmacao[] {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (e) {
    console.error('Erro ao carregar confirmações do localStorage:', e);
  }
  
  // Se não houver dados ou ocorrer erro, retornar dados de amostra
  const dadosAmostra = gerarDadosAmostra();
  salvarConfirmacoes(dadosAmostra);
  return dadosAmostra;
}

// Função para adicionar ou atualizar uma confirmação
export function salvarConfirmacao(confirmacao: Confirmacao): void {
  try {
    const confirmacoes = carregarConfirmacoes();
    const index = confirmacoes.findIndex(c => c.id === confirmacao.id);
    
    if (index >= 0) {
      // Atualizar confirmação existente
      confirmacoes[index] = confirmacao;
    } else {
      // Adicionar nova confirmação
      confirmacoes.push(confirmacao);
    }
    
    salvarConfirmacoes(confirmacoes);
  } catch (e) {
    console.error('Erro ao salvar confirmação:', e);
  }
}

// Função para excluir uma confirmação
export function excluirConfirmacao(id: string): void {
  try {
    const confirmacoes = carregarConfirmacoes();
    const novasConfirmacoes = confirmacoes.filter(c => c.id !== id);
    
    if (novasConfirmacoes.length < confirmacoes.length) {
      salvarConfirmacoes(novasConfirmacoes);
    }
  } catch (e) {
    console.error('Erro ao excluir confirmação:', e);
  }
}

// Função para limpar todas as confirmações (exceto dados de amostra)
export function limparConfirmacoes(): void {
  try {
    const dadosAmostra = gerarDadosAmostra();
    salvarConfirmacoes(dadosAmostra);
  } catch (e) {
    console.error('Erro ao limpar confirmações:', e);
  }
}

// Função para sincronizar confirmações entre dispositivos via API
export async function sincronizarConfirmacoes(): Promise<Confirmacao[]> {
  try {
    // Carregar confirmações locais
    const confirmacoes = carregarConfirmacoes();
    
    // Enviar para API para sincronização
    const response = await fetch('/api/save-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ syncData: confirmacoes })
    });
    
    if (!response.ok) {
      throw new Error('Falha ao sincronizar confirmações com o servidor');
    }
    
    const result = await response.json();
    if (result.success && result.data) {
      // Atualizar localStorage com dados sincronizados
      salvarConfirmacoes(result.data);
      return result.data;
    }
    
    return confirmacoes;
  } catch (error) {
    console.error('Erro ao sincronizar confirmações:', error);
    return carregarConfirmacoes();
  }
}
