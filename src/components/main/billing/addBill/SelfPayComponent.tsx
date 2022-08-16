// packages block
import { useParams } from 'react-router';
import DropIn from 'braintree-web-drop-in-react';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { FC, Fragment, Reducer, useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  PaymentMethodPayload, PaymentMethodRequestablePayload, PaymentOptionSelectedPayload
} from 'braintree-web-drop-in';
// components block
import Alert from '../../../common/Alert';
import Loader from '../../../common/Loader';
import NoDataComponent from '../../../common/NoDataComponent';
import ACHPaymentComponent from '../../publicAppointments/achPayment';
// constants and types block
import { GREY, WHITE } from '../../../../theme';
import { ACHIcon } from '../../../../assets/svgs';
import { appointmentChargesDescription } from '../../../../utils';
import { SelfPayComponentProps, ParamsType, TableCodesProps } from '../../../../interfacesTypes';
import { useChargeAfterAppointmentMutation, useGetTokenLazyQuery } from '../../../../generated/graphql';
import { externalPaymentReducer, Action, initialState, State, ActionType } from '../../../../reducers/externalPaymentReducer';
import {
  APPOINTMENT_BOOKED_SUCCESSFULLY, CHOOSE_YOUR_PAYMENT_METHOD, PAY, PAY_VIA_ACH, PAY_VIA_PAYPAL, APPOINTMENT_NOT_EXIST,
  PAY_VIA_DEBIT_OR_CREDIT_CARD, CHECKOUT, USD, ADD_CPT_AND_ICD_CODES,
} from '../../../../constants';

const SelfPayComponent: FC<SelfPayComponentProps> = ({ state: billingState }): JSX.Element => {
  const { appointmentId: aptId, id } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(externalPaymentReducer, initialState);

  const {
    appointmentPaymentToken, price, showPayBtn, instance, achPayment, facilityId, patientId, providerId,
    appointmentId
  } = state;
  const isZeroPrice = price === '0' || price === ''

  const [chargePayment] = useChargeAfterAppointmentMutation({
    onCompleted({ chargeAfterAppointment: { appointment, response } }) {
      if (response && appointment) {
        Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY);
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

  const fetchToken = useCallback(async () => {
    try {
      appointmentId && await getToken();
    } catch (error) { }
  }, [getToken, appointmentId]);

  useEffect(() => {
    !isZeroPrice && fetchToken();
  }, [isZeroPrice, fetchToken]);

  const charge = async (token: string) => {
    try {
      appointmentId && await chargePayment({
        variables: {
          paymentInput: { price, patientId, providerId: providerId ? providerId : null, facilityId, appointmentId, clientIntent: token },
        },
      });
    }
    catch (err) { }
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

  useMemo(() => {
    const { tableCodesData, facilityId: billingFacility, providerId: billingProvider } = billingState;
    let priceArr: TableCodesProps[] = []
    if (tableCodesData?.CPT_CODE) priceArr = [...priceArr, ...tableCodesData?.CPT_CODE]
    if (tableCodesData?.ICD_10_CODE) priceArr = [...priceArr, ...tableCodesData?.ICD_10_CODE]
    const totalCharges = priceArr.reduce((acc, code) => {
      return acc += Number(code.price || 0)
    }, 0)

    totalCharges && dispatch({ type: ActionType.SET_PRICE, price: `${totalCharges}` })
    billingFacility && dispatch({ type: ActionType.SET_FACILITY_ID, facilityId: billingFacility })
    billingProvider && dispatch({ type: ActionType.SET_PROVIDER_ID, providerId: billingProvider })
    id && dispatch({ type: ActionType.SET_PATIENT_ID, patientId: id })
    aptId && dispatch({ type: ActionType.SET_APPOINTMENT_ID, appointmentId: aptId })
  }, [billingState, id, aptId])

  if (isZeroPrice) {
    return (<Box display="flex" justifyContent="center" pb={12} pt={5}>
      <NoDataComponent message={ADD_CPT_AND_ICD_CODES} />
    </Box>)
  }

  return (
    <>
      <Box bgcolor={GREY}>
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
                    dispatcher={dispatch} states={state} />}
                </Box>
              ) : <Loader loading={true} />}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SelfPayComponent;
