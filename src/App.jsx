import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from './pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectorCurrentUser } from '~/redux/user/userSlice'

const ProtectedRouter = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectorCurrentUser)
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
      {/* Protected Routes (route được bảo vệ)— tức là chỉ người dùng đã đăng nhập mới có thể truy cập */}
      <Route element={<ProtectedRouter user={currentUser} />}>
        {/* Board Detail*/}
        <Route path='/boards/:boardId' element={<Board />}/>
      </Route>

      {/* 404 not found page */}
      {/*  * này là khi url trên trình duyệt nó ko trùng với router ta khai báo trong App thì sẽ vào *  */}
      <Route path='*' element={<NotFound />}/>

      {/* Authentication */}
      <Route path='login' element={<Auth />} />
      <Route path='register' element={<Auth />} />
      <Route path='/account/verification' element={ <AccountVerification /> } />
    </Routes>
  )
}

export default App
