import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
function App() {
  return (
    <Routes>
      {/* Redirect Route */}
      <Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm
        // trong history của Browser
        // Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của
        // trình duyệt giữa 2 trường hợp có replace hoặc không có.
        <Navigate to='/boards/686a993347b0301e61c873b4' replace />
      }/>
      {/* Board Detail*/}
      <Route path='/boards/:boardId' element={<Board />}/>

      {/* 404 not found page */}
      {/*  * này là khi url trên trình duyệt nó ko trùng với router ta khai báo trong App thì sẽ vào *  */}
      <Route path='*' element={<NotFound />}/>

      {/* Authentication */}
      <Route path='login' element={<Auth />} />
      <Route path='register' element={<Auth />} />
    </Routes>
  )
}

export default App
