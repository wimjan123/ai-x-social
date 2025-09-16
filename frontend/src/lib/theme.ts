import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', 'TwitterChirp', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
    body: `'Inter', 'TwitterChirp', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
  },
  colors: {
    // X-inspired colors
    x: {
      50: '#f7f9fa',
      100: '#e1e8ed',
      200: '#aab8c2',
      300: '#657786',
      400: '#536471',
      500: '#0f1419',
      600: '#15202b',
      700: '#0f1419',
      800: '#000000',
      900: '#000000',
    },

    // X Blue brand color
    xBlue: {
      50: '#e8f5fd',
      100: '#bee3f8',
      200: '#90cdf4',
      300: '#63b3ed',
      400: '#4299e1',
      500: '#1da1f2',
      600: '#1a91da',
      700: '#1570a6',
      800: '#105d8d',
      900: '#0a4a6b',
    },

    // Political alignment colors
    political: {
      conservative: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      liberal: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      progressive: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      moderate: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
    },

    // Influence level colors
    influence: {
      minimal: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      emerging: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
      },
      rising: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      influential: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      viral: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
      },
    },

    // Engagement colors
    engagement: {
      like: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#f91880',
        600: '#ec4899',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
      },
      repost: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#00ba7c',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
      },
      comment: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#1da1f2',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },
  },

  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: '9999px',
        transition: 'all 0.2s ease-in-out',
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        'x-primary': {
          bg: 'xBlue.500',
          color: 'white',
          _hover: {
            bg: 'xBlue.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'xBlue.700',
            transform: 'translateY(0)',
          },
        },
        'x-secondary': {
          bg: 'transparent',
          color: 'xBlue.500',
          border: '1px solid',
          borderColor: 'xBlue.500',
          _hover: {
            bg: 'xBlue.50',
            transform: 'translateY(-1px)',
          },
          _dark: {
            _hover: {
              bg: 'xBlue.900',
            },
          },
        },
        'x-ghost': {
          bg: 'transparent',
          color: 'x.500',
          _hover: {
            bg: 'gray.100',
          },
          _dark: {
            color: 'x.100',
            _hover: {
              bg: 'gray.700',
            },
          },
        },
        'political-conservative': {
          bg: 'political.conservative.500',
          color: 'white',
          _hover: {
            bg: 'political.conservative.600',
          },
        },
        'political-liberal': {
          bg: 'political.liberal.500',
          color: 'white',
          _hover: {
            bg: 'political.liberal.600',
          },
        },
        'political-progressive': {
          bg: 'political.progressive.500',
          color: 'white',
          _hover: {
            bg: 'political.progressive.600',
          },
        },
        'influence-viral': {
          bg: 'influence.viral.500',
          color: 'white',
          _hover: {
            bg: 'influence.viral.600',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
          },
        },
      },
      sizes: {
        'x-sm': {
          h: '32px',
          minW: '32px',
          fontSize: 'sm',
          px: 4,
        },
        'x-md': {
          h: '40px',
          minW: '40px',
          fontSize: 'md',
          px: 6,
        },
        'x-lg': {
          h: '48px',
          minW: '48px',
          fontSize: 'lg',
          px: 8,
        },
      },
    },

    Card: {
      baseStyle: {
        container: {
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'gray.200',
          bg: 'white',
          transition: 'all 0.2s ease-in-out',
          _hover: {
            borderColor: 'gray.300',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
          _dark: {
            bg: 'gray.800',
            borderColor: 'gray.700',
            _hover: {
              borderColor: 'gray.600',
            },
          },
        },
      },
      variants: {
        'x-post': {
          container: {
            p: 4,
            cursor: 'pointer',
            borderRadius: '0',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: '1px solid',
            borderBottomColor: 'gray.100',
            _hover: {
              bg: 'gray.50',
              transform: 'none',
              boxShadow: 'none',
            },
            _dark: {
              borderBottomColor: 'gray.700',
              _hover: {
                bg: 'gray.900',
              },
            },
          },
        },
        'political-glow': (props: any) => {
          const { colorScheme } = props;
          return {
            container: {
              position: 'relative',
              _before: {
                content: '""',
                position: 'absolute',
                inset: '-1px',
                borderRadius: '16px',
                p: '1px',
                background: `linear-gradient(45deg, ${
                  colorScheme === 'conservative'
                    ? '#dc2626, #fca5a5'
                    : colorScheme === 'liberal'
                      ? '#2563eb, #93c5fd'
                      : colorScheme === 'progressive'
                        ? '#7c3aed, #c4b5fd'
                        : '#0ea5e9, #7dd3fc'
                })`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
              },
            },
          };
        },
      },
    },

    Avatar: {
      baseStyle: {
        container: {
          border: '2px solid',
          borderColor: 'white',
          _dark: {
            borderColor: 'gray.800',
          },
        },
      },
      variants: {
        'political-conservative': {
          container: {
            borderColor: 'political.conservative.500',
          },
        },
        'political-liberal': {
          container: {
            borderColor: 'political.liberal.500',
          },
        },
        'political-progressive': {
          container: {
            borderColor: 'political.progressive.500',
          },
        },
        'influence-glow': {
          container: {
            boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.3)',
            animation: 'pulse 2s infinite',
          },
        },
      },
    },

    Badge: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: 'semibold',
        fontSize: 'xs',
        px: 2,
        py: 1,
      },
      variants: {
        'political-conservative': {
          bg: 'political.conservative.100',
          color: 'political.conservative.800',
        },
        'political-liberal': {
          bg: 'political.liberal.100',
          color: 'political.liberal.800',
        },
        'political-progressive': {
          bg: 'political.progressive.100',
          color: 'political.progressive.800',
        },
        'influence-minimal': {
          bg: 'influence.minimal.100',
          color: 'influence.minimal.800',
        },
        'influence-emerging': {
          bg: 'influence.emerging.100',
          color: 'influence.emerging.800',
        },
        'influence-rising': {
          bg: 'influence.rising.100',
          color: 'influence.rising.800',
        },
        'influence-influential': {
          bg: 'influence.influential.100',
          color: 'influence.influential.800',
        },
        'influence-viral': {
          bg: 'influence.viral.100',
          color: 'influence.viral.800',
          animation: 'pulse 2s infinite',
        },
      },
    },

    Text: {
      variants: {
        'x-username': {
          color: 'x.500',
          fontSize: 'sm',
          fontWeight: 'normal',
          _dark: {
            color: 'x.200',
          },
        },
        'x-timestamp': {
          color: 'x.300',
          fontSize: 'sm',
          _dark: {
            color: 'x.400',
          },
        },
        'x-body': {
          color: 'x.500',
          fontSize: 'md',
          lineHeight: '1.5',
          _dark: {
            color: 'x.100',
          },
        },
      },
    },

    Input: {
      variants: {
        'x-post': {
          field: {
            border: 'none',
            bg: 'transparent',
            fontSize: 'xl',
            placeholder: "What's happening?",
            _placeholder: {
              color: 'x.300',
              fontSize: 'xl',
            },
            _focus: {
              boxShadow: 'none',
              border: 'none',
            },
            resize: 'none',
          },
        },
      },
    },

    Textarea: {
      variants: {
        'x-post': {
          border: 'none',
          bg: 'transparent',
          fontSize: 'xl',
          placeholder: "What's happening?",
          _placeholder: {
            color: 'x.300',
            fontSize: 'xl',
          },
          _focus: {
            boxShadow: 'none',
            border: 'none',
          },
          resize: 'none',
          minH: '120px',
        },
      },
    },

    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: '16px',
          bg: 'white',
          _dark: {
            bg: 'gray.800',
          },
        },
        overlay: {
          bg: 'blackAlpha.600',
          backdropFilter: 'blur(4px)',
        },
      },
    },

    Drawer: {
      baseStyle: {
        dialog: {
          bg: 'white',
          _dark: {
            bg: 'gray.800',
          },
        },
        overlay: {
          bg: 'blackAlpha.600',
          backdropFilter: 'blur(4px)',
        },
      },
    },

    Menu: {
      baseStyle: {
        list: {
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'gray.200',
          bg: 'white',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          _dark: {
            bg: 'gray.800',
            borderColor: 'gray.700',
          },
        },
        item: {
          fontSize: 'sm',
          _hover: {
            bg: 'gray.50',
          },
          _dark: {
            _hover: {
              bg: 'gray.700',
            },
          },
        },
      },
    },

    Tooltip: {
      baseStyle: {
        borderRadius: '8px',
        bg: 'gray.700',
        color: 'white',
        fontSize: 'sm',
        px: 3,
        py: 2,
        _dark: {
          bg: 'gray.300',
          color: 'gray.800',
        },
      },
    },

    Progress: {
      baseStyle: {
        track: {
          borderRadius: 'full',
          bg: 'gray.200',
          _dark: {
            bg: 'gray.700',
          },
        },
        filledTrack: {
          borderRadius: 'full',
        },
      },
      variants: {
        'influence-viral': {
          filledTrack: {
            bg: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
            bgGradient:
              'linear(to-r, influence.viral.500, influence.viral.400)',
          },
        },
      },
    },
  },

  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'x.600' : 'white',
        color: props.colorMode === 'dark' ? 'x.100' : 'x.500',
        fontFamily: 'body',
        lineHeight: 'base',
      },
      '*::placeholder': {
        color: props.colorMode === 'dark' ? 'x.400' : 'x.300',
      },
      '*::-webkit-scrollbar': {
        width: '8px',
      },
      '*::-webkit-scrollbar-track': {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.100',
      },
      '*::-webkit-scrollbar-thumb': {
        bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
        borderRadius: '4px',
      },
      '*::-webkit-scrollbar-thumb:hover': {
        bg: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
      },
    }),
  },

  semanticTokens: {
    colors: {
      'x-bg': {
        default: 'white',
        _dark: 'x.600',
      },
      'x-surface': {
        default: 'white',
        _dark: 'x.700',
      },
      'x-border': {
        default: 'gray.200',
        _dark: 'gray.700',
      },
      'x-text': {
        default: 'x.500',
        _dark: 'x.100',
      },
      'x-text-muted': {
        default: 'x.300',
        _dark: 'x.400',
      },
    },
  },
});

export default theme;

// Type extensions for custom variants
declare module '@chakra-ui/react' {
  export interface ButtonProps {
    variant?:
      | 'solid'
      | 'outline'
      | 'ghost'
      | 'link'
      | 'x-primary'
      | 'x-secondary'
      | 'x-ghost'
      | 'political-conservative'
      | 'political-liberal'
      | 'political-progressive'
      | 'influence-viral';
  }

  export interface CardProps {
    variant?: 'x-post' | 'political-glow';
  }

  export interface AvatarProps {
    variant?:
      | 'political-conservative'
      | 'political-liberal'
      | 'political-progressive'
      | 'influence-glow';
  }

  export interface BadgeProps {
    variant?:
      | 'political-conservative'
      | 'political-liberal'
      | 'political-progressive'
      | 'influence-minimal'
      | 'influence-emerging'
      | 'influence-rising'
      | 'influence-influential'
      | 'influence-viral';
  }
}
