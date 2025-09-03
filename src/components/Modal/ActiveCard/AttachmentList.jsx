import { useState } from 'react'
import { Card, CardContent, Typography, IconButton, Avatar, Box, CardMedia } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import moment from 'moment'
import 'moment/locale/vi'

// moment.locale('vi')

const AttachmentList = ({ attachments= [] }) => {
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
              <IconButton component="a" href={file.url} target="_blank">
                <OpenInNewIcon fontSize="small" />
              </IconButton>
              <IconButton>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </div>
          </Box>
        ))}
      </Card>
    </>
  )
}

export default AttachmentList
