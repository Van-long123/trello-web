import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import GlobalStyles from '@mui/material/GlobalStyles';
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

// Cấu hình redux persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
let persistor = persistStore(store)

// Kỹ thuật Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from '~/utils/authoriseAxios'
injectStore(store)

import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs' // hoặc AdapterMoment nếu dùng moment

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth:'xs' },
            confirmationButtonProps: { color: 'error', variant: 'outlined' },
            cancellationButtonProps: { color: 'inherit' }
          }}>
            <CssBaseline />
            <GlobalStyles styles={{ a:{ color: 'inherit', textDecoration: 'none' } }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <App />
            </LocalizationProvider>
            <ToastContainer position="bottom-right" theme="colored" closeOnClick autoClose={3000} />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
