import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MoreIcon from '@mui/icons-material/MoreVert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ProfileMenuContent from './ProfileMenuContent'
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
  const renderMenu = (
    <Menu
      id="basic-menu-profiles"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button-profiles'
      }}
    >
      <ProfileMenuContent />
    </Menu>
  )
  const mobileMenuId = 'primary-search-account-menu-mobile'
  return (
    <>
      <Box sx={{ display: { xs: 'flex', md: 'none' }, color: 'primary.main' }}>
        <IconButton
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
          // menu sẽ mở ở dưới bên phải
          vertical: 'bottom',
          horizontal: 'right'
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          // menu sẽ "mở ra" từ góc trên bên phải của chính nó
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
              sx={{ width: 30, height: 30 }}
              alt='Beautiful'
              src='https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg'
            />
          </IconButton>
          <Typography variant='body1' p={2}>Profile</Typography>
        </MenuItem>
        <MenuItem>
          <Tooltip title="Notifications" >
            <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }}>
              <NotificationsNoneIcon sx={{ color: 'primary.main' }} />
            </Badge>
          </Tooltip>
          <Typography p= {2}>Notifications</Typography>
        </MenuItem>
        <MenuItem>
          <Tooltip title="Help" sx={{ cursor: 'pointer' }}>
            <HelpOutlineIcon sx={{ color: 'primary.main' }} />
          </Tooltip>
          <Typography p= {2}>Help</Typography>
        </MenuItem>
      </Menu>
      {renderMenu}
    </>
  )
}

export default MobileMenu
