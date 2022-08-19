import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core'
import { CANCEL, N_A } from '../../constants'
import { AreYouSureModalProps } from '../../interfacesTypes'

function AreYouSureModal({ isOpen, handleClose, handleSubmit, content }: AreYouSureModalProps) {
  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}
      aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        <Typography variant="h4">Are You Sure?</Typography>
      </DialogTitle>

      <DialogContent>
        {content || N_A}
      </DialogContent>

      <DialogActions>
        <Box display='flex' justifyContent='flex-end' alignItems='center'>
          <Button onClick={handleClose} color="default">
            {CANCEL}
          </Button>

          <Box p={1} />

          <Button variant="contained" color="primary" onClick={() => { handleSubmit && handleSubmit() }}>
            Submit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default AreYouSureModal