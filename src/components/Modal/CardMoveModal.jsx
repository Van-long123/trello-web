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
import { IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { arrayMove } from '@dnd-kit/sortable'
import { fetchBoardsFullApi, moveCartToDifferentAPI, updateColumnDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'

function CardMoveModal({ isOpen, onClose, card }) {
  const dispatch = useDispatch()
  const [boards, setBoards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState('')
  const [selectedColumnId, setSelectedColumnId] = useState('')
  const [selectedPosition, setSelectedPosition] = useState(1)
  const [selectedPositionOld, setSelectedPositionOld] = useState(null)
  const board = useSelector(selectorCurrentActiveBoard)

  // 🔹 Load tất cả boards khi mở modal
  useEffect(() => {
    if (isOpen) {
      fetchBoardsFullApi().then(data => setBoards(data))
    }
  }, [isOpen])

  // 🔹 Khi có card và board hiện tại, thiết lập các giá trị ban đầu
  useEffect(() => {
    if (card && board) {
      const colId = card.columnId || board?.columns?.[0]?._id
      setSelectedBoardId(board._id)
      setSelectedColumnId(colId)

      const column = board?.columns?.find(col => col._id === colId)
      const cardIndex = column?.cardOrderIds?.findIndex(id => id === card._id)
      setSelectedPosition(cardIndex !== -1 ? cardIndex + 1 : 1)
      setSelectedPositionOld(cardIndex)
    }
  }, [card, board])

  const currentBoard = boards?.find(b => b._id === selectedBoardId) || board
  const hasColumn = currentBoard.columns.length > 0
  const currentColumn = currentBoard?.columns?.find(col => col._id === selectedColumnId)
  const cardOrderIds = currentColumn?.cardOrderIds || []
  const maxPosition = cardOrderIds[0]?.includes('placeholder-card')
    ? 1
    : cardOrderIds.length

  const handleMove = async () => {
    const isMovingAcrossBoard = card.boardId !== selectedBoardId
    const newBoard = cloneDeep(board)
    const currentColumn = newBoard?.columns?.find(col => col._id === card?.columnId)
    if (isMovingAcrossBoard) {
      const activeBoard = cloneDeep(board)
      const targetBoard = cloneDeep(boards.find(b => b._id === selectedBoardId))

      if (!isEmpty(targetBoard)) {
        targetBoard.columns.forEach(column => {
          column.cards = targetBoard.cards.filter(card => card.columnId === column._id)
        })
        delete targetBoard.cards
      }

      const activeColumn = activeBoard?.columns?.find(c => c._id === card.columnId)
      const targetColumn = targetBoard?.columns?.find(c => c._id === selectedColumnId)

      if (activeColumn) {
        activeColumn.cards = activeColumn.cards.filter(c => c._id !== card._id)
        if (isEmpty(activeColumn.cards)) {
          activeColumn.cards = [generatePlaceholderCard(activeColumn)]
        }
        activeColumn.cardOrderIds = activeColumn.cards.map(c => c._id)
      }

      if (targetColumn) {
        const moverCard = { ...card, boardId: selectedBoardId, columnId: targetColumn._id }
        targetColumn.cards = targetColumn.cards.filter(c => !c.FE_PlaceHolderCard)
        targetColumn.cards = targetColumn.cards.toSpliced(selectedPosition - 1, 0, moverCard)
        targetColumn.cardOrderIds = targetColumn.cards.map(c => c._id)
      }
      if (activeColumn.cardOrderIds[0].includes('placeholder-card')) activeColumn.cardOrderIds = []
      moveCartToDifferentAPI({
        currentCardId: card._id,
        prevColumnId: activeColumn._id,
        preCardOrderIds: activeColumn.cardOrderIds,
        nextColumnId: targetColumn._id,
        nextCardOrderIds: targetColumn.cardOrderIds,
        targetBoardId: targetBoard._id
      })
      // Cập nhật lại board hiện tại trên frontend
      dispatch(updateCurrentActiveBoard(activeBoard))
    } else if (card.columnId !== selectedColumnId) {
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
      dispatch(updateCurrentActiveBoard(newBoard))
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
      dispatch(updateCurrentActiveBoard(newBoard))
      updateColumnDetailsAPI(selectedColumnId, { cardOrderIds: orderedCardIds })
    }
    onClose()
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '8px',
        p: '20px 30px',
        overflowY: 'auto',
        maxHeight: '90vh'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: 17, flex: 1, textAlign: 'center' }}>
            Move card
          </Typography>
          <IconButton onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </Box>

        {/* Board select */}
        <FormControl fullWidth sx={{ mt: 3, mb: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Board</Typography>
          <Select
            value={selectedBoardId}
            onChange={(e) => {
              const newBoardId = e.target.value
              setSelectedBoardId(newBoardId)
              const firstColumnId = boards.find(b => b._id === newBoardId)?.columns?.[0]?._id || ''
              setSelectedColumnId(firstColumnId)
              setSelectedPosition(1)
            }}
          >
            {boards?.map(b => (
              <MenuItem key={b._id} value={b._id}>{b.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Column + Position */}
        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Column & Position</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl sx={{ flex: 1 }} disabled={!hasColumn}>
            <InputLabel>Columns</InputLabel>
            <Select
              value={selectedColumnId}
              label="Columns"
              onChange={(e) => {
                setSelectedColumnId(e.target.value)
                setSelectedPosition(1)
              }}
            >
              {hasColumn &&
                currentBoard?.columns?.map(col => (
                  <MenuItem key={col._id} value={col._id}>{col.title}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <FormControl sx={{ width: 110 }} disabled={!hasColumn}>
            <InputLabel>Position</InputLabel>
            <Select
              value={selectedPosition}
              label="Position"
              onChange={(e) => setSelectedPosition(Number(e.target.value))}
            >
              {hasColumn && Array.from({ length: maxPosition }, (_, i) => i + 1).map(pos => (
                <MenuItem key={pos} value={pos}>{pos}</MenuItem>
              ))
              } 
            </Select>
          </FormControl>
        </Box>

        <Button variant="contained" onClick={handleMove} fullWidth disabled={!hasColumn}>Move card</Button>
      </Box>
    </Modal>
  )
}

export default CardMoveModal
