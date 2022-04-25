// packages block
import { Reducer, useCallback, useContext, useEffect, useReducer } from 'react';
import moment from 'moment';
import { Close } from '@material-ui/icons';
import DropIn from 'braintree-web-drop-in-react';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, Dialog, Card, CardHeader, IconButton, Typography, Collapse, Grid } from '@material-ui/core';
import {
  PaymentMethodPayload, PaymentMethodRequestablePayload, PaymentOptionSelectedPayload
} from 'braintree-web-drop-in';
// component block
import Alert from '../../common/Alert';
import BackdropLoader from '../../common/Backdrop';
import ConfirmationModal from '../../common/ConfirmationModal';
// constant, assets and styles block
import { AuthContext } from '../../../context';
import { GRAY_ONE, WHITE_FOUR } from '../../../theme';
import SIGN_IMAGE from "../../../assets/images/sign-image.png";
import { AppointmentCardProps, UpdateStatusInputProps } from '../../../interfacesTypes';
import { useCalendarStyles } from '../../../styles/calendarStyles';
import { getAppointmentDate, getAppointmentDatePassingView, getAppointmentTime, getISOTime, setRecord } from '../../../utils';
import { Action, appointmentReducer, initialState, State, ActionType } from '../../../reducers/appointmentReducer';
import {
  CashAppointmentIcon, DeleteAppointmentIcon, EditAppointmentIcon, InvoiceAppointmentIcon, PrintIcon,
} from '../../../assets/svgs';
import {
  Appointmentstatus, useGetTokenLazyQuery, useUpdateAppointmentStatusMutation, useChargePaymentMutation,
  useCreateInvoiceMutation, Billing_Type, Status, useGetAppointmentLazyQuery, useCancelAppointmentMutation, BillingStatus
} from '../../../generated/graphql';
import {
  PATIENT_NAME, FACILITY_CONTACT, PATIENT_CONTACT, FACILITY_NAME,
  DELETE_APPOINTMENT_DESCRIPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, INVOICE,
  PRODUCT_AND_SERVICES_TEXT, REASON, SUB_TOTAL_TEXT, TOTAL_TEXT, UNPAID, USD,
  FORBIDDEN_EXCEPTION, INVOICE_CREATED, NO_INVOICE, OUTSTANDING_TEXT, PAID, PAY, PAY_AMOUNT,
  APPOINTMENT, APPOINTMENT_DETAILS, APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY, APPOINTMENT_TYPE,
  CANCEL_TIME_EXPIRED_MESSAGE, CANT_CANCELLED_APPOINTMENT, CASH_PAID, CHECKOUT, CREATE_INVOICE,
  PAY_VIA_CASH, PAY_VIA_DEBIT_OR_CREDIT_CARD, PAY_VIA_PAYPAL, PRIMARY_INSURANCE, PROVIDER_NAME,
  TRANSACTION_PAID_SUCCESSFULLY, CHECK_IN, CHECK_IN_ROUTE, APPOINTMENTS_ROUTE, APPOINTMENT_CANCEL_REASON,
} from '../../../constants';
import { Link } from 'react-router-dom';
import history from '../../../history';

