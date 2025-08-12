import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import { useEffect } from 'react';
import client from '@/lib/apollo-client';
import { AuthProvider } from '@/contexts/AuthContext';
import '../styles/globals.css';
import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Add mobile-specific event listeners
    const handleOnline = () => {
      console.log('App is online');
      // Trigger background sync when coming online
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          // Type guard for background sync
          if ('sync' in registration) {
            return (registration as any).sync.register('background-sync');
          }
        });
      }
    };

    const handleOffline = () => {
      console.log('App is offline');
    };

    // Mobile app lifecycle events
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('App went to background');
      } else {
        console.log('App came to foreground');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <Head>
        <title>DevBoard - Personal Developer Dashboard</title>
        <meta name="description" content="A personal developer dashboard for tracking your coding journey, managing projects, and accelerating your growth." />
        
        {/* Mobile-optimized viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        
        {/* PWA meta tags */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="background-color" content="#ffffff" />
        <meta name="display" content="standalone" />
        <meta name="orientation" content="portrait-primary" />
        
        {/* iOS-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DevBoard" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Android-specific meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//api.github.com" />
        
        {/* Open Graph for sharing */}
        <meta property="og:title" content="DevBoard - Personal Developer Dashboard" />
        <meta property="og:description" content="Track your coding journey, manage projects, and accelerate your development growth." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DevBoard - Personal Developer Dashboard" />
        <meta name="twitter:description" content="Track your coding journey, manage projects, and accelerate your development growth." />
        <meta name="twitter:image" content="/twitter-image.png" />
      </Head>
      
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
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
              /> 
              <Analytics />
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}
