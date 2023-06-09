import { LayoutProvider } from '@/contexts/layout-context'
import { SocketProvider } from '@/contexts/socket-context'
import '@/styles/globals.css'
import { ThemeProvider } from 'next-theme'
import type { AppProps } from 'next/app'

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SocketProvider>
        <LayoutProvider>
          <ThemeProvider>
            <div className={inter.className}>
              <Component {...pageProps} />
            </div>
          </ThemeProvider>
        </LayoutProvider>
      </SocketProvider>
    </>
  );
}
