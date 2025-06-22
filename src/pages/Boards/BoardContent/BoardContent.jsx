import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { arrayMove } from '@dnd-kit/sortable'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import cloneDeep from 'lodash/cloneDeep'
// dùng để phân biệt cái ta đang active,kéo là column hay card
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors
  // Nếu dùng PointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thar nhưng mà bị bug
  // PointerSensor: Sensor này chịu trách nhiệm phát hiện các sự kiện kéo (drag) dựa trên con trỏ chuột
  //(1) yêu cầu chuột di chuyển 10px thì mới kích hoạt sự kiên pointermove, fix trường hợp click gọi event
  // const pointerSenser = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })//(1)
  const mouseSenser = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })//(1)
  //Nhấn giữ 250ms và dung sai của cảm ứng thì mới kích hoạt event
  const touchSenser = useSensor(TouchSensor, { activationConstraint: {
    delay: 250,
    tolerance: 500
  } })
  // const sensors = useSensors(pointerSenser)
  // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug.
  const sensors = useSensors(mouseSenser, touchSenser)

  const [orderedColumns, setOrderedColumns] = useState([])
  // Cùng một thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  // activeDragItemId dùng để kéo card từ column này qua column khác
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  // const [orderedColumns, setOrderedColumns] = useState([])

  //Tìm column theo cardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước
    // handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới.
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //useEffect Hàm này sẽ chạy sau khi component đã render xong
  //[dependency] Nếu giá trị nào trong đây thay đổi → chạy lại effect
  useEffect(() => {
    // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    //render lại component
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handleDragStart = (event) => {
    // console.log(event)
    // Khi gọi nhiều setState
    // Nó chỉ re-render 1 lần duy nhất sau khi tất cả setState hoàn tất
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }
  // Animation khi thả (Drop) phần tử Test bằng cách kéo xong thả trực tiếp và nhìn phần giữ chỗ Overlay
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  //Quá trình kéo 1 phần tử (column, card) khi đang kéo column hoặc card là nó sẽ đc gọi
  const handleDragOver = (event) => {
    //Không làm gì thêm nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    //Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các cột
    // console.log('handleDragOver', event)
    const { active, over } = event
    //Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì
    if (!active || !over) return
    // activeDraggingCard:Là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current : activeDraggingData } } = active
    const { id: overCardId } = over

    // Tìm 2 cái columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn !== overColumn) {
      // prevColumns chính là giá trị hiện tại của orderedColumns
      setOrderedColumns(prevColumns => {
        // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        // console.log('overCardIndex', overCardIndex)

        // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard)
        //  lấy chuẩn ra từ code của thư viện nhiều khi muốn từ chối hiểu vì thằng active.rect.current.translated cứ null miết méo hiểu ông anh cũng bị thế
        let newCardIndex
        // rect vị trí phần tử đó so với khung hình
        const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top >
        over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        // overItems là kiểu kéo column 03 sang 02 thì over overItems là toàn bộ cards ở column 02
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
        // console.log(newCardIndex)

        // Clone mảng orderedColumns cũ ra một cái mới đề xử lý data rôi return cập nhật
        //  lại orderedColumns mới
        const nextColumns = cloneDeep(prevColumns) //Sao chép sâu một object/mảng có cấu trúc lồng nhau
        // tại sao có hai biến này mà ko dùng thẳng luôn activeColumn và overColumn vì ta mới clone orderedColumns mới 
        // ko muốn đụng chạm vào 2 thằng trên
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
        if (nextActiveColumn) {
          // Xóa card ở cái column active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
          //Khi xóa card trong nextActiveColumn, thì nextColumns cũng bị thay đổi tương ứng,vì nextActiveColumn là tham chiếu tới phần tử bên trong nextColumns
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          //Cập nhật lại mảng cardOrderIds
          // nextActiveColumn.cardOrderIds = nextActiveColumn.cardOrderIds.filter(card => card !== activeDraggingCardId)
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
          // console.log(nextActiveColumn.cardOrderIds)
        }
        if (nextOverColumn) {
          // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingData)
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        // console.log('nextColumns', nextColumns)

        return nextColumns
        // return [...prevColumns] //Tạo mảng mới → React nhận biết thay đổi → re-render
        // return prevColumns //Cùng giá trị, không render lại
      })
    }
  }
  const handleDragEnd = (event) => {
    // event là giá trị ta nhận đc từ thư viện kéo giá
    // console.log(event) //kéo ở column hay card đều chạy vào hàm này
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('nothing')
      return
    }

    const { active, over } = event

    // - Kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return

    //nếu vị trí kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
    // lấy vị trí cũ (từ thằng active)
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // lấy vị trí mới (từ thằng over)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      // Code của arrayMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      // khi xong rồi gọi API Để cập nhật lại columnOrderIds
      // console.log(dndOrderedColumns)
      // console.log(dndOrderedColumns)

      setOrderedColumns(dndOrderedColumns)
      // board.columnOrderIds = dndOrderedColumnsIds // → nhưng tại sao useEffect([board]) không chạy lại
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  return (
    <>
      {/* onDragEnd={} có nghĩa là sau khi ta kết thúc cái kéo sẽ gọi hàm handleDragEnd*/}
      {/* onDragStart={} có nghĩa là  khi ta bắt đầu kéo sẽ gọi hàm handleDragStart*/}
      <DndContext
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <Box sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          // ``string literal
          height: (theme) => theme.trello.boardContentHeight,
          // height: 'calc(100vh - 48px - 58px)',
          width: '100%',
          p: '5px 0'
        }}
        >
          {/* truyền object,mảng,số... thì bỏ vào {} */}
          {/* <ListColumns columns= {board?.columns} /> */}
          {/* <ListColumns columns= {orderedColumns} /> */}
          <ListColumns columns= {orderedColumns} />
          <DragOverlay dropAnimation={dropAnimation}>
            {/* <div>Column</div> */}
            {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column= {activeDragItemData} />}
            {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card= {activeDragItemData} />}
          </DragOverlay>
        </Box>
      </DndContext>
    </>
  )
}
export default BoardContent
