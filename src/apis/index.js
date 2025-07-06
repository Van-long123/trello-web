import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // axios sẽ trả kết quả của be gửi về, trong data
  return response.data
}
