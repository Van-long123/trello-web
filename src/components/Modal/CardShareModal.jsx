import { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'
import { IconButton, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { sendShareCardEmail, shareTokenCardApi } from '~/apis'
import { WEB_ROOT } from '~/utils/constants'
import { updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { useForm } from 'react-hook-form'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '../Form/FieldErrorAlert'

function CardShareModal({ isOpen, onClose, card }) {
  const dispatch = useDispatch()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [shareUrl, setShareUrl] = useState(null)
  useEffect(() => {
    if (isOpen) {
      if (isEmpty(card?.shareToken)) {
        shareTokenCardApi(card._id).then((card) => {
          setShareUrl(`${WEB_ROOT}/share/card/${card?.shareToken}`)
          dispatch(updateCurrentActiveCard(card))
        })
      } else {
        setShareUrl(`${WEB_ROOT}/share/card/${card?.shareToken}`)
      }
    }
  }, [isOpen])

  const handleShare = (data) => {
    const { email }= data
    const newData = {
      shareUrl,
      email
    }
    // console.log('🚀 ~ handleShare ~ data:', newData)
    sendShareCardEmail(card._id, newData)
    onClose()
    reset() // reset form sau khi submit
  }
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '8px',
        p: '20px 30px',
        overflowY: 'auto',
        maxHeight: '90vh'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: 17, flex: 1, textAlign: 'center' }}>
            Share card
          </Typography>
          <IconButton onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </Box>

        <FormControl fullWidth sx={{ mb: 4, mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Link to this card</Typography>
          <TextField
            disabled
            size="medium"
            fullWidth
            value={shareUrl}
          />
        </FormControl>
        <form onSubmit={handleSubmit(handleShare)}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Email this card</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ flex: 1 }}>
              <TextField
                error={!!errors['email']}
                size="medium"
                fullWidth
                placeholder="Paste email here"
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'}/>
            </FormControl>
          </Box>

          <Button variant="contained" type='submit'>Share card</Button>
          {/* <Button variant="contained" onClick={handleMove} fullWidth disabled={!hasColumn}>Move card</Button> */}
        </form>
      </Box>
    </Modal>
  )
}

export default CardShareModal
