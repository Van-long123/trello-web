// Cấu hình socket.io phía client tại đây và export ra biến socketIoInstance ra sử dụng cho toàn app dùng để lắng nghe(on) và phát(emit) sự kiện
// https://socket.io/how-to/use-with-react
import { io } from 'socket.io-client'
import { API_ROOT } from './utils/constants'
export const socketIoInstance = io(API_ROOT)