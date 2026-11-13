import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LoyalProvider } from '@/context/LoyalContext';
import { Navigation } from '@/components/Navigation';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Loyal · Tarjetas de Sellos Digitales & Pases para Negocios',
  description: 'Plataforma SaaS de fidelización digital para comercios. Pases de sellos en Google Wallet, escáner QR en mostrador y recompensas de recurrencia sin apps pesadas.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#09090B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
        <LoyalProvider>
          <Suspense fallback={<div className="h-20 border-b border-neutral-200 bg-white" />}>
            <Navigation />
          </Suspense>
          <main className="flex-1">{children}</main>
        </LoyalProvider>
      </body>
    </html>
  );
}
