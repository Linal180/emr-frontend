import React from 'react'
import { Dialog, DialogTitle, IconButton, Box, DialogContent, DialogActions } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons'

const AchModal = ({ open, onClose }: any) => {



  return (
    <Dialog open={open} onClose={onClose} maxWidth={'md'} fullWidth>
      <DialogTitle >
        <Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>

      </DialogContent>
      <DialogActions>
        
      </DialogActions>
    </Dialog>
  )
}

export default AchModal