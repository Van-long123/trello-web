import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { arrayMove } from '@dnd-kit/sortable'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
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
  const handleDragEnd = (event) => {
    // event là giá trị ta nhận đc từ thư viện kéo giá
    // console.log(event) //kéo ở column hay card đều chạy vào hàm này
    const { active, over } = event

    // - Kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return

    //nếu vị trí kéo thả khác với vị trí ban đầu
    if (active._id !== over._id) {
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
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
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
