// packages block
import { Fragment, Reducer, useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router';
import DropIn from 'braintree-web-drop-in-react';
import { Box, Button, Grid, Toolbar, Typography } from '@material-ui/core';
import {
  PaymentMethodPayload, PaymentMethodRequestablePayload, PaymentOptionSelectedPayload,
} from 'braintree-web-drop-in';
// components block
import Alert from '../../../common/Alert';
import ACHPaymentComponent from '../achPayment'
import BackdropLoader from '../../../common/Backdrop';
// constants and types block
import { GREY, WHITE } from '../../../../theme';
import history from '../../../../history';
import { ACHIcon, AIMEDLOGO, PayLaterIcon } from '../../../../assets/svgs';
import { ParamsType } from '../../../../interfacesTypes';
import { appointmentChargesDescription } from '../../../../utils';
import { useHeaderStyles } from '../../../../styles/headerStyles';
import {
  externalPaymentReducer, Action, initialState, State, ActionType
} from '../../../../reducers/externalPaymentReducer';
import {
  useChargeAfterAppointmentMutation, useGetAppointmentLazyQuery, useGetTokenLazyQuery, BillingStatus,
} from '../../../../generated/graphql';
import {
  APPOINTMENT_BOOKED_SUCCESSFULLY, CHOOSE_YOUR_PAYMENT_METHOD, PAY, SLOT_CONFIRMATION,
  PAY_VIA_PAYPAL, PAY_VIA_DEBIT_OR_CREDIT_CARD, CHECKOUT, USD, APPOINTMENT_NOT_EXIST, PAY_LATER,
  PAY_VIA_ACH,
} from '../../../../constants';

const ExternalPaymentComponent = (): JSX.Element => {
  const classes = useHeaderStyles()
  const { id } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(externalPaymentReducer, initialState);

  const {
    appointmentPaymentToken, price, patientId, facilityId, providerId, showPayBtn, instance, achPayment
  } = state;

  const moveNext = () => history.push(`${SLOT_CONFIRMATION}/${id}`)

  const [chargePayment] = useChargeAfterAppointmentMutation({
    onCompleted({ chargeAfterAppointment: { appointment, response } }) {
      if (response && appointment) {
        Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY);
        history.push(`${SLOT_CONFIRMATION}/${id}`);
      } else Alert.error(APPOINTMENT_NOT_EXIST);
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
            type: ActionType.SET_PAYMENT_TOKEN,
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
          const { appointmentType, patientId, provider, facility, billingStatus, } = appointment;

          if (billingStatus === BillingStatus.Due) {
            const { price } = appointmentType || {};
            const { id: providerId } = provider || {};
            const { id: facilityId } = facility || {};

            price && dispatch({ type: ActionType.SET_PRICE, price: price })
            patientId && dispatch({ type: ActionType.SET_PATIENT_ID, patientId: patientId });
            providerId && dispatch({ type: ActionType.SET_PROVIDER_ID, providerId: providerId });
            facilityId && dispatch({ type: ActionType.SET_FACILITY_ID, facilityId: facilityId });

            try {
              await getToken();
            } catch (error) { }
          } else if (billingStatus === BillingStatus.Paid) {
            moveNext();
          }
        }
      }
    },
  });

  const fetchAppointment = useCallback(async () => {
    id && await getAppointment({ variables: { getAppointment: { id } } });
  }, [getAppointment, id]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  const charge = (token: string) => {
    chargePayment({
      variables: {
        paymentInput: { price, patientId, providerId, facilityId, appointmentId: id, clientIntent: token },
      },
    });
  };

  const threeDSecurePayment = () => {
    instance?.requestPaymentMethod(
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
      dispatch({ type: ActionType.SET_SHOW_PAY_BUTTON, showPayBtn: true })
    } else if (payload.paymentOption === 'paypal') {
      dispatch({ type: ActionType.SET_SHOW_PAY_BUTTON, showPayBtn: false })
    }
    else {
      dispatch({ type: ActionType.SET_SHOW_PAY_BUTTON, showPayBtn: false })
    }
  };

  const onPaymentMethodRequestable = (
    payload: PaymentMethodRequestablePayload
  ) => {
    if (payload.paymentMethodIsSelected) {
      if (payload.type === 'PayPalAccount') {
        threeDSecurePayment();
      } else if (payload.type === 'CreditCard') {
        dispatch({ type: ActionType.SET_SHOW_PAY_BUTTON, showPayBtn: false })
      }
    }
  };

  const achClickHandler = () => dispatch({ type: ActionType.SET_ACH_PAYMENT, achPayment: true })

  return (
    <>
      <Box className={classes.appBar}>
        <Toolbar>
          <AIMEDLOGO />
        </Toolbar>
      </Box>

      <Box bgcolor={GREY} minHeight="calc(100vh - 80px)" width='100vw' overflow='hidden'>
        <Box pt={5} textAlign="center">
          <Typography variant='h2'>{CHOOSE_YOUR_PAYMENT_METHOD}</Typography>

          <Typography variant='h6'>
            {appointmentChargesDescription(price || '0')}
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent='center' alignItems='center'>
          <Grid item md={6} sm={12} xs={12}>
            <Box mt={5} p={5} className="paypal-card-wrap">
              {appointmentPaymentToken ? (
                <Box>
                  {!achPayment && (<Fragment>
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
                      onInstance={(data) => dispatch({ type: ActionType.SET_INSTANCE, instance: data })}
                    />

                    {!showPayBtn && <Grid container>
                      <Grid item md={12} sm={12} xs={12}>
                        <Box mb={4} onClick={achClickHandler} borderRadius={4} bgcolor={WHITE} minHeight={80} padding={1.2} display="flex" alignItems="center" className='ach-hover'>
                          <ACHIcon />
                          <Box m={2} />
                          <Typography variant='body1'>{PAY_VIA_ACH}</Typography>
                        </Box>
                      </Grid>

                      <Grid item md={12} sm={12} xs={12}>
                        <Box mb={4} onClick={moveNext} borderRadius={4} bgcolor={WHITE} minHeight={80} padding={1.2} display="flex" alignItems="center" className='ach-hover'>
                          <PayLaterIcon />
                          <Box m={2} />
                          <Typography variant='body1'>{PAY_LATER}</Typography>
                        </Box>
                      </Grid>
                    </Grid>}

                    <Grid container justifyContent='flex-end'>
                      {showPayBtn && (
                        <Grid item md={12} sm={12}>
                          <Box pr={2}>
                            <Button variant='contained' color='primary' onClick={threeDSecurePayment}>
                              {PAY}
                            </Button>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Fragment>)}

                  {achPayment && <ACHPaymentComponent
                    token={appointmentPaymentToken}
                    dispatcher={dispatch} states={state} moveNext={moveNext} />}
                </Box>
              ) : <BackdropLoader loading={true} />}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ExternalPaymentComponent;
