// packages block
import { Reducer, useCallback, useEffect, useReducer, useState } from 'react';
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import DropIn from 'braintree-web-drop-in-react';
import { Close } from '@material-ui/icons';
// component block
import BackdropLoader from '../../common/Backdrop';
import ConfirmationModal from '../../common/ConfirmationModal';
import { Box, Button, Dialog, Card, CardHeader, IconButton, Typography, Collapse, Grid } from '@material-ui/core';
// constant block
import { GRAY_ONE, WHITE_FOUR } from '../../../theme';
import SIGN_IMAGE from "../../../assets/images/sign-image.png";
import { useCalendarStyles } from '../../../styles/calendarStyles';
import {
  CashAppointmentIcon, DeleteAppointmentIcon, EditAppointmentIcon, InvoiceAppointmentIcon,
} from '../../../assets/svgs';
import {
  APPOINTMENT, APPOINTMENT_DETAILS, APPOINTMENT_STATUS, APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY, APPOINTMENT_TYPE, CASH_PAID, CHECKOUT, CREATE_INVOICE, DELETE_APPOINTMENT_DESCRIPTION,
  EMAIL_OR_USERNAME_ALREADY_EXISTS,
  EMPTY_OPTION,
  FACILITY_LOCATION, FORBIDDEN_EXCEPTION, INVOICE, INVOICE_CREATED, MAPPED_APPOINTMENT_STATUS, NO_INVOICE, PAY, PAY_AMOUNT, PAY_VIA_CASH, PAY_VIA_DEBIT_OR_CREDIT_CARD, PAY_VIA_PAYPAL, PRIMARY_INSURANCE, PROVIDER_NAME, REASON, STATUS, TRANSACTION_PAID_SUCCESSFULLY, UNPAID, USD
} from '../../../constants';
import { getAppointmentDate, getAppointmentTime, renderItem, setRecord } from '../../../utils';
import { Appointmentstatus, useGetAppointmentLazyQuery, useGetTokenLazyQuery, BillingStatus, useUpdateAppointmentStatusMutation, useChargePaymentMutation, useCreateInvoiceMutation, Billing_Type, Status } from '../../../generated/graphql';
import Alert from '../../common/Alert';
import { UpdateStatusInputProps } from '../../../interfacesTypes';
import Selector from '../../common/Selector';
import { Action, appointmentReducer, initialState, State, ActionType } from '../../../reducers/appointmentReducer';
import { PaymentMethodPayload, PaymentMethodRequestablePayload, PaymentOptionSelectedPayload } from 'braintree-web-drop-in';

