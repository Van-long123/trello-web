import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
const MENU_STYLE = {
  color: 'primary.main',
  backgroundColor: 'white',
  border: 'none',
  padding: '5px',
  borderRadius: '4px',
  //xét icon
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  },
  '& .MuiChip-label': {
    marginTop: '2px'
  }
}
function BoardBar() {
  return (
    <>
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        borderTop: '1px solid #00bfa5'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            sx={MENU_STYLE}
            icon={<DashboardIcon />}
            label="Anh Long"
            clickable
          // onClick= {() => {}}
          />
          <Chip
            sx={MENU_STYLE}
            icon={<VpnLockIcon />}
            label="Public/Private Workspace"
            clickable
          />
          <Chip
            sx={MENU_STYLE}
            icon={<AddToDriveIcon />}
            label="Add To Google Drive"
            clickable
          />
          <Chip
            sx={MENU_STYLE}
            icon={<BoltIcon />}
            label="Automation"
            clickable
          />
          <Chip
            sx={MENU_STYLE}
            icon={<FilterListIcon />}
            label="Filter"
            clickable
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="outlined" startIcon={<PersonAddIcon />}>Invite</Button>
          {/* để  total={24} thì cái tròn cuối cùng nó ko tính mấy thằng còn dư lại ở trong group mà nó là 24 - 3(avatar hiện)*/}
          <AvatarGroup
            max={7}
            title='Anh Long'
            sx={{
              '& .MuiAvatar-root':{
                width: '34px',
                height: '34px',
                fontSize: '16px'
              }
            }}
          >
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
            <Tooltip>
              <Avatar alt="Anh Long"
                src="https://res.cloudinary.com/dm5pbyp9g/image/upload/v1740403545/vbqq0g8h7jzxglhmyd1z.jpg" 
              />
            </Tooltip>
          </AvatarGroup>
        </Box>
      </Box>
    </>
  )
}
export default BoardBar
