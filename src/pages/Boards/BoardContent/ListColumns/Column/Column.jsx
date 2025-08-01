import { useState } from 'react'
import { toast } from 'react-toastify'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Cloud from '@mui/icons-material/Cloud'
import Divider from '@mui/material/Divider'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { useConfirm } from 'material-ui-confirm'
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis/index'
import { cloneDeep } from 'lodash'
import {
  updateCurrentActiveBoard,
  selectorCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useSelector, useDispatch } from 'react-redux'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'

function Column({ column }) {
  const board = useSelector(selectorCurrentActiveBoard)
  const dispatch = useDispatch()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    // bổ sung data vào trong cái dữ liệu sau khi kéo thả
    data: { ...column }
  })
  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const orderedCards = column.cards

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')
  const addNewCard =async () => {
    if (!newCardTitle) {
      toast.error('Please enter Card Title')
      return
    }

    //Tạo dữ liệu card để gọi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    // Gọi API tạo mới Card và làm lại dữ liệu State Board
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    //Cập nhật lại state board
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      //Nếu column rỗng thì chứa 1 Placeholder Card
      if (columnToUpdate.cards.some(card => card.FE_PlaceHolderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      }
      else {
        // Ngược lại column có data thì push vào cuối mảng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    //Đóng lại trạng thái thêm Card mới và Clear Input đi
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  //Xử lý xóa 1 column và cards bên trong nó
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn =async () => {
    confirmDeleteColumn({
      title: 'Delete Column?',
      description: 'This action will permanently delete your Column and its Cards! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      //Xử lý xóa 1 column và cards bên trong nó
      // Update chuẩn dữ liệu state board
      const newBoard = cloneDeep(board)
      newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
      newBoard.columnOrderIds = newBoard.columnOrderIds.filter(c => c._id !== column._id)
      dispatch(updateCurrentActiveBoard(newBoard))
      // Gọi API xử lý
      deleteColumnDetailsAPI(column._id).then(res => {
        toast.success(res?.deleteResult)
      })
    }).catch(() => {
      // console.log('Cancel')
    })
  }

  const onUpdateColumnTitle = (newTitle) => {
    // Gọi Api Update Column và xử lý dữ liệu board trong redux
    updateColumnDetailsAPI(column._id, { title:newTitle }).then(res => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(column => column._id === res._id)//column._id
      if (columnToUpdate) {
        columnToUpdate.title = newTitle
        // columnToUpdate.title = res.title
      }
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={dndKitColumnStyles}
        {...attributes}
      >
        {/*Box Colum */}
        <Box
          {...listeners}
          sx={{
            minWidth: '300px',
            maxWidth: '300px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
            ml: 2,
            borderRadius: '6px',
            height: 'fit-content',
            maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
          }}
        >
          {/*Box Colum Header*/}
          <Box sx={{
            height: (theme) => (theme.trello.columnHeaderHeight),
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {column?.title}
            </Typography> */}
            <ToggleFocusInput
              data-no-dnd
              value={column?.title}
              onChangedValue={onUpdateColumnTitle}
            />
            <Tooltip title="More options" >
              <ExpandMoreIcon
                sx={{
                  color: 'text.primary',
                  cursor: 'pointer'
                }}
                // đoạn code này bên thằng button workspaces.jsx
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose} // khi người dùng bấm ra ngoài
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              {/* MenuItem không hỗ trợ onClose */}
              <MenuItem
                sx={{ '&:hover': { color: 'success.light', '& .add-card-icon': { color: 'success.light' } } }}
                onClick={toggleOpenNewCardForm}
              >
                <ListItemIcon><AddCardIcon className= "add-card-icon" fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{ '&:hover': { color: 'warning.dark', '& .delete-forever-icon': { color: 'warning.dark' } } }}
              >
                <ListItemIcon><DeleteForeverIcon className="delete-forever-icon" fontSize="small" /></ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
          {/*List Cards*/}
          <ListCards cards={orderedCards} />
          {/* <ListCards cards={column?.cards} /> */}

          {/*Box Colum Footer*/}
          <Box sx={{
            height: (theme) => (theme.trello.columnFooterHeight),
            p: 2
          }}
          >
            {!openNewCardForm
              ? <Box sx={{
                height:'100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
                <Tooltip title="Drag to move">
                  <DragHandleIcon sx={{ cursor: 'pointer' }} />
                </Tooltip>
              </Box>
              :
              <Box sx={{ height:'100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  data-no-dnd
                  label="Enter card title...."
                  type="text"
                  size='small'
                  variant='outlined'
                  autoFocus
                  value={newCardTitle}
                  onChange={(e) => (setNewCardTitle(e.target.value))}
                  sx={{
                    '& label': { color: 'text.primary' },
                    '& input': {
                      color: (theme) => theme.palette.primary.main,
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#333643' : 'white'
                    },
                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                    }
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    className='interceptor-loading'
                    onClick={addNewCard}
                    variant="contained" color='success' size='small'
                    sx={{
                      color: 'white',
                      boxShadow: 'none',
                      border: '1px solid',
                      borderColor: (theme) => theme.palette.success.main,
                      '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                    }}
                  >Add
                  </Button>
                  <CloseIcon
                    fontSize='small'
                    sx={{
                      color:(theme) => theme.palette.warning.light,
                      cursor:'pointer'
                    }}
                    onClick={toggleOpenNewCardForm}
                  />
                </Box>
              </Box>
            }
          </Box>
        </Box>
      </div>
    </>
  )
}

export default Column
