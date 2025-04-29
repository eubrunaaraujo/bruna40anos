
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Helper function to format date (assuming it exists or we create a simple one)
function formatarData(dateString: string | Date): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return 'Erro na data';
  }
}

interface Confirmation {
  id: number;
  name: string;
  companions: number;
  message: string | null;
  created_at: string; // ISO string from Supabase
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
  const [filteredConfirmations, setFilteredConfirmations] = useState<Confirmation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // Status filter might not be applicable anymore unless we add a status field
  // const [statusFilter, setStatusFilter] = useState('Todos'); 
  const [sortBy, setSortBy] = useState('Data'); // Can sort by 'Data' or 'Nome'
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [clearError, setClearError] = useState('');
  const [fetchError, setFetchError] = useState('');

  // Function to load confirmations from the Supabase API
  const loadConfirmations = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setFetchError('');
    try {
      const response = await fetch('/api/confirmations', { method: 'GET' });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao buscar confirmações da API.');
      }
      
      const data: Confirmation[] = await response.json();
      console.log('Dados recebidos da API Supabase:', data.length);
      setConfirmations(data);
      setLastUpdate(new Date());

    } catch (error) {
      console.error('Erro ao carregar confirmações:', error);
      setFetchError(error instanceof Error ? error.message : 'Erro desconhecido ao buscar dados.');
      // Optionally clear confirmations if fetch fails?
      // setConfirmations([]); 
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear all confirmations via API
  const limparTodosDados = async () => {
    setIsLoading(true);
    setClearError('');
    setFetchError('');
    try {
      const response = await fetch('/api/confirmations', { method: 'DELETE' });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao limpar dados no servidor');
      }

      // If successful, reload the (now empty) confirmations
      await loadConfirmations(); 
      setShowClearConfirmation(false);

    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      setClearError(`Erro ao limpar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Por favor, tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to filter and sort confirmations
  useEffect(() => {
    let filtered = [...confirmations];
    
    // Apply search filter (only on name for now)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(conf => 
        conf.name.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    if (sortBy === 'Nome') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else { // Data (default)
      // Sort by created_at descending (newest first)
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    setFilteredConfirmations(filtered);
  }, [confirmations, searchTerm, sortBy]);

  // Effect to load initial confirmations when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadConfirmations();
      // Optional: Set up auto-refresh interval
      // const interval = setInterval(loadConfirmations, 30000); // Refresh every 30 seconds
      // return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Authentication logic (remains the same)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'bruna40') { // Use your actual password
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setConfirmations([]); // Clear data on logout
    setFilteredConfirmations([]);
  };

  // Calculate total guests (confirmed person + companions)
  const totalGuests = filteredConfirmations.reduce((sum, conf) => sum + 1 + (conf.companions || 0), 0);
  const totalConfirmationsCount = filteredConfirmations.length;

  // --- Render Logic --- 

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center text-rose-500 mb-2 font-serif">Quarentei</h1>
          <h2 className="text-3xl font-bold text-center text-rose-500 mb-12 font-serif">Painel Administrativo</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold text-center text-pink-600 mb-6">Login</h3>
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 mb-2">Senha</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition duration-300"
              >
                Entrar
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button onClick={() => router.push('/')} className="text-rose-500 hover:text-rose-700">
                ← Voltar para o site
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 py-6 px-4 sm:px-6 lg:px-8 text-gray-800">
      <h1 className="text-4xl font-bold text-center text-rose-500 mb-2 font-serif">Quarentei</h1>
      <h2 className="text-3xl font-bold text-center text-rose-500 mb-6 font-serif">Painel Administrativo</h2>
      
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 border-gray-200">
          <div>
            <h3 className="text-2xl font-semibold text-pink-600">Olá, Bruna!</h3>
            {lastUpdate && <p className="text-sm text-gray-500">Última atualização: {formatarData(lastUpdate)}</p>}
            {fetchError && <p className="text-sm text-red-600">Erro ao buscar dados: {fetchError}</p>}
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={loadConfirmations}
              disabled={isLoading}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center transition duration-300 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {isLoading ? 'Atualizando...' : 'Atualizar Lista'}
            </button>
            
            <button
              onClick={() => setShowClearConfirmation(true)}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 shadow"
            >
              Limpar Dados
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300 shadow"
            >
              Sair
            </button>
          </div>
        </div>
        
        {/* Clear Data Confirmation Modal */}
        {showClearConfirmation && (
          <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-md mb-6 shadow">
            <h4 className="text-xl font-semibold text-red-700 mb-2">Confirmar Limpeza de Dados</h4>
            <p className="text-red-700 mb-4">
              Tem certeza que deseja excluir <strong>TODAS</strong> as confirmações de presença? Esta ação não pode ser desfeita.
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
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300"
              >
                {isLoading ? 'Limpando...' : 'Sim, Excluir Tudo'}
              </button>
              
              <button
                onClick={() => setShowClearConfirmation(false)}
                disabled={isLoading}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        {/* Filters and Summary */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Search */}
          <div className="relative mb-4 md:mb-0 md:w-1/3">
            <label htmlFor="search" className="sr-only">Buscar por nome</label>
            <input
              type="text"
              id="search"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="Data">Data (Mais Recente)</option>
              <option value="Nome">Nome (A-Z)</option>
            </select>
          </div>

          {/* Summary Counts */}
          <div className="flex items-center space-x-4">
            <div className="text-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
              <span className="font-bold text-lg">{totalConfirmationsCount}</span>
              <span className="block text-xs">Confirmações</span>
            </div>
            <div className="text-center px-3 py-1 rounded-full bg-green-100 text-green-800">
              <span className="font-bold text-lg">{totalGuests}</span>
              <span className="block text-xs">Total Convidados</span>
               <span className="block text-xs">(Confirmados + Acomp.)</span>
            </div>
             <div className={`text-center px-3 py-1 rounded-full ${totalGuests > 90 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
              <span className="font-bold text-lg">{Math.max(0, 90 - totalGuests)}</span>
              <span className="block text-xs">Vagas Restantes</span>
               <span className="block text-xs">(Limite: 90)</span>
            </div>
          </div>
        </div>

        {/* Confirmations Table */}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acompanhantes</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensagem</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Confirmação</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Carregando confirmações...
                  </td>
                </tr>
              )}
              {!isLoading && filteredConfirmations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma confirmação encontrada.
                  </td>
                </tr>
              )}
              {!isLoading && filteredConfirmations.map((conf) => (
                <tr key={conf.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{conf.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{conf.companions}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">{1 + (conf.companions || 0)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={conf.message || ''}>{conf.message || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(conf.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

