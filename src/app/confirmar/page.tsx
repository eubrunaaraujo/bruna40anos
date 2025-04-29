
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatarData } from '@/utils/stringUtils';

// --- Static Guest Data (Copied from /api/google-sheets/route.ts) ---
function getStaticConvidadosData() {
  console.log('Usando dados estáticos de convidados');
  
  // Lista estática de convidados com seus respectivos grupos
  const LISTA_CONVIDADOS = {
    // Grupo A
    "Sandra Lucia de Araujo Pereira": { grupo: "A", bebê: false },
    "Sandra Lucia": { grupo: "A", bebê: false },
    "Sandra": { grupo: "A", bebê: false },
    
    // Grupo B
    "Lisandra Araujo Baliano Vieira": { grupo: "B", bebê: false },
    "Lisandra": { grupo: "B", bebê: false },
    "Brenda Araujo Baliano Vieira": { grupo: "B", bebê: false },
    "Brenda": { grupo: "B", bebê: false },
    "Leonardo C Mendonça Baliano Vieira": { grupo: "B", bebê: false },
    "Leonardo": { grupo: "B", bebê: false },
    
    // Grupo C
    "Marimilia Cunha Mendonça": { grupo: "C", bebê: false },
    "Marimilia": { grupo: "C", bebê: false },
    
    // Grupo D
    "Maria da Penha Justo": { grupo: "D", bebê: false },
    "Maria": { grupo: "D", bebê: false },
    "Osmar Penha": { grupo: "D", bebê: false },
    "Osmar": { grupo: "D", bebê: false },
    
    // Grupo E
    "Priscilla Justo": { grupo: "E", bebê: false },
    "Priscilla": { grupo: "E", bebê: false },
    "Felipe C Mendonça Baliano Vieira": { grupo: "E", bebê: false },
    "Felipe": { grupo: "E", bebê: false },
    "Mirela Claudino Baliano Vieira": { grupo: "E", bebê: false },
    "Mirela": { grupo: "E", bebê: false },
    
    // Grupo F
    "Rafael Brito de Oliveira": { grupo: "F", bebê: false },
    "Rafael": { grupo: "F", bebê: false },
    
    // Grupo G
    "Ana Lucia Generoza": { grupo: "G", bebê: false },
    "Ana Lucia": { grupo: "G", bebê: false },
    "Ana": { grupo: "G", bebê: false },
    
    // Grupo H
    "Tayana Brito de Oliveira": { grupo: "H", bebê: false },
    "Tayana": { grupo: "H", bebê: false },
    "Gael Oliveira Brum": { grupo: "H", bebê: true },
    "Gael": { grupo: "H", bebê: true },
    "Ulysses Brum": { grupo: "H", bebê: false },
    "Ulysses": { grupo: "H", bebê: false },
    
    // Grupo I
    "Daniele Fernanda Pacheco": { grupo: "I", bebê: false },
    "Daniele Pacheco": { grupo: "I", bebê: false },
    "Daniele Fernanda": { grupo: "I", bebê: false },
    "Beatriz Pereira Pacheco": { grupo: "I", bebê: false },
    "Beatriz": { grupo: "I", bebê: false },
    "Bia": { grupo: "I", bebê: false },
    
    // Grupo J
    "Robson Pereira Junior": { grupo: "J", bebê: false },
    "Robson": { grupo: "J", bebê: false },
    "Janaina Oliveira": { grupo: "J", bebê: false },
    "Janaina": { grupo: "J", bebê: false },
    "Isabella Luiza Oliveira": { grupo: "J", bebê: false },
    "Isabella": { grupo: "J", bebê: false },
    "Bella": { grupo: "J", bebê: false },
    
    // Grupo K
    "Paulo Roberto de Araujo": { grupo: "K", bebê: false },
    "Paulo Roberto": { grupo: "K", bebê: false },
    "Paulo": { grupo: "K", bebê: false },
    
    // Grupo L
    "Lidia de Mello Teixeira": { grupo: "L", bebê: false },
    "Lidia": { grupo: "L", bebê: false },
    
    // Grupo M
    "Barbara de Mello Teixeira Estrela": { grupo: "M", bebê: false },
    "Barbara": { grupo: "M", bebê: false },
    "Bruno Willson Estrela": { grupo: "M", bebê: false },
    "Bruno Willson": { grupo: "M", bebê: false },
    "Arthur Estrela": { grupo: "M", bebê: true },
    
    // Grupo N
    "Denise Estrela": { grupo: "N", bebê: false },
    "Denise": { grupo: "N", bebê: false },
    
    // Grupo O
    "Fernanda de Mello Teixeira": { grupo: "O", bebê: false },
    "Fernanda Teixeira": { grupo: "O", bebê: false },
    "Leandro Gomez": { grupo: "O", bebê: false },
    "Leandro": { grupo: "O", bebê: false },
    
    // Grupo P
    "Amanda Teixeira": { grupo: "P", bebê: false },
    "Amanda": { grupo: "P", bebê: false },
    "Rafael Lima": { grupo: "P", bebê: false },
    "Igor Teixeira": { grupo: "P", bebê: false },
    "Igor": { grupo: "P", bebê: false },
    
    // Grupo Q
    "Paula Gonçalves Teixeira": { grupo: "Q", bebê: false },
    "Paula": { grupo: "Q", bebê: false },
    "Bruno de Hollanda Ferro": { grupo: "Q", bebê: false },
    "Bruno Ferro": { grupo: "Q", bebê: false },
    "Julia Ferro": { grupo: "Q", bebê: false },
    "Julia": { grupo: "Q", bebê: false },
    "Lucas Ferro": { grupo: "Q", bebê: false },
    "Lucas": { grupo: "Q", bebê: false },
    
    // Grupo R
    "Andreia Teixeira": { grupo: "R", bebê: false },
    "Andreia": { grupo: "R", bebê: false },
    "Marcio Bastos": { grupo: "R", bebê: false },
    "Marcio": { grupo: "R", bebê: false },
    "Gabriel Teixeira Bastos": { grupo: "R", bebê: false },
    "Gabriel Bastos": { grupo: "R", bebê: false },
    
    // Grupo S
    "Maristela Gonçalves": { grupo: "S", bebê: false },
    "Maristela": { grupo: "S", bebê: false },
    
    // Grupo T
    "Aline Reis de Sá": { grupo: "T", bebê: false },
    "Aline": { grupo: "T", bebê: false },
    
    // Grupo U
    "Erika Kristine Caldas Peixoto": { grupo: "U", bebê: false },
    "Erika": { grupo: "U", bebê: false },
    "Anderson Souza": { grupo: "U", bebê: false },
    "Agatha Peixoto Souza": { grupo: "U", bebê: true },
    "Agatha": { grupo: "U", bebê: true },
    
    // Grupo V
    "Rosana Barros de Araujo": { grupo: "V", bebê: false },
    "Rosana": { grupo: "V", bebê: false },
    
    // Grupo X
    "Tathiane Tonnera Goulart": { grupo: "X", bebê: false },
    "Tathiane": { grupo: "X", bebê: false },
    "Arthur Tonnera": { grupo: "X", bebê: true },
    "Eduardo Tonnera": { grupo: "X", bebê: false },
    "Eduardo": { grupo: "X", bebê: false },
    "Gabriel Tonnera": { grupo: "X", bebê: false },
    "Norimar Tonnera": { grupo: "X", bebê: false },
    "Norimar": { grupo: "X", bebê: false },
    
    // Grupo Z
    "Alexander Silva": { grupo: "Z", bebê: false },
    "Alexander": { grupo: "Z", bebê: false },
    
    // Grupo AB
    "Fabiana Vieira": { grupo: "AB", bebê: false },
    "Fabiana": { grupo: "AB", bebê: false },
    "Davi Pires": { grupo: "AB", bebê: false },
    "Davi": { grupo: "AB", bebê: false },
    
    // Grupo AC
    "Juliana Nunes Almeida": { grupo: "AC", bebê: false },
    "Juliana Nunes": { grupo: "AC", bebê: false },
    "Juliana Almeida": { grupo: "AC", bebê: false },
    
    // Grupo AD
    "Camila Souza Cruz": { grupo: "AD", bebê: false },
    "Camila": { grupo: "AD", bebê: false },
    "Rafael Souza Cruz": { grupo: "AD", bebê: false },
    "Rafael Cruz": { grupo: "AD", bebê: false },
    
    // Grupo AE
    "Cristiani Maria Cano da Silva": { grupo: "AE", bebê: false },
    "Cristiani": { grupo: "AE", bebê: false },
    "Daniel": { grupo: "AE", bebê: false },
    
    // Grupo AF
    "Danielle Mendes": { grupo: "AF", bebê: false },
    "Danielle": { grupo: "AF", bebê: false },
    "André Mendes": { grupo: "AF", bebê: false },
    "André": { grupo: "AF", bebê: false },
    
    // Grupo AG
    "Marcely Freire Cruz": { grupo: "AG", bebê: false },
    "Marcely": { grupo: "AG", bebê: false },
    "Marivaldo Cruz": { grupo: "AG", bebê: false },
    "Marivaldo": { grupo: "AG", bebê: false },
    
    // Grupo AH
    "Kassandra Bosio": { grupo: "AH", bebê: false },
    "Kassandra": { grupo: "AH", bebê: false },
    "Kyle Bartram": { grupo: "AH", bebê: false },
    "Kyle": { grupo: "AH", bebê: false },
    
    // Grupo AI
    "Raphael Cardoso": { grupo: "AI", bebê: false },
    "Raphael": { grupo: "AI", bebê: false },
    
    // Grupo AJ
    "Silvana Pontes da Cruz": { grupo: "AJ", bebê: false },
    "Silvana": { grupo: "AJ", bebê: false },
    "Daniel Albuka": { grupo: "AJ", bebê: false },
    "Daniel Albuka": { grupo: "AJ", bebê: false },
    
    // Grupo AK
    "Rayana Teixeira": { grupo: "AK", bebê: false },
    "Rayana": { grupo: "AK", bebê: false },
    
    // Grupo AL
    "Raphael Lopes de Jesus": { grupo: "AL", bebê: false },
    "Raphael Lopes": { grupo: "AL", bebê: false },
    "Raphael Jesus": { grupo: "AL", bebê: false },
    
    // Grupo AM
    "Rodrigo Rodrigues": { grupo: "AM", bebê: false },
    "Rodrigo": { grupo: "AM", bebê: false },
    
    // Grupo AN
    "Wallace de Oliveira Nascimento": { grupo: "AN", bebê: false },
    "Wallace": { grupo: "AN", bebê: false },
    "Arthur Alves de Oliveira": { grupo: "AN", bebê: false },
    "Arthur Alves": { grupo: "AN", bebê: false },
    
    // Grupo AO
    "Gabrielle de Lucena Silva de Lima": { grupo: "AO", bebê: false },
    "Gabrielle": { grupo: "AO", bebê: false },
    "Mattheus de Lima": { grupo: "AO", bebê: false },
    "Mattheus": { grupo: "AO", bebê: false },
    
    // Grupo AP
    "Philippe Silva Praxedes dos Santos": { grupo: "AP", bebê: false },
    "Philippe": { grupo: "AP", bebê: false },
    "Anna Paula Portelinha Praxedes dos Santos": { grupo: "AP", bebê: false },
    "Anna Paula": { grupo: "AP", bebê: false },
    "João Philippe Praxedes dos Santos": { grupo: "AP", bebê: false },
    "João Philippe": { grupo: "AP", bebê: false },
    
    // Grupo AQ
    "Willane Rafaela Freire de Oliveira": { grupo: "AQ", bebê: false },
    "Willane": { grupo: "AQ", bebê: false },
    "Edney da Silva Lima": { grupo: "AQ", bebê: false },
    "Edney": { grupo: "AQ", bebê: false },
    
    // Grupo AR
    "Evellyse do Amaral": { grupo: "AR", bebê: false },
    "Evellyse": { grupo: "AR", bebê: false },
    "Willian Bueno": { grupo: "AR", bebê: false },
    "Willian": { grupo: "AR", bebê: false },
    
    // Grupo AS
    "Iago Murilo Brito de Souza": { grupo: "AS", bebê: false },
    "Iago": { grupo: "AS", bebê: false },
    "Anderson Cardoso Davila": { grupo: "AS", bebê: false },
    "Anderson Cardoso": { grupo: "AS", bebê: false },
    
    // Grupo AT
    "Heloisa Monsão": { grupo: "AT", bebê: false },
    "Heloisa": { grupo: "AT", bebê: false },
    "Rodney Monsão": { grupo: "AT", bebê: false },
    "Rodney": { grupo: "AT", bebê: false },
    
    // Grupo AU
    "Thais Cristina": { grupo: "AU", bebê: false },
    "Thais": { grupo: "AU", bebê: false },
    
    // Grupo AV
    "Evelyn Chaves": { grupo: "AV", bebê: false },
    "Evelyn": { grupo: "AV", bebê: false },
    
    // Grupo AX
    "Tatiane Aragão Vasconcelos": { grupo: "AX", bebê: false },
    "Tatiane Vasconcelos": { grupo: "AX", bebê: false },
    "Tatiane Aragão": { grupo: "AX", bebê: false },
    "Tatiane": { grupo: "AX", bebê: false },
    "Felipe Mendes": { grupo: "AX", bebê: false },
    "Felipe Mendes": { grupo: "AX", bebê: false },
    
    // Grupo AW
    "Jacqueline Barboza": { grupo: "AW", bebê: false },
    "Jacqueline": { grupo: "AW", bebê: false },
    "Carlos": { grupo: "AW", bebê: false },
    
    // Grupo AY
    "Danilo Fiorotto": { grupo: "AY", bebê: false },
    "Danilo": { grupo: "AY", bebê: false },
    
    // Grupo AZ
    "João Prado": { grupo: "AZ", bebê: false },
    "João": { grupo: "AZ", bebê: false },
    "Juliana Gobbi": { grupo: "AZ", bebê: false },
    "Juliana Gobbi": { grupo: "AZ", bebê: false },
    
    // Grupo BA
    "Marcos Tobias": { grupo: "BA", bebê: false },
    "Marcos": { grupo: "BA", bebê: false },
    "Patricia Mirza": { grupo: "BA", bebê: false },
    "Patricia": { grupo: "BA", bebê: false },
    
    // Grupo BB
    "Pedro Henrique Vilela": { grupo: "BB", bebê: false },
    "Pedro Henrique": { grupo: "BB", bebê: false },
    "Pedro Vilela": { grupo: "BB", bebê: false },
    
    // Grupo BC
    "Ivone Gomes": { grupo: "BC", bebê: false },
    "Ivone": { grupo: "BC", bebê: false },
    
    // Grupo BD
    "Fabio Rago Duarte": { grupo: "BD", bebê: false },
    "Fabio": { grupo: "BD", bebê: false },
    
    // Grupo BP
    "Jose Fonseca": { grupo: "BP", bebê: false },
    "Jose": { grupo: "BP", bebê: false },
    "Marido Jose": { grupo: "BP", bebê: false },
    
    // Grupo BQ
    "Renata dos Santos Bordallo Neves": { grupo: "BQ", bebê: false },
    "Renata": { grupo: "BQ", bebê: false },
    
    // Grupo BE
    "Helênio Faya": { grupo: "BE", bebê: false },
    "Helênio": { grupo: "BE", bebê: false },
    
    // Grupo BF
    "Heberth Oliveira": { grupo: "BF", bebê: false },
    "Heberth": { grupo: "BF", bebê: false },
    "Paulo Ricardo Garcia Carneiro": { grupo: "BF", bebê: false },
    "Paulo Ricardo": { grupo: "BF", bebê: false },
    "Paulo Carneiro": { grupo: "BF", bebê: false },
    
    // Grupo BG
    "Viviane Isabele Campos": { grupo: "BG", bebê: false },
    "Viviane": { grupo: "BG", bebê: false },
    
    // Grupo BH
    "Daniele Mori": { grupo: "BH", bebê: false },
    "Daniele": { grupo: "BH", bebê: false },
    
    // Grupo BI
    "Carlos Vinicius Esteca": { grupo: "BI", bebê: false, sby: true },
    "Carlos Vinicius": { grupo: "BI", bebê: false, sby: true },
    "Carlos Esteca": { grupo: "BI", bebê: false, sby: true },
    
    // Grupo BJ
    "Marcio Alves": { grupo: "BJ", bebê: false, sby: true },
    
    // Grupo BK
    "Ingrid": { grupo: "BK", bebê: false, sby: true },
    "Amanda Sales": { grupo: "BK", bebê: false, sby: true },
    
    // Grupo BL
    "Higor Oscar": { grupo: "BL", bebê: false, sby: true },
    "Higor": { grupo: "BL", bebê: false, sby: true },
    "Danielle Oliveira Fernandes": { grupo: "BL", bebê: false, sby: true },
    "Danielle Oliveira": { grupo: "BL", bebê: false, sby: true },
    "Danielle Fernandes": { grupo: "BL", bebê: false, sby: true },
    "Ana Carolina da Silva Pereira": { grupo: "BR", bebê: false, sby: true },
    "Ana Carolina": { grupo: "BR", bebê: false, sby: true },
    
    // Grupo BN
    "Marcos Marins": { grupo: "BN", bebê: false, sby: true },
    "Marina Maia": { grupo: "BN", bebê: false, sby: true },
    "Marina": { grupo: "BN", bebê: false, sby: true },
    
    // Grupo BM
    "Anderson Sousa": { grupo: "BM", bebê: false, sby: true },
    "Daniele Sousa": { grupo: "BM", bebê: false, sby: true },
    
    // Grupo BO
    "André Estrela": { grupo: "BO", bebê: false, sby: true },
    "Karen Gusmão": { grupo: "BO", bebê: false, sby: true },
    "Karen": { grupo: "BO", bebê: false, sby: true },
    
    // Grupo BR
    "Ana Carolina da Silva Pereira": { grupo: "BR", bebê: false, sby: true },
    "Ana Carolina": { grupo: "BR", bebê: false, sby: true },
    "Ana Pereira": { grupo: "BR", bebê: false, sby: true }
  };
  
  // Definição de acompanhantes por grupo
  const ACOMPANHANTES_POR_GRUPO = {
    "A": 0,
    "B": 2,
    "C": 0,
    "D": 2,
    "E": 3,
    "F": 0,
    "G": 0,
    "H": 3,
    "I": 2,
    "J": 3,
    "K": 0,
    "L": 0,
    "M": 3,
    "N": 0,
    "O": 2,
    "P": 3,
    "Q": 3,
    "R": 3,
    "S": 0,
    "T": 0,
    "U": 3,
    "V": 0,
    "X": 4,
    "Z": 0,
    "AB": 2,
    "AC": 0,
    "AD": 2,
    "AE": 2,
    "AF": 2,
    "AG": 2,
    "AH": 2,
    "AI": 0,
    "AJ": 2,
    "AK": 0,
    "AL": 0,
    "AM": 0,
    "AN": 2,
    "AO": 2,
    "AP": 2,
    "AQ": 2,
    "AR": 2,
    "AS": 2,
    "AT": 2,
    "AU": 0,
    "AV": 0,
    "AX": 2,
    "AW": 2,
    "AY": 0,
    "AZ": 2,
    "BA": 2,
    "BB": 0,
    "BC": 0,
    "BD": 0,
    "BE": 0,
    "BF": 2,
    "BG": 0,
    "BH": 0,
    "BI": 0,
    "BJ": 0,
    "BK": 2,
    "BL": 2,
    "BM": 2,
    "BN": 2,
    "BO": 2,
    "BP": 2,
    "BQ": 0,
    "BR": 0
  };

  // Transformar a lista de convidados em um array de objetos
  const convidadosArray = Object.entries(LISTA_CONVIDADOS).map(([nome, info]) => {
    const grupo = info.grupo;
    const maxAcompanhantes = ACOMPANHANTES_POR_GRUPO[grupo] || 0;
    
    // Obter todos os nomes do mesmo grupo
    const nomesDoGrupo = Object.entries(LISTA_CONVIDADOS)
      .filter(([n, i]) => i.grupo === grupo && n !== nome)
      .map(([n]) => n);

    return {
      nome,
      grupo,
      acompanhantes: nomesDoGrupo.slice(0, maxAcompanhantes - 1), // Limita pelo maxAcompanhantes
      bebe: info.bebê
    };
  });

  return convidadosArray;
}
// --- End Static Guest Data ---

