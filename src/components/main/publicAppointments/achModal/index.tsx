import { Fragment, useState } from 'react'
import { Dialog, DialogTitle, IconButton, Box, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { usBankAccount, client, dataCollector ,USBankAccount} from 'braintree-web';
import Alert from '../../../common/Alert';

const AchModal = ({ open, onClose }: any) => {

  const [token, setToken] = useState('')

  const getFieldHandler = () => {
    const bankPersonalDetails = {
      accountNumber: '1000000000',
      routingNumber: '011000015',
      accountType: 'savings', //savings or checking
      ownershipType: "personal", //business or personal
      firstName: "John",
      lastName: "Doe",
      billingAddress: {
        streetAddress: '123 Fake St',
        locality: 'San Francisco',
        region: "CA",
        postalCode: "94119"
      }
    }
    const bankCompanyDetails = {
      accountNumber: '1000000000',
      routingNumber: '011000015',
      accountType: 'checking',
      ownershipType: "business",
      businessName: "Emr",
      billingAddress: {
        streetAddress: '123 Fake St',
        locality: 'San Francisco',
        region: "CA",
        postalCode: "94119"
      }
    }
    client.create({
      authorization: token
    }).then(async (clientInstance) => {
      const deviceInstance = await dataCollector.create({
        client: clientInstance
      })

      const { deviceData } = deviceInstance || {}
      return new Promise((resolve, reject) => {
        usBankAccount.create({
          client: clientInstance
        }, (err, bankInstance) => {
          if (err) {
            reject(err.message)
          }
          else {
            resolve({ bankInstance, deviceData })
          }
        })
      })
    }).then((data: any) => {
      const { bankInstance, deviceData } = data || {}
      bankInstance.tokenize({
        bankDetails: bankCompanyDetails,
        mandateText: 'I authorize Braintree to debit my bank account on behalf of My Online Store.',
      }).then((res: any) => {
        const token = res?.nonce
        console.log('token => ', token)
        console.log('deviceData => ', deviceData)
        debugger
      }).catch((err: any) => {
        console.log('err => ', err)
        Alert.error(err?.message)
      })
    }).catch((err) => {
      Alert.error(err)
      debugger
    })
  }

  return (
    <Fragment>
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
      {/* <PlaidModule /> */}
    </Fragment>
  )
}

export default AchModal