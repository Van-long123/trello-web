import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
function BoardContent() {
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
        <ListColumns />
      </Box>
    </>
  )
}
export default BoardContent
