import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ToastContainer } from 'react-toastify'
//Cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

//Cấu hình Redux Store
import { Provider } from 'react-redux'
import { store } from './redux/store'

// Cấu hình react-router-dom với browser-router
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider defaultOptions={{
          allowClose: false,
          dialogProps: { maxWidth:'xs' },
          confirmationButtonProps: { color: 'error', variant: 'outlined' },
          cancellationButtonProps: { color: 'inherit' }
        }}>
          <CssBaseline />
          <App />
          <ToastContainer position="bottom-right" theme="colored" closeOnClick autoClose={3000} />
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
)
