import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import Navigation from '@/components/Navigation'
import Modals from './modals'
import { cookieToInitialState } from 'wagmi'
import wagmiConfig from '@/config/wagmi-config'
import { headers } from 'next/headers';

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
  const initialState = cookieToInitialState(
    wagmiConfig,
    headers().get('cookie')
  );

  return (
    <html lang="en">
      <body className={`${inter.className} light text-foreground bg-background`}>
        <Providers initialState={initialState}>
          <Modals>
            <Navigation />
            {children}
          </Modals>
        </Providers>
      </body>
    </html>
  )
}
