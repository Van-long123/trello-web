import Box from '@mui/material/Box'
import Card from './Card/Card'
function ListCards({ cards }) {
  return (
    <>
      <Box sx={{
        // p: 2,
        p: '0 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto', //overflowY: 'auto' rồi thì ở content phải hiện thanh scroll mà ở đây nó ko hiện (lý do là đám Card có overflow mặc định là hidden nên ko có scroll)
        maxHeight: (theme) => (`calc(
                ${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${theme.trello.columnFooterHeight} - ${theme.trello.columnHeaderHeight}
              )`),
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ced0da'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#bfc2cf'
        }
      }}>
        {cards?.map(card => (<Card key={card._id} card= {card} />))}
        {/* <Card /> */}
        {/* dùng prop ko để giá trị thì là true */}
        {/* <Card temporaryHideMedia/>
        <Card temporaryHideMedia/>
        <Card temporaryHideMedia/>
        <Card temporaryHideMedia/>
        <Card temporaryHideMedia/>
        <Card temporaryHideMedia/>
        <Card temporaryHideMedia/>
        <Card temporaryHideMedia/> */}
      </Box>
    </>
  )
}

export default ListCards
