import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Box, Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import {
  selectorCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import { selectorCurrentUser } from '~/redux/user/userSlice'
import { Eye } from 'lucide-react'

function Card({ card }) {
  const board = useSelector(selectorCurrentActiveBoard)
  const currentUser = useSelector(selectorCurrentUser)
  const selectedLabels = board.labels.filter(label => card?.labelIds?.includes(label.id))
  const dispatch = useDispatch()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })
  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }
  const isWatching = card.watchers?.includes(currentUser._id)

  const shouldShowCardActions= () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length || !!card?.dueDate || !!isWatching
  }

  const setActiveCard = () => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showModalActiveCard())
  }

  let colorDate
  let backgroundDate
  if (card?.isCompleted ) {
    backgroundDate = '#5B7F24'
    colorDate = '#FFFFFF'
  } else if (dayjs().isAfter(card?.dueDate)) {
    backgroundDate = '#FFD5D2'
    colorDate = '#AE2E24'
  } else {
    colorDate = '#505258'
  }
  return (
    <>
      <MuiCard
        onClick={setActiveCard}
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceHolderCard ? 'none' : 'block',
          border: '1px solid transparent',
          transition: 'border-color 0.3s ease',
          '&:hover': { borderColor: (theme) => theme.palette.primary.main }
        }}
      >
        {card?.cover &&
          <CardMedia sx={{ height: 140 }} image={card?.cover} title={card?.title} />
        }
        {selectedLabels?.length !== 0 &&
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt:1, ml: '12px', flexWrap: 'wrap' }}>
              {selectedLabels?.map(label =>
                (
                  <Box key={label.id} sx={{ bgcolor: label?.color, borderRadius: '4px', width:'42px', height: '7px' }}>
                  </Box>
                )
              )}
            </Box>
          </>
        }
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{card?.isCompleted ? <TaskAltOutlinedIcon fontSize="small" color='success'/> : ''}{card?.title}</Typography>
        </CardContent>
        {shouldShowCardActions() &&
          <CardActions sx={{ display: 'flex', flexWrap: 'wrap', marginTop: '-15px' }}>
            {/* 1 dấu ! là phủ đinh trả về true/false  còn !! là lấy giá trị nó true hay false chính giá trị đó ko phủ đinhj   */}
            {isWatching &&
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Eye size={19} color="#505258" />
              </Box>
            }
            {!!card?.dueDate &&
              <Typography variant="body2" sx={{
                display: 'flex',
                gap: '5px',
                p:'3px',
                borderRadius: 1,
                color: colorDate,
                background: backgroundDate,
                fontSize: '13px',
                fontWeight: 500
              }}>
                <WatchLaterOutlinedIcon sx={{ fontSize: '17px' }} /> {dayjs(card?.dueDate).format('MMM D, YYYY h:mm')}
              </Typography>
            }
            {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>}
            {!!card?.comments?.length && <Button size="small" startIcon={<CommentIcon />}>{card?.comments?.length}</Button>}
            {!!card?.attachments?.length && <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>}
          </CardActions>
        }
      </MuiCard>
    </>
  )
}

export default Card
