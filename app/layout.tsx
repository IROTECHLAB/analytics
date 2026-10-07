import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'IROTECHLAB ANALYTICS',
    template: '%s · IROTECHLAB ANALYTICS',
  },
  description:
    'Privacy-first, self-hostable web analytics. Cookie-free, lightweight, and yours.',
  applicationName: 'IROTECHLAB ANALYTICS',
  metadataBase: new URL(
    process.env.APP_URL ?? 'https://analytics.irotechlab.xi.to'
  ),
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
    shortcut: '/icon.png',
  },
  openGraph: {
    title: 'IROTECHLAB ANALYTICS',
    description:
      'Privacy-first, self-hostable web analytics. Cookie-free, lightweight, and yours.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IROTECHLAB ANALYTICS',
    description:
      'Privacy-first, self-hostable web analytics. Cookie-free, lightweight, and yours.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
