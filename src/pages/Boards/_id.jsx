import Container from '@mui/material/Container'
// import useMediaQuery from '@mui/material/useMediaQuery'
import AppBar from '~/components/AppBar/index'
// import BoardBar from '~/pages/Boards/BoardBar/index'
import BoardBar from './BoardBar/index'
import BoardContent from './BoardContent/index'
function Board() {
  return (
    // dùng Container thì nó giống bootstrap thục vào giữa để màn hình full luôn thì có thuộc tính
    //disableGutters mặc định là false ghi thêm vào thì là true  Loại bỏ padding trái và phải
    //  thêm maxWidth false nghĩa là Container sẽ chiếm toàn bộ chiều rộng (width: 100%). mặc định là 'lg'
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      {/* Board Bar mà code dài quá nên tách ra component riêng để ở trong folder này luôn
      tại vì Board Bar dùng ở một nơi này thôi nên ko để trong folder component */}
      <BoardBar />
      <BoardContent />
    </Container>
  )
}
export default Board
