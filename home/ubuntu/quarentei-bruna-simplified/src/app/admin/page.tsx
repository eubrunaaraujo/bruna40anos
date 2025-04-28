
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatarData } from '@/utils/stringUtils';

// Chave para armazenamento local (atualizada para v3)
const LOCAL_STORAGE_KEY = 'quarentei_confirmations_v3';
const LOCAL_STORAGE_LAST_SYNC_KEY = 'quarentei_last_sync_v3';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmations, setConfirmations] = useState([]);
  const [filteredConfirmations, setFilteredConfirmations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState('Data');
  const [activeTab, setActiveTab] = useState('Convidados');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [clearError, setClearError] = useState('');
  const [syncStatus, setSyncStatus] = useState('');

  // Função para carregar confirmações do localStorage e sincronizar com o servidor
  const loadConfirmations = async () => {
    setIsLoading(true);
    setSyncStatus('Sincronizando...');
    try {
      // Tentar carregar do localStorage primeiro
      let localData = [];
      try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          localData = JSON.parse(storedData);
          console.log('Dados carregados do localStorage:', localData.length);
        }
      } catch (e) {
        console.error('Erro ao carregar dados do localStorage:', e);
      }

      // Enviar dados locais para sincronização com o servidor
      const response = await fetch('/api/save-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ syncData: localData })
      });
      
      if (!response.ok) {
        throw new Error('Falha ao sincronizar confirmações com o servidor');
      }
      
      const result = await response.json();
      if (result.success) {
        const syncedData = result.data || [];
        console.log('Dados sincronizados do servidor:', syncedData.length);
        
        // Atualizar estado e localStorage com os dados sincronizados
        setConfirmations(syncedData);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncedData));
          localStorage.setItem(LOCAL_STORAGE_LAST_SYNC_KEY, new Date().toISOString());
        } catch (e) {
          console.error('Erro ao salvar dados sincronizados no localStorage:', e);
        }
        
        setLastUpdate(new Date());
        setSyncStatus('Sincronizado com sucesso');
      } else {
        throw new Error(result.message || 'Erro desconhecido ao sincronizar confirmações');
      }
    } catch (error) {
      console.error('Erro ao carregar/sincronizar confirmações:', error);
      setSyncStatus(`Erro: ${error.message}`);
      
      // Se falhar ao sincronizar, usar apenas dados locais
      try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          const localData = JSON.parse(storedData);
          setConfirmations(localData);
          setLastUpdate(new Date());
          setSyncStatus('Usando dados locais (offline)');
        }
      } catch (e) {
        console.error('Erro ao carregar dados do localStorage:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para excluir uma confirmação
  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta confirmação?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Excluir do servidor
      const response = await fetch(`/api/save-confirmation?id=${id}`, {
        method: 'DELETE'
      });
      
      // Atualizar estado local independentemente da resposta do servidor
      const updatedConfirmations = confirmations.filter(conf => conf.id !== id);
      setConfirmations(updatedConfirmations);
      
      // Atualizar localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedConfirmations));
      } catch (e) {
        console.error('Erro ao salvar dados no localStorage:', e);
      }
      
      if (response.ok) {
        console.log('Confirmação excluída com sucesso do servidor');
        setSyncStatus('Confirmação excluída');
      } else {
        console.warn('Falha ao excluir confirmação do servidor, mas excluída localmente');
        setSyncStatus('Confirmação excluída localmente (erro no servidor)');
      }
    } catch (error) {
      console.error('Erro ao excluir confirmação:', error);
      alert('Erro ao excluir confirmação. A confirmação foi removida localmente, mas pode reaparecer na próxima sincronização.');
      setSyncStatus(`Erro ao excluir: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para limpar todos os dados (exceto amostra)
  const limparTodosDados = async () => {
    setIsLoading(true);
    setClearError('');
    setSyncStatus('Limpando dados...');
    try {
      // Limpar no servidor
      const response = await fetch('/api/save-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limparTudo: true })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao limpar dados no servidor');
      }
      
      const result = await response.json();
      if (result.success) {
        // Atualizar estado e localStorage com os dados de amostra retornados
        const sampleData = result.data || [];
        setConfirmations(sampleData);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sampleData));
          localStorage.setItem(LOCAL_STORAGE_LAST_SYNC_KEY, new Date().toISOString());
        } catch (e) {
          console.error('Erro ao salvar dados de amostra no localStorage:', e);
        }
        
        setLastUpdate(new Date());
        setShowClearConfirmation(false);
        setSyncStatus('Dados limpos com sucesso');
      } else {
        throw new Error(result.message || 'Erro desconhecido ao limpar dados');
      }
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      setClearError(`Erro ao limpar dados. Por favor, tente novamente.`);
      setSyncStatus(`Erro ao limpar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para filtrar e ordenar confirmações
  useEffect(() => {
    let filtered = [...confirmations];
    
    // Aplicar filtro de pesquisa
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(conf => 
        conf.nome.toLowerCase().includes(term) || 
        conf.email.toLowerCase().includes(term) ||
        (conf.grupo && conf.grupo.toLowerCase().includes(term))
      );
    }
    
    // Aplicar filtro de status
    if (statusFilter === 'Confirmados') {
      filtered = filtered.filter(conf => !conf.naoComparecera);
    } else if (statusFilter === 'Recusados') {
      filtered = filtered.filter(conf => conf.naoComparecera);
    }
    
    // Aplicar ordenação
    if (sortBy === 'Nome') {
      filtered.sort((a: Confirmacao, b: Confirmacao) => a.nome.localeCompare(b.nome));
    } else if (sortBy === 'Grupo') {
      filtered.sort((a: Confirmacao, b: Confirmacao) => (a.grupo || '').localeCompare(b.grupo || ''));
    } else { // Data (padrão)
      filtered.sort((a: Confirmacao, b: Confirmacao) => new Date(b.dataConfirmacao).getTime() - new Date(a.dataConfirmacao).getTime());
    }
    
    setFilteredConfirmations(filtered);
  }, [confirmations, searchTerm, statusFilter, sortBy]);

  // Efeito para carregar confirmações iniciais e configurar atualização automática
  useEffect(() => {
    if (isAuthenticated) {
      loadConfirmations();
      
      // Configurar atualização automática a cada 15 segundos
      const interval = setInterval(() => {
        loadConfirmations();
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Função para autenticar
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'bruna40') {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta');
    }
  };

  // Função para sair
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  // Contar total de confirmados e recusados
  const totalConfirmados = confirmations.filter((conf: Confirmacao) => !conf.naoComparecera).length;
  const totalRecusados = confirmations.filter(conf => conf.naoComparecera).length;

  // Renderizar página de login se não estiver autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center text-amber-500 mb-2">Quarentei</h1>
          <h2 className="text-3xl font-bold text-center text-amber-500 mb-12">Painel Administrativo</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-center text-pink-500 mb-6">Login</h3>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-2">Senha</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha de administrador"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                Entrar
              </button>
            </form>
            
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

  // Renderizar painel administrativo
  return (
    <div className="min-h-screen bg-pink-50 py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center text-amber-500 mb-2">Quarentei</h1>
      <h2 className="text-3xl font-bold text-center text-amber-500 mb-6">Painel Administrativo</h2>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-pink-500">Olá, Bruna!</h3>
            <p className="text-gray-600">Última atualização: {formatarData(lastUpdate)}</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={loadConfirmations}
              disabled={isLoading}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Atualizar
            </button>
            
            <button
              onClick={() => setShowClearConfirmation(true)}
              className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              Limpar Dados
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Sair
            </button>
          </div>
        </div>
        
        {/* Modal de confirmação para limpar dados */}
        {showClearConfirmation && (
          <div className="border border-red-300 bg-red-50 p-4 rounded-md mb-6">
            <h4 className="text-xl font-semibold text-red-700 mb-2">Atenção: Área de Perigo</h4>
            <p className="text-red-700 mb-4">
              Esta ação excluirá <strong>TODAS</strong> as confirmações de presença, exceto os dados de amostra. Esta ação não pode ser desfeita.
            </p>
            
            {clearError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {clearError}
              </div>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={limparTodosDados}
                disabled={isLoading}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {isLoading ? 'Processando...' : 'Confirmar Exclusão de Todos os Dados'}
              </button>
              
              <button
                onClick={() => setShowClearConfirmation(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        {/* Abas */}
        <div className="mb-6">
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('Convidados')}
              className={`py-2 px-4 ${activeTab === 'Convidados' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-t-md`}
            >
              Convidados
            </button>
            
            <button
              onClick={() => setActiveTab('Presentes')}
              className={`py-2 px-4 ${activeTab === 'Presentes' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-t-md`}
            >
              Presentes
            </button>
          </div>
        </div>
        
        {/* Conteúdo da aba Convidados */}
        {activeTab === 'Convidados' && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Total: <span className="font-bold">{confirmations.length}/90</span>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Confirmados: <span className="font-bold">{totalConfirmados}</span>
                </div>
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  Recusados: <span className="font-bold">{totalRecusados}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Pesquisar convidado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="Todos">Todos</option>
                  <option value="Confirmados">Confirmados</option>
                  <option value="Recusados">Recusados</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="Data">Data</option>
                  <option value="Nome">Nome</option>
                  <option value="Grupo">Grupo</option>
                </select>
              </div>
            </div>
            
            {/* Tabela de confirmações */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acompanhantes</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensagem</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConfirmations.map((confirmation) => (
                    <tr key={confirmation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{confirmation.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{confirmation.grupo || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {confirmation.email}<br/>{confirmation.telefone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {confirmation.acompanhantes > 0 
                          ? (
                            <ul>
                              {Object.entries(confirmation.acompanhantesConfirmados || {}).map(([nome, confirmado]) => (
                                <li key={nome} className={confirmado ? '' : 'line-through text-gray-400'}>
                                  {nome}
                                </li>
                              ))}
                            </ul>
                          )
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 break-words max-w-xs">{confirmation.mensagem || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {confirmation.naoComparecera ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Não comparecerá
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(new Date(confirmation.dataConfirmacao))}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(confirmation.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        
        {/* Conteúdo da aba Presentes */}
        {activeTab === 'Presentes' && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-center text-pink-500 mb-6">Lista de Presentes</h3>
            <p className="text-center text-gray-700 mb-4">
              Sua presença é o maior presente! Mas se você quiser me presentear, ficarei muito feliz.
            </p>
            <p className="text-center text-gray-700 mb-8">
              Sugestão de presente: PIX para Bruna (Chave: bruna@email.com)
            </p>
            {/* Adicionar mais informações ou links aqui, se necessário */}
          </div>
        )}
        
        {/* Status da sincronização */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {syncStatus}
        </div>
      </div>
    </div>
  );
}

