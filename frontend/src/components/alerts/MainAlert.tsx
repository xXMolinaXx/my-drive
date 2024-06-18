import { Alert, Snackbar } from "@mui/material"
interface props {
  message: string
  open: boolean
  handleClose: any
  type: 'success' | 'error'
  duration?: number
}
export default function MainAlert({ message, open, handleClose, type, duration = 3000 }: props) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: 'center' }}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}