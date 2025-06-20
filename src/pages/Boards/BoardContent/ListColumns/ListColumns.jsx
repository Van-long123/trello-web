import { useState } from 'react'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
function ListColumns({ columns }) {
  // const [items] = useState(['column-id-01', 'column-id-02', 'column-id-03'])
  const itemIds = columns?.map(column => column._id)
  return (
    <>
      {/* Thằng SortableContext yêu cầu items là một mảng dạng ['id-1', 'id-2'] chứ không phải [{id: 'id-1'}, {id: 'id-2'}]
      Nếu không đúng thì vẫn kéo thả được nhưng không có animation */}
      {/* strategy có các chiến lược sẽ đứa kéo thả theo chiều ngang hay chiều dọc và nó tối ưu cho trường hợp đó
      horizontalListSortingStrategy Chiến lược này được tối ưu hóa cho danh sách ngang */}
      <SortableContext items={itemIds} strategy={horizontalListSortingStrategy} >
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
          {/* chạy render từng Column */}
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
      </SortableContext>
    </>
  )
}

export default ListColumns
