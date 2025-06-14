import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme'
ReactDOM.createRoot(document.getElementById('root')).render(
  //khi sử dụng React.StrictMode chạy trên môi trường dev nó sẽ render hiển thị 2 lần(console.log, goi api 2)
  <React.StrictMode>
    {/*  prop theme của ThemeProvider*/}
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </React.StrictMode>
)
