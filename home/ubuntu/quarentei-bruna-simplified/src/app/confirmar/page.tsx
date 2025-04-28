'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatarData } from '@/utils/stringUtils';

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

  // Carregar dados de convidados
  useEffect(() => {
    const fetchConvidados = async () => {
      try {
        const response = await fetch('/api/google-sheets');
        if (!response.ok) {
          throw new Error('Falha ao buscar dados de convidados');
        }
        const data = await response.json();
        if (data && data.convidados) {
          setConvidadosData(data.convidados);
        }
      } catch (error) {
        console.error('Erro ao carregar dados de convidados:', error);
      }
    };

    fetchConvidados();
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
      
      // Enviar email de confirmação
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
        localData.push(dadosConfirmacao);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localData));
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
              {mostrarSugestoes && possiveisConvidados.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">Você quis dizer:</p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {possiveisConvidados.map((convidado, index) => (
                      <button
                        key={index}
                        onClick={() => selecionarConvidado(convidado)}
                        className="block w-full text-left px-3 py-2 mb-1 text-blue-600 hover:bg-gray-100 rounded"
                      >
                        {convidado.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {erro && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {erro}
                </div>
              )}
              
              <div className="mt-6 text-center">
                <button
                  onClick={voltarParaInicio}
                  className="text-pink-500 hover:text-pink-700"
                >
                  ← Voltar para a página principal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={enviarConfirmacao}>
              <div className="mb-6">
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  <p className="font-semibold">Olá, {convidadoEncontrado.nome}!</p>
                  <p>Por favor, complete sua confirmação abaixo.</p>
                </div>
                
                {/* Acompanhantes */}
                {Object.keys(acompanhantes).length > 0 && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Acompanhantes</label>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-600 mb-3">Selecione quem irá te acompanhar:</p>
                      
                      {Object.entries(acompanhantes).map(([acompanhante, confirmado]) => (
                        <div key={acompanhante} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`acompanhante-${acompanhante}`}
                            checked={confirmado}
                            onChange={(e) => handleAcompanhanteChange(acompanhante, e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={`acompanhante-${acompanhante}`} className="text-gray-700">
                            {acompanhante}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Email */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Digite seu email"
                    required
                  />
                </div>
                
                {/* Telefone */}
                <div className="mb-6">
                  <label htmlFor="telefone" className="block text-gray-700 mb-2">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Digite seu telefone"
                    required
                  />
                </div>
                
                {/* Mensagem */}
                <div className="mb-6">
                  <label htmlFor="mensagem" className="block text-gray-700 mb-2">
                    Mensagem para a aniversariante
                  </label>
                  <textarea
                    id="mensagem"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Deixe uma mensagem (opcional)"
                    rows={3}
                  />
                </div>
                
                {/* Não comparecerá */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="naoComparecera"
                      checked={naoComparecera}
                      onChange={(e) => setNaoComparecera(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="naoComparecera" className="text-gray-700">
                      Infelizmente não poderei comparecer
                    </label>
                  </div>
                </div>
                
                {erro && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {erro}
                  </div>
                )}
                
                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={enviando}
                    className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    {enviando ? 'Enviando...' : 'Confirmar presença'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setConvidadoEncontrado(null);
                      setMostrarSugestoes(false);
                      setPossiveisConvidados([]);
                    }}
                    className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
