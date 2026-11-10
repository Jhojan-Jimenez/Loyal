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
  title: 'Samyama Yoga · Pase Digital de Clases & Lealtad',
  description: 'Pase digital PWA de clases de yoga, acumulación de sellos y recompensas exclusivas.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#7e22ce',
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
      <body className="min-h-full flex flex-col bg-gradient-to-b from-[#FDF8FF] via-[#FAF5FF] to-[#F3E8FF] font-sans selection:bg-purple-200 selection:text-purple-950">
        <LoyalProvider>
          <Suspense fallback={<div className="h-16 border-b border-purple-100 bg-white/80" />}>
            <Navigation />
          </Suspense>
          <main className="flex-1">{children}</main>
        </LoyalProvider>
      </body>
    </html>
  );
}
