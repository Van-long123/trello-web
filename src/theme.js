import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light', //light là default
    primary: {
      // main: red[500]
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    text: {
      secondary: red[500]
    }
  }
})

export default theme