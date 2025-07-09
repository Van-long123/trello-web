import { useState } from 'react'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const addNewColumn = () => {
    if (!newColumnTitle) {
      // console.error('Please enter Column Title')
      return
    }
    // console.log(newColumnTitle)
    //Gọi api ở đây

    //Đóng lại trạng thái thêm Column mới và Clear Input đi
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  const itemIds = columns?.map(column => column._id)
  return (
    <>
      <SortableContext items={itemIds} strategy={horizontalListSortingStrategy} >
        <Box sx={{
          //inherit là kế thừa bg của thằng cha
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}>
          {columns?.map((column, index) =>
            <Column key= {column._id} column= {column} />
          )}
          {/* <Column /> */}

          {/* Box Add New Column */}
          {!openNewColumnForm
            ?
            <Box onClick={toggleOpenNewColumnForm} sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}>
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
            :
            <Box sx = {{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p:1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <TextField
                label="Enter column title...."
                type="text"
                size='small'
                variant='outlined'
                autoFocus
                value={newColumnTitle}
                onChange={(e) => (setNewColumnTitle(e.target.value))}
                sx={{
                  '& label': { color: 'white' },
                  '& input': { color: 'white' },
                  '& label.Mui-focused': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'white' },
                    '&:hover fieldset': { borderColor: 'white' },
                    '&.Mui-focused fieldset': { borderColor: 'white' }
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewColumn}
                  variant="contained" color='success' size='small'
                  sx={{
                    color: 'white',
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >Add Column
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color:'white',
                    cursor:'pointer',
                    '&:hover': { color: (theme) => theme.palette.warning.light }
                  }}
                  onClick={toggleOpenNewColumnForm}
                />
              </Box>
            </Box>
          }
        </Box>
      </SortableContext>
    </>
  )
}

export default ListColumns
