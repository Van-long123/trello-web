import { useState } from 'react'
import { Box, Modal, Typography, Button, Stack } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

function CardDatesModal({ open, onClose, card, onUpdateCardDates }) {
  const [startDate, setStartDate] = useState(card?.startDate ? dayjs(card.startDate) : null)
  const [dueDate, setDueDate] = useState(card?.dueDate ? dayjs(card.dueDate) : null)

  const handleSave = () => {
    if (!startDate || !dueDate) {
      toast.error('Please select a start date or a due date.')
      return
    }
    if (startDate.isAfter(dueDate)) {
      toast.error('Start date must be before due date!')
    } else {
      onUpdateCardDates({ startDate, dueDate })
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        bgcolor: 'background.paper',
        p: 3,
        borderRadius: 2,
        maxWidth: 400,
        mx: 'auto',
        mt: 10
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Dates</Typography>

        <Stack spacing={2}>
          <DateTimePicker
            label="Start date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DateTimePicker
            label="Due date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
          />

          <Button variant="contained" onClick={handleSave}>Save</Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default CardDatesModal