// Função para normalizar texto para comparação (remover acentos, converter para minúsculas)
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
};

// Função para calcular a similaridade entre duas strings (distância de Levenshtein simplificada)
const calculateSimilarity = (str1, str2) => {
  // Se as strings são iguais, retorna similaridade máxima
  if (str1 === str2) return 1;
  
  // Se uma das strings está contida na outra, alta similaridade
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.9;
  }
  
  // Tokenização - dividir em palavras
  const tokens1 = str1.split(/\s+/).filter(t => t.length > 1);
  const tokens2 = str2.split(/\s+/).filter(t => t.length > 1);
  
  // Contar palavras em comum
  let matchCount = 0;
  for (const token1 of tokens1) {
    for (const token2 of tokens2) {
      if (token1 === token2 || token1.includes(token2) || token2.includes(token1)) {
        matchCount++;
        break;
      }
    }
  }
  
  // Calcular similaridade baseada em tokens correspondentes
  const maxTokens = Math.max(tokens1.length, tokens2.length);
  if (maxTokens === 0) return 0;
  
  return matchCount / maxTokens;
};

// Função para obter acompanhantes especiais para convidados específicos
const getAcompanhantesEspeciais = (nome) => {
  const nomeNormalizado = normalizeText(nome);
  
  // Mapeamento de convidados para seus acompanhantes reais
  const acompanhantesMap = {
    // Exemplos de mapeamentos específicos
    // Não associar Rafael e Tayana como acompanhantes um do outro
  };
  
  return acompanhantesMap[nomeNormalizado] || [];
};

