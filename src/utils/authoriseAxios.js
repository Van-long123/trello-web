import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { refreshTokenApi } from '~/apis'
import { logoutUserApi } from '~/redux/user/userSlice'

/**
* cách dùng redux srote trong .js
* Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
* Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios hiện tại
* Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức
để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
* https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
*/
let axiosReduxStore

export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}


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


// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích tạo Promise này để khi nào gọi api refresh_token xong xuôi thì mới retry(Thử lại) lại nhiều api bị lỗi trước đó.
let refreshTokenPromise = null

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

  /** Quan trọng: Xử lý Refresh Token tự động */
  // Trường hợp 1: Nếu như nhận mã 401 từ BE, thì gọi api đăng xuất luôn
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserApi(false))
  }

  // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
  // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequests = error.config
  // if (error.response?.status === 410 && !originalRequests._retry) {
  if (error.response?.status === 410) {
    // Gán thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, đảm bảo việc refresh token này
    // chỉ luôn gọi 1 lần tại 1 thời điểm (nhìn lại điều kiện if ngay phía trên)
    // originalRequests._retry = true // dùng refreshTokenPromise để kiểm tra rồi ko cần _retry nữa
    // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời gán vào cho cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenApi()
        .then((data) => {
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu nhận bất kỳ lỗi nào từ api refresh token thì cứ logout
          axiosReduxStore.dispatch(logoutUserApi(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }

    // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      /**
      * Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết
      * thêm code xử lý ở đây.
      * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE)
      * sau khi api refreshToken được gọi thành công.
      */
      /* Bước 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi
       * lại những api ban đầu bị lỗi */
      return authorizedAxiosInstance(originalRequests)
    })
  }

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
