import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích đề custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 reqquest từ fe lên be: đề 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE
// (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình interceptor bộ đánh chặn giữa mọi Request & Response
// interceptor request : Can thiệp vào giữa các request API
authorizedAxiosInstance.interceptors.request.use( (config) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// interceptor request : Can thiệp vào giữa các reponse nhận về
authorizedAxiosInstance.interceptors.response.use( (response) => {
  // Mọi mã http status code nằm trong khoảng 200-299 sẽ là error và rơi vào đây
  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Mọi mã http status code nằm ngoài khoảng 200-299 sẽ là error và rơi vào đây

  // Kỹ thuật chặn spam click
  interceptorLoadingElements(false)

  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình
  // Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token.
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})

export default authorizedAxiosInstance
