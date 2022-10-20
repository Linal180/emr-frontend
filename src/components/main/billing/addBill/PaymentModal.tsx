import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { FC } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid, Typography } from "@material-ui/core";
//components
import Alert from "../../../common/Alert";
import InputController from "../../../../controller";
import NoDataComponent from "../../../common/NoDataComponent";
import RadioController from "../../../../controller/RadioController";
// theme, constants, interfaces
import { appointmentChargesDescription } from "../../../../utils";
import { AppointmentPaymentTypeSchema } from "../../../../validationSchemas";
import { ParamsType, SelfPayComponentProps, SideDrawerCloseReason, AppointmentPaymentType } from "../../../../interfacesTypes";
import {
  ADD_CPT_AND_ICD_CODES, APPOINTMENT_PAYMENT_TYPE, CANCEL, CHOOSE_YOUR_PAYMENT_METHOD, LAST_FOUR_DIGIT,
  MAPPED_APPOINTMENT_PAYMENT_TYPE, PAY,
} from "../../../../constants";
import { BillingStatus, useUpdateAppointmentBillingStatusMutation } from "../../../../generated/graphql";

const SelfPayComponent: FC<SelfPayComponentProps> = ({ onCloseHandler, isOpen, checkOutHandler, state: appointmentState }): JSX.Element => {
  const { appointmentId } = useParams<ParamsType>();
  const methods = useForm<AppointmentPaymentType>({
    defaultValues: {
      paymentType: '',
      lastFour: ''
    },
    resolver: yupResolver(AppointmentPaymentTypeSchema)
  })

  const { handleSubmit, watch: formWatch } = methods
  const { paymentType } = formWatch()
  const { totalPrice } = appointmentState || {}

  const isZeroPrice = totalPrice === '0' || totalPrice === '';

  const [updateAppointmentBillingStatus, { loading }] = useUpdateAppointmentBillingStatusMutation({
    onError: ({ message }) => {
      Alert.error(message)
    },
    onCompleted: (data) => {
      const { updateAppointmentBillingStatus } = data || {}
      const { response } = updateAppointmentBillingStatus || {}
      const { status } = response || {}
      if (status === 200) {
        checkOutHandler()
      }
    }
  })

  const onDialogClose = (_: Object, reason: SideDrawerCloseReason) => {
    if (reason === 'backdropClick') return
    onCloseHandler(!isOpen)
  }

  const onSubmit: SubmitHandler<AppointmentPaymentType> = async (data) => {
    const { lastFour } = data;
    try {
      appointmentId && await updateAppointmentBillingStatus({
        variables: {
          updateAppointmentBillingStatusInput: {
            billingStatus: BillingStatus.Paid,
            id: appointmentId,
            cardLast4Digits: lastFour,
          }
        }
      })
    } catch (error) { }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onDialogClose}
      maxWidth={'md'}
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{CHOOSE_YOUR_PAYMENT_METHOD}</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box p={2}>
            <Box mb={1}>
              {isZeroPrice ? <Box display="flex" justifyContent="center" pb={12} pt={5}>
                <NoDataComponent message={ADD_CPT_AND_ICD_CODES} />
              </Box> : <>
                <Box pt={5} textAlign="center">

                  <Typography variant='h6'>
                    {appointmentChargesDescription(totalPrice || '0')}
                  </Typography>
                </Box>

                <Grid container spacing={3} justifyContent='center' alignItems='center'>
                  <Grid item md={12} sm={12} xs={12}>
                    <Box p={2}>
                      <RadioController label={''} name='paymentType' options={MAPPED_APPOINTMENT_PAYMENT_TYPE} />
                      {paymentType === APPOINTMENT_PAYMENT_TYPE.CARD &&
                        <InputController
                          isRequired
                          fieldType="number"
                          controllerName="lastFour"
                          controllerLabel={LAST_FOUR_DIGIT}
                        />
                      }

                    </Box>
                  </Grid>
                </Grid>
              </>}
            </Box>
          </Box>
          <DialogActions>
            <Box mr={2}>
              <Button onClick={() => onCloseHandler(!isOpen)} disabled={loading}>{CANCEL}</Button>
            </Box>
            <Box>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>{PAY}</Button>
            </Box>

          </DialogActions>
        </form>
      </FormProvider>
    </Dialog >
  );
}


export default SelfPayComponent