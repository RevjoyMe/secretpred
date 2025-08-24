import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Secret Predictions - Private Prediction Market',
  description: 'The first fully private prediction market powered by Zama FHE. Bet on events with complete confidentiality.',
  keywords: ['prediction market', 'FHE', 'privacy', 'betting', 'Zama', 'blockchain'],
  authors: [{ name: 'Secret Predictions Team' }],
  openGraph: {
    title: 'Secret Predictions - Private Prediction Market',
    description: 'The first fully private prediction market powered by Zama FHE',
    type: 'website',
    siteName: 'Secret Predictions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secret Predictions',
    description: 'Private prediction market with FHE',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-dark-900`}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

