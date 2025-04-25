import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quarentei da Bruna | 40 Anos",
  description: "Site de aniversário de 40 anos da Bruna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <footer className="text-center py-4 text-sm text-gray-500">
          © 2025 Quarentei da Bruna | Todos os direitos reservados
        </footer>
      </body>
    </html>
  );
}
