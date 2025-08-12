import React from 'react';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { MobileCard, MobileCardHeader, MobileCardTitle, MobileCardContent } from '@/components/ui/mobile-card';
import dynamic from 'next/dynamic';

// Dynamically import icons
const Wifi = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Wifi })), { ssr: false });
const WifiOff = dynamic(() => import('lucide-react').then(mod => ({ default: mod.WifiOff })), { ssr: false });
const RefreshCw = dynamic(() => import('lucide-react').then(mod => ({ default: mod.RefreshCw })), { ssr: false });
const Home = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Home })), { ssr: false });

export default function OfflinePage() {
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      // Show message that device is still offline
      alert('Your device is still offline. Please check your internet connection.');
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      <Head>
        <title>You're Offline - DevBoard</title>
        <meta name="description" content="You're currently offline. Some features may not be available." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <MobileCard variant="glassmorphism" className="text-center">
            <MobileCardContent className="p-8">
              {/* Offline Icon */}
              <div className="mb-6">
                <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                  <WifiOff className="h-10 w-10 text-red-500" />
                </div>
              </div>

              {/* Title and Description */}
              <MobileCardHeader spacing="lg" className="mb-6">
                <MobileCardTitle size="xl" className="text-gray-900 dark:text-white">
                  You're Offline
                </MobileCardTitle>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  It looks like you're not connected to the internet. Some features may not be available, but you can still view cached content.
                </p>
              </MobileCardHeader>

              {/* Offline Features */}
              <div className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center justify-center mb-2">
                  <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Available Offline
                  </span>
                </div>
                <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <li>• View cached dashboard</li>
                  <li>• Read saved journal entries</li>
                  <li>• Browse project details</li>
                  <li>• Access offline documentation</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>
              </div>

              {/* Connection Status */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Connection Status: Offline
                  </span>
                </div>
              </div>
            </MobileCardContent>
          </MobileCard>

          {/* Tips for Offline Usage */}
          <MobileCard variant="glassmorphism" className="mt-4">
            <MobileCardHeader>
              <MobileCardTitle size="md" className="text-center">
                💡 Offline Tips
              </MobileCardTitle>
            </MobileCardHeader>
            <MobileCardContent>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                <p>• DevBoard saves your recent data locally for offline access</p>
                <p>• Your changes will sync automatically when you're back online</p>
                <p>• Check your WiFi or mobile data connection</p>
                <p>• Try moving to an area with better signal</p>
              </div>
            </MobileCardContent>
          </MobileCard>
        </div>
      </div>
    </>
  );
}
