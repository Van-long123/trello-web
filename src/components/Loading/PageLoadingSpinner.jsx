import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
function PageLoadingSpinner({ caption }) {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2,
          background: 'linear-gradient(to right, #e0f7fa, #ffffff)',
          color: '#1976d2'
        }}
      >
        <CircularProgress size={50} thickness={3.5} sx={{ color: '#1976d2' }} />
        <Typography variant="h6" fontWeight={500}>
          {caption}
        </Typography>
      </Box>

    </>
  )
}

export default PageLoadingSpinner
