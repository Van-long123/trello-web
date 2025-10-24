import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import Tooltip from '@mui/material/Tooltip'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import { useState } from 'react'
import { updateBoardDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'

const MENU_STYLE = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  padding: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  },
  '& .MuiChip-label': {
    marginTop: '2px'
  }
}
function BoardBar({ board }) {
  const dispatch = useDispatch()
  const [isPublic, setIsPublic] = useState(board?.type === 'public')
  const handleToggleVisibility = async () => {
    const newType = isPublic ? 'private' : 'public'
    try {
      await updateBoardDetailsAPI(board._id, { type: newType })
      const newBoard = cloneDeep(board)
      newBoard.type = newType
      dispatch(updateCurrentActiveBoard(newBoard))
      setIsPublic(!isPublic)
    } catch (error) {
      toast.error('Error, Please try again')
    }
  }
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
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        '&::-webkit-scrollbar-track': { m:2 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={board?.description}>
            <Chip
              sx={MENU_STYLE}
              icon={<DashboardIcon />}
              label={board?.title}
              clickable
            />
          </Tooltip>
          <Chip
            sx={MENU_STYLE}
            icon={<VpnLockIcon />}
            label={isPublic ? 'Public' : 'Private'}
            clickable
            onClick={handleToggleVisibility}
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
          <InviteBoardUser boardId={board._id} />
          <BoardUserGroup boardUsers={board.FE_allUser} boardId={board._id}/>
        </Box>
      </Box>
    </>
  )
}
export default BoardBar
