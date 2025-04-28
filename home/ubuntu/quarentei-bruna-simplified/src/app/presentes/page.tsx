'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Lista de presentes com valores, descrições e imagens
const presentes = [
  {
    id: 'livro',
    titulo: 'Livro Especial',
    descricao: 'Contribua para a Bruna adquirir aquele livro especial que ela tanto quer!',
    valor: 50,
    imagem: '/images/livro.jpeg',
    qrcode: '/images/qrcodes_jpg/qrcode_50.jpeg',
    chavePix: '21998683876'
  },
  {
    id: 'aula-danca',
    titulo: 'Aula de Dança',
    descricao: 'Presenteie a Bruna com aulas de dança para continuar arrasando na pista!',
    valor: 70,
    imagem: '/images/danca.webp',
    qrcode: '/images/qrcodes_jpg/qrcode_70.jpeg',
    chavePix: '21998683876'
  },
  {
    id: 'kit-drinks',
    titulo: 'Kit de Drinks',
    descricao: 'Ajude a Bruna a montar um kit de drinks para continuar fazendo aqueles drinks deliciosos!',
    valor: 80,
    imagem: '/images/drinks.jpeg',
    qrcode: '/images/qrcodes_jpg/qrcode_80.jpeg',
    chavePix: '21998683876'
  },
  {
    id: 'jantar-especial',
    titulo: 'Jantar Especial',
    descricao: 'Ofereça à Bruna um jantar especial em um restaurante sofisticado!',
    valor: 100,
    imagem: '/images/jantar.jpeg',
    qrcode: '/images/qrcodes_jpg/qrcode_100.jpeg',
    chavePix: '21998683876'
  },
  {
    id: 'dia-spa',
    titulo: 'Dia de Spa',
    descricao: 'Dê à Bruna um dia de relaxamento e cuidados em um spa de luxo!',
    valor: 150,
    imagem: '/images/botox.jpeg',
    qrcode: '/images/qrcodes_jpg/qrcode_150.jpeg',
    chavePix: '21998683876'
  },
  {
    id: 'personal-trainer',
    titulo: 'Personal Trainer',
    descricao: 'Contribua para que a Bruna continue com seu personal trainer e mantendo a boa forma!',
    valor: 200,
    imagem: '/images/personal_trainer.webp',
    qrcode: '/images/qrcodes_jpg/qrcode_200.jpeg',
    chavePix: '21998683876'
  },
  {
    id: 'sessao-botox',
    titulo: 'Sessão de Botox',
    descricao: 'Presenteie a Bruna com uma sessão de botox para manter aquela pele impecável!',
    valor: 300,
    imagem: '/images/botox_novo.jpeg',
    qrcode: '/images/qrcodes_jpg/qrcode_300.jpeg',
    chavePix: '21998683876'
  },
  {
    id: 'viagem-maldivas',
    titulo: 'Viagem às Maldivas',
    descricao: 'Ajude a Bruna a realizar o sonho de conhecer as paradisíacas Ilhas Maldivas!',
    valor: 500,
    imagem: '/images/maldivas.jpeg',
    qrcode: '/images/qrcodes_jpg/qrcode_500.jpeg',
    chavePix: '21998683876'
  }
];

// Função para enviar email de confirmação de presente
const sendGiftConfirmationEmail = async (email: string, nome: string, presente: string, valor: number) => {
  try {
    // Chamar a API route para enviar o email
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        nome,
        presente,
        valor,
        tipo: 'presente'
      }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};

