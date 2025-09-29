
import { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { useSelector, useDispatch } from 'react-redux'
import { updateCurrentActiveBoard, selectorCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { toast } from 'react-toastify'
import { createNewCardCopyAPI } from '~/apis'
import { cloneDeep } from 'lodash'
function CardCopyModal({ isOpen, onClose, card }) {
  const dispatch = useDispatch()
  const board = useSelector(selectorCurrentActiveBoard)
  const [selectedColumnId, setSelectedColumnId] = useState('')
  const [selectedPosition, setSelectedPosition] = useState(1)
  const [title, setTitle] = useState('')
  useEffect(() => {
    if (card) {
      setTitle(card.title)
      setSelectedColumnId(card.columnId || board?.columns[0]?._id)
    }
  }, [card, board])
  const currentColumn = board?.columns?.find(col => col._id == selectedColumnId)
  const maxPosition = currentColumn ? currentColumn.cardOrderIds.length + 1 : 1
  const handleCopy = async () => {
    // eslint-disable-next-line no-unused-vars
    const { _id, ...resCard } = card
    const newCard = {
      title,
      columnId: selectedColumnId,
      position: selectedPosition,
      card: resCard
    }
    createNewCardCopyAPI(newCard).then(createdCard => {
      const newBoard = cloneDeep(board)
      const column = newBoard.columns.find(col => col._id == createdCard.columnId)
      column.cardOrderIds.splice(selectedPosition - 1, 0, createdCard._id)
      column.cards.splice(selectedPosition - 1, 0, createdCard)
      dispatch(updateCurrentActiveBoard(newBoard))
      toast.success('Card copied successfully!')
      onClose()
    })
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
              Copy card
            </Typography>
            <IconButton onClick={onClose}><CloseIcon sx={{ fontSize: '17px', cursor: 'pointer' }}/></IconButton>
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
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 2
          }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Lists</InputLabel>
              <Select
                value={selectedColumnId}
                label="List"
                onChange={(e) => {
                  setSelectedColumnId(e.target.value)
                  setSelectedPosition(1)
                }}
              >
                {board?.columns?.map((col) => (
                  <MenuItem key={col._id} value={col._id}>
                    {col.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ maxWidth: '80px', width: '100%' }}>
              <InputLabel>Positions</InputLabel>
              <Select
                value={selectedPosition}
                label="Position"
                onChange={(e) => setSelectedPosition(Number(e.target.value))}
              >
                {Array.from({ length: maxPosition }, (_, i) => i + 1).map(pos => (
                  <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" color='primary' onClick={handleCopy}>Create card</Button>
        </Box>
      </Modal>
    </>
  )
}

export default CardCopyModal
