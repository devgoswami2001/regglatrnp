import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://glatrnp.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GLA TransportPass - Easy Bus Route Registration',
    template: '%s | GLA TransportPass',
  },
  description: 'One Shift • One Route • One Bus • One Seat. Simplify your daily commute with the official transport registration portal for GLA University.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'GLA TransportPass - Easy Bus Route Registration',
    description: 'Simplify your daily commute with the official transport registration portal for GLA University.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'GLA TransportPass Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GLA TransportPass - Easy Bus Route Registration',
    description: 'Simplify your daily commute with the official transport registration portal for GLA University.',
    images: ['/logo.png'],
    creator: '@glauniversity',
  },
  // Fixed icons - uses your existing /public/logo.png
  icons: {
    icon: '/logo.png',        // Auto-generates all favicon sizes
    shortcut: '/logo.png',    // PWA shortcuts
    apple: '/logo.png',       // iOS Safari tab icon
  },
  appleWebApp: {
    title: 'GLA TransportPass',
    statusBarStyle: 'default',
  },
  applicationName: 'GLA TransportPass',
  keywords: ['GLA University', 'transport', 'bus registration', 'commute', 'Mathura'],
  authors: [{ name: 'GLA University' }],
  creator: 'GLA University',
  publisher: 'GLA University',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GLA TransportPass',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-5662-250-900',
      contactType: 'Customer Service',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
