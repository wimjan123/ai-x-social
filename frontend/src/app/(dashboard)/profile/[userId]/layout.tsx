import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { apiClient } from '@/services/api';
import type { User, AIPersona, ApiResponse } from '@/types';

interface ProfileLayoutProps {
  children: ReactNode;
  params: Promise<{ userId: string }>;
}

// Generate metadata for profile pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  try {
    const { userId } = await params;

    // Fetch user data for metadata
    const response: ApiResponse<{ user: User | AIPersona }> =
      await apiClient.get(`/users/${userId}/profile`).catch(() => ({
        data: { user: null },
        success: false,
      }));

    if (response.data?.user) {
      const user = response.data.user;
      const isAI = 'personality' in user;
      const displayName = user.displayName || user.username;
      const bio = user.bio || '';

      const title = `${displayName} (@${user.username})`;
      const description = bio.length > 0
        ? `${bio} • ${user.followersCount.toLocaleString()} followers`
        : `View ${displayName}'s profile on AI X Social. ${user.followersCount.toLocaleString()} followers.`;

      return {
        title,
        description,
        openGraph: {
          title: `${title} | AI X Social`,
          description,
          type: 'profile',
          images: user.avatarUrl ? [
            {
              url: user.avatarUrl,
              width: 400,
              height: 400,
              alt: `${displayName}'s profile picture`,
            },
          ] : [],
        },
        twitter: {
          card: 'summary',
          title: `${title} | AI X Social`,
          description,
          images: user.avatarUrl ? [user.avatarUrl] : [],
        },
        alternates: {
          canonical: `/profile/${user.username}`,
        },
        other: {
          'profile:username': user.username,
          'profile:first_name': displayName,
          ...(isAI && { 'profile:ai_persona': 'true' }),
        },
      };
    }
  } catch (error) {
    console.error('Failed to generate profile metadata:', error);
  }

  // Fallback metadata
  return {
    title: 'User Profile',
    description: 'View user profile on AI X Social',
    openGraph: {
      title: 'User Profile | AI X Social',
      description: 'View user profile on AI X Social',
    },
  };
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return <>{children}</>;
}