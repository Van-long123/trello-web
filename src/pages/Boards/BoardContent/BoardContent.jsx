import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { arrayMove } from '@dnd-kit/sortable'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
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

  const [orderedColumns, setorderedColumns] = useState([])
  //useEffect Hàm này sẽ chạy sau khi component đã render xong
  //[dependency] Nếu giá trị nào trong đây thay đổi → chạy lại effect
  useEffect(() => {
    // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    //render lại component
    setorderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // event là giá trị ta nhận đc từ thư viện kéo giá
    // console.log(event)
    const { active, over } = event

    // - Kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return

    //nếu vị trí kéo thả khác với vị trí ban đầu
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

    setorderedColumns(dndOrderedColumns)
    // board.columnOrderIds = dndOrderedColumnsIds // → nhưng tại sao useEffect([board]) không chạy lại
  }
  return (
    <>
      {/* onDragEnd={} có nghĩa là sau khi ta kết thúc cái kéo sẽ gọi hàm handleDragEnd*/}
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
        </Box>
      </DndContext>
    </>
  )
}
export default BoardContent
