'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { obterConfirmacoes, obterPresentes } from '@/lib/googleSheets';

interface Convidado {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  grupo: string;
  confirmado?: boolean;
  acompanhantes: string[];
  mensagem?: string;
  dataConfirmacao?: string;
}

interface Presente {
  id: string;
  nome: string;
  valor: number;
  presenteador?: string;
  email?: string;
  dataConfirmacao?: string;
}

export default function Admin() {
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [aba, setAba] = useState<'presenca' | 'presentes'>('presenca');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'confirmados' | 'recusados'>('todos');
  const [filtroOrdem, setFiltroOrdem] = useState<'data' | 'nome' | 'grupo'>('data');
  const [pesquisa, setPesquisa] = useState('');
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [carregando, setCarregando] = useState(false);
  
  const autenticar = () => {
    if (senha === 'bruna40') {
      setAutenticado(true);
      carregarDados();
    } else {
      alert('Senha incorreta!');
    }
  };
  
  const sair = () => {
    setAutenticado(false);
    setSenha('');
  };
  
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [dadosConvidados, dadosPresentes] = await Promise.all([
        obterConfirmacoes(),
        obterPresentes()
      ]);
      
      setConvidados(dadosConvidados);
      setPresentes(dadosPresentes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Ocorreu um erro ao carregar os dados. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };
  
  const filtrarConvidados = () => {
    let resultado = [...convidados];
    
    if (filtroStatus === 'confirmados') {
      resultado = resultado.filter(c => c.confirmado);
    } else if (filtroStatus === 'recusados') {
      resultado = resultado.filter(c => !c.confirmado);
    }
    
    if (pesquisa) {
      const termoPesquisa = pesquisa.toLowerCase();
      resultado = resultado.filter(c => 
        c.nome.toLowerCase().includes(termoPesquisa) ||
        (c.email && c.email.toLowerCase().includes(termoPesquisa)) ||
        (c.telefone && c.telefone.includes(termoPesquisa)) ||
        c.grupo.toLowerCase().includes(termoPesquisa)
      );
    }
    
    if (filtroOrdem === 'nome') {
      resultado.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (filtroOrdem === 'grupo') {
      resultado.sort((a, b) => a.grupo.localeCompare(b.grupo));
    } else if (filtroOrdem === 'data' && resultado.some(c => c.dataConfirmacao)) {
      resultado.sort((a, b) => {
        if (!a.dataConfirmacao) return 1;
        if (!b.dataConfirmacao) return -1;
        return new Date(b.dataConfirmacao).getTime() - new Date(a.dataConfirmacao).getTime();
      });
    }
    
    return resultado;
  };
  
  const totalConfirmados = convidados.filter(c => c.confirmado).length;
  const totalRecusados = convidados.filter(c => c.confirmado === false).length;
  const totalPessoas = convidados.reduce((total, c) => {
    if (c.confirmado) {
      // Conta o convidado principal
      let count = 1;
      
      // Conta os acompanhantes confirmados
      if (c.acompanhantes && c.acompanhantes.length > 0) {
        count += c.acompanhantes.length;
      }
      
      return total + count;
    }
    return total;
  }, 0);
  const limiteConvidados = 90;
  
  return (
    <main className="min-h-screen py-12 bg-[#FFF5F8]">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 header-gradient">Quarentei</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 gold-text">Área Administrativa</h2>
        </div>
        
        {!autenticado ? (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 border border-[#FFB6C1]">
            <h3 className="text-2xl font-bold mb-6 text-center text-[#FF1493]">Login</h3>
            
            <div className="mb-6">
              <label htmlFor="senha" className="label">Senha</label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-field"
                onKeyDown={(e) => e.key === 'Enter' && autenticar()}
              />
            </div>
            
            <button 
              onClick={autenticar}
              className="btn-primary w-full"
            >
              Entrar
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 border border-[#FFB6C1]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-[#FF1493]">Painel de Controle</h3>
              <div className="flex gap-2">
                <button 
                  onClick={carregarDados}
                  className="bg-[#D4AF37] text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
                  disabled={carregando}
                >
                  {carregando ? 'Atualizando...' : 'Atualizar'}
                </button>
                <button 
                  onClick={sair}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Sair
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-4">Status da Festa</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-[#FFB6C1]">
                  <p className="text-sm text-gray-600">Total de Confirmados</p>
                  <p className="text-2xl font-bold text-green-600">{totalConfirmados}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#FFB6C1]">
                  <p className="text-sm text-gray-600">Total de Recusados</p>
                  <p className="text-2xl font-bold text-red-600">{totalRecusados}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#FFB6C1]">
                  <p className="text-sm text-gray-600">Total de Pessoas</p>
                  <p className="text-2xl font-bold text-blue-600">{totalPessoas} / {limiteConvidados}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#FFB6C1]">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`text-xl font-bold ${totalPessoas <= limiteConvidados ? 'text-green-600' : 'text-red-600'}`}>
                    {totalPessoas <= limiteConvidados ? 'Dentro do Limite' : 'Limite Excedido'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-2 px-4 font-medium ${aba === 'presenca' ? 'text-[#FF1493] border-b-2 border-[#FF1493]' : 'text-gray-500'}`}
                  onClick={() => setAba('presenca')}
                >
                  Confirmações de Presença
                </button>
                <button
                  className={`py-2 px-4 font-medium ${aba === 'presentes' ? 'text-[#FF1493] border-b-2 border-[#FF1493]' : 'text-gray-500'}`}
                  onClick={() => setAba('presentes')}
                >
                  Confirmações de Presentes
                </button>
              </div>
            </div>
            
            {aba === 'presenca' && (
              <div>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Pesquisar por nome, email, telefone ou grupo..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="input-field"
                  />
                </div>
                
                <div className="flex gap-4 mb-6">
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value as any)}
                    className="input-field"
                  >
                    <option value="todos">Todos</option>
                    <option value="confirmados">Confirmados</option>
                    <option value="recusados">Recusados</option>
                  </select>
                  
                  <select
                    value={filtroOrdem}
                    onChange={(e) => setFiltroOrdem(e.target.value as any)}
                    className="input-field"
                  >
                    <option value="data">Data</option>
                    <option value="nome">Nome</option>
                    <option value="grupo">Grupo</option>
                  </select>
                </div>
                
                {carregando ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Carregando dados...</p>
                  </div>
                ) : filtrarConvidados().length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-gray-400 text-6xl mb-4">😕</div>
                    <p className="text-gray-500">Nenhuma confirmação encontrada.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-left">Nome</th>
                          <th className="p-3 text-left">Grupo</th>
                          <th className="p-3 text-left">Contato</th>
                          <th className="p-3 text-left">Acompanhantes</th>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtrarConvidados().map((convidado) => (
                          <tr key={convidado.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3">{convidado.nome}</td>
                            <td className="p-3">{convidado.grupo}</td>
                            <td className="p-3">
                              {convidado.email && <div>{convidado.email}</div>}
                              {convidado.telefone && <div>{convidado.telefone}</div>}
                            </td>
                            <td className="p-3">
                              {convidado.acompanhantes.length > 0 ? (
                                <ul className="list-disc pl-4">
                                  {convidado.acompanhantes.map((a, i) => (
                                    <li key={i}>{a}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-500">Nenhum</span>
                              )}
                            </td>
                            <td className="p-3">
                              {convidado.confirmado !== undefined && (
                                <span className={`px-2 py-1 rounded-full text-xs ${convidado.confirmado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {convidado.confirmado ? 'Confirmado' : 'Recusado'}
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {convidado.dataConfirmacao && 
                                new Date(convidado.dataConfirmacao).toLocaleDateString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {aba === 'presentes' && (
              <div>
                {carregando ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Carregando dados...</p>
                  </div>
                ) : presentes.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-gray-400 text-6xl mb-4">😕</div>
                    <p className="text-gray-500">Nenhuma confirmação de presente encontrada.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-3 text-left">Presente</th>
                          <th className="p-3 text-left">Valor</th>
                          <th className="p-3 text-left">Presenteador</th>
                          <th className="p-3 text-left">Email</th>
                          <th className="p-3 text-left">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {presentes.map((presente) => (
                          <tr key={presente.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3">{presente.nome}</td>
                            <td className="p-3">R$ {presente.valor.toFixed(2)}</td>
                            <td className="p-3">{presente.presenteador}</td>
                            <td className="p-3">{presente.email}</td>
                            <td className="p-3">
                              {presente.dataConfirmacao && 
                                new Date(presente.dataConfirmacao).toLocaleDateString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-[#FF1493] hover:underline">
            ← Voltar para a página principal
          </Link>
        </div>
      </div>
    </main>
  );
}
