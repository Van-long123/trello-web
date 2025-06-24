import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { arrayMove } from '@dnd-kit/sortable'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  rectIntersection,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { useEffect, useState, useCallback, useRef } from 'react'
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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  // const [orderedColumns, setOrderedColumns] = useState([])

  //Điểm va chạm cuối cùng xử lý thuật toàn phát hiện va chạm
  const lastOverId = useRef(null)

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

  // Cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau.
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingData
  ) => {
    // prevColumns chính là giá trị hiện tại của orderedColumns
    setOrderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

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
        // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau.
        const rebuild_activeDraggingData = {
          ...activeDraggingData,
          // ghi đè lại columnId
          columnId:nextOverColumn._id
        }
        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingData)
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
      // return [...prevColumns] //Tạo mảng mới → React nhận biết thay đổi → re-render
      // return prevColumns //Cùng giá trị, không render lại
    })
  }
  const handleDragStart = (event) => {
    // console.log(event)
    // Khi gọi nhiều setState
    // Nó chỉ re-render 1 lần duy nhất sau khi tất cả setState hoàn tất
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
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
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingData
      )
    }
  }
  const handleDragEnd = (event) => {

    // event là giá trị ta nhận đc từ thư viện kéo giá
    // console.log(event) //kéo ở column hay card đều chạy vào hàm này
    const { active, over } = event

    // - Kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return
    //Xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard:Là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current : activeDraggingData } } = active
      const { id: overCardId } = over
      // Tìm 2 cái columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!oldColumnWhenDraggingCard || !overColumn) return
      //Hành động kéo thả card giữa 2 column khác nhau
      // if (activeDragItemData?.columnId !== overColumn._id) {
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // dữ liệu sẽ lỗi vì khi kết thúc kéo thì nó đã vào dragOver để cập nhập lại state(orderedColumn) rồi
        // kiểu là kéo card từ 3 sang 2 nó vào dragOver trước cập nhật lại card 2 có thêm card đc kéo từ card 3(cập nhật lại state orderedColumns)
        // khi thả xuống thì dữ liệu đó nằm ở column 2 ;state(orderedColumn) event trong dragEnd đó đc thêm sẵn rồi nên active hay over đều ở column 2
        //cách làm là ở dragStart ta sẽ lưu dữ liệu column gốc vào 1 state riêng dragEnd vào state để lấy gốc ban column ban đầu
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingData
        )
      }
      else {
        //Hành động kéo thả card trong cùng một cái column
        console.log('Hành động kéo thả card trong cùng một cái column')
        // lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
        // const oldCardIndex = oldColumnWhenDraggingCard?.cardOrderIds?.findIndex(c => c === activeDraggingCardId)
        // const newCardIndex = overColumn?.cardOrderIds?.findIndex(c => c === overCardId)

        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lấy vị trí mới (từ thằng overColumn)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        // Code của arrayMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        // const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cardOrderIds, oldCardIndex, newCardIndex)
        setOrderedColumns(prevColumns => {
          // Clone mảng orderedColumns cũ ra một cái mới đề xử lý data rôi return cập nhật
          //  lại orderedColumns mới
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // nên cập nhật cả cards và cardOrderIds
          //dùng const khi đề kiểu 1 cấp đc như này
          targetColumn.cards= dndOrderedCards
          targetColumn.cardOrderIds= dndOrderedCards.map(card => card._id)

          // targetColumn.cardOrderIds= dndOrderedCards
          return nextColumns
        })
      }
    }

    //Xử lý kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //nếu vị trí kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
      // lấy vị trí cũ (từ thằng active)
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // lấy vị trí mới (từ thằng over)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        // Code của arrayMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // khi xong rồi gọi API Để cập nhật lại columnOrderIds
        // console.log(dndOrderedColumns)

        setOrderedColumns(dndOrderedColumns)
        // board.columnOrderIds = dndOrderedColumnsIds // → nhưng tại sao useEffect([board]) không chạy lại
      }
    }
    //Những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
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
  // ta sẽ custom lại chiến lược / thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiều columns
  // args = arguments = Các Đối số, tham số
  //thư viện dnd-kit hàm sẽ đc gọi khi đang kéo hoặc thả ra
  // mục đích của hàm collisionDetectionStrategy  này là trả về id của phần tử “bị chạm vào”
  const collisionDetectionStrategy = useCallback((args) => {
    // nếu kéo thả column thì dùng thuật toán closestCorners có sẵn
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args }) //thuật toán nó làm rồi nó sẽ trả về 1 mảng như biên dưới
    }
    // nếu kéo thả card thì custom thuật toán
    // trả về danh sách các container đang nằm dưới con trỏ chuột hiện tại
    const pointerIntersections = pointerWithin(args)
    // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây
    const intersections = !!pointerIntersections?.length
      ? pointerIntersections
      : rectIntersection(args) //là hàm phát hiện va chạm theo vùng hình chữ nhật.Dùng để xác định xem phần tử đang được kéo đang chạm vào container nào
    // Tìm overId đầu tiên trong đám intersections ở trên
    // khi kéo card qua bên column khác đầu tiên là cardId của nó sau đó tới columnId của column kia rồi mới tới cardId muốn thay đổi
    // bug nhấp nhấy là nó bị ở chỗ tới columnId
    let overId = getFirstCollision(intersections, 'id')// lấy ra id đầu tiên trong danh sách intersections trả về.
    if (overId) {
      // Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm
      //đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được.
      // Tuy nhiên ở đây dùng closestCenter mình thấy mượt mà hơn.
      const checkColumn = orderedColumns.find(column => column._id === overId )
      if (checkColumn) {
        // console.log('overId before: ', overId)
        // closestCenter(...): Dùng thuật toán có sẵn trong dnd-kit để tìm phần tử gần con trỏ nhất.
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && checkColumn?.cardOrderIds?.includes(container.id)
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    //Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id:lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])
  return (
    <>
      {/* onDragEnd={} có nghĩa là sau khi ta kết thúc cái kéo sẽ gọi hàm handleDragEnd*/}
      {/* onDragStart={} có nghĩa là  khi ta bắt đầu kéo sẽ gọi hàm handleDragStart*/}
      <DndContext
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        //Cảm biến
        sensors={sensors}
        // Thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua Column được vì lúc này nó
        // đang bị conflict giữa card và column), chúng ta sẽ dùng losestCorners thay vì closestCenter
        // https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms

        //nếu dùng closestCorners sẽ bị bug nhấp nháy
        // collisionDetection={closestCorners}
        //Tự custom nâng cao thuật toán va chạm
        // mục đích của hàm collisionDetectionStrategy  này là trả về id của phần tử “bị chạm vào”
        //Từ đó gửi over vào các hàm xử lý như onDragOver, onDragEnd để bạn xử lý
        collisionDetection={collisionDetectionStrategy}
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
