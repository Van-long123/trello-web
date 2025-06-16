import Box from '@mui/material/Box'
function BoardContent() {
  return (
    <>
      <Box sx={{
        backgroundColor: 'primary.main',
        // ``string literal
        height: (theme) => `calc(100vh - ${theme.trello.boardBarHeight} - ${theme.trello.appBarHeight})`,
        // height: 'calc(100vh - 48px - 58px)',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
      >
        Board content
      </Box>
    </>
  )
}
export default BoardContent
