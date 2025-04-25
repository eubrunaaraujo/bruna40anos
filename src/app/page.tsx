import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header com imagem de capa */}
      <div className="relative w-full h-screen">
        <Image 
          src="/images/b08303d0-8f01-4213-8d12-fad564264ba7 (2).jpeg" 
          alt="Quarentei da Bruna" 
          fill
          style={{objectFit: 'cover'}}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.7)]"></div>
        <div className="absolute bottom-10 left-0 right-0 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Quarentei da Bruna</h1>
          <p className="text-xl md:text-2xl">31 de Maio de 2025 | 13h às 17h</p>
          <p className="text-lg md:text-xl">Positano Eventos - Rua Cirne Maia, 143 - Cobertura</p>
        </div>
      </div>

      {/* Informações do Evento */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="section-title header-gradient">Informações do Evento</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 gold-text">Data e Horário</h3>
              <p className="text-lg mb-2">31 de Maio de 2025</p>
              <p className="text-lg mb-2">Das 13h às 17h</p>
            </div>
            
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 gold-text">Local</h3>
              <p className="text-lg mb-2">Positano Eventos</p>
              <p className="text-lg mb-2">Rua Cirne Maia, 143 - Cobertura</p>
              <p className="text-lg mb-2">Bairro: Cachambi - RJ</p>
            </div>
          </div>

          <div className="mt-10">
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 gold-text">Detalhes Importantes</h3>
              <p className="text-lg mb-4">Prepare-se para um dia de sucesso, sorrisos, bons drinks e muito pagode!</p>
              <p className="text-lg mb-4">Serão 4 horas de alegria garantidas — então chega cedo pra não perder nadinha!</p>
              <p className="text-lg mb-4">Local com estacionamento — R$20 (sujeito à disponibilidade)</p>
              <p className="text-lg mb-4">Você precisa confirmar a sua presença até 24/05</p>
            </div>
          </div>

          <div className="mt-10">
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 gold-text">Bebidas</h3>
              <p className="text-lg mb-4">Bebidas liberadas: refrigerantes, sucos, drinks e coquetel de frutas no capricho!</p>
              <p className="text-lg mb-4">Para os cervejeiros de plantão: a cerveja não está inclusa, mas fique à vontade para trazer seu cooler com a cerva geladinha e brindar com a gente!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Botões de Ação */}
      <section className="py-16 bg-[#FFF5F8]">
        <div className="container-custom text-center">
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link href="/confirmar" className="btn-primary text-center text-xl">
              Confirmar Presença
            </Link>
            <Link href="/presentes" className="btn-secondary text-center text-xl">
              Lista de Presentes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
