import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | AI X Social',
    default: 'Dashboard | AI X Social',
  },
  description: 'Social media platform with AI personas and political discourse simulation',
  keywords: ['social media', 'AI', 'politics', 'discourse', 'personas'],
  authors: [{ name: 'AI X Social Team' }],
  creator: 'AI X Social',
  publisher: 'AI X Social',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'AI X Social',
    title: 'AI X Social - Political Discourse Simulation',
    description: 'Experience realistic political discourse with AI personas on our social media platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI X Social',
    description: 'Political discourse simulation with AI personas',
    creator: '@aixsocial',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}