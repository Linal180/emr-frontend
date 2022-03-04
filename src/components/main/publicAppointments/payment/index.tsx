import React, { useEffect, useState } from 'react';
import DropIn from 'braintree-web-drop-in-react';
import {
  PaymentMethodRequestablePayload,
  PaymentOptionSelectedPayload,
} from 'braintree-web-drop-in';
import { useGetTokenLazyQuery, useGetTokenQuery } from '../../../../generated/graphql';

export const Payment = () => {

    //states

    
  const [instance, setInstance] = useState<any>(null);
  const [clientToken, setClientToken] = useState<string>('');
  const [showPayBtn, setShowPayBtn] = useState<boolean>(false);

  const  [getToken, { loading,data }] = useGetTokenLazyQuery({
    onCompleted(){

    },
    onError(){

    }
  })

  useEffect(() => {
    getToken()
    if(loading){

    }else{
      data?.getToken.clientToken && setClientToken(data?.getToken.clientToken);
    }
  }, [data,loading,getToken]);

  const buy = async () => {
    debugger;
    // Send the nonce to your server
    const { nonce } = await instance.requestPaymentMethod();
    debugger;
    // await fetch(`server.test/purchase/${nonce}`);
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
        debugger
        setShowPayBtn(false);
      }
    }
  };

  return (
    <div>
      {clientToken ? (
        <div >
          <DropIn
            options={{
              authorization: clientToken,
              paypal: {
                flow: 'checkout',
                currency: 'USD',
                amount: '50',
                commit: true,
              },
              card: {
                cardholderName: true,
                overrides: {
                  styles: {
                    input: {
                      // color: 'blue',
                      'font-size': '18px'
                    },
                    '.number': {
                      'color':"green"
                      // Custom web fonts are not supported. Only use system installed fonts.
                    },
                    '.invalid': {
                      color: 'red'
                    }
                  }
                }            
              },
              dataCollector: true,
              paymentOptionPriority: ['paypal', 'card'],
            }}
            onPaymentMethodRequestable={onPaymentMethodRequestable}
            onPaymentOptionSelected={onPaymentOptionSelected}
            onInstance={(insta) => setInstance(insta)}
          />
          {/* {showPayBtn && <button onClick={buy}>Buy</button>} */}
        </div>
      ) : (
        'loading'
      )}
    </div>
  );
};

export default Payment;
