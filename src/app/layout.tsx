import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactQueryProvider } from './app-query-provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EPS Topik Score',
  description: 'Check your eps topik score',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (    
    <html lang="en">
      <ReactQueryProvider>
        <body className={inter.className}>{children}</body>
        </ReactQueryProvider>
    </html>
  )
}
