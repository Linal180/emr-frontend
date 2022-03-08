// packages block
import { useParams } from 'react-router';
import { Reducer, useCallback, useEffect, useReducer, useState } from 'react';
import { Box, Button } from '@material-ui/core';
import DropIn from 'braintree-web-drop-in-react';
import {
  PaymentMethodPayload, PaymentMethodRequestablePayload, PaymentOptionSelectedPayload,
} from 'braintree-web-drop-in';
// components block
import Alert from '../../../common/Alert';
import BackdropLoader from '../../../common/Backdrop';
// constants and types block
import history from "../../../../history";
import { ParamsType } from '../../../../interfacesTypes';
import { APPOINTMENT_BOOKED_SUCCESSFULLY, PAY, SLOT_CONFIRMATION } from '../../../../constants';
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../../reducers/appointmentReducer";
import {
  useChargeAfterAppointmentMutation, useGetAppointmentLazyQuery, useGetTokenLazyQuery
} from '../../../../generated/graphql';

export const ExternalPaymentComponent = (): JSX.Element => {
  const { id } = useParams<ParamsType>()
  const [instance, setInstance] = useState<any>(null);
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { appointmentPaymentToken, } = state
  const [showPayBtn, setShowPayBtn] = useState<boolean>(false);
  const [appointmentId, setAppointmentId] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');
  const [facilityId, setFacilityId] = useState<string>('');
  const [providerId, setProviderId] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const [chargePayment] = useChargeAfterAppointmentMutation({
    onCompleted({ chargeAfterAppointment: { appointment, response } }) {
      if (response && appointment) {
        Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY);
        history.push(`${SLOT_CONFIRMATION}/${appointmentId}`)
      } else Alert.error('Cannot find appointment id')
    },
    onError({ message }) {
      Alert.error(message)
    }
  })

  const [getToken] = useGetTokenLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onCompleted(data) {
      if (data) {
        const { getToken } = data;

        if (getToken) {
          const { clientToken } = getToken;

          dispatch({
            type: ActionType.SET_APPOINTMENT_PAYMENT_TOKEN,
            appointmentPaymentToken: clientToken
          })
        }
      }

    },

    onError({ message }) {
      Alert.error(message)
    }
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
          const { appointmentType, patientId, provider, facility } = appointment;
          const { id: appointmentId, price } = appointmentType || {}
          const { id: providerId } = provider || {}
          const { id: facilityId } = facility || {}

          price && setPrice(price)
          patientId && setPatientId(patientId)
          providerId && setProviderId(providerId)
          facilityId && setFacilityId(facilityId)
          appointmentId && setAppointmentId(appointmentId)

          try {
            await getToken()
          } catch (error) { }
        }
      }
    }
  });

  const fetchAppointment = useCallback(async () => {
    id && await getAppointment({
      variables: { getAppointment: { id } }
    })
  }, [getAppointment, id])

  useEffect(() => {
    fetchAppointment()
  }, [fetchAppointment]);

  const charge = (token: string) => {
    chargePayment({
      variables: {
        paymentInput: {
          price, patientId, providerId, facilityId, appointmentId, clientIntent: token,
        }
      }
    })
  }

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

  return (
    <div>
      {appointmentPaymentToken ? (
        <div>
          <DropIn
            options={{
              authorization: appointmentPaymentToken,
              paypal: {
                flow: 'checkout',
                currency: 'USD',
                amount: price,
                commit: true,
              },
              card: {
                cardholderName: true,
                overrides: {
                  styles: {
                    input: {
                      // color: 'blue',
                      'font-size': '18px',
                    },
                    '.number': {
                      color: 'green',
                      // Custom web fonts are not supported. Only use system installed fonts.
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

          {showPayBtn && (
            <Box pt={4} display='flex' justifyContent='center' gridGap={20}>
              <Button
                onClick={threeDSecurePayment}
                variant='contained'
                className={'blue-button'}
              >
                {PAY}
              </Button>
            </Box>
          )}
        </div>
      ) : (
        <BackdropLoader loading={true} />
      )}
    </div>
  );
};

export default ExternalPaymentComponent;
