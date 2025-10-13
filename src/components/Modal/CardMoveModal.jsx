import { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useSelector, useDispatch } from 'react-redux'
import { updateCurrentActiveBoard, selectorCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep, isEmpty } from 'lodash'
import { IconButton, TextareaAutosize, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { arrayMove } from '@dnd-kit/sortable'
import { moveCartToDifferentAPI, updateColumnDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'

function CardMoveModal({ isOpen, onClose, card }) {
  const dispatch = useDispatch()
  const [selectedColumnId, setSelectedColumnId] = useState('')
  const [selectedPosition, setSelectedPosition] = useState(1)
  const [selectedPositionOld, setSelectedPositionOld] = useState(null)
  const board = useSelector(selectorCurrentActiveBoard)
  useEffect(() => {
    if (card && board) {
      const colId = card.columnId || board?.columns[0]?._id
      setSelectedColumnId(colId)
      const column = board?.columns?.find(col => col._id === colId)

      const cardIndex = column?.cardOrderIds.findIndex(id => id === card._id)
      setSelectedPosition(cardIndex !== -1 ? cardIndex + 1 : 1)
      setSelectedPositionOld(cardIndex)
    }
  }, [card, board])
  const currentColumn = board?.columns?.find(col => col._id == selectedColumnId)
  const cardOrderIds = currentColumn?.cardOrderIds || []
  const maxPosition = cardOrderIds[0]?.includes('placeholder-card')
    ? 1
    : cardOrderIds.length + 1
  const handleMove = () => {
    const newBoard = cloneDeep(board)
    const currentColumn = newBoard?.columns?.find(col => col._id === card?.columnId)
    if (card.columnId !== selectedColumnId) {
      const nextOverColumn = newBoard?.columns?.find(col => col._id === selectedColumnId)
      if (currentColumn) {
        currentColumn.cards = currentColumn.cards.filter(c => c._id !== card._id)
        if (isEmpty(currentColumn.cards)) {
          currentColumn.cards = [generatePlaceholderCard(currentColumn)]
        }
        currentColumn.cardOrderIds = currentColumn.cards.map(c => c._id)
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(c => c._id !== card._id)
        const rebuild_activeCardData = {
          ...card,
          // ghi đè lại columnId
          columnId:nextOverColumn._id
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(selectedPosition - 1, 0, rebuild_activeCardData)
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceHolderCard)
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(c => c._id)
      }
      //Gọi API xử lý
      const preColumn = cloneDeep(currentColumn)
      let preCardOrderIds = preColumn?.cardOrderIds
      //Xử lý vấn đề khi kéo card cuối cùng ra khỏi column
      if (preCardOrderIds[0].includes('placeholder-card')) preCardOrderIds = []
      moveCartToDifferentAPI({
        currentCardId: card._id,
        prevColumnId: preColumn._id,
        preCardOrderIds,
        nextColumnId: nextOverColumn._id,
        nextCardOrderIds: nextOverColumn.cardOrderIds
      })
    } else {
      const orderedCards = arrayMove(currentColumn?.cards, selectedPositionOld, selectedPosition - 1)
      const orderedCardIds = orderedCards.map(card => card._id)
      currentColumn.cards = orderedCards
      currentColumn.cardOrderIds = orderedCardIds
      //Gọi API update column
      updateColumnDetailsAPI(selectedColumnId, { cardOrderIds: orderedCardIds })
    }
    dispatch(updateCurrentActiveBoard(newBoard))
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
              Move card
            </Typography>
            <IconButton onClick={onClose}><CloseIcon sx={{ fontSize: '17px', cursor: 'pointer' }}/></IconButton>
          </Box>
          <FormControl sx={{ flex: 1, mb: 5 }} fullWidth>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Information board</Typography>
            <Select
              value={board?._id}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              onChange={(e) => {
                // setSelectedColumnId(e.target.value)
                // setSelectedPosition(1)
              }}
            >
              <MenuItem value={board._id}>
                {board?.title}
              </MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Information card</Typography>
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
            <FormControl sx={{ maxWidth: '110px', width: '100%' }}>
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
          <Button variant="contained" color='primary' onClick={handleMove}>Move card</Button>
        </Box>
      </Modal>
    </>
  )
}

export default CardMoveModal
