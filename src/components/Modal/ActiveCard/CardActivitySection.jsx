import moment from 'moment'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'

import { useSelector } from 'react-redux'
import { selectorCurrentUser } from '~/redux/user/userSlice'
import { IconButton, Popover } from '@mui/material'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'emoji-picker-element'


function CardActivitySection({ cardComments = [], onAddCardComment, onUpdateCardComment, onDeleteCardComment, onUpdateCardCommentReactions }) {
  const currentUser = useSelector(selectorCurrentUser)
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const pickerRef = useRef(null)

  const handleAddCardComment = (event) => {
    // Bắt hành động người dùng nhấn phím Enter && không phải hành động Shift + Enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Thêm dòng này để khi Enter không bị nhảy dòng
      if (!event.target?.value) return // Nếu không có giá trị gì thì return không làm gì cả

      // Tạo một biến comment data để gửi api
      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: event.target.value.trim()
      }
      onAddCardComment(commentToAdd).then(() => {
        event.target.value=''
      })
    }
  }

  const handleUpdateCardComment = (event, idEdited) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!event.target?.value) return // Nếu không có giá trị gì thì return không làm gì cả

      // Tạo một biến comment data để gửi api
      const commentToUpdate = {
        content: event.target.value.trim(),
        commentedAt: idEdited
      }
      onUpdateCardComment(commentToUpdate).then(() => {
        toast.success('Comment updated successfully!')
        setEditingId(null)
      })
    }
  }

  const handleDeleteCardComment = (idEdited) => {
    onDeleteCardComment({ commentedAt: idEdited }).then(() => {
      toast.success('Comment deleted successfully!')
    })
  }

  const handleEmojiSelect = (unicode, editingId) => {
    // setComments(prevComments =>
    //   prevComments.map(comment => {
    //     if (comment.commentedAt !== commentId) return comment
    //     const existing = comment.reactions?.find(r => r.emoji === e.detail.unicode)
    //     if (existing) {
    //       return {
    //         ...comment,
    //         reactions: comment.reactions.map(r => {
    //           return r.emoji === e.detail.unicode ? { ...r, count: r.count + 1 } : r
    //         })
    //       }
    //     }
    //     else {
    //       return {
    //         ...comment,
    //         reactions: [
    //           ...comment.reactions,
    //           {
    //             emoji: e.detail.unicode, count: 1
    //           }
    //         ]
    //       }
    //     }
    //   })
    // )

    // Tạo một biến comment data để gửi api
    const commentReactionsToUpdate = {
      emoji: unicode,
      commentedAt: editingId
    }
    onUpdateCardCommentReactions(commentReactionsToUpdate).then(() => {
      setAnchorPopoverElement(null)
    })
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Xử lý thêm comment vào Card */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar
          sx={{ width: 36, height: 36, cursor: 'pointer' }}
          alt={currentUser?.displayName}
          src={currentUser?.avatar}
        />
        <TextField
          fullWidth
          placeholder="Write a comment..."
          type="text"
          variant="outlined"
          multiline
          onKeyDown={handleAddCardComment}
        />
      </Box>

      <Popover
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={() => setAnchorPopoverElement(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        TransitionProps={{
          onEntered: () => {
            const element = pickerRef.current
            if (element) {
              element.addEventListener('emoji-click', (e) => { handleEmojiSelect(e.detail.unicode, editingId) })
            }
          },
          onExit: () => {
            const element = pickerRef.current
            if (element) {
              // element.removeEventListener('emoji-click', handleEmojiSelect)
            }
          }
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <emoji-picker ref={pickerRef}></emoji-picker>
      </Popover>
      {/* Hiển thị danh sách các comments */}
      {cardComments.length === 0 &&
        <Typography sx={{ pl: '45px', fontSize: '14px', fontWeight: '500', color: '#b1b1b1' }}>No comments found!</Typography>
      }
      {cardComments.map((comment, index) =>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }} key={index}>
          <Tooltip title={comment?.userDisplayName}>
            <Avatar
              sx={{ width: 36, height: 36, cursor: 'pointer' }}
              alt={comment.userDisplayName}
              src={comment.userAvatar}
            />
          </Tooltip>
          <Box sx={{ width: 'inherit' }}>
            <Typography variant="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {comment.userDisplayName}
            </Typography>

            <Typography variant="span" sx={{ fontSize: '12px' }}>
              {moment(comment.commentedAt).format('llll')}
            </Typography>
            {editingId === comment.commentedAt
              ?<TextField
                fullWidth
                type="text"
                variant="outlined"
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value)
                }}
                onKeyDown={(e) => { handleUpdateCardComment(e, comment.commentedAt) }}
                sx={{
                  '& .MuiInputBase-input': { padding: '13px' }
                }}
              />
              :<TextField
                fullWidth
                disabled
                type="text"
                variant="outlined"
                value={comment.content}
                sx={{
                  '& .MuiInputBase-input': { padding: '13px' },
                  '& .Mui-disabled': {
                    WebkitTextFillColor: '#514b4bff !important' // màu chữ khi disabled
                  }
                }}
              />
            }
            {/* Dòng action dưới comment */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, pl: 1, flexWrap: 'wrap' }}>
              {comment.reactions?.map((reaction, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2px',
                    gap: '0px',
                    width: '40px',
                    height: '25px',
                    border: '1px solid #ccc',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f0f0f0' }
                  }}
                  onClick={() => { handleEmojiSelect(reaction.emoji, comment.commentedAt) }
                  }
                >
                  <span style={{ fontSize: '16px' }}>{reaction?.emoji}</span>
                  <Typography variant='span' sx={{ fontSize: '12px', fontWeight: '500', marginTop: '2px', color: '#44546f' }}>{reaction?.count}</Typography>
                </Box>
              ))}
              <IconButton size="small" sx={{
                width: '34px',
                height: '24px',
                border: '1px solid #091e4224',
                borderRadius: '12px',
                fontSize: '16px',
                marginBottom: '2px'
              }}
              onClick={(e) => {
                setAnchorPopoverElement(e.currentTarget)
                setEditingId(comment.commentedAt)
              }}
              >
                <EmojiEmotionsIcon fontSize="inherit" />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ fontSize: '12px', color: '#44546f', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => {
                  setEditingId(comment.commentedAt)
                  setEditContent(comment.content)
                }}
              >
                Chỉnh sửa
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: '12px', color: '#44546f', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => handleDeleteCardComment(comment.commentedAt)}
              >
                Xoá
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CardActivitySection
