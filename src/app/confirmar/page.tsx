'use client';

import { useState, useEffect } from 'react';
import { buscarConvidado, salvarConfirmacao, Convidado } from '@/lib/googleSheets';
import Link from 'next/link';

export default function ConfirmarPresenca() {
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'not_found' | 'saving'>('idle');
  const [convidado, setConvidado] = useState<Convidado | null>(null);
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [acompanhantes, setAcompanhantes] = useState<{nome: string, confirmado: boolean}[]>([]);
  const [sucesso, setSucesso] = useState(false);
  
  const buscarConvidadoHandler = async () => {
    if (!nome.trim()) return;
    
    setStatus('searching');
    
    try {
      const resultado = await buscarConvidado(nome);
      
      if (resultado) {
        setConvidado(resultado);
        
        if (resultado.acompanhantes.length > 0) {
          setAcompanhantes(
            resultado.acompanhantes.map(nome => ({ nome, confirmado: false }))
          );
        }
        
        setStatus('found');
      } else {
        setStatus('not_found');
        setConvidado(null);
      }
    } catch (error) {
      console.error('Erro ao buscar convidado:', error);
      setStatus('not_found');
    }
  };
  
  const toggleAcompanhante = (index: number) => {
    const novosAcompanhantes = [...acompanhantes];
    novosAcompanhantes[index].confirmado = !novosAcompanhantes[index].confirmado;
    setAcompanhantes(novosAcompanhantes);
  };
  
  const confirmarPresenca = async () => {
    if (!convidado || !email || !telefone) return;
    
    setStatus('saving');
    
    try {
      const acompanhantesConfirmados = acompanhantes
        .filter(a => a.confirmado)
        .map(a => a.nome);
      
      const resultado = await salvarConfirmacao({
        convidado,
        email,
        telefone,
        mensagem: mensagem || undefined,
        acompanhantesConfirmados
      });
      
      if (resultado) {
        setSucesso(true);
      } else {
        alert('Ocorreu um erro ao confirmar sua presença. Por favor, tente novamente.');
        setStatus('found');
      }
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      alert('Ocorreu um erro ao confirmar sua presença. Por favor, tente novamente.');
      setStatus('found');
    }
  };
  
  const reiniciar = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setMensagem('');
    setAcompanhantes([]);
    setStatus('idle');
    setConvidado(null);
    setSucesso(false);
  };
  
  return (
    <main className="min-h-screen py-12 bg-[#FFF5F8]">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 header-gradient">Quarentei</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 gold-text">Confirmação de Presença</h2>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 border border-[#FFB6C1]">
          {sucesso ? (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-4 text-[#FF1493]">Presença confirmada com sucesso!</h3>
              <p className="mb-8">Obrigado por confirmar sua presença na festa da Bruna. Estamos ansiosos para celebrar com você!</p>
              <button 
                onClick={reiniciar}
                className="btn-primary"
              >
                Confirmar outra presença
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-6 text-center text-[#FF1493]">Confirme sua presença</h3>
              <p className="text-center mb-8">Você precisa confirmar a sua presença até 24/05</p>
              
              {status === 'idle' || status === 'searching' || status === 'not_found' ? (
                <div className="mb-6">
                  <label htmlFor="nome" className="label">Nome completo *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="input-field flex-1"
                      disabled={status === 'searching'}
                    />
                    <button 
                      onClick={buscarConvidadoHandler}
                      className="btn-primary whitespace-nowrap"
                      disabled={status === 'searching' || !nome.trim()}
                    >
                      {status === 'searching' ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                  
                  {status === 'not_found' && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                      Seu nome não está na lista. Caso ache que houve um erro, entre em contato com a Bruna.
                    </div>
                  )}
                </div>
              ) : null}
              
              {status === 'found' && convidado && (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                    {convidado.acompanhantes.length > 0 
                      ? "Você está na lista de convidados com os acompanhantes abaixo. Favor confirmar a presença de todos."
                      : "Você está na lista de convidados favor confirmar sua presença."}
                  </div>
                  
                  {convidado.acompanhantes.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Acompanhantes:</h4>
                      {acompanhantes.map((acompanhante, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`acompanhante-${index}`}
                            checked={acompanhante.confirmado}
                            onChange={() => toggleAcompanhante(index)}
                            className="mr-2 h-5 w-5 text-[#FF1493] focus:ring-[#FF1493]"
                          />
                          <label htmlFor={`acompanhante-${index}`}>{acompanhante.nome}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="label">E-mail *</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu e-mail"
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="telefone" className="label">Telefone *</label>
                      <input
                        type="tel"
                        id="telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="Seu telefone"
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="mensagem" className="label">Mensagem para a aniversariante (opcional)</label>
                      <textarea
                        id="mensagem"
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        placeholder="Sua mensagem"
                        className="input-field min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button 
                      onClick={confirmarPresenca}
                      className="btn-primary w-full"
                      disabled={status === 'saving' || !email || !telefone}
                    >
                      {status === 'saving' ? 'Confirmando...' : 'Confirmar'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-[#FF1493] hover:underline">
            ← Voltar para a página principal
          </Link>
        </div>
      </div>
    </main>
  );
}
