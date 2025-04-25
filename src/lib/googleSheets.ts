// Este arquivo será responsável pela integração com a planilha Google

export interface Convidado {
  id: string;
  nome: string;
  grupo: string;
  acompanhantes: string[];
  email?: string;
  telefone?: string;
  mensagem?: string;
  confirmado?: boolean;
  dataConfirmacao?: string;
}

export interface Presente {
  id: string;
  nome: string;
  valor: number;
  presenteador?: string;
  email?: string;
  dataConfirmacao?: string;
}

// URL da planilha: https://docs.google.com/spreadsheets/d/12D3MbOt77ufDQd87r3FIXE7qS-PJjNfVwk6pOk35F60/edit?usp=drivesdk

// Em um ambiente de produção, usaríamos a API do Google Sheets
// Para este protótipo, vamos simular a integração

export async function buscarConvidado(nome: string): Promise<Convidado | null> {
  // Simulação de busca na planilha
  // Em produção, isso seria uma chamada real à API do Google Sheets
  
  // Simulando um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulando alguns convidados para teste
  const convidadosTeste = [
    {
      id: '1',
      nome: 'Bruna Silva',
      grupo: 'Aniversariante',
      acompanhantes: [],
    },
    {
      id: '2',
      nome: 'João Silva',
      grupo: 'Família',
      acompanhantes: ['Maria Silva', 'Pedro Silva'],
    },
    {
      id: '3',
      nome: 'Ana Souza',
      grupo: 'Amigos',
      acompanhantes: ['Carlos Souza'],
    },
    {
      id: '4',
      nome: 'Teste',
      grupo: 'Teste',
      acompanhantes: ['Acompanhante Teste 1', 'Acompanhante Teste 2'],
    }
  ];
  
  const nomeLowerCase = nome.toLowerCase();
  const convidado = convidadosTeste.find(c => 
    c.nome.toLowerCase().includes(nomeLowerCase)
  );
  
  return convidado || null;
}

export async function salvarConfirmacao(dados: {
  convidado: Convidado;
  email: string;
  telefone: string;
  mensagem?: string;
  acompanhantesConfirmados: string[];
}): Promise<boolean> {
  // Simulação de salvamento na planilha
  // Em produção, isso seria uma chamada real à API do Google Sheets
  
  // Simulando um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulando sucesso
  return true;
}

export async function salvarPresente(dados: {
  presente: string;
  valor: number;
  presenteador: string;
  email: string;
}): Promise<boolean> {
  // Simulação de salvamento na planilha
  // Em produção, isso seria uma chamada real à API do Google Sheets
  
  // Simulando um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulando sucesso
  return true;
}

export async function obterConfirmacoes(): Promise<Convidado[]> {
  // Simulação de busca na planilha
  // Em produção, isso seria uma chamada real à API do Google Sheets
  
  // Simulando um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulando alguns convidados confirmados para teste
  return [
    {
      id: '1',
      nome: 'Bruna Silva',
      grupo: 'Aniversariante',
      acompanhantes: [],
      email: 'bruna@exemplo.com',
      telefone: '(21) 99999-9999',
      confirmado: true,
      dataConfirmacao: new Date().toISOString(),
    },
    {
      id: '2',
      nome: 'João Silva',
      grupo: 'Família',
      acompanhantes: ['Maria Silva'],
      email: 'joao@exemplo.com',
      telefone: '(21) 88888-8888',
      mensagem: 'Parabéns Bruna! Estamos ansiosos pela festa!',
      confirmado: true,
      dataConfirmacao: new Date(Date.now() - 86400000).toISOString(), // Ontem
    }
  ];
}

export async function obterPresentes(): Promise<Presente[]> {
  // Simulação de busca na planilha
  // Em produção, isso seria uma chamada real à API do Google Sheets
  
  // Simulando um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulando alguns presentes para teste
  return [
    {
      id: '1',
      nome: 'Viagem às Maldivas',
      valor: 500,
      presenteador: 'Carlos Oliveira',
      email: 'carlos@exemplo.com',
      dataConfirmacao: new Date().toISOString(),
    },
    {
      id: '2',
      nome: 'Day Spa de Diva',
      valor: 150,
      presenteador: 'Fernanda Santos',
      email: 'fernanda@exemplo.com',
      dataConfirmacao: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
    }
  ];
}
