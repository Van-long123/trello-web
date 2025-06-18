import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
// import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
const APP_BAR_HEIGHT= '58px'
const BOARD_BAR_HEIGHT= '60px'
const BOARD_CONTENT_HEIGHT= `calc(100vh - ${BOARD_BAR_HEIGHT} - ${APP_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '50px'
// Create a theme instance.
const theme = extendTheme({
  // tự tạo ra thuộc tính
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },
  colorSchemes: {
    // light: {
    //   palette: {
    //     // máy thằng button mặt đinh nó sẽ là màu primary
    //     // màu main sẽ là teal còn light nó nhẹ hơn,dark nó nặng hơn, còn co 50,100...
    //     primary: teal,
    //     // màu này đc dùng khi các component có màu secondary
    //     secondary:deepOrange
    //   }
    // },
    // dark: {
    //   palette: {
    //     primary: cyan,
    //     secondary:orange
    //   }
    // }
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          // Typography ko khai báo variant thì mặc định là body 1 vì thế ta chỉ nên ghi đề
          // những thằng body1 thôi chớ để variant="h1" thì nó ghi đè thành '0.875rem'
          // fontSize: '0.875rem'
          '&.MuiTypography-body1': {
            fontSize: '0.875rem'
          }
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // * là apply cho toàn bộ scrollbar
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white'
          }
        }
      }
    },
    // dùng để tùy chỉnh giao diện của Button
    MuiButton: {
      styleOverrides: {
        root: {
          // chữ hoa,thường
          textTransform: 'none'
        }
      }
    },
    // .MuiFormLabel-root
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          // color: theme.palette.primary.main,
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
          // color: theme.palette.primary.main,
          fontSize: '0.875rem',
          // tiếp theo là cái border đường viền bên ngoài
          // https://stackoverflow.com/questions/69860132/how-to-remove-the-border-of-the-material-ui-select-component/73707977#73707977
          // MuiOutlinedInput-notchedOutline là phần tử con (child) của MuiOutlinedInput
          // '.MuiOutlinedInput-notchedOutline': {
          '& .MuiOutlinedInput-notchedOutline': {
            // để thằng này ở ngoài thì ko ăn phải để trong này
            // borderColor: theme.palette.primary.light
          },
          // & là chính MuiOutlinedInput luôn
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              // để thằng này ở ngoài thì ko ăn phải để trong này
              // borderColor: theme.palette.primary.main
            }
          },
          // khi click vào các input thì nó đậm lên cách để bỏ đi là f12 lên tìm thằng fieldset (cách bỏ)
          // '& fieldset' nghĩa là: "khi ở trong MuiOutlinedInput-root, chọn thẻ <fieldset> con".
          // 'fieldset': { //để này thì nó cũng hiểu là .MuiOutlinedInput-root fieldset
          // fieldset và .MuiOutlinedInput-notchedOutline là một
          '& fieldset': { borderWidth: '1px !important' },
          '&:hover fieldset': { borderWidth: '2px !important' },
          '&.Mui-focused fieldset': { borderWidth: '2px !important' }
        })
      }
    }
  }
})

export default theme