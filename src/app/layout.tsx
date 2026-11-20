import type { Metadata, Viewport } from 'next';
import { Libre_Baskerville, DM_Sans } from 'next/font/google';
import './globals.css';
import { LoyalProvider } from '@/context/LoyalContext';
import { Navigation } from '@/components/Navigation';
import { DevRoleSwitcher } from '@/components/DevRoleSwitcher';
import { Toaster } from 'sonner';
import { Suspense } from 'react';

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Loyal · Tarjetas de Sellos Digitales & Pases para Negocios',
  description:
    'Plataforma SaaS de fidelización digital para comercios. Pases de sellos en Google Wallet, escáner QR en mostrador y recompensas de recurrencia sin apps pesadas.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#5B6F00',
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
      suppressHydrationWarning
      className={`${libreBaskerville.variable} ${dmSans.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#5B6F00] selection:text-white">
        <LoyalProvider>
          <Suspense fallback={<div className="h-20 border-b border-[#EAE4D5] bg-[#FDFBF7]" />}>
            <Navigation />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Toaster richColors position="top-center" />
          <DevRoleSwitcher />
        </LoyalProvider>
      </body>
    </html>
  );
}
