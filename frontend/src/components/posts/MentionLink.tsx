'use client';

import { cn } from '@/lib/design-system';

interface MentionLinkProps {
  username: string;
  onClick?: (username: string) => void;
  className?: string;
}

export function MentionLink({ username, onClick, className }: MentionLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(username);
    } else {
      // Default behavior: navigate to user profile
      // In a real app, this would use Next.js router
      window.location.href = `/user/${encodeURIComponent(username)}`;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'text-x-blue hover:underline font-normal transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-x-blue/20 focus:ring-offset-1 rounded',
        className
      )}
      aria-label={`View profile of ${username}`}
    >
      @{username}
    </button>
  );
}