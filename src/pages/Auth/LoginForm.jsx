import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import Alert from '@mui/material/Alert'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import { ReactComponent as Google } from '~/assets/auth/google.svg'
import { ReactComponent as Facebook } from '~/assets/auth/facebook.svg'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import { useForm } from 'react-hook-form'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUserApi } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'
import Divider from '@mui/material/Divider'
import SvgIcon from '@mui/material/SvgIcon'
import { API_ROOT } from '~/utils/constants'

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  // Lấy giá trị email và token từ URL
  let [searchParams] = useSearchParams()
  const { registeredEmail, verifiedEmail } = Object.fromEntries([...searchParams])

  const submitLogIn = (data) => {
    const { email, password }= data
    toast.promise(
      dispatch(loginUserApi({ email, password })),
      {
        pending: 'Logging in...'
      }
    ).then((res) => {
      // Đoạn này phải kiểm tra không có lỗi thì mới redirect về route /
      if (!res.error) navigate('/')
    })
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_ROOT}/v1/users/google`
  }

  const handleFacebookLogin = () => {
    window.location.href = `${API_ROOT}/v1/users/facebook`
  }

  const handleDemoLogin = () => {
    const email = import.meta.env.VITE_DEMO_USER_EMAIL
    const password = import.meta.env.VITE_DEMO_USER_PASSWORD
    toast.promise(
      dispatch(loginUserApi({ email, password })),
      {
        pending: 'Logging in...'
      }
    ).then((res) => {
      if (!res.error) navigate('/')
    })
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      {/* MuiCard sẽ hiện ra sau 200ms với hiệu ứng phóng to dần. */}
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em', marginBottom: '2em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}><TrelloIcon /></Avatar>
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', color: theme => theme.palette.grey[500] }}>
            Author: AnhLong
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
            {verifiedEmail &&
              <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Your email&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{verifiedEmail}</Typography>
                &nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
              </Alert>
            }
            {registeredEmail &&
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                An email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{registeredEmail}</Typography>
                <br />Please check and verify your account before logging in!
              </Alert>
            }
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                error={!!errors['email']}
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: errors['email'] ? '' : 'primary.main' }
                  }
                }}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'}/>
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                error={!!errors['password']}
                label="Enter Password..."
                type="password"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: errors['password'] ? '' : 'primary.main' }
                  }
                }}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'}/>
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              className='interceptor-loading'
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ paddingY: '10px', fontSize: '16px' }}
            >
              Login
            </Button>
          </CardActions>

          {/* Divider với text "hoặc" */}
          <Box sx={{ padding: '0 1em', marginBottom: '1em' }}>
            <Divider sx={{
              fontSize: '14px',
              color: (theme) => theme.palette.grey[600]
            }}>
              Or continue with
            </Divider>
          </Box>

          <Box sx={{ padding: '0 1em 1em 1em', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              onClick={handleDemoLogin}
              variant="outlined"
              color="inherit"
              size="large"
              fullWidth
              startIcon={<RocketLaunchIcon fontSize="small" sx={{ color: '#1976d2' }} />}
              sx={{
                borderColor: theme => theme.palette.grey[400],
                color: '#191919',
                fontSize: '16px',
                fontWeight: 400,
                justifyContent: 'flex-start',
                paddingY: '10px',
                paddingLeft: '30px',
                '&:hover': {
                  borderColor: theme => theme.palette.grey[400],
                  backgroundColor: theme => theme.palette.grey[50]
                },
                '& .MuiButton-startIcon': {
                  marginRight: '15px'
                }
              }}
            >
              Continue as Demo User
            </Button>

            <Button
              onClick={handleGoogleLogin}
              variant="outlined"
              color="inherit"
              size="large"
              fullWidth
              startIcon={<SvgIcon component={Google} inheritViewBox fontSize="small" />}
              sx={{
                borderColor: theme => theme.palette.grey[400],
                color: '#191919',
                fontSize: '16px',
                fontWeight: 400,
                justifyContent: 'flex-start',
                paddingY: '10px',
                paddingLeft: '30px',
                '&:hover': {
                  borderColor: theme => theme.palette.grey[400],
                  backgroundColor: theme => theme.palette.grey[50]
                },
                '& .MuiButton-startIcon': {
                  marginRight: '15px'
                }
              }}
            >
              Continue with Google
            </Button>
            <Button
              onClick={handleFacebookLogin}
              variant="outlined"
              color="inherit"
              size="large"
              fullWidth
              startIcon={<SvgIcon component={Facebook} inheritViewBox fontSize="small" />}
              sx={{
                borderColor: theme => theme.palette.grey[400],
                color: '#191919',
                fontSize: '16px',
                fontWeight: 400,
                justifyContent: 'flex-start',
                paddingY: '10px',
                paddingLeft: '30px',
                '&:hover': {
                  borderColor: theme => theme.palette.grey[400],
                  backgroundColor: theme => theme.palette.grey[50]
                },
                '& .MuiButton-startIcon': {
                  marginRight: '15px'
                }
              }}
            >
              Continue with Facebook
            </Button>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>Don't have an account?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Create account!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
