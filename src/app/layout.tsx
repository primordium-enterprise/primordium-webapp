import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Navigation from '@/components/Navigation'
import Modals from './modals'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Primordium DAO App',
  description: 'Front-end app interface for the Primordium DAO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} light text-foreground bg-background`}>
        <Providers>
          <Modals>
            <Navigation />
            {children}
          </Modals>
        </Providers>
      </body>
    </html>
  )
}
