
import { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, FormControl, IconButton, MenuItem, Select } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useSelector, useDispatch } from 'react-redux'
import { updateCurrentActiveBoard, selectorCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { fetchBoardsFullApi, MoveColumnDetailsAPI, updateBoardDetailsAPI, updateColumnDetailsAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'

function ColumnMoveModal({ isOpen, onClose, column }) {
  const dispatch = useDispatch()
  const board = useSelector(selectorCurrentActiveBoard)
  const [selectedPosition, setSelectedPosition] = useState(1)
  const [selectedBoardId, setSelectedBoardId] = useState(board?._id)
  const [boards, setBoards] = useState(null)
  const [maxPosition, setMaxPosition] = useState(1)

  useEffect(() => {
    if (isOpen) {
      fetchBoardsFullApi().then(data => setBoards(data))
    }
  }, [isOpen])

  useEffect(() => {
    const boardTarget = boards?.find(b => b._id === selectedBoardId)
    const count = boardTarget?.columns?.length || 0
    setMaxPosition(count > 0 ? count + 1 : 1)
    if (selectedBoardId === board._id) {
      const currentPosition = board?.columns?.findIndex(c => c._id === column?._id) + 1
      setSelectedPosition(currentPosition)
    } else {
      setSelectedPosition(1)
    }
  }, [selectedBoardId, boards, column, board])
  const handleMove = async () => {
    const fromBoardId = board._id
    const toBoardId = selectedBoardId
    const newBoard = cloneDeep(board)
    if (toBoardId === fromBoardId) {
      const positionOld = board?.columns?.findIndex(c => c._id === column?._id) + 1
      const orderedColumns = arrayMove(board?.columns, positionOld - 1, selectedPosition - 1)
      const orderedColumnsIds = orderedColumns.map(c => c._id)
      newBoard.columns = orderedColumns
      newBoard.columnOrderIds = orderedColumnsIds
      dispatch(updateCurrentActiveBoard(newBoard))
      updateBoardDetailsAPI(newBoard._id, { columnOrderIds: orderedColumnsIds })
    } else {
      const newBoards = cloneDeep(boards)
      const fromBoard = newBoards.find(b => b._id === fromBoardId)
      const toBoard = newBoards.find(b => b._id === toBoardId)
      if (!fromBoard || !toBoard) return
      // Xóa column khỏi board cũ
      newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
      newBoard.columnOrderIds = newBoard.columns.map(c => c._id)
      fromBoard.columns = newBoard.columns
      fromBoard.columnOrderIds = newBoard.columnOrderIds

      // Thêm column vào board mới
      const columnClone = cloneDeep(column)
      const insertIndex = selectedPosition - 1
      columnClone.boardId = toBoardId
      toBoard.columns.splice(insertIndex, 0, columnClone)
      toBoard.columnOrderIds = toBoard.columns.map(c => c._id)

      // Gọi API cập nhật DB
      await Promise.all([
        updateBoardDetailsAPI(fromBoardId, { columnOrderIds: fromBoard.columnOrderIds }),
        updateBoardDetailsAPI(toBoardId, { columnOrderIds:toBoard.columnOrderIds }),
        MoveColumnDetailsAPI(column._id, { boardId: toBoardId, cardOrderIds: column.cardOrderIds })
      ])
      setBoards(newBoards)
      dispatch(updateCurrentActiveBoard(newBoard))
    }
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
          <Box sx={{
            display: 'flex',
            flexDirection:'column',
            justifyContent: 'center',
            gap: 1,
            mb: 2
          }}>
            <FormControl fullWidth>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Information board</Typography>
              {boards &&
              <Select
                value={selectedBoardId}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(e) => {
                  setSelectedBoardId(e.target.value)
                }}
              >
                {boards?.map(board => (
                  <MenuItem key={board?._id} value={board?._id}>{board?.title}</MenuItem>
                ))}
              </Select>
              }
            </FormControl>
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
