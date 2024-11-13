import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from '../config';

import './global.css';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import dynamic from 'next/dynamic';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';

const OnchainProviders = dynamic(
  () => import('src/components/OnchainProviders'),
  {
    ssr: false,
  },
);

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'Tic-Tac-Toe',
  description: 'Tic-Tac-Toe on Blockchain',
  openGraph: {
    title: 'Tic-Tac-Toe',
    description: 'Tic-Tac-Toe on Blockchain',
    images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
  },
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center">
        <OnchainProviders>
          <div className="flex flex-col min-h-screen">
            <Header />
            {children}
            <Footer />
          </div>
        </OnchainProviders>
      </body>
    </html>
  );
}

