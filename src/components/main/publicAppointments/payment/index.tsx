// packages block
import { useParams } from 'react-router';
import { Reducer, useCallback, useEffect, useReducer, useState } from 'react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import DropIn from 'braintree-web-drop-in-react';
import {
  PaymentMethodPayload, PaymentMethodRequestablePayload, PaymentOptionSelectedPayload,
} from 'braintree-web-drop-in';
// components block
import Alert from '../../../common/Alert';
import BackdropLoader from '../../../common/Backdrop';
// constants and types block
import history from '../../../../history';
import { GREY } from '../../../../theme';
import { EMRLogo } from '../../../../assets/svgs';
import { ParamsType } from '../../../../interfacesTypes';
import {
  APPOINTMENT_BOOKED_SUCCESSFULLY, CHOOSE_YOUR_PAYMENT_METHOD, PAY, SLOT_CONFIRMATION, appointmentChargesDescription,
  PAY_VIA_PAYPAL, PAY_VIA_DEBIT_OR_CREDIT_CARD, CHECKOUT, USD, APPOINTMENT_NOT_EXIST, PAY_LATER,
} from '../../../../constants';
import { appointmentReducer, Action, initialState, State, ActionType, } from '../../../../reducers/appointmentReducer';
import { useChargeAfterAppointmentMutation, useGetAppointmentLazyQuery, useGetTokenLazyQuery, BillingStatus, } from '../../../../generated/graphql';
import ACHModal from '../achModal'

const ExternalPaymentComponent = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const [instance, setInstance] = useState<any>(null);
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState);
  const { appointmentPaymentToken } = state;
  const [showPayBtn, setShowPayBtn] = useState<boolean>(false);
  const [patientId, setPatientId] = useState<string>('');
  const [facilityId, setFacilityId] = useState<string>('');
  const [providerId, setProviderId] = useState<string>('');
  const [price, setPrice] = useState<string>('');

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
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message);
    },

    async onCompleted(data) {
      const {
        getAppointment: { response, appointment },
      } = data;

      if (response) {
        const { status } = response;

        if (appointment && status && status === 200) {
          const { appointmentType, patientId, provider, facility, billingStatus, } = appointment;

          if (billingStatus === BillingStatus.Due) {
            const { price } = appointmentType || {};
            const { id: providerId } = provider || {};
            const { id: facilityId } = facility || {};

            price && setPrice(price);
            patientId && setPatientId(patientId);
            providerId && setProviderId(providerId);
            facilityId && setFacilityId(facilityId);

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

  const achClickHandler = () => {
    debugger
  }

  return (
    <Box bgcolor={GREY} minHeight='100vh' padding='30px 30px 30px 60px'>
      <EMRLogo />
      <Box mt={3} mb={1}>
        <Typography variant='h4'>{CHOOSE_YOUR_PAYMENT_METHOD}</Typography>
      </Box>

      <Typography variant='body1'>
        {appointmentChargesDescription(price || '0')}
      </Typography>

      <Grid container spacing={3} justifyContent='center' alignItems='center'>
        <Grid item md={6} sm={12} xs={12}>
          <Box mt={5} p={5}>
            {appointmentPaymentToken ? (
              <Box>
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

                  <Grid item>
                    <Box pr={2}>
                      <Button variant='contained' onClick={achClickHandler} color={'primary'}>Pay via ACH</Button>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Button variant='contained' onClick={moveNext}>{PAY_LATER}</Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <BackdropLoader loading={true} />
            )}
          </Box>
        </Grid>
      </Grid>
     
    </Box>
  );
};

export default ExternalPaymentComponent;
