'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { salvarPresente } from '@/lib/googleSheets';

interface Presente {
  id: number;
  nome: string;
  valor: number;
  descricao: string;
  imagem: string;
}

export default function ListaPresentes() {
  const [presenteSelecionado, setPresenteSelecionado] = useState<Presente | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');
  const [sucesso, setSucesso] = useState(false);
  
  const presentes: Presente[] = [
    {
      id: 1,
      nome: 'Viagem às Maldivas',
      valor: 500,
      descricao: 'Ajude a Bruna a realizar o sonho de conhecer as paradisíacas Ilhas Maldivas!',
      imagem: '/images/IMG_5229 (1).jpeg'
    },
    {
      id: 2,
      nome: 'Sessão de Botox',
      valor: 300,
      descricao: 'Presenteie a Bruna com uma sessão de botox para manter aquela pele impecável!',
      imagem: '/images/IMG_5230 (1).jpeg'
    },
    {
      id: 3,
      nome: 'Day Spa de Diva',
      valor: 150,
      descricao: 'Um dia de puro luxo, com massagem relaxante, máscara facial e muita paz.',
      imagem: '/images/IMG_5231 (1).jpeg'
    },
    {
      id: 4,
      nome: 'Aula de dança',
      valor: 100,
      descricao: 'Porque ninguém segura uma aniversariante que samba até o chão!',
      imagem: '/images/IMG_5232 (1).jpeg'
    },
    {
      id: 5,
      nome: 'Kit de Drinks Personalizado',
      valor: 80,
      descricao: 'Gin, frutas, especiarias e muito charme num kit feito pra ela brindar com estilo.',
      imagem: '/images/IMG_5233 (1).jpeg'
    },
    {
      id: 6,
      nome: 'Livro de Autoestima',
      valor: 70,
      descricao: 'Uma leitura inspiradora pra manter o alto astral sempre em alta!',
      imagem: '/images/IMG_5234 (1).jpeg'
    },
    {
      id: 7,
      nome: 'Copo térmico estiloso',
      valor: 50,
      descricao: 'Pra manter o drink geladinho e o look em dia, claro!',
      imagem: '/images/IMG_5235 (1).jpeg'
    }
  ];
  
  const selecionarPresente = (presente: Presente) => {
    setPresenteSelecionado(presente);
    setSucesso(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const enviarConfirmacao = async () => {
    if (!nome || !email || !presenteSelecionado) return;
    
    setStatus('saving');
    
    try {
      const resultado = await salvarPresente({
        presente: presenteSelecionado.nome,
        valor: presenteSelecionado.valor,
        presenteador: nome,
        email: email
      });
      
      if (resultado) {
        setSucesso(true);
      } else {
        alert('Ocorreu um erro ao confirmar seu presente. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao confirmar presente:', error);
      alert('Ocorreu um erro ao confirmar seu presente. Por favor, tente novamente.');
    } finally {
      setStatus('idle');
    }
  };
  
  const reiniciar = () => {
    setNome('');
    setEmail('');
    setPresenteSelecionado(null);
    setSucesso(false);
  };
  
  const getQrCodeImage = (valor: number) => {
    // Mapeia o valor do presente para a imagem do QR code correspondente
    const qrCodeMap: Record<number, string> = {
      50: '/images/IMG_5229 (1).jpeg',
      70: '/images/IMG_5230 (1).jpeg',
      80: '/images/IMG_5231 (1).jpeg',
      100: '/images/IMG_5232 (1).jpeg',
      150: '/images/IMG_5233 (1).jpeg',
      300: '/images/IMG_5234 (1).jpeg',
      500: '/images/IMG_5235 (1).jpeg',
    };
    
    return qrCodeMap[valor] || '/images/IMG_5236 (1).jpeg';
  };
  
  return (
    <main className="min-h-screen py-12 bg-[#FFF5F8]">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 header-gradient">Quarentei</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 gold-text">Lista de Presentes</h2>
        </div>
        
        {presenteSelecionado ? (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 border border-[#FFB6C1] mb-10">
            {sucesso ? (
              <div className="text-center">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold mb-4 text-[#FF1493]">Presente confirmado com sucesso!</h3>
                <p className="mb-8">Obrigado por presentear a Bruna! Seu presente foi registrado.</p>
                <button 
                  onClick={reiniciar}
                  className="btn-primary"
                >
                  Escolher outro presente
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setPresenteSelecionado(null)}
                  className="text-[#FF1493] hover:underline mb-6 inline-block"
                >
                  ← Voltar para a lista de presentes
                </button>
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#FF1493] mb-2">{presenteSelecionado.nome}</h3>
                  <p className="text-xl font-bold gold-text mb-4">R$ {presenteSelecionado.valor.toFixed(2)}</p>
                  <p className="mb-6">{presenteSelecionado.descricao}</p>
                  
                  <div className="mb-8 max-w-xs mx-auto">
                    <Image 
                      src={getQrCodeImage(presenteSelecionado.valor)}
                      alt={`QR Code para ${presenteSelecionado.nome}`}
                      width={300}
                      height={300}
                      className="mx-auto"
                    />
                    <p className="mt-2 text-sm text-gray-600">Escaneie o QR Code para fazer o PIX</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nome-presente" className="label">Seu nome *</label>
                    <input
                      type="text"
                      id="nome-presente"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Digite seu nome"
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email-presente" className="label">Seu e-mail *</label>
                    <input
                      type="email"
                      id="email-presente"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu e-mail"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-8">
                  <button 
                    onClick={enviarConfirmacao}
                    className="btn-primary w-full"
                    disabled={status === 'saving' || !nome || !email}
                  >
                    {status === 'saving' ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {presentes.map((presente) => (
              <div key={presente.id} className="card flex flex-col h-full">
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <Image 
                    src={presente.imagem}
                    alt={presente.nome}
                    fill
                    style={{objectFit: 'cover'}}
                  />
                </div>
                
                <h3 className="text-xl font-bold text-[#FF1493] mb-2">{presente.nome}</h3>
                <p className="text-xl font-bold gold-text mb-4">R$ {presente.valor.toFixed(2)}</p>
                <p className="mb-6 flex-grow">{presente.descricao}</p>
                
                <button 
                  onClick={() => selecionarPresente(presente)}
                  className="btn-primary w-full mt-auto"
                >
                  Selecionar
                </button>
              </div>
            ))}
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
