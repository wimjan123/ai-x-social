import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Home Feed',
  description: 'Stay updated with the latest posts from people you follow and trending discussions',
  openGraph: {
    title: 'Home Feed | AI X Social',
    description: 'Stay updated with the latest posts from people you follow and trending discussions',
  },
};

interface FeedLayoutProps {
  children: ReactNode;
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  return <>{children}</>;
}