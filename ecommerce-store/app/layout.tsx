// app/layout.tsx

import type { Metadata } from 'next';
import { Urbanist } from 'next/font/google';

import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import ModalProvider from '@/providers/modal-provider';
import { ToasterProvider } from '@/providers/toast-provider';
import IpBlocker from '@/components/IpBlocker';

import './globals.css';
import getBlockIps from '@/actions/get-blockIps';
import FacebookPixel from './FacebookPixel';

const font = Urbanist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Store',
  description: 'Store',
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blockIps = await getBlockIps();
  const facebookPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  return (
    <html lang="en">
      <head>
        <FacebookPixel facebookPixelId={facebookPixelId} />
      </head>
      <body className={font.className}>
        <ModalProvider />
        <ToasterProvider />
        <IpBlocker blockIps={blockIps}>
          <Navbar />
          {children}
          <Footer />
        </IpBlocker>
      </body>
    </html>
  );
}
