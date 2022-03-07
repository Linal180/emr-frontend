import { useState } from 'react';
import DropIn from 'braintree-web-drop-in-react';
import {
  PaymentMethodRequestablePayload,
  PaymentOptionSelectedPayload,
} from 'braintree-web-drop-in';
import { Box, Button } from '@material-ui/core';
import { PAY } from '../../../../constants';

interface PaymentProps {
  clientToken: string;
  amount: string;
  chargePayment: (token: string) => void;
}

export const Payment = (props: PaymentProps): JSX.Element => {
  const { clientToken, amount, chargePayment } = props;

  //states

  const [instance, setInstance] = useState<any>(null);
  const [showPayBtn, setShowPayBtn] = useState<boolean>(false);

  const buy = async () => {
    const { nonce } = await instance.requestPaymentMethod();
    chargePayment(nonce);
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
        buy();
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
                onClick={buy}
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
