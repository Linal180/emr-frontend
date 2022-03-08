import { useState } from 'react';
import DropIn from 'braintree-web-drop-in-react';
import {
  PaymentMethodPayload,
  PaymentMethodRequestablePayload,
  PaymentOptionSelectedPayload,
} from 'braintree-web-drop-in';
import { Box, Button } from '@material-ui/core';
import { PAY } from '../../../../constants';
import Alert from '../../../common/Alert';
import { PaymentProps } from '../../../../interfacesTypes';

export const Payment = (props: PaymentProps): JSX.Element => {
  const { clientToken, amount, chargePayment } = props;

  //states

  const [instance, setInstance] = useState<any>(null);
  const [showPayBtn, setShowPayBtn] = useState<boolean>(false);

  // const buy = async () => {
  //   const { nonce } = await instance.requestPaymentMethod({});
  //   chargePayment(nonce);
  // };

  const threeDSecurePayment = () => {
    instance.requestPaymentMethod(
      {
        threeDSecure: {
          amount,
        },
      },
      (err: any, payload: PaymentMethodPayload) => {
        if (!err) {
          chargePayment(payload.nonce);
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
        // buy();
        threeDSecurePayment();
      } else if (payload.type === 'CreditCard') {
        setShowPayBtn(false);
      }
    }
  };

  return (
    <div>
      {clientToken ? (
        <div>
          <DropIn
            options={{
              authorization: clientToken,
              paypal: {
                flow: 'checkout',
                currency: 'USD',
                amount: amount,
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
              threeDSecure: { amount: amount },
              dataCollector: true,
              paymentOptionPriority: ['paypal', 'card'],
            }}
            onPaymentMethodRequestable={onPaymentMethodRequestable}
            onPaymentOptionSelected={onPaymentOptionSelected}
            onInstance={(insta) => setInstance(insta)}
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
        'loading'
      )}
    </div>
  );
};

export default Payment;