export default function PresentesPage() {
  const [presenteSelecionado, setPresenteSelecionado] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  
  const handleSelecionar = (id: string) => {
    setPresenteSelecionado(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !presenteSelecionado) {
      return;
    }
    
    setEnviando(true);
    
    const presente = presentes.find(p => p.id === presenteSelecionado);
    
    if (presente) {
      // Em um sistema real, isso seria enviado para um backend
      // Para o protótipo, vamos apenas salvar no localStorage
      const confirmacao = {
        id: Math.random().toString(36).substring(2, 9),
        nome,
        email,
        presente: presente.titulo,
        valor: presente.valor,
        dataConfirmacao: new Date().toISOString()
      };
      
      const confirmacoes = JSON.parse(localStorage.getItem('confirmacoes_presentes') || '[]');
      confirmacoes.push(confirmacao);
      localStorage.setItem('confirmacoes_presentes', JSON.stringify(confirmacoes));
      
      // Enviar email de confirmação
      const emailSuccess = await sendGiftConfirmationEmail(email, nome, presente.titulo, presente.valor);
      
      setEmailEnviado(emailSuccess);
      setConfirmado(true);
    }
    
    setEnviando(false);
  };
  
  const handleNovoPresente = () => {
    setPresenteSelecionado(null);
    setNome('');
    setEmail('');
    setConfirmado(false);
    setEmailEnviado(false);
  };
  
  return (
    <main className="min-h-screen py-12 px-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="quarentei-title mb-2 text-center">Quarentei</h1>
          <h2 className="text-4xl font-bold text-center gold-text mb-8">Lista de Presentes</h2>
          
          {presenteSelecionado && !confirmado ? (
            <div className="card p-8 bg-white shadow-xl border-t-4 border-pink-400 mb-12">
              {presentes.filter(p => p.id === presenteSelecionado).map(presente => (
                <div key={presente.id}>
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="w-full md:w-1/3 relative h-64 rounded-lg overflow-hidden">
                      <Image 
                        src={presente.imagem} 
                        alt={presente.titulo}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="w-full md:w-2/3">
                      <h3 className="text-3xl font-bold rose-text mb-2">{presente.titulo}</h3>
                      <p className="text-xl font-bold gold-text mb-4">R$ {presente.valor.toFixed(2)}</p>
                      <p className="text-gray-700 mb-4">{presente.descricao}</p>
                      
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Formas de pagamento:</h4>
                        <div className="flex flex-col gap-4">
                          <div>
                            <p className="font-medium">PIX:</p>
                            <p className="text-gray-600 mb-2">Chave: {presente.chavePix}</p>
                            <div className="bg-gray-100 p-4 rounded-lg">
                              <p className="text-sm text-gray-500 mb-2">Escaneie o QR Code abaixo:</p>
                              <div className="flex justify-center">
                                <div className="relative h-48 w-48">
                                  <Image 
                                    src={presente.qrcode} 
                                    alt="QR Code para pagamento"
                                    width={192}
                                    height={192}
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleConfirmar} className="mt-8">
                    <h4 className="text-xl font-semibold mb-4">Complete seus dados para confirmar o presente:</h4>
                    
                    <div className="mb-4">
                      <label htmlFor="nome" className="block mb-2 font-medium">
                        Nome completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="email" className="block mb-2 font-medium">
                        E-mail <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <button 
                        type="button" 
                        onClick={() => setPresenteSelecionado(null)}
                        className="btn-secondary px-6 py-2 rounded-full"
                      >
                        Voltar para a lista
                      </button>
                      <button 
                        type="submit" 
                        className="btn-primary px-6 py-2 rounded-full"
                        disabled={enviando}
                      >
                        {enviando ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processando...
                          </span>
                        ) : (
                          'Confirmar Presente'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          ) : confirmado ? (
            <div className="card p-8 text-center bg-white shadow-xl border-t-4 border-green-400 mb-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-bold mb-4 rose-text">Presente Confirmado!</h2>
              <p className="text-lg mb-6">
                Muito obrigada pela sua contribuição! Sua generosidade significa muito para mim.
              </p>
              <p className="text-md mb-6">
                {emailEnviado ? 'Um email de confirmação foi enviado para ' + email + '.' : 'O email de confirmação será enviado em breve.'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={handleNovoPresente} 
                  className="btn-secondary px-6 py-2 rounded-full"
                >
                  Escolher outro presente
                </button>
                <Link href="/" className="btn-primary px-6 py-2 rounded-full">
                  Voltar para a página inicial
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {presentes.map(presente => (
                <div key={presente.id} className="card bg-white shadow-lg overflow-hidden">
                  <div className="relative h-64">
                    <Image 
                      src={presente.imagem} 
                      alt={presente.titulo}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold rose-text mb-2">{presente.titulo}</h3>
                    <div className="mb-4">
                      <div className="font-bold text-xl text-pink-600">
                        R$ {presente.valor.toFixed(2)}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6">{presente.descricao}</p>
                    <button 
                      onClick={() => handleSelecionar(presente.id)}
                      className="w-full btn-primary py-3 rounded-full text-lg font-medium"
                    >
                      Selecionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Link href="/" className="text-pink-500 hover:text-pink-700 font-medium">
              ← Voltar para a página principal
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
