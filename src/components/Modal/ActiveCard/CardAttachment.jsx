
import { useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import Typography from '@mui/material/Typography'
import { Button, Divider, TextField } from '@mui/material'
import { toast } from 'react-toastify'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))
function CardAttachment({ onUploadAttach }) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => setIsOpen(false)

  const handleUploadAttach = (event) => {
    onUploadAttach(event).then(res => {
      if (!res.error) {
        toast.success('Success!')
        setIsOpen(false)
      }
    })
  }
  return (
    <>
      <SidebarItem className="active" onClick={handleOpenModal}><AttachFileOutlinedIcon fontSize="small" />Attachment</SidebarItem>
      <Modal
        open={isOpen}
        onClose={handleCloseModal}
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
              onClick={handleCloseModal} />
          </Box>

          <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }}>Attachment</Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>Attach files from your computer</Typography>
          <Button
            fullWidth
            variant="outlined"
            component="label"
            sx={{
              mb: 2,
              color: '#172B4D',
              background: '#091e420f',
              '&.MuiButton-root': {
                border: 'none'
              },
              '&:hover': {
                background: '#091e4224'
              }
            }}
          >
            Select file
            <input hidden type="file" onChange={handleUploadAttach}/>
          </Button>
          <Divider />

          <Typography variant="body2" sx={{ my: 1, fontWeight: 600 }}>Paste link here</Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="Paste link here"
            // value={link}
            // onChange={}
          />
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            mt: 2
          }}>
            <Button variant="text" color='inherit' onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained">Insert</Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default CardAttachment
