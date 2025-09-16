'use client';

import { cn } from '@/lib/design-system';

interface HashtagLinkProps {
  hashtag: string;
  onClick?: (hashtag: string) => void;
  className?: string;
}

export function HashtagLink({ hashtag, onClick, className }: HashtagLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(hashtag);
    } else {
      // Default behavior: navigate to hashtag page
      // In a real app, this would use Next.js router
      window.location.href = `/hashtag/${encodeURIComponent(hashtag)}`;
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
      aria-label={`View hashtag ${hashtag}`}
    >
      #{hashtag}
    </button>
  );
}