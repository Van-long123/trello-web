import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCartToDifferentAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectorCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

function Board() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // Không dùng state của component nữa mà chuyển qua dùng state của redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectorCurrentActiveBoard)
  const activeCard = useSelector(selectCurrentActiveCard)
  const { boardId }= useParams()
  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId)).then(res => {
      if (res.error) navigate('/board-not-found', { replace: true })
    })
  }, [dispatch, boardId, navigate])


  // Func này có nhiệm vụ gọi API và xử lý khi kéo thả xong Column
  const moveColumns = (dndOrderedColumns) => {
    //Update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    //Gọi API update board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds:dndOrderedColumnsIds })
  }

  //Khi di chuyển card trong cùng 1 column
  //Chỉ cần gọi API cập nhật lại mảng cardOrderIds của column chứa nó
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    //Update cho chuẩn dữ liệu state column
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    //Gọi API update column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }
  /**
  Khi di chuyển card sang Column khác:
  * * B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó (Hiều bản chất là xóa cái id của Card ra khỏi mảng)
  * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiều bản chất là thêm id của Card vào mảng)
  * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
  * => Làm một API support riêng
  */
  const moveCartToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    //Update cho chuẩn dữ liệu state board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    //Gọi API xử lý
    let preCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    //Xử lý vấn đề khi kéo card cuối cùng ra khỏi column
    if (preCardOrderIds[0].includes('placeholder-card')) preCardOrderIds = []
    moveCartToDifferentAPI({
      currentCardId,
      prevColumnId,
      preCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption='Loading Board...'/>
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card, check đóng/mở dựa theo điều kiện có tồn tại data activeCard lưu trong
      Redux hay không thì mới render. Mỗi thời điểm chỉ tồn tại một cái Modal Card đang Active */}
      {activeCard && <ActiveCard />}
      {/* <ActiveCard /> */}

      {/* Các thành phần còn lại của Board Details */}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}

        // 3 cái trường hợp move dưới đây thì giữ nguyên đề code xử lý kéo thả ở phần BoardContent
        // không bị quá dài mất kiểm soát khi đọc code, maintain.
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCartToDifferentColumn={moveCartToDifferentColumn}
      />
    </Container>
  )
}
export default Board
