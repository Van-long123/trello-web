import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MoreIcon from '@mui/icons-material/MoreVert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ProfileMenuContent from './ProfileMenuContent'
import { useSelector } from 'react-redux'
import { selectorCurrentUser } from '~/redux/user/userSlice'
import Notifications from '~/components/AppBar/Notifications/Notifications'

function MobileMenu() {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =React.useState(null)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl) // truyển sang kiểu boolean
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }
  const currentUser = useSelector(selectorCurrentUser)
  const renderMenu = (
    <Menu
      id="basic-menu-profiles"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button-profiles'
      }}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      <ProfileMenuContent currentUser={currentUser}/>
    </Menu>
  )
  const mobileMenuId = 'primary-search-account-menu-mobile'
  return (
    <>
      <Box sx={{ display: { xs: 'flex', md: 'none' }, color: 'primary.main' }}>
        <IconButton
          sx={{ color: 'white' }}
          size="large"
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
      </Box>
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem onClick={handleClick} sx={{ marginLeft: '-4.5px' }}>
          <IconButton
            size="small"
            sx={{ padding: 0 }}
            aria-controls={open ? 'basic-menu-profiles' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
              sx={{ width: 36, height: 36 }}
              alt={currentUser?.displayName}
              src={currentUser?.avatar}
            />
          </IconButton>
          <Typography variant='body1' p={2}>Profile</Typography>
        </MenuItem>
        <MenuItem>
          {/* <Notifications/> */}
        </MenuItem>
        <MenuItem>
          <Tooltip title="Help" sx={{ cursor: 'pointer' }}>
            <HelpOutlineIcon />
          </Tooltip>
          <Typography p= {2}>Help</Typography>
        </MenuItem>
      </Menu>
      {renderMenu}
    </>
  )
}

export default MobileMenu
