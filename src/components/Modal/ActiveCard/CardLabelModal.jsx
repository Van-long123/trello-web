
import { useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { Button, Checkbox, IconButton, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

function CardLabelModal({ cardLabelIds, onUpdateCardLabel, board, isOpen, onClose }) {
  console.log('🚀 ~ CardLabelModal ~ isOpen:', isOpen)
  const boardLabels = board?.labels.slice(0, 7)
  const [tempLabels, setTempLabels] = useState(cardLabelIds)

  const toggleLabel = (id) => {
    const exists = tempLabels.includes(id)
    let labelIds
    if (exists) {
      labelIds = tempLabels.filter(labelId => labelId !== id)
      setTempLabels(labelIds)
    } else {
      labelIds = [...tempLabels, id]
      setTempLabels(labelIds)
    }
    onUpdateCardLabel({ labelIds })
  }
  // const [isOpen, setIsOpen] = useState(false)
  // const handleOpenModal = () => setIsOpen(true)
  // const handleCloseModal = () => setIsOpen(false)
  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '20px 30px',
          color: '#44546F',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
        }}>
          <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer'
          }}>
            <CancelIcon
              color="error"
              sx={{ '&:hover': { color: 'error.light' } }}
              onClick={onClose} />
          </Box>

          <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }}>Labels</Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Search Lables..."
            // value={link}
            // onChange={}
          />
          <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>Labels</Typography>
          {boardLabels.map(label => {
            const active = tempLabels.includes(label.id)
            return (
              <Box key={label.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={!!active}
                  onChange={() => toggleLabel(label.id)}
                />
                <Box sx={{ flex: 1, bgcolor: label?.color, p: 2, borderRadius: '4px' }}>
                  {label?.name || ''}
                </Box>
                <IconButton size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )
          })}
          <Button variant="text" fullWidth sx={{ bgcolor: '#F0F0F0', color: '#292A2E', mt: 2 }}>Create new label</Button>
        </Box>
      </Modal>
    </>
  )
}

export default CardLabelModal
