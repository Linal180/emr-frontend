// packages block
import DropIn from 'braintree-web-drop-in-react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { Dispatch, Fragment, Reducer, useCallback, useEffect, useReducer } from 'react';
import {
  PaymentMethodPayload, PaymentMethodRequestablePayload, PaymentOptionSelectedPayload,
} from 'braintree-web-drop-in';
// components block
import Alert from '../../common/Alert';
import ViewDataLoader from "../ViewDataLoader";
import ACHPaymentComponent from './AchPaymentForm'
// constants and types block
import { GREY } from '../../../theme';
import { appointmentChargesDescription } from '../../../utils';
import { useChargePaymentMutation, useGetServiceLazyQuery, useGetTokenLazyQuery } from '../../../generated/graphql';
import {
  externalPaymentReducer, Action, initialState, State, ActionType
} from '../../../reducers/externalPaymentReducer';
import {
  Action as PublicFormBuilderAction, ActionType as FormActionType, State as PublicFormBuilderState
} from '../../../reducers/externalFormBuilderReducer';
import {
  CHOOSE_YOUR_PAYMENT_METHOD, PAY, PAY_LATER, PAY_VIA_ACH, PAY_VIA_PAYPAL,
  PAY_VIA_DEBIT_OR_CREDIT_CARD, CHECKOUT, USD,
} from '../../../constants';

interface PaymentComponentProps {
  dispatcher?: Dispatch<PublicFormBuilderAction>;
  state?: PublicFormBuilderState
}

const PaymentComponent = ({ dispatcher, state: formState }: PaymentComponentProps): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(externalPaymentReducer, initialState);
  const { appointmentPaymentToken, price, showPayBtn, instance, achPayment } = state;
  const { activeStep, serviceId } = formState || {}

  const moveNext = () => {
    dispatcher && activeStep && dispatcher({ type: FormActionType.SET_ACTIVE_STEP, activeStep: activeStep + 1 })
  }

  const [chargePayment] = useChargePaymentMutation({
    onCompleted({ chargePayment }) {

      const { transaction, response } = chargePayment
      if (response && transaction) {

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

  const [getService] = useGetServiceLazyQuery({
    onCompleted: (data) => {
      if (data) {
        const { getService } = data
        const { service, response } = getService
        const { status } = response || {}
        if (status === 200 && service) {
          const { price } = service;
          dispatch({ type: ActionType.SET_PRICE, price })
        }
      }
    },
    onError: () => {

    }
  })

  const fetchToken = useCallback(async () => {
    await getToken();
  }, [getToken]);

  const fetchService = useCallback(async () => {
    try {
      serviceId && await getService({ variables: { getService: { id: serviceId } } })
      price && fetchToken()
    } catch (error) {

    }
  }, [getService, serviceId, fetchToken, price])

  useEffect(() => {
    serviceId && fetchService();
  }, [fetchService, serviceId]);

  const charge = (token: string) => {
    chargePayment({
      variables: {
        paymentInput: { price, clientIntent: token },
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
    <Box bgcolor={GREY} padding='30px 30px 30px 60px'>
      <Box mt={3} mb={1}>
        <Typography variant='h4'>{CHOOSE_YOUR_PAYMENT_METHOD}</Typography>
      </Box>
      {appointmentPaymentToken ? (
        <Fragment>
          <Typography variant='body1'>
            {appointmentChargesDescription(price || '0')}
          </Typography>

          <Grid container spacing={3} justifyContent='center' alignItems='center'>
            <Grid item md={6} sm={12} xs={12}>
              <Box mt={5} p={5} className="paypal-card-wrap">

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
                          <Button variant='contained' onClick={achClickHandler} color={'primary'}>{PAY_VIA_ACH}</Button>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Button variant='contained' onClick={moveNext}>{PAY_LATER}</Button>
                      </Grid>
                    </Grid>
                  </Fragment>)}
                  {achPayment && <ACHPaymentComponent
                    token={appointmentPaymentToken}
                    dispatcher={dispatch} states={state} moveNext={moveNext} />}
                </Box>

              </Box>
            </Grid>
          </Grid>
        </Fragment>) : (
        <ViewDataLoader rows={3} columns={12} hasMedia={false} />
      )}

    </Box>
  );
};

export default PaymentComponent;
