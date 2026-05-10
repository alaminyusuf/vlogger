import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    black: '#16161D',
  },
  fonts: {
    mono: `'Menlo', monospace`,
  },
  breakpoints: {
    sm: '40em',
    md: '52em',
    lg: '64em',
  },
})

export default theme