const AppointmentCard = ({ visible, onHide, appointmentMeta }: AppointmentTooltip.LayoutProps): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState);
  const { appointmentPaymentToken } = state; const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isAppDetail, setIsAppDetail] = useState<boolean>(true)
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const [appStatus, setAppStatus] = useState<string>('')
  const [isInvoice, setIsInvoice] = useState<boolean>(false)
  const [isPayment, setIsPayment] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [patientId, setPatientId] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>('');
  const [facilityId, setFacilityId] = useState<string>('');
  const [providerId, setProviderId] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [showPayBtn, setShowPayBtn] = useState<boolean>(false);
  const [instance, setInstance] = useState<any>(null);
  const classes = useCalendarStyles()
  const methods = useForm<UpdateStatusInputProps>({
    mode: "all",
  });

  const { setValue, handleSubmit, watch } = methods;

  const { appointmentStatus } = watch();

  const [createInvoice] = useCreateInvoiceMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createInvoice: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(INVOICE_CREATED);
        }
      }
    }
  });

  const [chargePayment] = useChargePaymentMutation({
    onCompleted({ chargePayment: { transaction, response } }) {
      if (response && transaction) {
        Alert.success(TRANSACTION_PAID_SUCCESSFULLY);
      }
    },

    onError({ message }) {
      Alert.error(message);
    },
  });

  const [getToken] = useGetTokenLazyQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onCompleted(data) {
      if (data) {
        const { getToken } = data;

        if (getToken) {
          const { clientToken } = getToken;

          dispatch({
            type: ActionType.SET_APPOINTMENT_PAYMENT_TOKEN,
            appointmentPaymentToken: clientToken,
          });
        }
      }
    },

    onError({ message }) {
      Alert.error(message);
    },
  });

  const [getAppointment] = useGetAppointmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { getAppointment: { response, appointment } } = data;

      if (response) {
        const { status } = response

        if (appointment && status && status === 200) {
          const { status, billingStatus, appointmentType, provider, facility, patientId } = appointment || {}
          status && setValue('appointmentStatus', setRecord(status, status))

          if (billingStatus === BillingStatus.Due) {
            const { price } = appointmentType || {};
            const { id: providerId } = provider || {};
            const { id: facilityId } = facility || {};

            price && setPrice(price);
            patientId && setPatientId(patientId);
            serviceId && setServiceId(serviceId);
            providerId && setProviderId(providerId);
            facilityId && setFacilityId(facilityId);

            try {
              await getToken();
            } catch (error) { }
          }
        }
      }
    }
  });

  const id = appointmentMeta?.data.id

  const fetchAppointment = useCallback(async () => {
    id && await getAppointment({
      variables: { getAppointment: { id: id.toString() } }
    })
  }, [getAppointment, id])


  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateAppointmentStatus: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY);
        }
      }
    }
  });

  const onSubmit: SubmitHandler<UpdateStatusInputProps> = async (inputs) => {
    const { appointmentStatus
    } = inputs;

    if (id) {
      await updateAppointmentStatus({
        variables: { appointmentStatusInput: { id: id.toString(), status: appointmentStatus.name as Appointmentstatus } }
      })
    }
  };

  const handleClose = () => {
    setIsOpen(!isOpen)
  }

  const editHandleClick = () => {
    setEdit(true)
  }

  const deleteHandleClick = () => {
    setIsDeleteOpen(true)
  }

  const handleAppDetail = () => {
    setIsPaid(true)
  }

  const handlePaid = () => {
    setIsInvoice(true)
    setIsPaid(false)
    setIsAppDetail(false)
    setIsPayment(false)
  }

  const handleInvoice = () => {
    setIsAppDetail(false)
    setIsInvoice(false)
    setIsPaid(false)
    setIsPayment(true)
  }
  // const onSubmit: SubmitHandler<InvoiceInputProps> = async (inputs) => {
  //   const { amount, billingType, facilityId, status, generatedBy, paymentMethod, paymentTransactionId
  //   } = inputs;

  //   await createInvoice({
  //     variables: {
  //       createInvoiceInputs: {}
  //     }
  //   })
  // };

  const patientName = appointmentMeta?.data.title
  const appDate = getAppointmentDate(appointmentMeta?.data.startDate)
  const appStartTime = getAppointmentTime(appointmentMeta?.data.startDate)
  const appEndTime = getAppointmentTime(appointmentMeta?.data.endDate)

  const updateStatus = useCallback(() => {
    if (edit && id && appointmentStatus) {

      updateAppointmentStatus({
        variables: { appointmentStatusInput: { id: id.toString(), status: appointmentStatus.id as Appointmentstatus } }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentStatus, id, updateAppointmentStatus]);

  const createAppointmentInvoice = useCallback(() => {
    if (edit && id && appointmentStatus) {
      createInvoice({
        variables: { createInvoiceInputs: { amount: appointmentMeta?.data.price, billingType: Billing_Type.SelfPay, facilityId: appointmentMeta?.data.facilityId, status: Status.Pending } }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentStatus, id, updateAppointmentStatus]);

  useEffect(() => {
    createAppointmentInvoice();
  }, [createAppointmentInvoice]);

  useEffect(() => {
    updateStatus();
  }, [updateStatus, watch]);

  useEffect(() => {
    id && fetchAppointment()
  }, [fetchAppointment, id])

  useEffect(() => {
    typeof visible === 'boolean' && setIsOpen(visible)
    setAppStatus(appointmentMeta?.data.appointmentStatus)
  }, [appointmentMeta?.data.appointmentStatus, visible])

  const charge = (token: string) => {
    if (id) {
      chargePayment({
        variables: {
          paymentInput: { price, patientId, providerId, facilityId, appointmentId: id.toString(), clientIntent: token, serviceId },
        },
      });
    }
  };

  const threeDSecurePayment = () => {
    instance.requestPaymentMethod(
      {
        threeDSecure: { amount: price },
      },
      (err: any, payload: PaymentMethodPayload) => {
        if (!err) {
          charge(payload.nonce);
        } else {
          Alert.error(err?.message);
        }
      }
    );
  };

  const onPaymentOptionSelected = (payload: PaymentOptionSelectedPayload) => {
    if (payload.paymentOption === 'card') {
      setShowPayBtn(true);
    } else if (payload.paymentOption === 'paypal') {
      setShowPayBtn(false);
    }
    else {
      setShowPayBtn(false);
    }
  };

  const onPaymentMethodRequestable = (
    payload: PaymentMethodRequestablePayload
  ) => {
    if (payload.paymentMethodIsSelected) {
      if (payload.type === 'PayPalAccount') {
        threeDSecurePayment();
      } else if (payload.type === 'CreditCard') {
        setShowPayBtn(false);
      }
    }
  };
  console.log(appointmentMeta);
  return (
    <Dialog
      open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
      maxWidth="sm" className={classes.dropdown}
    >
      <Box px={4} py={2} className={classes.cardContainer}>

        {/* CARD1 */}
        {isAppDetail &&
          <Card>
            <CardHeader
              title={APPOINTMENT}
              action={
                <Box>
                  <IconButton onClick={editHandleClick}>
                    <EditAppointmentIcon />
                  </IconButton>

                  <IconButton onClick={deleteHandleClick}>
                    <DeleteAppointmentIcon />
                  </IconButton>

                  <IconButton aria-label="close" onClick={onHide}>
                    <Close />
                  </IconButton>
                </Box>
              }
              className={classes.cardHeader}
            />

            <Box className={classes.cardText}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box pb={3} display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant='h4'>{patientName}</Typography>

                      <Box p={0.5} />

                      <Typography variant="body1">{appDate}</Typography>

                      <Typography variant="body1">{appStartTime} - {appEndTime}</Typography>
                    </Box>
                    {edit ? (
                      <Grid item md={4}>
                        <Selector
                          isRequired
                          label={APPOINTMENT_STATUS}
                          name="appointmentStatus"
                          value={EMPTY_OPTION}
                          options={MAPPED_APPOINTMENT_STATUS}
                        />
                      </Grid>
                    ) : renderItem(STATUS, appStatus)}
                  </Box>
                </form>
              </FormProvider>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{APPOINTMENT_TYPE}</Typography>

                <Typography variant="body2">{appointmentMeta?.data?.appointmentType?.name}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{FACILITY_LOCATION}</Typography>

                <Typography variant="body2">{appointmentMeta?.data?.basicContact ?? 'NAN'}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{PROVIDER_NAME}</Typography>

                <Typography variant="body2">{appointmentMeta?.data?.providerName}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{REASON}</Typography>

                <Typography variant="body2">{appointmentMeta?.data?.reason ?? 'NAN'}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{PRIMARY_INSURANCE}</Typography>

                <Typography variant="body2">{appointmentMeta?.data?.primaryInsurance ?? 'NAN'}</Typography>
              </Box>

              {!isPaid ? <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} pt={3} borderTop={`1px solid ${WHITE_FOUR}`}>
                <Typography variant='body1'>{NO_INVOICE}</Typography>

                <Button type="submit" onClick={handleAppDetail} variant="contained" className="blue-button-new">{CREATE_INVOICE}</Button>
              </Box>
                :
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} pt={3} borderTop={`1px solid ${WHITE_FOUR}`}>
                  <Box display="flex" alignItems="center" className={classes.invoiceText}>
                    <InvoiceAppointmentIcon />

                    <Typography variant='body1'>INV-000000115</Typography>
                  </Box>

                  <Button type="submit" onClick={handlePaid} variant="outlined" color='default'>{UNPAID}</Button>
                </Box>}

              <ConfirmationModal
                title={APPOINTMENT_DETAILS}
                isOpen={isDeleteOpen}
                description={DELETE_APPOINTMENT_DESCRIPTION}
                setOpen={(open: boolean) => setIsDeleteOpen(open)}
                handleDelete={() => { }}
              />
            </Box>
          </Card>}

        {/* CARD2 */}
        {isInvoice &&
          <Card>
            <CardHeader
              title={INVOICE}
              action={
                <Box px={2}>
                  <Button onClick={handleInvoice} type="submit" variant="contained" size="large" color="primary">{PAY}</Button>
                </Box>
              }
              className={classes.cardHeader}
            />

            <Box className={classes.cardText}>
              <Box pb={3}>
                <Typography variant='h5'>National Health Clinic</Typography>

                <Typography variant="body1">Green Fields, 11731</Typography>

                <Box p={1} />

                <Typography variant='h5'>William Martin</Typography>

                <Typography variant="body1">Green Fields, 11731</Typography>
              </Box>

              <Box my={2} py={2} borderTop={`1px solid ${WHITE_FOUR}`} borderBottom={`1px solid ${WHITE_FOUR}`}>
                <Typography variant='h4'>Product & Services</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pt={2}>
                <Box>
                  <Typography variant="body2"><strong>Sick Visit</strong></Typography>
                  <Typography variant="body2">30 min w/ Ted David</Typography>
                  <Typography variant="body1">Tue. Mar. 15, 2022</Typography>
                </Box>

                <Typography variant="h4">$100.00</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between'>
                <Box>
                  <Typography variant="body2"><strong>CBC Test</strong></Typography>
                  <Typography variant="body2">15 min w/ Ted David</Typography>
                  <Typography variant="body1">Tue. Mar. 15, 2022</Typography>
                </Box>

                <Typography variant="h4">$50.00</Typography>
              </Box>

              <Box
                display="flex" justifyContent="space-between" alignItems="center" pt={3}
                borderTop={`1px solid ${WHITE_FOUR}`} borderBottom={`1px solid ${WHITE_FOUR}`}
              >
                <Box>
                  <Typography variant="body1">Sub-Total</Typography>
                  <Typography variant="body1">Total</Typography>
                </Box>

                <Box>
                  <Typography variant="body2">$150.00</Typography>
                  <Typography variant="body2">$150.00</Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" my={3} borderBottom={`1px solid ${WHITE_FOUR}`}>
                <Typography variant="h5"><strong>Outstanding</strong></Typography>
                <Typography variant="h4">$150.00</Typography>
              </Box>

              <Box mt={5} px={3}>
                <img src={SIGN_IMAGE} alt="" />
              </Box>

              <Box py={2} borderTop={`1px solid ${WHITE_FOUR}`} maxWidth={250} textAlign="center">
                <Typography variant="h5"><strong>Floyed Miles</strong></Typography>
              </Box>
            </Box>
          </Card>}

        {/* CARD3 */}
        {isPayment &&
          <Card>
            <CardHeader
              title={INVOICE}
              className={classes.cardHeader}
            />

            <Box className={classes.cardText}>
              <Box display='flex' justifyContent='space-between' borderBottom={`1px solid ${WHITE_FOUR}`}>
                <Typography variant="body1"><strong>{PAY_AMOUNT}</strong></Typography>
                <Typography variant="h6"><strong>$150.00</strong></Typography>
              </Box>

              <Box mt={5} p={5}>
                <Box bgcolor={GRAY_ONE}>
                  <Box pt={3} px={3} display='flex' alignItems="center" onClick={() => setEdit(!edit)}>
                    <CashAppointmentIcon />
                    <Box p={1} />
                    <Typography variant="h5" className={classes.cursor}>{PAY_VIA_CASH}</Typography>
                  </Box>

                  <Collapse in={edit} mountOnEnter unmountOnExit>
                    <Box py={3} display='flex' justifyContent='center'>
                      <Button variant="contained" size='large' color="primary">{CASH_PAID}</Button>
                    </Box>
                  </Collapse>
                </Box>

                {appointmentPaymentToken ? (
                  <Box className='brain-tree-calendar-view'>
                    <DropIn
                      options={{
                        authorization: appointmentPaymentToken,
                        translations: {
                          PayPal: PAY_VIA_PAYPAL,
                          Card: PAY_VIA_DEBIT_OR_CREDIT_CARD,
                          chooseAWayToPay: '',
                        },

                        paypal: {
                          flow: CHECKOUT,
                          currency: USD,
                          amount: price,
                          commit: true,
                          buttonStyle: {
                            tagline: false,
                          },
                        },

                        card: {
                          cardholderName: true,
                          overrides: {
                            styles: {
                              input: {
                                'font-size': '18px',
                              },
                              '.number': {
                                color: 'green',
                              },
                              '.invalid': {
                                color: 'red',
                              },
                            },
                          },
                        },

                        threeDSecure: { amount: price },
                        dataCollector: true,
                        paymentOptionPriority: ['paypal', 'card'],
                      }}

                      onPaymentMethodRequestable={onPaymentMethodRequestable}
                      onPaymentOptionSelected={onPaymentOptionSelected}
                      onInstance={(data) => setInstance(data)}
                    />
                    <Grid container>
                      {showPayBtn && (
                        <Grid item>
                          <Box pr={2}>
                            <Button variant='contained' color='primary' onClick={threeDSecurePayment}>
                              {PAY}
                            </Button>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                ) : (
                  <BackdropLoader loading={true} />
                )}
              </Box>

            </Box>
          </Card>}
      </Box>
    </Dialog>
  );
}

export default AppointmentCard
