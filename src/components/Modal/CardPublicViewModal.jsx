import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import AttachmentIcon from '@mui/icons-material/Attachment'
import AddIcon from '@mui/icons-material/Add'
import IconButton from '@mui/material/IconButton'
import { useParams } from 'react-router-dom'
import { fetchBoardShareAPI, publicShareToken } from '~/apis'
import dayjs from 'dayjs'
import AttachmentList from './ActiveCard/AttachmentList'
import CardDescriptionMdEditor from './ActiveCard/CardDescriptionMdEditor'
import { useEffect, useState } from 'react'
import moment from 'moment'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { styled } from '@mui/material/styles'
import LogoutIcon from '@mui/icons-material/Logout'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Avatar, TextField, Tooltip } from '@mui/material'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'

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

function CardPublicViewModal() {
  const { shareToken }= useParams()
  const [card, setCard] = useState(null)
  const [board, setBoard] = useState(null)
  let colorDate
  let backgroundDate
  let textDate = ''
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardData = await publicShareToken(shareToken)
        setCard(cardData)

        const boardData = await fetchBoardShareAPI(cardData.boardId)
        boardData.FE_allUser = boardData.owners.concat(boardData.members)
        setBoard(boardData)
      } catch (err) {
        console.error('Error fetching shared card:', err)
      }
    }

    if (shareToken) fetchData()
  }, [shareToken])
  const cardMembers = card?.memberIds
    ?.map(id => board?.FE_allUser?.find(u => u._id === id))
    ?.filter(Boolean)

  if (board?.type === 'private') {
    return (
      <Modal open={true}>
        <Box sx={{
          position: 'relative',
          width: '90%',
          maxWidth: 500,
          bgcolor: 'white',
          borderRadius: '8px',
          p: 4,
          m: '100px auto',
          textAlign: 'center',
          boxShadow: 24
        }}>
          <CancelIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          You don’t have permission to access this card
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          This card is marked as <strong>Private</strong> by its owner.
          </Typography>
        </Box>
      </Modal>
    )
  }

  return (
    <>
      <Modal
        open={true}
        disableScrollLock
        sx={{ overflowY: 'auto' }}>
        <Box sx={{
          position: 'relative',
          width: {
            xs: '90%',
            sm: '85%',
            md: '100%'
          },
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '50px auto',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
        }}>
          <Box sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer'
          }}>
            <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }}/>
          </Box>
          {card?.cover &&
        <Box sx={{ mb: 4 }}>
          <img
            style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
            src={card?.cover}
            alt={card?.title}
          />
        </Box>
          }

          <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCardIcon />
            <Typography variant="span" gutterBottom sx={{
              fontSize: '22px',
              fontWeight: 700,
              marginBottom: 0
            }}>
              {card?.title}
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Left side */}
            <Grid xs={12} sm={9}>
              {card?.isCompleted &&
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TaskAltOutlinedIcon color={card?.isCompleted ? 'success' : 'disabled'} />
                <Typography
                  variant="span"
                  sx={{
                    fontWeight: '600',
                    fontSize: '20px',
                    color:'success.main'
                  }}
                >
                  This card is completed 🎉
                </Typography>
              </Box>
            </Box>
              }

              {card?.labelIds.length !== 0 &&
            <>
              <Typography>Labels</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt:1, mb: 2, flexWrap: 'wrap' }}>
                {board?.labels.map(label => {
                  const active = card?.labelIds.includes(label.id)
                  if (!active) return null
                  const customLabel = board?.customLabels?.find(cl => cl.id === label.id)
                  return (
                    active &&
                    <Box key={label.id} component='span' sx={{ bgcolor: label?.color, p: 2, borderRadius: '4px', width:'48px', height: '32px', display:'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {customLabel?.title || ''}
                    </Box>
                  )
                })}
                <IconButton
                  sx={{
                    background: '#0515240F',
                    borderRadius: '4px',
                    width:'32px',
                    height: '32px'
                  }}>
                  <AddIcon/>
                </IconButton>
              </Box>
            </>
              }
              {card?.dueDate &&
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{
                  display: 'block',
                  py: 0.5,
                  borderRadius: 1,
                  color: '#292A2E'
                }}>
                  Date
                </Typography>
                <Typography variant="body2" sx={{
                  display: 'inline-block',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  color: '#292A2E',
                  background: '#091e420f',
                  fontWeight: 500
                  // bgcolor:  card?.isCompleted || dayjs().isBefore(card?.dueDate) ? 'success.main' : 'error.main'
                }}>
                  {dayjs(card?.dueDate).format('MMM D, YYYY h:mm A')}
                  {textDate &&
                  <Typography variant="span" sx={{ marginLeft: 1,
                    color: colorDate,
                    background:  backgroundDate,
                    px: 1,
                    py: 0.5,
                    borderRadius: '8px'
                  }}>
                    {textDate}
                  </Typography>
                  }
                </Typography>
              </Box>
              }

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

                {/* Feature 02: Xử lý các thành viên của Card */}
                {/* <CardUserGroup
                  cardMemberIds={card?.memberIds}
                  // onUpdateCardMembers={onUpdateCardMembers}
                /> */}
                <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {/* Hiển thị các user là thành viên của card */}
                  {cardMembers?.map((user, index) =>
                    <Tooltip title={user.displayName} key={index}>
                      <Avatar
                        sx={{ width: 34, height: 34, cursor: 'pointer' }}
                        alt={user.displayName}
                        src={user.avatar}
                      />
                    </Tooltip>
                  )}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SubjectRoundedIcon />
                  <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
                </Box>

                {/* Feature 03: Xử lý mô tả của Card */}
                <CardDescriptionMdEditor
                  cardDescriptionProp={card?.description}
                  isReadOnly={true}
                  // handleUpdateCardDescription={onUpdateCardDescription}
                />
              </Box>

              {card?.attachments.length !==0 &&
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AttachmentIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Attachments</Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <AttachmentList
                attachments={card?.attachments}
                isReadOnly={true}
                // onDeleteCardAttachment={onDeleteCardAttachment}
                // onUpdateCardAttachment={onUpdateCardAttachment}
              />
            </Box>
              }

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <DvrOutlinedIcon />
                  <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Comments</Typography>
                </Box>

                {card?.comments.length === 0 &&
                  <Typography sx={{ pl: '45px', fontSize: '14px', fontWeight: '500', color: '#b1b1b1' }}>No comments found!</Typography>
                }
                {card?.comments.map((comment, index) =>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5, mt: 3 }} key={index}>
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
                      <TextField
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
                        >
                          <EmojiEmotionsIcon fontSize="inherit" />
                        </IconButton>
                        <>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: '12px', color: '#44546f', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                                    Chỉnh sửa
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: '12px', color: '#44546f', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                                    Xoá
                          </Typography>
                        </>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
            {/* Right side */}
            <Grid xs={12} sm={3}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
              <Stack direction="column" spacing={1}>
                {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
                {/* Nếu user hiện tại đang đăng nhập chưa thuộc mảng memberIds của card thì mới cho hiện nút Join ra */}
                <SidebarItem
                  className="active"
                >
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
                <SidebarItem
                  className="active"
                >
                  <LogoutIcon fontSize="small" />
                  Leave
                </SidebarItem>
                {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
                <SidebarItem className="active" component="label">
                  <ImageOutlinedIcon fontSize="small" />
                  Cover
                </SidebarItem>
                <SidebarItem><LocalOfferOutlinedIcon fontSize="small" />Labels</SidebarItem>
                <SidebarItem><TaskAltOutlinedIcon fontSize="small"/>{card?.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}</SidebarItem>
                <SidebarItem><WatchLaterOutlinedIcon fontSize="small" />Dates</SidebarItem>
                <SidebarItem className="active"><RemoveRedEyeIcon fontSize="small" />Monitor</SidebarItem>
                {/* <SidebarItem><AutoFixHighOutlinedIcon fontSize="small" />Custom Fields</SidebarItem> */}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><AspectRatioOutlinedIcon fontSize="small" />Card Size</SidebarItem>
              <SidebarItem><AddToDriveOutlinedIcon fontSize="small" />Google Drive</SidebarItem>
              <SidebarItem><AddOutlinedIcon fontSize="small" />Add Power-Ups</SidebarItem>
            </Stack> */}

              <Divider sx={{ my: 2 }} />

              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
              <Stack direction="column" spacing={1}>
                <SidebarItem><ArrowForwardOutlinedIcon fontSize="small" />Move</SidebarItem>
                <SidebarItem><ContentCopyOutlinedIcon fontSize="small" />Copy</SidebarItem>
                {/* <SidebarItem><AutoAwesomeOutlinedIcon fontSize="small" />Make Template</SidebarItem> */}
                {/* <SidebarItem><ArchiveOutlinedIcon fontSize="small" />Archive</SidebarItem> */}
                <SidebarItem><ShareOutlinedIcon fontSize="small" />Share</SidebarItem>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  )
}

export default CardPublicViewModal
