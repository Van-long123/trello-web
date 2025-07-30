import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import {
  logoutUserApi
} from '~/redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { useConfirm } from 'material-ui-confirm'
import { Link } from 'react-router-dom'

function ProfileMenuContent({ currentUser, handleCloseMenu }) {

  const dispatch = useDispatch()

  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: 'Log out of your account?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      dispatch(logoutUserApi())
      handleCloseMenu()
    }).catch(() => {})
  }

  return (
    <>
      <Link to="/settings/account" >
        <MenuItem sx={{
          '&:hover': { color: 'success.light' }
        }}>
          <Avatar sx={{ width: 30, height: 30, mr: 2 }} src={currentUser?.avatar} /> Profile
        </MenuItem>
      </Link>
      <Divider />
      <MenuItem>
        <ListItemIcon>
          <PersonAdd fontSize="small" />
        </ListItemIcon>
        Add another account
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={handleLogout} sx={{
        '&:hover': { color: 'warning.dark', '& .logout-icon': { color: 'warning.dark' } }
      }}
      >
        <ListItemIcon>
          <Logout fontSize="small" className="logout-icon"/>
        </ListItemIcon>
        Logout
      </MenuItem>
    </>
  )
}
export default ProfileMenuContent
