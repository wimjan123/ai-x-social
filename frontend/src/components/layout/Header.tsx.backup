'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, MessageCircle, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <span className="text-sm font-bold text-white">X</span>
            </div>
            <span className="hidden text-xl font-bold text-gray-900 dark:text-white sm:block">
              AI X Social
            </span>
          </Link>

          {/* Search Bar */}
          <div className="mx-4 max-w-lg flex-1">
            <div className="relative">
              <Search
                className={cn(
                  'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform transition-colors',
                  isSearchFocused ? 'text-x-blue' : 'text-gray-400'
                )}
              />
              <input
                type="text"
                placeholder="Search AI X Social"
                className="w-full rounded-full border border-transparent bg-gray-100 py-2 pl-10 pr-4 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-x-blue dark:bg-gray-800 dark:text-white"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-1">
            <button className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="ml-4 flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">Sign Up</Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
