import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'
function AppBar() {
  return (
    <>
      <Box sx={{
        backgroundColor: 'primary.light',
        width: '100%',
        // cách lấy thuộc tính tự tạo ở theme (tại sao phải dùng vì có hàm tính toán calc nếu ta đổi height ở thằng này thì xuống dưới calc phải sửa lại)
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}>
        <ModeSelect />
      </Box>
    </>
  )
}
export default AppBar
