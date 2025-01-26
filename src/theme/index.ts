import { extendTheme } from '@chakra-ui/react';

const colors = {
  navy: {
    900: '#0B1120',
    800: '#141B2D',
    700: '#1A2236',
    600: '#252D42',
  },
  purple: {
    300: '#B794F4',
    400: '#9F7AEA',
    500: '#805AD5',
    600: '#6B46C1',
  },
  whiteAlpha: {
    50: 'rgba(255, 255, 255, 0.04)',
    100: 'rgba(255, 255, 255, 0.06)',
    200: 'rgba(255, 255, 255, 0.08)',
    300: 'rgba(255, 255, 255, 0.16)',
    400: 'rgba(255, 255, 255, 0.24)',
    500: 'rgba(255, 255, 255, 0.36)',
    600: 'rgba(255, 255, 255, 0.48)',
    700: 'rgba(255, 255, 255, 0.64)',
    800: 'rgba(255, 255, 255, 0.80)',
    900: 'rgba(255, 255, 255, 0.92)',
  },
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'lg',
      _focus: {
        boxShadow: 'none',
      },
    },
    variants: {
      solid: {
        bg: 'purple.500',
        color: 'white',
        _hover: {
          bg: 'purple.600',
          _disabled: {
            bg: 'purple.500',
          },
        },
      },
      outline: {
        borderColor: 'purple.500',
        color: 'purple.400',
        _hover: {
          bg: 'whiteAlpha.100',
        },
      },
      ghost: {
        color: 'gray.300',
        _hover: {
          bg: 'whiteAlpha.100',
          color: 'purple.400',
        },
      },
      gradient: {
        bg: 'linear-gradient(135deg, purple.500 0%, blue.500 100%)',
        color: 'white',
        _hover: {
          opacity: 0.9,
        },
        _active: {
          opacity: 0.8,
        },
      },
      glass: {
        bg: 'whiteAlpha.100',
        backdropFilter: 'blur(10px)',
        color: 'white',
        _hover: {
          bg: 'whiteAlpha.200',
        },
      },
    },
    defaultProps: {
      variant: 'solid',
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          bg: 'navy.900',
          borderColor: 'whiteAlpha.300',
          _hover: {
            bg: 'navy.800',
            borderColor: 'purple.400',
          },
          _focus: {
            bg: 'navy.800',
            borderColor: 'purple.400',
          },
        },
      },
    },
    defaultProps: {
      variant: 'filled',
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: 'navy.800',
        borderWidth: '1px',
        borderColor: 'whiteAlpha.200',
        borderRadius: 'xl',
      },
    },
  },
  Link: {
    baseStyle: {
      _hover: {
        textDecoration: 'none',
        color: 'purple.400',
      },
    },
  },
};

const styles = {
  global: {
    body: {
      bg: 'navy.900',
      color: 'white',
    },
    '::-webkit-scrollbar': {
      width: '10px',
    },
    '::-webkit-scrollbar-track': {
      bg: 'navy.900',
    },
    '::-webkit-scrollbar-thumb': {
      bg: 'whiteAlpha.200',
      borderRadius: '10px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      bg: 'whiteAlpha.300',
    },
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  colors,
  components,
  styles,
  config,
});
