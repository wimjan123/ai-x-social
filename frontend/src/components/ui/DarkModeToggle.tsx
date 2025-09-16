'use client';

import { useColorMode, IconButton, useColorModeValue } from '@chakra-ui/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

interface DarkModeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'solid';
  className?: string;
}

export function DarkModeToggle({
  size = 'md',
  variant = 'ghost',
  className = '',
}: DarkModeToggleProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  // Sync Chakra UI color mode with Tailwind dark class
  useEffect(() => {
    const isDark = colorMode === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save preference to localStorage
    localStorage.setItem('theme', colorMode);
  }, [colorMode]);

  const icon = useColorModeValue(<Moon size={18} />, <Sun size={18} />);
  const ariaLabel = useColorModeValue(
    'Switch to dark mode',
    'Switch to light mode'
  );
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <IconButton
      aria-label={ariaLabel}
      icon={icon}
      onClick={toggleColorMode}
      size={size}
      variant={variant}
      className={`transition-all duration-200 ${className}`}
      _hover={{
        bg: hoverBg,
        transform: 'scale(1.05)',
      }}
      _active={{
        transform: 'scale(0.95)',
      }}
      title={ariaLabel}
    />
  );
}

export default DarkModeToggle;
