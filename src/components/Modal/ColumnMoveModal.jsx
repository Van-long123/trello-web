
import { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { useSelector, useDispatch } from 'react-redux'
import { updateCurrentActiveBoard, selectorCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { toast } from 'react-toastify'
import { createNewCardCopyAPI, updateBoardDetailsAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'
function ColumnMoveModal({ isOpen, onClose, column }) {
  console.log('🚀 ~ ColumnMoveModal ~ isOpen:', isOpen)
  const dispatch = useDispatch()
  const board = useSelector(selectorCurrentActiveBoard)
  const [selectedPosition, setSelectedPosition] = useState(1)
  const [title, setTitle] = useState('')
  useEffect(() => {
    if (column) {
      setTitle(column.title)
      const currentPosition = board?.columns?.findIndex(c => c._id === column?._id) + 1
      setSelectedPosition(currentPosition)
    }
  }, [column, board])
  const maxPosition = board?.columns?.length > 0 ? board?.columns?.length : 1
  const handleMove = async () => {
    const positionOld = board?.columns?.findIndex(c => c._id === column?._id) + 1
    const orderedColumns = arrayMove(board?.columns, positionOld - 1, selectedPosition - 1)
    const orderedColumnsIds = orderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = orderedColumns
    newBoard.columnOrderIds = orderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: orderedColumnsIds })
    onClose()
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
              Move list
            </Typography>
            <IconButton onClick={onClose}><CloseIcon sx={{ fontSize: '17px', cursor: 'pointer' }}/></IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Title</Typography>
          <Box sx={{
            display: 'flex',
            flexDirection:'column',
            justifyContent: 'center',
            gap: 1,
            mb: 2
          }}>
            <TextField
              id="outlined-read-only-input"
              value={title}
              slotProps={{
                input: {
                  readOnly: true
                }
              }}
              fullWidth
            />
            <FormControl fullWidth>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Position</Typography>
              <Select
                value={selectedPosition}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(e) => setSelectedPosition(Number(e.target.value))}
              >
                {Array.from({ length: maxPosition }, (_, i) => i + 1).map(pos => (
                  <MenuItem key={pos} value={pos}>{pos}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button variant="contained" color='primary' onClick={handleMove}>Move</Button>
        </Box>
      </Modal>
    </>
  )
}

export default ColumnMoveModal
