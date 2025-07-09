import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  // {/*  prop theme của ThemeProvider*/}
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer position="bottom-left" theme="colored" closeOnClick autoClose={3000} />
  </CssVarsProvider>
  // {/* </React.StrictMode> */}
)