// Função para remover duplicatas de acompanhantes
const removeDuplicateAcompanhantes = (acompanhantes) => {
  if (!acompanhantes || !Array.isArray(acompanhantes)) return [];
  
  const uniqueAcompanhantes = [];
  const normalizedNames = new Set();
  
  acompanhantes.forEach(acompanhante => {
    const normalizedName = normalizeText(acompanhante);
    
    // Verificar se já existe um nome similar
    let isDuplicate = false;
    normalizedNames.forEach(existingName => {
      // Se um nome é substring do outro, considerar como duplicata
      if (normalizedName.includes(existingName) || existingName.includes(normalizedName)) {
        isDuplicate = true;
      }
    });
    
    if (!isDuplicate) {
      normalizedNames.add(normalizedName);
      uniqueAcompanhantes.push(acompanhante);
    }
  });
  
  return uniqueAcompanhantes;
};

export default function ConfirmarPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [convidadoEncontrado, setConvidadoEncontrado] = useState(null);
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [acompanhantes, setAcompanhantes] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [naoComparecera, setNaoComparecera] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [convidadosData, setConvidadosData] = useState([]);
  const [possiveisConvidados, setPossiveisConvidados] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  // Carregar dados de convidados estaticamente
  useEffect(() => {
    try {
      const data = getStaticConvidadosData();
      if (data) {
        setConvidadosData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados estáticos de convidados:', error);
    }
  }, []);

  // Função para buscar convidado com algoritmo melhorado
  const buscarConvidado = () => {
    if (!nome.trim()) {
      setErro('Por favor, digite seu nome completo');
      return;
    }

    setBuscando(true);
    setErro('');
    setConvidadoEncontrado(null);
    setPossiveisConvidados([]);
    setMostrarSugestoes(false);

    // Normalizar o nome de busca
    const nomeBuscaNormalizado = normalizeText(nome);
    
    // Implementação de busca mais robusta com pontuação de similaridade
    const convidadosComPontuacao = convidadosData.map(convidado => {
      // Normalizar o nome do convidado
      const nomeConvidadoNormalizado = normalizeText(convidado.nome);
      
      // Calcular pontuação de similaridade
      const pontuacao = calculateSimilarity(nomeConvidadoNormalizado, nomeBuscaNormalizado);
      
      return {
        convidado,
        pontuacao
      };
    });
    
    // Ordenar por pontuação (mais similar primeiro)
    convidadosComPontuacao.sort((a, b) => b.pontuacao - a.pontuacao);
    
    // Verificar se temos uma correspondência forte (pontuação > 0.7)
    if (convidadosComPontuacao.length > 0 && convidadosComPontuacao[0].pontuacao > 0.7) {
      const melhorCorrespondencia = convidadosComPontuacao[0].convidado;
      setConvidadoEncontrado(melhorCorrespondencia);
      
      // Pré-preencher acompanhantes se disponíveis
      if (melhorCorrespondencia.acompanhantes && melhorCorrespondencia.acompanhantes.length > 0) {
        // Remover duplicatas de acompanhantes
        const uniqueAcompanhantes = removeDuplicateAcompanhantes(melhorCorrespondencia.acompanhantes);
        
        const acompanhantesObj = {};
        uniqueAcompanhantes.forEach(acompanhante => {
          acompanhantesObj[acompanhante] = false;
        });
        
        // Adicionar acompanhantes especiais se aplicável
        const acompanhantesEspeciais = getAcompanhantesEspeciais(melhorCorrespondencia.nome);
        acompanhantesEspeciais.forEach(acompanhante => {
          if (!acompanhantesObj[acompanhante]) {
            acompanhantesObj[acompanhante] = false;
          }
        });
        
        setAcompanhantes(acompanhantesObj);
      } else {
        // Verificar se há acompanhantes especiais mesmo se não houver acompanhantes na lista
        const acompanhantesEspeciais = getAcompanhantesEspeciais(melhorCorrespondencia.nome);
        if (acompanhantesEspeciais.length > 0) {
          const acompanhantesObj = {};
          acompanhantesEspeciais.forEach(acompanhante => {
            acompanhantesObj[acompanhante] = false;
          });
          setAcompanhantes(acompanhantesObj);
        } else {
          setAcompanhantes({});
        }
      }
    } else {
      // Se não temos uma correspondência forte, verificar se temos possíveis correspondências (pontuação > 0.4)
      const possiveisCorrespondencias = convidadosComPontuacao
        .filter(item => item.pontuacao > 0.4)
        .map(item => item.convidado);
      
      if (possiveisCorrespondencias.length > 0) {
        setPossiveisConvidados(possiveisCorrespondencias);
        setMostrarSugestoes(true);
      } else {
        setErro('Não encontramos seu nome na lista de convidados. Por favor, verifique se digitou corretamente ou entre em contato com a aniversariante.');
      }
    }

    setBuscando(false);
  };

  // Função para selecionar um convidado sugerido
  const selecionarConvidado = (convidado) => {
    setConvidadoEncontrado(convidado);
    setMostrarSugestoes(false);
    
    // Pré-preencher acompanhantes se disponíveis
    if (convidado.acompanhantes && convidado.acompanhantes.length > 0) {
      // Remover duplicatas de acompanhantes
      const uniqueAcompanhantes = removeDuplicateAcompanhantes(convidado.acompanhantes);
      
      const acompanhantesObj = {};
      uniqueAcompanhantes.forEach(acompanhante => {
        acompanhantesObj[acompanhante] = false;
      });
      
      // Adicionar acompanhantes especiais se aplicável
      const acompanhantesEspeciais = getAcompanhantesEspeciais(convidado.nome);
      acompanhantesEspeciais.forEach(acompanhante => {
        if (!acompanhantesObj[acompanhante]) {
          acompanhantesObj[acompanhante] = false;
        }
      });
      
      setAcompanhantes(acompanhantesObj);
    } else {
      // Verificar se há acompanhantes especiais mesmo se não houver acompanhantes na lista
      const acompanhantesEspeciais = getAcompanhantesEspeciais(convidado.nome);
      if (acompanhantesEspeciais.length > 0) {
        const acompanhantesObj = {};
        acompanhantesEspeciais.forEach(acompanhante => {
          acompanhantesObj[acompanhante] = false;
        });
        setAcompanhantes(acompanhantesObj);
      } else {
        setAcompanhantes({});
      }
    }
  };

  // Função para lidar com mudanças nos checkboxes de acompanhantes
  const handleAcompanhanteChange = (acompanhante, checked) => {
    setAcompanhantes(prev => ({
      ...prev,
      [acompanhante]: checked
    }));
  };

  // Função para enviar confirmação
  const enviarConfirmacao = async (e) => {
    e.preventDefault();
    
    if (!convidadoEncontrado) {
      setErro('Por favor, busque seu nome primeiro');
      return;
    }
    
    if (!email) {
      setErro('Por favor, informe seu email');
      return;
    }
    
    if (!telefone) {
      setErro('Por favor, informe seu telefone');
      return;
    }
    
    setEnviando(true);
    setErro('');
    
    try {
      // Filtrar apenas acompanhantes confirmados
      const acompanhantesConfirmados = {};
      Object.entries(acompanhantes).forEach(([nome, confirmado]) => {
        if (confirmado) {
          acompanhantesConfirmados[nome] = true;
        }
      });
      
      // Preparar dados para envio
      const dadosConfirmacao = {
        id: `conf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        nome: convidadoEncontrado.nome,
        email,
        telefone,
        acompanhantes: Object.keys(acompanhantesConfirmados).length,
        acompanhantesConfirmados,
        mensagem,
        naoComparecera,
        dataConfirmacao: new Date().toISOString(),
        grupo: convidadoEncontrado.grupo || ''
      };
      
      // Enviar confirmação para a API
      const response = await fetch('/api/save-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosConfirmacao)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao enviar confirmação');
      }
      
      // Enviar email de confirmação (REMOVIDO TEMPORARIAMENTE - SEM API DE EMAIL CONFIGURADA)
      /*
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: email,
            nome: convidadoEncontrado.nome,
            acompanhantes: Object.keys(acompanhantesConfirmados),
            naoComparecera
          })
        });
      } catch (emailError) {
        console.error('Erro ao enviar email de confirmação:', emailError);
        // Não interromper o fluxo se o email falhar
      }
      */
      
      // Limpar formulário e mostrar mensagem de sucesso
      setNome('');
      setConvidadoEncontrado(null);
      setEmail('');
      setTelefone('');
      setAcompanhantes({});
      setMensagem('');
      setNaoComparecera(false);
      setSucesso(true);
      
      // Salvar confirmação no localStorage para sincronização
      try {
        const LOCAL_STORAGE_KEY = 'quarentei_confirmations_v3';
        let localData = [];
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          localData = JSON.parse(storedData);
        }
        // Evitar duplicatas no localStorage
        if (!localData.some(conf => conf.id === dadosConfirmacao.id)) {
          localData.push(dadosConfirmacao);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localData));
        }
      } catch (e) {
        console.error('Erro ao salvar confirmação no localStorage:', e);
      }
      
    } catch (error) {
      console.error('Erro ao enviar confirmação:', error);
      setErro(`Erro ao enviar confirmação: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };

  // Função para voltar à página inicial
  const voltarParaInicio = () => {
    router.push('/');
  };

  // Renderizar página de sucesso
  if (sucesso) {
    return (
      <div className="min-h-screen bg-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center text-amber-500 mb-2">Quarentei</h1>
          <h2 className="text-3xl font-bold text-center text-amber-500 mb-12">Confirmação de Presença</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-900 mt-4">Confirmação Enviada!</h3>
              <p className="text-gray-600 mt-2">
                {naoComparecera 
                  ? 'Recebemos sua resposta. Sentiremos sua falta na festa!' 
                  : 'Recebemos sua confirmação. Estamos ansiosos para celebrar com você!'}
              </p>
            </div>
            
            <div className="mt-6">
              <button
                onClick={voltarParaInicio}
                className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Voltar para a página principal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar formulário de confirmação
  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center text-amber-500 mb-2">Quarentei</h1>
        <h2 className="text-3xl font-bold text-center text-amber-500 mb-12">Confirmação de Presença</h2>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-center text-pink-500 mb-6">Confirme sua presença</h3>
          
          <p className="text-center text-gray-700 mb-8">
            Você precisa confirmar a sua presença até 24/05
          </p>
          
          {!convidadoEncontrado ? (
            <div>
              <div className="mb-6">
                <label htmlFor="nome" className="block text-gray-700 mb-2">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Digite seu nome completo"
                    required
                  />
                  <button
                    onClick={buscarConvidado}
                    disabled={buscando}
                    className="bg-pink-500 text-white py-2 px-4 rounded-r-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    {buscando ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              </div>
              
              {/* Mostrar sugestões de convidados */}
              {mostrarSugestoes && (
                <div className="mb-6 p-4 bg-pink-100 border border-pink-200 rounded-md">
                  <p className="text-pink-700 mb-2">Não encontramos o nome exato. Você quis dizer:</p>
                  <ul className="space-y-1">
                    {possiveisConvidados.map((convidado, index) => (
                      <li key={index}>
                        <button 
                          onClick={() => selecionarConvidado(convidado)}
                          className="text-blue-600 hover:underline"
                        >
                          {convidado.nome}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {erro && (
                <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-md">
                  <p className="text-red-700">{erro}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={enviarConfirmacao}>
              <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-md">
                <p className="text-green-700">Olá, <strong>{convidadoEncontrado.nome}</strong>! Por favor, confirme seus dados e se levará acompanhantes.</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="seuemail@exemplo.com"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="telefone" className="block text-gray-700 mb-2">
                  Telefone (com DDD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="(XX) 9XXXX-XXXX"
                  required
                />
              </div>
              
              {/* Checkbox para indicar que não comparecerá */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={naoComparecera}
                    onChange={(e) => setNaoComparecera(e.target.checked)}
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="ml-2 text-gray-700">Não poderei comparecer</span>
                </label>
              </div>
              
              {/* Acompanhantes (mostrar apenas se não marcou 'Não comparecerá') */}
              {!naoComparecera && Object.keys(acompanhantes).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Acompanhantes</h4>
                  <p className="text-gray-600 mb-3">Marque quem irá com você:</p>
                  <div className="space-y-2">
                    {Object.keys(acompanhantes).map((acompanhante, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={acompanhantes[acompanhante]}
                          onChange={(e) => handleAcompanhanteChange(acompanhante, e.target.checked)}
                          className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="ml-2 text-gray-700">{acompanhante}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Mensagem (mostrar apenas se não marcou 'Não comparecerá') */}
              {!naoComparecera && (
                <div className="mb-6">
                  <label htmlFor="mensagem" className="block text-gray-700 mb-2">
                    Deixe uma mensagem para a aniversariante (opcional)
                  </label>
                  <textarea
                    id="mensagem"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Escreva sua mensagem aqui..."
                  ></textarea>
                </div>
              )}
              
              {erro && (
                <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-md">
                  <p className="text-red-700">{erro}</p>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                  {enviando ? 'Enviando...' : (naoComparecera ? 'Enviar Resposta' : 'Confirmar Presença')}
                </button>
                <button
                  type="button"
                  onClick={() => { setConvidadoEncontrado(null); setNome(''); setErro(''); }}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Buscar outro nome
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <a href="/" className="text-pink-500 hover:text-pink-700">
              ← Voltar para a página principal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

