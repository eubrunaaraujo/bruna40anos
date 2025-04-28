import { NextResponse } from 'next/server';

// Função para obter dados estáticos de convidados
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
  
  return { LISTA_CONVIDADOS, ACOMPANHANTES_POR_GRUPO };
}

export async function GET() {
  try {
    // Usar diretamente os dados estáticos em vez de tentar buscar da planilha
    const data = getStaticConvidadosData();
    
    console.log('Número de convidados na lista estática:', Object.keys(data.LISTA_CONVIDADOS).length);
    
    return NextResponse.json({ 
      success: true, 
      data
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao processar requisição' 
    }, { status: 500 });
  }
}
