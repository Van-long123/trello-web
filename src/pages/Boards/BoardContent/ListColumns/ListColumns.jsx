import { useState } from 'react'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
function ListColumns({ columns }) {
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
          <Box sx={{
            minWidth: '200px',
            maxWidth: '200px',
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
        </Box>
      </SortableContext>
    </>
  )
}

export default ListColumns
