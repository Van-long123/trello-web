
import { useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, Checkbox, IconButton, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import CloseIcon from '@mui/icons-material/Close'

function CardLabelModal({ cardLabelIds, onUpdateCardLabel, board, isOpen, onClose }) {
  const boardLabels = board?.labels
  const [tempLabels, setTempLabels] = useState(cardLabelIds)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpenActionLabel, setIsOpenActionLabel] = useState(false)
  const [activeLabel, setActiveLabel] = useState(null)
  const handleOpenModal = () => setIsOpenActionLabel(true)
  const handleCloseModal = () => setIsOpenActionLabel(false)
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
  const q = searchTerm.trim().toLowerCase()
  const filteredLabels = board?.labels.filter(label => {
    if (!q) return false
    const name = label.name.toLowerCase()
    return name.startsWith(q)
  })
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
            value={searchTerm}
            onChange={ e => setSearchTerm(e.target.value)}
          />
          <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>Labels</Typography>
          {(filteredLabels?.length > 0 ? filteredLabels : boardLabels.slice(0, 7)).map(label => {
            const active = tempLabels.includes(label.id)
            return (
              <Box key={label.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={!!active}
                  onChange={() => toggleLabel(label.id)}
                />
                <Box sx={{ flex: 1, bgcolor: label?.color, p: 2, borderRadius: '4px' }}>
                  {label?.title || ''}
                </Box>
                <IconButton size="small" onClick={() => {
                  handleOpenModal(true)
                  setActiveLabel(label)
                }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )
          })}
          <Button variant="text" fullWidth sx={{ bgcolor: '#F0F0F0', color: '#292A2E', mt: 2 }}>Create new label</Button>
        </Box>
      </Modal>


      <Modal
        open={isOpenActionLabel}
        onClose={() => {
          handleCloseModal()
          onClose()
        }}
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
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white',
          overflowY: 'auto',
          maxHeight: '90vh'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <IconButton onClick={handleCloseModal}><ArrowBackIosIcon sx={{ fontSize: '15px', cursor: 'pointer' }}/></IconButton>
            <Typography variant="h6" sx={{ fontSize: '17px' }}>
              Chỉnh sửa nhãn
            </Typography>
            <IconButton onClick={() => {
              handleCloseModal()
              onClose()
            }}><CloseIcon sx={{ fontSize: '17px', cursor: 'pointer' }}/></IconButton>
          </Box>
          <Box sx={{
            background: '#f7f8f9',
            padding: '28px',
            margin: '-25px',
            my: 1
          }} >
            <Typography component="span" sx={{
              display: 'inline-block',
              bgcolor: activeLabel?.color,
              height: 40,
              width: '100%',
              borderRadius: 1
            }}></Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Title</Typography>
          <TextField
            size="small"
            fullWidth
          />
          <Typography variant="body2" sx={{ fontWeight: 500, my: 1 }}>Select a color</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt:1, mb: 2, flexWrap: 'wrap' }}>
            {boardLabels.map(label => {
              return (
                <Box key={label.id} component='span' sx={{ bgcolor: label?.color, p: 2, borderRadius: '4px', width:'50px', height: '32px' }}>
                </Box>
              )
            })}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between  ' }}>
            <Button variant="contained" color='primary'>Save</Button>
            <Button variant="contained" color='error'>Delete</Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default CardLabelModal
