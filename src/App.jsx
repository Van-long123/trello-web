import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import HomeIcon from '@mui/icons-material/Home'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { pink } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
function App() {
  return (
    <>
      <div>Contained</div>
      <Typography variant='body2' color="text.secondary">Test Typography</Typography>
      <Button variant="text" color='success'>Text</Button>
      <Button variant="contained" startIcon={<DeleteIcon />}>Contained</Button>
      <Button variant="outlined" endIcon={<SendIcon />}>Outlined</Button>
      <AccessAlarmIcon />
      <ThreeDRotation />
      <br />
      <HomeIcon />
      <HomeIcon color="primary" />
      <HomeIcon color="secondary" />
      <HomeIcon color="success" />
      <HomeIcon color="action" />
      <HomeIcon color="disabled" />
      <HomeIcon sx={{ color: pink[100] }} />
    </>
  )
}

export default App
