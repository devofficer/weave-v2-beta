import { extendTheme } from '@chakra-ui/react'
const breakpoints = {
  base: '0',
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1440px',
  '2xl': '1536px',
}


export const theme = extendTheme({
  breakpoints,
  fonts: {
    heading: `"Blinker", sans-serif`,
    body: `"Blinker", sans-serif`,
  },
  colors: {
    black: '#16161D',
    // light: {
    //   /* eslint-disable @typescript-eslint/naming-convention, sort-keys */
    //   "50": "#edffff",
    //   "100": "#83dee0",
    //   "200": "#6ad9d9",
    //   "300": "#4fc9cb",
    //   "400": "#34a6b8",
    //   "500": "#126784",
    //   "600": "#1f7493",
    //   "700": "#2a597b",
    //   "800": "#1b2f50",
    //   "900": "#1e2b3e"
    //   /* eslint-enable @typescript-eslint/naming-convention, sort-keys */
    // },
    light: {
      /* eslint-disable @typescript-eslint/naming-convention, sort-keys */
      "50": "#e3fafc",
      "100": "#c5f6fa",
      "200": "#99e9f2",
      "300": "#66d9e8",
      "400": "#3bc9db",
      "500": "#22b8cf",
      "600": "#15aabf",
      "700": "#1098ad",
      "800": "#0c8599",
      "900": "#0b7285"
      /* eslint-enable @typescript-eslint/naming-convention, sort-keys */
    },
    dark: {
      /* eslint-disable @typescript-eslint/naming-convention, sort-keys */
      "50": "#d0dcfb",
      "100": "#aac0fe",
      "200": "#a3b9f8",
      "300": "#728fea",
      "400": "#3652ba",
      "500": "#1b3bbb",
      "600": "#24388a",
      "700": "#1B254B",
      "800": "#111c44",
      "900": "#0b1437"
      /* eslint-enable @typescript-eslint/naming-convention, sort-keys */
    },
    secGray: {
      /* eslint-disable @typescript-eslint/naming-convention, sort-keys */
      "100": "#E0E5F2",
      "200": "#E1E9F8",
      "300": "#F4F7FE",
      "400": "#E9EDF7",
      "500": "#8F9BBA",
      "600": "#1b3bbb",
      "700": "#A3AED0",
      "800": "#707EAE",
      "900": "#1B2559"
      /* eslint-enable @typescript-eslint/naming-convention, sort-keys */
    },

    gradient: {
      '100': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)'
    },

    slider: {
      /* eslint-disable @typescript-eslint/naming-convention, sort-keys */
      '100': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)',
      '200': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)',
      '300': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)',
      '400': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)',
      '500': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)',
      '600': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)',
      '700': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)',
      '800': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)',
      '900': 'linear-gradient(135deg, rgb(134, 140, 255) 0%, rgb(67, 24, 255) 100%)',
      /* eslint-enable @typescript-eslint/naming-convention, sort-keys */
    }

  },
  layerStyles: {
    dropdown: {
      bg: 'white',
      color: 'gray.700',
    }
  }
})