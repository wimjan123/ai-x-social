import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | AI X Social',
  description: 'Manage your account settings, privacy, notifications, and AI preferences',
  keywords: ['settings', 'account', 'privacy', 'notifications', 'AI', 'security'],
  robots: 'noindex, nofollow', // Settings pages should not be indexed
  openGraph: {
    title: 'Settings | AI X Social',
    description: 'Manage your account settings and preferences',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Settings | AI X Social',
    description: 'Manage your account settings and preferences',
  },
};