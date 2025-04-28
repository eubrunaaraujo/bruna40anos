'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header com a imagem do convite */}
      <header className="relative py-16 px-4 text-center overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Image 
                src="/images/bruna_convite.jpeg" 
                alt="Quarentei da Bruna" 
                width={600} 
                height={900}
                className="mx-auto rounded-lg shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Seção de informações da festa */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="card p-8 mb-12 bg-white shadow-xl border-t-4 border-pink-400">
              <h2 className="text-3xl md:text-4xl font-bold text-center gold-text mb-8">Informações do Evento</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gold-bg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 rose-text">Data e Horário</h4>
                    <p className="text-lg">31 de Maio de 2025</p>
                    <p className="text-lg">Das 13h às 17h</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full rose-bg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 gold-text">Local</h4>
                    <p className="text-lg">Positano Eventos</p>
                    <p className="text-lg">Rua Cirne Maia, 143 - Cobertura</p>
                    <p className="text-lg">Bairro: Cachambi - RJ</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gold-bg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 rose-text">Detalhes Importantes</h4>
                    <p className="mb-2 text-lg">Prepare-se para um dia de sucesso, sorrisos, bons drinks e muito pagode!</p>
                    <p className="mb-2 text-lg">Serão 4 horas de alegria garantidas — então chega cedo pra não perder nadinha!</p>
                    <p className="mb-2 text-lg">Local com estacionamento — R$20 (sujeito à disponibilidade)</p>
                    <p className="mb-2 text-lg font-bold text-pink-600">Você precisa confirmar a sua presença até 24/05</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full rose-bg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1 gold-text">Bebidas</h4>
                    <p className="mb-2 text-lg">Bebidas liberadas: refrigerantes, sucos, drinks e coquetel de frutas no capricho!</p>
                    <p className="text-lg">Para os cervejeiros de plantão: a cerveja não está inclusa, mas fique à vontade para trazer seu cooler com a cerva geladinha e brindar com a gente!</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
              <Link href="/confirmar" className="btn-primary px-8 py-4 rounded-full text-lg font-medium text-center shadow-lg transform hover:scale-105 transition-transform">
                Confirmar Presença
              </Link>
              <Link href="/presentes" className="btn-secondary px-8 py-4 rounded-full text-lg font-medium text-center shadow-lg transform hover:scale-105 transition-transform">
                Lista de Presentes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-bg text-white py-8 px-4 text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Quarentei da Bruna</h2>
          <p className="mb-2">31 de Maio de 2025 | 13h às 17h</p>
          <p>Positano Eventos - Rua Cirne Maia, 143 - Cobertura</p>
        </div>
      </footer>
    </main>
  )
}
