//packages blocks
import { useParams } from 'react-router';
import { ChangeEvent, Fragment } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress, Grid, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { usBankAccount, client, dataCollector } from 'braintree-web';
//components
import Alert from '../../common/Alert';
import Selector from '../../common/Selector';
import InputController from '../../../controller';
import CheckboxController from '../../common/CheckboxController';
//constants, reducers, interfaces, graphql 
import { ActionType } from '../../../reducers/externalPaymentReducer';
import {
  ACCOUNT_TYPE, ACH_PAYMENT_AUTHORITY, ACH_PAYMENT_ACCOUNT_TYPE_ENUMS, ACH_PAYMENT_TABS, BANK_ACCOUNT, CANCEL_TEXT,
  COMPANY_NAME, FIRST_NAME, LAST_NAME, LOCALITY, MAPPED_REGIONS, ROUTING_NUMBER, STATE, STREET_ADDRESS, SUBMIT,
  ZIP_CODE
} from '../../../constants';
import { AccountPaymentInputs, AchAccountType, ACHPaymentComponentProps, ParamsType } from '../../../interfacesTypes';
import { personalAchSchema, businessAchSchema } from '../../../validationSchemas';
import { useAchPaymentMutation } from '../../../generated/graphql';

const ACHPaymentComponent = ({ token, dispatcher, states, moveNext }: ACHPaymentComponentProps) => {

  const { ownershipType, loader, facilityId, patientId, price, providerId } = states
  const { id: appointmentId } = useParams<ParamsType>();
  const methods = useForm<AccountPaymentInputs>({
    mode: "all",
    resolver: yupResolver(ownershipType === 'personal' ? personalAchSchema : businessAchSchema)
  });
  const { handleSubmit, watch } = methods;
  const { firstName, lastName, businessName } = watch()

  const [chargeAccount] = useAchPaymentMutation({
    onCompleted: ({ achPayment }) => {
      const { transaction, response } = achPayment || {}
      const { status, message } = response || {}
      const { id } = transaction || {}
      if (status === 200 && id) {
        message && Alert.success(message)
        moveNext()
      }
      else {
        message && Alert.error(message)
      }
    },
    onError: ({ message }) => {
      Alert.error(message)
    }
  })

  const paymentHandler = async (token: string, deviceData: string) => {
    try {
      await chargeAccount({
        variables: {
          achPaymentInputs: {
            token, facilityId, appointmentId, patientId, price, doctorId: providerId, company: businessName,
            lastName, firstName, deviceData
          }
        }
      })
      dispatcher({ type: ActionType.SET_LOADER, loader: false })
    } catch (error) {
      dispatcher({ type: ActionType.SET_LOADER, loader: false })
    }
  }

  const onSubmit: SubmitHandler<AccountPaymentInputs> = async (inputs) => {
    const {
      accountNumber, accountType, businessName, firstName, lastName, locality, postalCode, region, routingNumber,
      streetAddress } = inputs || {}
    const { id } = accountType;
    const { id: regionId } = region
    dispatcher({ type: ActionType.SET_LOADER, loader: true })
    const bankDetails = {
      accountNumber,
      routingNumber,
      ownershipType,
      accountType: id,
      billingAddress: {
        streetAddress,
        locality,
        region: regionId,
        postalCode
      }
    }

    const companyDetails = {
      businessName,
      ...bankDetails
    }

    const personalDetails = {
      firstName,
      lastName,
      ...bankDetails
    }

    client.create({ authorization: token })
      .then(async (clientInstance) => {
        const deviceInstance = await dataCollector.create({
          client: clientInstance
        })

        const { deviceData } = deviceInstance || {}
        return new Promise((resolve, reject) => {
          usBankAccount.create({
            client: clientInstance
          }, (err, bankInstance) => {
            if (err) {
              const { message } = err || {}
              reject(message)
            }
            else {
              resolve({ bankInstance, deviceData })
            }
          })
        })
      }).then((data: any) => {
        const { bankInstance, deviceData } = data || {}
        bankInstance.tokenize({
          bankDetails: ownershipType === 'business' ? companyDetails : personalDetails,
          mandateText: ACH_PAYMENT_AUTHORITY,
        }).then((res: any) => {
          const { nonce } = res || {}
          nonce && deviceData && paymentHandler(nonce, deviceData)
        }).catch((err: any) => {
          dispatcher({ type: ActionType.SET_LOADER, loader: false })
          Alert.error(err?.message)
        })
      }).catch((err) => {
        dispatcher({ type: ActionType.SET_LOADER, loader: false })
        Alert.error(err)
      })
  }

  const tabChangeHandler = (_: ChangeEvent<{}>, value: AchAccountType) => dispatcher({
    type: ActionType.SET_OWNERSHIP_TYPE, ownershipType: value
  })

  return (
    <Fragment>
      <TabContext value={ownershipType}>
        <TabList onChange={tabChangeHandler} aria-label="ach payment type tabs" variant='fullWidth'>
          {ACH_PAYMENT_TABS.map(item => (
            <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
          ))}
        </TabList>

        <FormProvider {...methods}>
            <Box bgcolor={'white'} p={2} pt={4}>

              <InputController controllerName='routingNumber' controllerLabel={ROUTING_NUMBER} fieldType={'number'} notStep />
              <InputController controllerName='accountNumber' controllerLabel={BANK_ACCOUNT} fieldType={'number'} notStep />
              <Selector name='accountType' options={ACH_PAYMENT_ACCOUNT_TYPE_ENUMS} label={ACCOUNT_TYPE} />

              <TabPanel value="personal">
                <Grid container spacing={2}>
                  <Grid item xs={6}><InputController controllerName='firstName' controllerLabel={FIRST_NAME} /></Grid>
                  <Grid item xs={6}><InputController controllerName='lastName' controllerLabel={LAST_NAME} /></Grid>
                </Grid>
              </TabPanel>

              <TabPanel value="business">
                <InputController controllerName='businessName' controllerLabel={COMPANY_NAME} />
              </TabPanel>

              <Grid container spacing={2}>

                <Grid item xs={6}><InputController controllerName='streetAddress' controllerLabel={STREET_ADDRESS} /></Grid>

                <Grid item xs={6}><InputController controllerName='locality' controllerLabel={LOCALITY} /></Grid>

                <Grid item xs={6}>
                  <InputController controllerName='postalCode' controllerLabel={ZIP_CODE} fieldType={'number'} notStep />
                </Grid>

                <Grid item xs={6}><Selector name='region' options={MAPPED_REGIONS} label={STATE} /></Grid>
              </Grid>

              <CheckboxController controllerName='authority' controllerLabel={ACH_PAYMENT_AUTHORITY} />

              <Box display={'flex'} justifyContent={'flex-end'}>

                <Box pr={2}>
                  <Button
                    variant='outlined'
                    onClick={() => dispatcher({ type: ActionType.SET_ACH_PAYMENT, achPayment: false })}
                    disabled={loader}>
                    {CANCEL_TEXT}
                  </Button>
                </Box>

                <Button variant="contained" color="primary" onSubmit={handleSubmit(onSubmit)} disabled={loader}>
                {!!loader && <CircularProgress size={20} color="inherit" />}  {SUBMIT}
                </Button>
              </Box>
            </Box>
        </FormProvider>

      </TabContext>
    </Fragment>
  )
}

export default ACHPaymentComponent 