
import { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { useSelector, useDispatch } from 'react-redux'
import { updateCurrentActiveBoard, selectorCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { toast } from 'react-toastify'
import { createNewColumnAPI, createNewColumnCopyAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { cloneDeep } from 'lodash'

function CardCopyModal({ isOpen, onClose, column }) {
  const dispatch = useDispatch()
  const board = useSelector(selectorCurrentActiveBoard)
  console.log('🚀 ~ CardCopyModal ~ board:', board)
  const [title, setTitle] = useState('')
  useEffect(() => {
    if (column) {
      setTitle(column.title)
    }
  }, [column])
  const handleCopy = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    const columnCopy = board.columns.find(c => c._id === column._id)
    // eslint-disable-next-line no-unused-vars
    let cardsWithoutId = columnCopy.cards.map(({ _id, ...rest }) => rest)
    if (cardsWithoutId[0].FE_PlaceHolderCard) {
      cardsWithoutId = []
    }
    const newColumn = {
      title,
      boardId: board._id,
      cards: cardsWithoutId
    }
    createNewColumnCopyAPI(newColumn).then((res) => {
      const createdColumn = res?.getNewColumn
      if (res?.createdCards.length > 0) {
        createdColumn.cards = res?.createdCards
        createdColumn.cardOrderIds = res?.createdCards.map(card => card._id)
      } else {
        createdColumn.cards = [generatePlaceholderCard(createdColumn)]
        createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
      }
      const newBoard = cloneDeep(board)
      newBoard.columns.push(createdColumn)
      newBoard.columnOrderIds.push(createdColumn._id)
      dispatch(updateCurrentActiveBoard(newBoard))
      onClose()
    })
    // createNewColumnAPI(newColumn).then((res) => {
    //   const createdColumn = res?.getNewColumn
    //   const newBoard = cloneDeep(board)
    //   newBoard.columns.push(createdColumn)
    //   newBoard.columnOrderIds.push(createdColumn._id)
    //   dispatch(updateCurrentActiveBoard(newBoard))
    //   onClose()
    // })
  }
  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '20px 30px',
          color: '#44546F',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white',
          overflowY: 'auto',
          maxHeight: '90vh'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" sx={{ fontSize: '17px', flex: 1, textAlign: 'center' }}>
              Copy list
            </Typography>
            <IconButton onClick={onClose}><CloseIcon sx={{ fontSize: '17px', cursor: 'pointer', }}/></IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Title</Typography>
          {/* TextareaAutosize bằng Box + component={TextareaAutosize} → nhờ đó có thể dùng luôn sx. */}
          <Box
            component={TextareaAutosize}
            minRows={3}
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              width: '100%',
              fontSize: '15px',
              padding: '10px',
              border: (theme) => `1px solid ${theme.palette.grey[400]}`,
              borderRadius: '6px',
              resize: 'none',
              outline: 'none',
              '&:focus': {
                borderColor: (theme) => theme.palette.primary.main
              },
              mb: 1
            }}
          />
          <Button variant="contained" color='primary' onClick={handleCopy}>Create a list</Button>
        </Box>
      </Modal>
    </>
  )
}

export default CardCopyModal
