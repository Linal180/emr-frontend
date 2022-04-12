import { Fragment, useState } from 'react'
import { Dialog, DialogTitle, IconButton, Box, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { usBankAccount, client, dataCollector, vaultManager } from 'braintree-web';
import Alert from '../../../common/Alert';
import PlaidModule from './Plaid'




const AchModal = ({ open, onClose }: any) => {

  const [token, setToken] = useState('')

  const getFieldHandler = () => {
    // const bankDetails = {
    //   accountNumber: '1000000000',
    //   routingNumber: '011000015',
    //   accountType: 'savings',
    //   ownershipType: "personal",
    //   firstName: "John",
    //   lastName: "Doe",
    //   billingAddress: {
    //     streetAddress: '123 Fake St',
    //     locality: 'San Francisco',
    //     region: "CA",
    //     postalCode: "94119"
    //   }
    // }

    const bankLogin = {
      displayName: 'My Online Store',
      ownershipType: 'personal',
      firstName: "first name",
      lastName: "last name",
      link: 'public-sandbox-4f546243-26e3-4ffa-800f-59453c7d6adf',
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
      debugger
      bankInstance.tokenize({
        // bankDetails,
        bankLogin,
      Link: 'public-sandbox-4f546243-26e3-4ffa-800f-59453c7d6adf',
        mandateText: 'I authorize Braintree to debit my bank account on behalf of My Online Store.',

      }).then((res: any) => {
        const token = res?.nonce
        debugger
      }).catch((err: any) => {
        console.log('err => ', err)
        Alert.error(err?.message)
      })
    }).catch((err) => {
      Alert.error(err)
      debugger
    })



    // client.create({ authorization: token }).then((clientInstance) => {
    //   debugger
    //   usBankAccount.create({
    //     client: clientInstance
    //   }, (error, data) => {
    //     debugger
    //     if (error) {
    //       console.error(error)
    //     }
    //     else {

    //       /
    //       console.log('data => ', data)
    //     }
    //   })
    // })
    //   .catch((err) => {
    //     console.error(err)
    //   })

  }

  // const paymentHandler = async () => {
  //   const bankDetails = {
  //     accountNumber: '1000000000',
  //     routingNumber: '011000015',
  //     accountType: 'checking',
  //     ownershipType: "personal",
  //     firstName: "first name",
  //     lastName: "last name",
  //     billingAddress: {
  //       streetAddress: '123 Fake St',
  //       locality: 'San Francisco',
  //       region: "CA",
  //       postalCode: "94119"
  //     }
  //   }
  //   try {
  //     const clientInstance = await client.create({ authorization: token });
  //     const deviceData = await dataCollector.create({ client: clientInstance });
  //     usBankAccount.create({ client: clientInstance }, (err, data) => {
  //       if (err) {
  //         Alert.error(err.message)
  //       }
  //       else {
  //         data?.tokenize({
  //           bankDetails: bankDetails,
  //           mandateText: 'I authorize Braintree, a service of PayPal, on behalf of emr (i) to verify my bank account information using bank information and consumer reports and (ii) to debit my bank account.'
  //         }).then((res: any) => {

  //         }).catch((err: any) => {
  //           Alert.error(err?.message)
  //         })
  //       }
  //     })
  //   } catch (error) {
  //     Alert.error(error)
  //   }
  // }


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