const AppointmentCard = ({ tooltip, setCurrentView, setCurrentDate }: AppointmentCardProps): JSX.Element => {
  const { visible, onHide, appointmentMeta } = tooltip
  const classes = useCalendarStyles()
  const { user } = useContext(AuthContext)
  const { id: userId } = user || {}
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState);
  const {
    appointmentPaymentToken, appEdit, instance, appOpen, appPaid, appStatus, appInvoice, appPayment,
    appInvoiceNumber, appShowPayBtn, appDetail, openDelete, isInvoiceNumber, appBillingStatus,
  } = state;
  const methods = useForm<UpdateStatusInputProps>({ mode: "all", });
  const { handleSubmit, watch, setValue } = methods;
  const { appointmentStatus } = watch();

  const [createInvoice] = useCreateInvoiceMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createInvoice: { response, invoice } } = data;

      if (invoice) {
        const { invoiceNo } = invoice
        dispatch({ type: ActionType.SET_APP_INVOICE_NUMBER, appInvoiceNumber: invoiceNo })

      }

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(INVOICE_CREATED);
        }
      }
    }
  });

  const [chargePayment] = useChargePaymentMutation({
    onError({ message }) {
      Alert.error(message);
    },

    onCompleted({ chargePayment: { transaction, response } }) {
      if (response && transaction) {
        Alert.success(TRANSACTION_PAID_SUCCESSFULLY);
        fetchAppointment()
        dispatch({ type: ActionType.SET_APP_DETAIL, appDetail: true })
        dispatch({ type: ActionType.SET_APP_PAID, appPaid: false })
        dispatch({ type: ActionType.SET_APP_INVOICE, appInvoice: false })
        dispatch({ type: ActionType.SET_APP_PAYMENT, appPayment: false })
        dispatch({ type: ActionType.SET_APP_EDIT, appEdit: false })
      }
    }
  });

  const [getToken] = useGetTokenLazyQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message);
    },

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
    }
  });

  const id = appointmentMeta?.data.appointmentId
  const facilityId = appointmentMeta?.data.facilityId
  const patientId = appointmentMeta?.data.patientId
  const providerId = appointmentMeta?.data.providerId
  const serviceId = appointmentMeta?.data.serviceId
  const appointmentPrice = appointmentMeta?.data.price
  const patientName = appointmentMeta?.data.title
  const appDate = getAppointmentDate(appointmentMeta?.data.startDate)
  const appStartTime = getAppointmentTime(appointmentMeta?.data.startDate)
  const appEndTime = getAppointmentTime(appointmentMeta?.data.endDate)
  const scheduleStartDateTime = appointmentMeta?.data.scheduleStartDateTime
  const appCancelToken = appointmentMeta?.data.token
  const providerName = appointmentMeta?.data?.providerName
  const appReason = appointmentMeta?.data?.reason
  const appPrimaryInsurance = appointmentMeta?.data?.primaryInsurance
  const facilityName = appointmentMeta?.data?.facilityName
  const appointmentDatePassingView = appointmentMeta && appointmentMeta?.data.startDate

  const [getAppointment] = useGetAppointmentLazyQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message);
    },

    async onCompleted(data) {
      const { getAppointment: { response, appointment } } = data;

      if (response) {
        const { status } = response;
        if (appointment && status && status === 200) {
          const { invoice, status, billingStatus } = appointment;
          const { invoiceNo } = invoice || {}

          if (invoiceNo) {
            dispatch({ type: ActionType.SET_APP_INVOICE_NUMBER, appInvoiceNumber: invoiceNo })
            dispatch({ type: ActionType.SET_IS_INVOICE_NUMBER, isInvoiceNumber: true })
          } else {
            dispatch({ type: ActionType.SET_APP_INVOICE_NUMBER, appInvoiceNumber: '' })
            dispatch({ type: ActionType.SET_IS_INVOICE_NUMBER, isInvoiceNumber: false })
          }

          status && setValue('appointmentStatus', setRecord(status, status))
          dispatch({ type: ActionType.SET_APP_STATUS, appStatus: status })
          dispatch({ type: ActionType.SET_APP_BILLING_STATUS, appBillingStatus: billingStatus as BillingStatus })
        }
      }
    },
  });

  const fetchAppointment = useCallback(async () => {
    id && await getAppointment({
      variables: { getAppointment: { id: id.toString() } },
    });
  }, [getAppointment, id]);

  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      const { updateAppointmentStatus: { appointment } } = data;

      if (appointment) {
        const { status: appointmentStatus } = appointment

        if (appointmentStatus) {
          dispatch({ type: ActionType.SET_APP_STATUS, appStatus: appointmentStatus })
          Alert.success(APPOINTMENT_STATUS_UPDATED_SUCCESSFULLY);
        }
      }
    }
  });

  const onSubmit: SubmitHandler<UpdateStatusInputProps> = async (inputs) => {
    const { appointmentStatus } = inputs;

    id && await updateAppointmentStatus({
      variables: {
        appointmentStatusInput: {
          id: id.toString(), status: appointmentStatus.name as Appointmentstatus
        }
      }
    })
  };

  const handleClose = () => {
    dispatch({ type: ActionType.SET_APP_DETAIL, appDetail: true })
    dispatch({ type: ActionType.SET_APP_PAID, appPaid: false })
    dispatch({ type: ActionType.SET_APP_INVOICE, appInvoice: false })
    dispatch({ type: ActionType.SET_APP_PAYMENT, appPayment: false })
    dispatch({ type: ActionType.SET_APP_EDIT, appEdit: false })
    onHide && onHide()
  }

  const [cancelAppointment, { loading: cancelAppointmentLoading }] = useCancelAppointmentMutation({
    onError() {
      Alert.error(CANT_CANCELLED_APPOINTMENT)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    async onCompleted(data) {
      if (data) {
        const { cancelAppointment: { response } } = data

        if (response) {
          const { message } = response

          message && Alert.success(message);
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
        }
      }
    }
  });

  const handleCancelAppointment = async () => {
    await cancelAppointment({
      variables: {
        cancelAppointment: { reason: APPOINTMENT_CANCEL_REASON, token: appCancelToken }
      }
    })
  };

  const onDeleteClick = () => {
    dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
  };

  const handleAppDetail = () => {
    dispatch({ type: ActionType.SET_APP_PAID, appPaid: true })
    dispatch({ type: ActionType.SET_APP_PAID, appPaid: true })
  }


  const handlePaid = () => {
    dispatch({ type: ActionType.SET_APP_INVOICE, appInvoice: true })
    dispatch({ type: ActionType.SET_APP_PAID, appPaid: false })
    dispatch({ type: ActionType.SET_APP_DETAIL, appDetail: false })
    dispatch({ type: ActionType.SET_APP_PAYMENT, appPayment: false })
  }

  const handleInvoice = () => {
    dispatch({ type: ActionType.SET_APP_DETAIL, appDetail: false })
    dispatch({ type: ActionType.SET_APP_INVOICE, appInvoice: false })
    dispatch({ type: ActionType.SET_APP_PAID, appPaid: false })
    dispatch({ type: ActionType.SET_APP_PAYMENT, appPayment: true })
  }

  const updateStatus = useCallback(async () => {
    if (appEdit && id && appointmentStatus) {

      await updateAppointmentStatus({
        variables: {
          appointmentStatusInput: {
            id: id.toString(), status: appointmentStatus.id as Appointmentstatus
          }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentStatus, id, updateAppointmentStatus]);

  const createAppointmentInvoice = async () => {
    id && await createInvoice({
      variables: {
        createInvoiceInputs: {
          amount: appointmentPrice, billingType: Billing_Type.SelfPay, facilityId, appointmentId: id.toString(),
          status: Status.Pending, generatedBy: userId, paymentMethod: 'cash', paymentTransactionId: '',
        }
      }
    });

    handleAppDetail()
  }

  const handleEdit = () => history.push(`${APPOINTMENTS_ROUTE}/${id}`)

  useEffect(() => {
    id && fetchAppointment()
  }, [id, fetchAppointment]);

  useEffect(() => {
    id && appEdit && updateStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, updateStatus, watch]);

  useEffect(() => {
    typeof visible === 'boolean' && dispatch({ type: ActionType.SET_APP_OPEN, appOpen: visible })
  }, [appointmentMeta?.data.appointmentStatus, visible, appStatus])

  useEffect(() => {
    id && getToken()
  }, [getToken, id])

  const charge = (token: string) => {
    chargePayment({
      variables: {
        paymentInput: {
          price: appointmentPrice, patientId: patientId, providerId: providerId || '',
          facilityId: facilityId, appointmentId: id, clientIntent: token, serviceId: serviceId
        },
      },
    });
  };


  useEffect(() => {
    if (patientName === "Show More" && visible === true) {
      onHide && onHide()
      setCurrentDate(getAppointmentDatePassingView(appointmentDatePassingView))
      setCurrentView('Day')
    }
  }, [appointmentDatePassingView, onHide, patientName, setCurrentDate, setCurrentView, visible])

  const cashPaid = () => {
    charge("")
  }

  const threeDSecurePayment = () => {
    instance.requestPaymentMethod({ threeDSecure: { amount: appointmentPrice } },
      (err: any, payload: PaymentMethodPayload) => {
        if (err) {
          const { message } = err;
          Alert.error(message);
        } else {
          const { nonce } = payload
          charge(nonce);
        }
      }
    );
  };

  const onPaymentOptionSelected = (payload: PaymentOptionSelectedPayload) => {
    const { paymentOption } = payload

    dispatch({ type: ActionType.SET_APP_SHOW_PAY_BTN, appShowPayBtn: paymentOption === 'card' })
  };

  const onPaymentMethodRequestable = (payload: PaymentMethodRequestablePayload) => {
    const { paymentMethodIsSelected, type } = payload

    if (paymentMethodIsSelected) {
      if (type === 'PayPalAccount') threeDSecurePayment();
      else if (type === 'CreditCard') dispatch({ type: ActionType.SET_APP_SHOW_PAY_BTN, appShowPayBtn: false })
    }
  };

  return (
    <Dialog
      open={appOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
      disableEscapeKeyDown keepMounted
      maxWidth="sm" className={classes.dropdown}
    >
      <Box px={4} py={2} className={classes.cardContainer}>

        {appDetail &&
          <Card>
            <CardHeader
              title={APPOINTMENT}
              action={
                <Box>
                  {appStatus !== "COMPLETED" && <IconButton onClick={() => {
                    moment(getISOTime(scheduleStartDateTime || '')).diff(moment(), 'hours') <= 1 ?
                      Alert.info(CANCEL_TIME_EXPIRED_MESSAGE) : onDeleteClick()
                  }}>
                    <DeleteAppointmentIcon />
                  </IconButton>}

                  <IconButton aria-label="edit" onClick={handleEdit}>
                    <EditAppointmentIcon />
                  </IconButton>

                  <IconButton aria-label="close" onClick={handleClose}>
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

                    <Box className='button-link'>
                      <Typography component={Link} to={`${APPOINTMENTS_ROUTE}/${id}${CHECK_IN_ROUTE}`}>{CHECK_IN}</Typography>
                    </Box>
                  </Box>
                </form>
              </FormProvider>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{APPOINTMENT_TYPE}</Typography>
                <Typography variant="body2">{appointmentMeta?.data?.appointmentType?.name}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{FACILITY_NAME}</Typography>
                <Typography variant="body2">{facilityName ?? 'N/A'}</Typography>
              </Box>

              {providerName !== 'undefined undefined' && <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{PROVIDER_NAME}</Typography>
                <Typography variant="body2">{providerName}</Typography>
              </Box>}

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{REASON}</Typography>
                <Typography variant="body2">{appReason === '' ? 'N/A' : appReason}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pb={1}>
                <Typography variant="body1">{PRIMARY_INSURANCE}</Typography>
                <Typography variant="body2">{appPrimaryInsurance === '' ? 'N/A' : appPrimaryInsurance}</Typography>
              </Box>

              {!appPaid && !isInvoiceNumber ? (<Box display="flex" justifyContent="space-between"
                alignItems="center" mt={3} pt={3} borderTop={`1px solid ${WHITE_FOUR}`}
              >
                <Typography variant='body1'>{NO_INVOICE}</Typography>

                <Button type="submit" onClick={createAppointmentInvoice}
                  variant="contained" color="secondary"
                >
                  {CREATE_INVOICE}
                </Button>
              </Box>
              ) : !isInvoiceNumber && (
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} pt={3}
                  borderTop={`1px solid ${WHITE_FOUR}`}
                >
                  <Box display="flex" alignItems="center" className={classes.invoiceText} onClick={handlePaid}>
                    <InvoiceAppointmentIcon />
                    <Typography variant='body1'>{appInvoiceNumber}</Typography>
                  </Box>

                  <Button className={classes.notCursor} type="submit" variant="outlined" color='default'>
                    {UNPAID}
                  </Button>
                </Box>
              )}

              {isInvoiceNumber && (
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} pt={3}
                  borderTop={`1px solid ${WHITE_FOUR}`}
                >
                  <Box display="flex" alignItems="center" className={classes.invoiceText} onClick={handlePaid}>
                    <InvoiceAppointmentIcon />
                    <Typography variant='body1'>{appInvoiceNumber}</Typography>
                  </Box>

                  <Button className={classes.notCursor} type="submit" variant="outlined" color='default'>
                    {PAID}
                  </Button>
                </Box>
              )}

              <ConfirmationModal
                title={APPOINTMENT_DETAILS}
                isOpen={openDelete}
                isLoading={cancelAppointmentLoading}
                description={DELETE_APPOINTMENT_DESCRIPTION}
                setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
                handleDelete={handleCancelAppointment}
              />
            </Box>
          </Card>
        }

        {appInvoice &&
          <Card>
            <CardHeader
              title={INVOICE}
              action={
                <Box px={2}>
                  <IconButton aria-label="close" onClick={handleClose}>
                    <Close />
                  </IconButton>
                  {appBillingStatus !== 'PAID' && <Button onClick={handleInvoice} type="submit" variant="contained"
                    size="large" color="primary"
                  >
                    {PAY}
                  </Button>}
                </Box>
              }
              className={classes.cardHeader}
            />

            <Box className={classes.cardText}>
              <Box pb={3}>
                <Box display='flex' justifyContent='space-between' pb={1}>
                  <Typography variant="body1">{FACILITY_NAME}</Typography>
                  <Typography variant='h5'>{appointmentMeta?.data?.facilityName}</Typography>
                </Box>

                <Box display='flex' justifyContent='space-between' pb={1}>
                  <Typography variant="body1">{FACILITY_CONTACT}</Typography>
                  <Typography variant="body1">{appointmentMeta?.data?.facilityContact ?? 'N/A'}</Typography>
                </Box>

                <Box p={1} />
                <Box display='flex' justifyContent='space-between' pb={1}>
                  <Typography variant="body1">{PATIENT_NAME}</Typography>
                  <Typography variant='h5'>{patientName}</Typography>
                </Box>

                <Box display='flex' justifyContent='space-between' pb={1}>
                  <Typography variant="body1">{PATIENT_CONTACT}</Typography>
                  <Typography variant="body1">{appointmentMeta?.data?.patientContact ?? 'N/A'}</Typography>
                </Box>

                <Box display='flex' justifyContent='space-between' pb={1}>
                </Box>
              </Box>

              <Box my={2} py={2} borderTop={`1px solid ${WHITE_FOUR}`} borderBottom={`1px solid ${WHITE_FOUR}`}>
                <Typography variant='h4'>{PRODUCT_AND_SERVICES_TEXT}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' pt={2}>
                <Box>
                  <Typography variant="body2"><strong>{appointmentMeta?.data?.appointmentName}</strong></Typography>
                  <Typography variant="body2">{appStartTime} - {appEndTime}</Typography>
                  <Typography variant="body1">{appDate}</Typography>
                </Box>

                <Typography variant="h4">{appointmentPrice ?? 'N/A'}</Typography>
              </Box>

              <Box
                display="flex" justifyContent="space-between" alignItems="center" pt={3}
                borderTop={`1px solid ${WHITE_FOUR}`} borderBottom={`1px solid ${WHITE_FOUR}`}
              >
                <Box>
                  <Typography variant="body1">{SUB_TOTAL_TEXT}</Typography>
                  <Typography variant="body1">{TOTAL_TEXT}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2">{appointmentPrice ?? 'N/A'}</Typography>
                  <Typography variant="body2">{appointmentPrice ?? 'N/A'}</Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" my={3}
                borderBottom={`1px solid ${WHITE_FOUR}`}
              >
                <Typography variant="h5"><strong>{OUTSTANDING_TEXT}</strong></Typography>
                <Typography variant="h4">{appointmentPrice ?? 'N/A'}</Typography>
              </Box>

              <Box mt={5} px={3}>
                <img src={SIGN_IMAGE} alt="" />
              </Box>

              <Box py={2} borderTop={`1px solid ${WHITE_FOUR}`} maxWidth={250} textAlign="center">
                <Typography variant="h5"><strong>{patientName}</strong></Typography>
              </Box>

              <Box onClick={() => window.print()} className={classes.cursor} width={25}>
                <PrintIcon />
              </Box>
            </Box>
          </Card>
        }

        {appPayment &&
          <Card>
            <CardHeader
              title={INVOICE}
              className={classes.cardHeader}
              action={
                <Box px={2}>
                  <IconButton aria-label="close" onClick={handleClose}>
                    <Close />
                  </IconButton>
                </Box>
              }
            />

            <Box className={classes.cardText}>
              <Box display='flex' justifyContent='space-between' borderBottom={`1px solid ${WHITE_FOUR}`}>
                <Typography variant="body1"><strong>{PAY_AMOUNT}</strong></Typography>
                <Typography variant="h6"><strong>{appointmentPrice ?? 'N/A'}</strong></Typography>
              </Box>

              <Box mt={5} p={5}>
                <Box bgcolor={GRAY_ONE}>
                  <Box pt={3} px={3} display='flex' alignItems="center" onClick={() => dispatch({ type: ActionType.SET_APP_EDIT, appEdit: !appEdit })}>
                    <CashAppointmentIcon />
                    <Box p={1} />
                    <Typography variant="h5" className={classes.cursor}>{PAY_VIA_CASH}</Typography>
                  </Box>

                  <Collapse in={appEdit} mountOnEnter unmountOnExit>
                    <Box py={3} display='flex' justifyContent='center'>
                      <Button variant="contained" size='large' color="primary" onClick={cashPaid}>
                        {CASH_PAID}
                      </Button>
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
                          amount: appointmentPrice,
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

                        threeDSecure: { amount: appointmentPrice },
                        dataCollector: true,
                        paymentOptionPriority: ['paypal', 'card'],
                      }}

                      onPaymentMethodRequestable={onPaymentMethodRequestable}
                      onPaymentOptionSelected={onPaymentOptionSelected}
                      onInstance={(data) => dispatch({ type: ActionType.SET_INSTANCE, instance: data })}
                    />

                    <Grid container>
                      {appShowPayBtn && (
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
          </Card>
        }
      </Box>
    </Dialog>
  );
}

export default AppointmentCard
