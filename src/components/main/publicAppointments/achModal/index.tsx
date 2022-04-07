import { useState } from 'react'
import { Dialog, DialogTitle, IconButton, Box, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { usBankAccount, client } from 'braintree-web';



const AchModal = ({ open, onClose }: any) => {

  const [token, setToken] = useState('')

  const getFieldHandler = () => {
    debugger
    client.create({ authorization: token }).then((clientInstance) => {
      debugger
       usBankAccount.create({
        client: clientInstance
      }, (error, data) => {
        if (error) {
          console.error(error)
        }
        else {

          // usBankAccount.tokenize({
          //   bankDetails: 'bankDetails', // or bankLogin: bankLogin
          //   bankLogin: '',
          //   mandateText: 'By clicking ["Checkout"], I authorize Braintree, a service of PayPal, on behalf of [your business name here] (i) to verify my bank account information using bank information and consumer reports and (ii) to debit my bank account.'
          // }, (err, data) => { })
          console.log('data => ', data)
        }
      })
    })
      .catch((err) => {
        console.error(err)
      })

  }

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
        <Box>
          <TextField value={token} onChange={(e) => setToken(e.target.value)} multiline minRows={3} variant={'outlined'} fullWidth>
          </TextField>
        </Box>

      </DialogContent>
      <DialogActions>
        <Box pr={0.2}>
          <Button variant='outlined'>
            Cancel
          </Button>
        </Box>
        <Button variant="contained" color="primary" onClick={getFieldHandler}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AchModal