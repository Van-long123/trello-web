import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authoriseAxios'
import { mapOrder } from '~/utils/sorts'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
//Khởi tạo giá trị State của một cái slice trong redux
const initialState = {
  currentActiveBoard: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi
//kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI', //name là một chuỗi định danh cho thằng Middleware này
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    // axios sẽ trả kết quả của be gửi về, trong data
    return response.data
  }
)

//createSlice dùng để tạo slice
//Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  //reducers: nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const board = action.payload

      //Xử lý dữ liệu nếu cần thiết
      //...

      //Update lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board
    },
    updateCartInBoard: (state, action) => {
      // update nested-data
      const isComingCard = action.payload

      // Tìm dần từ Board -> Column -> Card
      const column = state.currentActiveBoard.columns.find(column => column._id === isComingCard.columnId)
      if (column) {
        const card = column.cards.find(card => card._id === isComingCard._id)
        if (card) {
          // card.title = isComingCard.title

          // Cập nhật tất cả dữ liệu isComingCard vào
          Object.keys(isComingCard).forEach(key => {
            card[key] = isComingCard[key]
          })
        }
      }
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
        // action.payload: là dữ liệu trả về từ API
        let board = action.payload

        // Thành viên trong board sẽ là gộp lại từ owners và members
        board.FE_allUser = board.owners.concat(board.members)

        //Xử lý dữ liệu nếu cần thiết
        // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
        // Cần xử lý vấn đề kéo thả vào một column rỗng
        board.columns.forEach(column => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          }
          else {
            // Sắp xếp thứ tự các card luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })

        //Update lại dữ liệu của currentActiveBoard
        state.currentActiveBoard = board
      }) //fulfilled là api gọi thành công, pending là api đang đc gọi, rejected gặp lỗi nếu lỗi thì chỗ axios gọi api đã lỗi rôid
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo
// tự động theo tên của reducer nhé.
export const { updateCurrentActiveBoard, updateCartInBoard } = activeBoardSlice.actions

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectorCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer
