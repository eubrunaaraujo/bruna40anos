import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quarentei da Bruna | 40 Anos',
  description: 'Venha comemorar os 40 anos da Bruna com muita alegria, drinks e pagode!'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  )
}
