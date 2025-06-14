import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import HomeIcon from '@mui/icons-material/Home'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { pink } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material'
// import useMediaQuery from '@mui/material/useMediaQuery'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Box from '@mui/material/Box'

function ModeSelect() {
  // useState là một hook được cung cấp bởi React để quản lý trạng thái (state) bên trong functional component.
  // là ban đầu age = "" sau khi input có sự thay đổi thì gọi lại hàm setAge
  // Khi setName(...) được gọi,Component sẽ re-render (vẽ lại) với giá trị name mới
  // const [age, setAge] = React.useState('');

  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    // setAge(event.target.value)
    const selectedMode=event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="lable-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="lable-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="mode"
        onChange={handleChange}
      >
        {/* <MenuItem value="">
          <em>None</em>
        </MenuItem>
        https://v5.mui.com/material-ui/api/icon/
        */}
        <MenuItem value="light">
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <LightModeIcon fontSize='small' /> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
          { /* sử dụng box giống như sử dụng div thuần ở trên trong material bổ sung thêm box
          có một số lợi ích,tính năng
          gap 1 vẫn 8px sẽ nói ở vid sau */ }
          <Box
            sx={{ display:'flex', alignItems:'center', gap:1 }}
          >
            <DarkModeOutlinedIcon fontSize='small '/> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box
            sx={{ display:'flex', alignItems:'center', gap:1 }}
          >
            <SettingsBrightnessIcon fontSize='small '/> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}
function ModeToggle() {
  // Cài đặt > Hình thức
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)')
  // console.log('prefersDarkMode', prefersDarkMode)
  // console.log(prefersLightMode)

  // useColorScheme() chỉ chạy lại khi component render lại
  // useColorScheme() vừa là dùng để lưu trên localStorage và đổi màu giao diện,lấy màu sắc (light / dark / system) của theme.
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        // Gọi setMode(...), thay đổi giá trị mode (light ⇄ dark) và React sẽ render lại component  → useColorScheme() được gọi lại
        setMode(mode === 'light' ? 'dark' : 'light')
        // nếu ko dùng useColorScheme để ta tự set local
        // localStorage.setItem('trello-dark-light-mode','')
        // localStorage.getItem('trello-dark-light-mode')
      }}
    >
      {mode === 'light' ? 'dark' : 'light' }
    </Button>
  )
}

function App() {
  return (
    <>
      <ModeSelect />
      <hr />
      <ModeToggle />
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
