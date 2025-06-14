import { useColorScheme } from '@mui/material'
import Container from '@mui/material/Container'
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
        <MenuItem value="light">
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <LightModeIcon fontSize='small' /> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
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

function App() {
  return (
    // dùng Container thì nó giống bootstrap thục vào giữa để màn hình full luôn thì có thuộc tính
    //disableGutters mặc định là false ghi thêm vào thì là true  Loại bỏ padding trái và phải
    //  thêm maxWidth false nghĩa là Container sẽ chiếm toàn bộ chiều rộng (width: 100%). mặc định là 'lg'
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <Box sx={{
        backgroundColor: 'primary.light',
        width: '100%',
        // cách lấy thuộc tính tự tạo ở theme (tại sao phải dùng vì có hàm tính toán calc nếu ta đổi height ở thằng này thì xuống dưới calc phải sửa lại)
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}>
        <ModeSelect />
      </Box>
      <Box sx={{
        backgroundColor: 'primary.dark',
        width: '100%',
        // height: '58px',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}>
        Board Bar
      </Box>
      <Box sx={{
        backgroundColor: 'primary.main',
        // ``string literal
        height: (theme) => `calc(100vh - ${theme.trello.boardBarHeight} - ${theme.trello.appBarHeight})`,
        // height: 'calc(100vh - 48px - 58px)',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
      >
        Board content
      </Box>
    </Container>
  )
}

export default App
