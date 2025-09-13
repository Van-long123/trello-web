
import { useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, Checkbox, IconButton, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import CloseIcon from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'

function CardLabelModal({ cardLabelIds, onUpdateCardLabel, board, isOpen, onClose, onUpdateBoardCustomLabels }) {
  const [tempLabels, setTempLabels] = useState(cardLabelIds)
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpenActionLabel, setIsOpenActionLabel] = useState(false)
  const [activeLabel, setActiveLabel] = useState(null)
  const [visibleLabels, setVisibleLabels] = useState(board?.customLabels)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [labelTitle, setLabelTitle] = useState('')

  const handleOpenModal = () => setIsOpenActionLabel(true)
  const handleCloseModal = () => {
    setIsOpenActionLabel(false)
    setIsCreateMode(false)
    setActiveLabel(false)
  }
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

  const handleDeleteLabelCustom = () => {
    // console.log(activeLabel)
    const customLabels = visibleLabels.filter(l => l.id !== activeLabel.id)
    setVisibleLabels(customLabels)
    handleCloseModal()

    onUpdateBoardCustomLabels(customLabels)
  }
  const handleAddLabelCustom = () => {
    const existingIndex = visibleLabels.findIndex(l => l.id === activeLabel.id)
    const newLabel = {
      ...activeLabel,
      title: labelTitle?.trim() || activeLabel?.title || ''
    }
    let customLabels
    if (existingIndex !== -1) {
      if (!labelTitle?.trim()) {
        handleCloseModal()
        return
      }
      customLabels = [...visibleLabels]
      customLabels[existingIndex] = newLabel
    } else {
      customLabels = [...visibleLabels, newLabel]
    }
    console.log('object')
    setVisibleLabels(customLabels)
    onUpdateBoardCustomLabels(customLabels)
    handleCloseModal()
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
            placeholder="Search Labels..."
            value={searchTerm}
            onChange={ e => setSearchTerm(e.target.value)}
          />
          <Typography variant="body2" sx={{ mt: 2, fontWeight: 500 }}>Labels</Typography>
          {(filteredLabels?.length > 0 ? filteredLabels : visibleLabels).map(label => {
            const active = tempLabels.includes(label.id)
            return (
              <Box key={label.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={!!active}
                  onChange={() => toggleLabel(label.id)}
                />
                <Box sx={{ flex: 1, bgcolor: label?.color, borderRadius: '4px', height: '35px', padding: '5px 0 5px 10px' }}>
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
          <Button variant="text" fullWidth sx={{ bgcolor: '#F0F0F0', color: '#292A2E', mt: 2 }} onClick={() => {
            handleOpenModal(true)
            setIsCreateMode(true)
          }}
          >Create new label</Button>
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
              {isCreateMode ? 'Create new label' : 'Edit label'}
            </Typography>
            <IconButton onClick={() => {
              handleCloseModal()
              onClose()
            }}><CloseIcon sx={{ fontSize: '17px', cursor: 'pointer' }}/></IconButton>
          </Box>
          <Box sx={{
            background: '#f7f8f9',
            padding: '28px',
            margin: '-10px',
            borderRadius: '7px',
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
            value={activeLabel?.title}
            onChange={e => setLabelTitle(e.target.value)}
          />
          <Typography variant="body2" sx={{ fontWeight: 500, my: 1 }}>Select a color</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt:1, mb: 2, flexWrap: 'wrap' }}>
            {board?.labels.map(label => {
              const isActive = label.id === activeLabel?.id
              return (
                <Box key={label.id} component='span'
                  sx={{
                    bgcolor: label?.color,
                    p: 2, borderRadius: '4px',
                    width:'50px', height: '32px',
                    cursor: 'pointer',
                    border: isActive ? '3px solid #1976d2' : '2px solid transparent'
                  }}
                  onClick={() => setActiveLabel(label)}
                >
                </Box>
              )
            })}
          </Box>
          <Button variant="text" fullWidth sx={{ background: '#0515240F', color: '#292A2E', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '7px' }}><CloseIcon sx={{ fontSize: '20px' }}/> Remove color</Button>
          <Divider sx={{ my: 2 }}/>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between  ' }}>
            <Button variant="contained" color='primary' onClick={handleAddLabelCustom}>{isCreateMode ? 'Create new' : 'Save'}</Button>
            {!isCreateMode &&
              <Button variant="contained" color='error' onClick={handleDeleteLabelCustom}>Delete</Button>
            }
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default CardLabelModal
