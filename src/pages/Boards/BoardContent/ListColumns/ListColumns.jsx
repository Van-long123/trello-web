import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
function ListColumns({ columns }) {
  return (
    <>
      {/* Box này khi co lại nhỏ thì sinh ra scroll dưới thôi nên thằng cha ở trên p trên dưới thì scoll đi lên */}
      <Box sx={{
        //inherit là kế thừa bg của thằng cha
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        // để cách trái phải nhìn cho ok hơn
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map((column, index) =>
          // khi map thì component nó cần key thì ta dùng key là index luôn   dùng key index khi dữ liệu ko có id nhưng mình có id mà nên dùng
          //<Column key= {index} />
          <Column key= {column._id} column= {column} />
        )}
        {/* <Column /> */}

        {/* Box Add New Column */}
        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          //chiều dài mặc định thằng box là 100% nên dùng fit-content
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}>
          {/* mặc định thằng button là inline-flex */}
          <Button startIcon={<NoteAddIcon />}
            sx={{
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1
            }}
          >
            Add New Column
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default ListColumns
