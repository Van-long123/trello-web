import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import MobileMenu from './Menus/MobileMenu'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { Link } from 'react-router-dom'
import Notifications from '~/components/AppBar/Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <>
      <Box px={2} sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
        '&::-webkit-scrollbar-track': { m:2 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link to='/boards'>
            <Tooltip title='Board List'>
              <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
            </Tooltip>
          </Link>
          <Link to="/">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'white' }} fontSize="small" />
              <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Trello</Typography>
            </Box>
          </Link>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* <Workspaces />
            <Recent />
            <Starred />
            <Templates />
            <Button
              sx={{
                color: 'white',
                border: 'none',
                '&:hover': {
                  border: 'none'
                }
              }}
              variant="outlined"
              startIcon={<AddToPhotosIcon/>}
            >
              Create
            </Button> */}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
          <AutoCompleteSearchBoard />
          {/* Dark - Light - System Modes */}
          <ModeSelect />
          {/* <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}> */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            <Notifications />

            <Tooltip title="Help" sx={{ cursor: 'pointer' }}>
              <HelpOutlineIcon sx={{ color: 'white' }} />
            </Tooltip>
            <Profiles />
          </Box>
          {/* <MobileMenu /> */}
        </Box>
      </Box>
    </>
  )
}
export default AppBar
