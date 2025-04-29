
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Função para normalizar texto para comparação (remover acentos, converter para minúsculas)
function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function ConfirmarPage() {
  const [name, setName] = useState('');
  const [companions, setCompanions] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Por favor, digite seu nome.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/confirmations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          companions: Number(companions), // Ensure it's a number 
          message: message.trim() || null // Send null if empty
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Falha ao salvar confirmação.');
      }

      // Assuming Supabase returns the inserted data in an array
      const confirmedName = result[0]?.name || name.trim(); 
      setSuccess(`Presença confirmada para ${confirmedName}! Obrigado!`);
      setName('');
      setCompanions(0);
      setMessage('');
      // Optionally redirect or clear form after a delay
      // setTimeout(() => router.push('/'), 3000); 

    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-rose-100 flex flex-col items-center justify-center p-4 text-gray-800">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
        <button 
          onClick={() => router.push('/')} 
          className="absolute top-4 left-4 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 shadow-md"
        >
          &larr; Voltar
        </button>
        
        <h1 className="text-4xl font-bold text-rose-500 mb-6 font-serif">Confirme sua Presença</h1>
        
        <p className="mb-8 text-lg text-gray-600">
          Por favor, preencha seu nome e o número de acompanhantes (incluindo você) que irão à festa.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Sucesso!</strong>
            <span className="block sm:inline"> {success}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 text-left">Seu Nome Completo:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                placeholder="Digite seu nome"
              />
            </div>

            <div>
              <label htmlFor="companions" className="block text-sm font-medium text-gray-700 mb-1 text-left">Número de Acompanhantes (0 se for só você):</label>
              <input
                type="number"
                id="companions"
                value={companions}
                onChange={(e) => setCompanions(Math.max(0, parseInt(e.target.value) || 0))} // Ensure non-negative number
                min="0"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              />
               <p className="text-xs text-gray-500 mt-1 text-left">*Importante: Inclua apenas os acompanhantes, sem contar você mesmo(a).</p>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 text-left">Deixe um recado para a Bruna (opcional):</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                placeholder="Sua mensagem aqui..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${isSubmitting ? 'bg-gray-400' : 'bg-rose-500 hover:bg-rose-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition duration-300`}
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar Presença'}
            </button>
          </form>
        )}
         {success && (
           <button
              onClick={() => router.push('/')}
              className="mt-6 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition duration-300"
            >
              Voltar para o Início
            </button>
         )}
      </div>
    </div>
  );
}

