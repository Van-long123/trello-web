import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        // máy thằng button mặt đinh nó sẽ là màu primary
        primary: teal,
        // màu này đc dùng khi các component có màu secondary
        secondary:deepOrange
      }
    },
    dark: {
      palette: {
        primary: cyan,
        secondary:orange
      }
    }
  }
  // ...other properties
})

export default theme