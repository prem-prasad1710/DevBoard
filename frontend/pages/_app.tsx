import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import client from '@/lib/apollo-client';
import { AuthProvider } from '@/contexts/AuthContext';
import '../styles/globals.css';
import { Analytics } from "@vercel/analytics/next";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>DevBoard - Personal Developer Dashboard</title>
        <meta name="description" content="A personal developer dashboard for tracking your coding journey, managing projects, and accelerating your growth." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ApolloProvider client={client}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Component {...pageProps} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            /> <Analytics />
          </ThemeProvider>
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}
