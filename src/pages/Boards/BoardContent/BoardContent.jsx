import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
function BoardContent({ board }) {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <>
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
        <ListColumns columns= {orderedColumns} />
      </Box>
    </>
  )
}
export default BoardContent
