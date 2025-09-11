import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, IconButton, Box, CardMedia, MenuItem, ListItemIcon, ListItemText, Menu, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import moment from 'moment'
import 'moment/locale/vi'
import EditIcon from '@mui/icons-material/Edit'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
// moment.locale('vi')

const AttachmentList = ({ attachments= [], onDeleteCardAttachment, onUpdateCardAttachment }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const open = Boolean(anchorEl) // truyển sang kiểu boolean
  useEffect(() => {
    if (selectedFile) setFileName(selectedFile.fileName)
  }, [selectedFile])
  const handleClickOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const handleClick = (event, file) => {
    setAnchorEl(event.currentTarget)
    setSelectedFile(file)
  }
  const handleClose = () => {
    setAnchorEl(null)
    setSelectedFile(null)
  }
  const handleDownloadFile = async (selectedFile) => {
    const response = await fetch(selectedFile.fileUrl) // gọi Cloudinary
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = selectedFile.fileName // buộc browser tải về
    document.body.appendChild(a)
    a.click()
    a.remove()

    window.URL.revokeObjectURL(url)
  }
  const openInNew = (file) => {
    if (file.fileType.includes('image') || file.fileType.includes('video')) {
      window.open(file.fileUrl, '_blank')
    } else {
      handleDownloadFile(file)
    }
  }
  const handleAction = async (action) => {
    switch (action) {
    case 'download':
    {
      handleDownloadFile(selectedFile)
      break
    }
    case 'delete':
      onDeleteCardAttachment({ createdAt: selectedFile.createdAt }).then(() => {
        toast.success('Comment deleted successfully!')
      })
      break
    default:
      break
    }
    handleClose()
  }
  const handleSubmit = () => {
    onUpdateCardAttachment({ ...selectedFile, fileName })
    handleClose()
    setOpenDialog(false)
  }
  return (
    <>
      <Card sx={{
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: 8
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: 3,
          '&:hover': {
            backgroundColor: '#ccc',
          }
        }
        // '&::-webkit-scrollbar-thumb:hover': {
        //   background: '#555'
        // }
      }}>
        {attachments.map((file, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent:'space-between', alignItems: 'center' }}>
            {/* Icon hoặc thumbnail */}
            <Box sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              marginLeft: '20px'
            }}>
              {file.fileType.includes('image') ? (
                <CardMedia
                  component="img"
                  height="48"
                  image={file.fileUrl}
                  alt="Example"
                  sx={{
                    width: '64px',
                    borderRadius: '5px'
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '64px',
                    height: '48px',
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    border: '1px solid #ddd'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#44546f', fontSize: '14px' }}>
                    {file.fileName.split('.').pop().toUpperCase()}
                  </Typography>
                </Box>
              )}

              {/* Thông tin file */}
              <CardContent sx={{ width: '450px', marginTop: '10px' }}>
                <Typography variant="body1" noWrap>
                  {file.fileName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Added {moment(file.createdAt).fromNow()}
                </Typography>
              </CardContent>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex' }}>
              {/* <IconButton component="a" href={file.fileUrl} target="_blank"> */}
              <IconButton onClick={() => { openInNew(file) }} target="_blank">
                <OpenInNewIcon fontSize="small" />
              </IconButton>
              <IconButton
                id="basic-button-workspaces"
                aria-controls={open ? 'basic-menu-workspaces' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) => handleClick(e, file)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Card>
      <Menu
        id="basic-menu-workspaces"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-workspaces'
        }}
      >
        <MenuItem onClick={handleClickOpenDialog}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit
        </MenuItem>
        {/* <MenuItem onClick={() => handleAction('comment')}>
          <ListItemIcon><CommentIcon fontSize="small" /></ListItemIcon>
          Nhận xét
        </MenuItem> */}
        <MenuItem onClick={() => handleAction('download')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          Download
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'red' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Remove
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton onClick={handleCloseDialog}>
            <ArrowBackIcon />
          </IconButton>
              Edit attachment
          <IconButton onClick={() => {
            handleCloseDialog()
            handleClose()
          }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="File name"
            sx={{ marginTop: '9px' }}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            fullWidth
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AttachmentList
