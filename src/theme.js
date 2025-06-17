import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  // tự tạo ra thuộc tính
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {
    light: {
      palette: {
        // máy thằng button mặt đinh nó sẽ là màu primary
        // màu main sẽ là teal còn light nó nhẹ hơn,dark nó nặng hơn
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
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // * là apply cho toàn bộ scrollbar
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdc3c7',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#00b894'
          }
        }
      }
    },
    // dùng để tùy chỉnh giao diện của Button
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    // .MuiFormLabel-root
    MuiFormLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem'
        })
      }
    },
    // MuiOutlinedInput-root
    MuiOutlinedInput: {
      styleOverrides: {
        // dùng function để sử dụng theme
        // return {} thì để ngoặc nhọn ở ngoài nữa
        root: ({ theme }) => ({
          // console.log(theme)
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
          // tiếp theo là cái border đường viền bên ngoài
          // https://stackoverflow.com/questions/69860132/how-to-remove-the-border-of-the-material-ui-select-component/73707977#73707977
          // MuiOutlinedInput-notchedOutline là phần tử con (child) của MuiOutlinedInput
          // '.MuiOutlinedInput-notchedOutline': {
          '& .MuiOutlinedInput-notchedOutline': {
            // để thằng này ở ngoài thì ko ăn phải để trong này
            borderColor: theme.palette.primary.light
          },
          // & là chính MuiOutlinedInput luôn
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              // để thằng này ở ngoài thì ko ăn phải để trong này
              borderColor: theme.palette.primary.main
            }
          },
          // khi click vào các input thì nó đậm lên cách để bỏ đi là f12 lên tìm thằng fieldset (cách bỏ)
          // '& fieldset' nghĩa là: "khi ở trong MuiOutlinedInput-root, chọn thẻ <fieldset> con".
          // 'fieldset': { //để này thì nó cũng hiểu là .MuiOutlinedInput-root fieldset
          '& fieldset': {
            borderWidth: '1px !important'
          }
        })
      }
    }
  }
})

export default theme