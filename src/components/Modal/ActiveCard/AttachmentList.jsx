import { useEffect, useState } from 'react'
import { Card, CardContent, Typography, IconButton, Avatar, Box, CardMedia, MenuItem, ListItemIcon, ListItemText, Menu, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
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
  const handleAction = async (action) => {
    switch (action) {
    case 'download':
    {
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
      <Card>
        {attachments.map((file, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent:'space-between', alignItems: 'center' }}>
            {/* Icon hoặc thumbnail */}
            <Box sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              marginLeft: '20px'
            }}>
              {file.type === 'pdf' ? (
                <Avatar variant="rounded" sx={{ bgcolor: '#e53935' }}>
                  <PictureAsPdfIcon />
                </Avatar>
              ) : (
                <CardMedia
                  component="img"
                  height="48"
                  image={file.fileUrl}
                  alt="Example"
                  sx={{ width: '64px' }}
                />
              )}

              {/* Thông tin file */}
              <CardContent className="flex-1 !p-3">
                <Typography variant="body1" noWrap>
                  {file.fileName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Added {moment(file.createdAt).fromNow()}
                </Typography>
              </CardContent>
            </Box>

            {/* Action buttons */}
            <div className="flex space-x-1">
              <IconButton component="a" href={file.fileUrl} target="_blank">
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
            </div>
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
          Sửa
        </MenuItem>
        {/* <MenuItem onClick={() => handleAction('comment')}>
          <ListItemIcon><CommentIcon fontSize="small" /></ListItemIcon>
          Nhận xét
        </MenuItem> */}
        <MenuItem onClick={() => handleAction('download')}>
          <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
          Tải xuống
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'red' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Loại bỏ
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton onClick={handleCloseDialog}>
            <ArrowBackIcon />
          </IconButton>
              Sửa tệp đính kèm
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
            label="Tên tệp"
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
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AttachmentList
