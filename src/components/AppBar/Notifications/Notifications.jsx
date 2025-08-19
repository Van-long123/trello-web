import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchInvitationApi,
  selectorCurrentNotification,
  updateBoardInvitationApi,
  addNotification
} from '~/redux/notifications/notificationsSlice'
import { selectorCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { socketIoInstance } from '~/socketClient'

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function Notifications() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector(selectorCurrentUser)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)

    // Khi click vào phần icon thông báo thì set lại trạng thái của biến newNotification về false
    setNewNotification(false)
    localStorage.setItem('newNotification', 'false')
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Biến state để kiểm tra có thông báo mới hay ko
  // localStorage.getItem('newNotification') trả về chuỗi nên === 'true' để trả về dạng boolean
  const [newNotification, setNewNotification] = useState(localStorage.getItem('newNotification') === 'true')

  // Lấy dữ liệu notification trong redux
  const notifications = useSelector(selectorCurrentNotification)

  // Fetch danh sách các lời mời invitations
  useEffect(() => {
    dispatch(fetchInvitationApi())
    // Tạo một cái function xử lý khi nhận được sự kiện real-time : https://socket.io/how-to/use-with-react
    const onReceiveNewInvitation = (invitation) => {
      // Nếu thằng user đang đăng nhập hiện tại trong redux chính là thằng invitee trong bản ghi invitation
      if (invitation.inviteeId === currentUser._id) {
        // Thêm bản ghi invitation mới mới vào trong redux
        dispatch(addNotification(invitation))
        // Cập nhật trạng thái đang có thông báo đến
        setNewNotification(true)
        localStorage.setItem('newNotification', 'true')
      }
    }
    // Lắng nghe sự kiện real-time BE_USER_INVITED_TO_BOARD
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    // Clean sự kiện để ngăn chặn việc bị đăng ký lặp lại sự kiện
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }
  }, [dispatch, currentUser._id])

  // Cập nhật trạng thái - Status của một cái lời mời join board
  const updateBoardInvitation = (status, notificationId) => {
    dispatch(updateBoardInvitationApi({ status, notificationId })).then((res) => {
      if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
        socketIoInstance.emit('FE_USER_OF_BOARD', res.payload.inviterId)
        navigate(`/boards/${res.payload.boardInvitation.boardId}`)
      }
    })
  }

  return (
    <Box>
      <Box
        onClick={handleClickNotificationIcon}
        sx={{
          display: 'flex',
          alignItems: 'center'
        }}>
        <Tooltip title="Notifications">
          <Badge
            color="warning"
            variant={newNotification ? 'dot' : 'none'}
            sx={{ cursor: 'pointer' }}
            id="basic-button-open-notification"
            aria-controls={open ? 'basic-notification-drop-down' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <NotificationsNoneIcon sx={{
              // color: {
              //   xs: 'black', md: newNotification ? 'yellow' : 'white'
              // }
              color: newNotification ? 'yellow' : 'white'
            }} />
          </Badge>
        </Tooltip>
        {
          // <Typography variant="body1" sx={{ mt: 0.5, ml: 2, display: { xs: 'block', md: 'none' } }}>
          // Notifications
          // </Typography>
        }
      </Box>
      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        { (!notifications || notifications.length === 0) &&
        <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>}
        {notifications?.map((notification, index) =>
          <Box key={index}>
            <MenuItem sx={{
              minWidth: 200,
              maxWidth: 360,
              overflowY: 'auto'
            }}>
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Nội dung của thông báo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box><strong>{notification.inviter?.displayName}</strong> had invited you to join the board <strong>{notification.board?.title}</strong></Box>
                </Box>

                {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}
                {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING &&
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                  >
                    Reject
                  </Button>
                </Box>
                }

                {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                    <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                  }
                  {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.REJECTED &&
                    <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                  }
                </Box>

                {/* Thời gian của thông báo */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="span" sx={{ fontSize: '13px' }}>
                    {moment(notification.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
            {index !== (notifications?.length - 1) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
