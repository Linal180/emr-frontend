// packages block

import { useReducer, Reducer, ChangeEvent, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box, Accordion, AccordionSummary, Radio, Typography, AccordionDetails, Grid, Button
} from "@material-ui/core";
// component block
import Alert from "../../../common/Alert";
import Backdrop from "../../../common/Backdrop";
import InputController from "../../../../controller";
// constants and styles block
import history from "../../../../history";
import { ParamsType } from "../../../../interfacesTypes";
import { useGetPatientLazyQuery } from "../../../../generated/graphql";
import { CardIcon, PaypalIcon, PaypalButton } from "../../../../assets/svgs";
import { useExternalPatientStyles } from "../../../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../reducers/patientReducer"
import {
  PAY_DEBIT_CARD_TEXT, FIRST_NAME, LAST_NAME, CARD_NUMBER, EXPIRY_DATE, CVV, PAY, PAY_PAYPAL_TEXT,
  NOT_FOUND_EXCEPTION, PATIENT_APPOINTMENT_FAIL, PAYMENT_CANT_DONE
} from "../../../../constants";

const PaymentComponent = () => {
  const { id } = useParams<ParamsType>()
  const classes = useExternalPatientStyles();
  const [{ paymentMethod }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const [getPatient, { loading: getPatientLoading }] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message !== NOT_FOUND_EXCEPTION ? PAYMENT_CANT_DONE : message)
      history.push(PATIENT_APPOINTMENT_FAIL)
    },

    onCompleted() { }
  });

  const fetchPatient = useCallback(async () => {
    try {
      id && await getPatient({
        variables: { getPatient: { id } }
      })
    } catch (error) { }
  }, [getPatient, id])

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  const handleChangeAccordion = (paymentMethod: string) =>
    (_: ChangeEvent<{}>, isExpanded: boolean) =>
      dispatch({ type: ActionType.SET_PAYMENT_METHOD, paymentMethod })

  return (
    <Box>
      {getPatientLoading ? <Backdrop loading={true} /> :
        <>
          <Box className={classes.paymentAccordion}>
            <Accordion expanded={paymentMethod === 'card'} onChange={handleChangeAccordion('card')}>
              <AccordionSummary
                expandIcon={<Radio color='primary' disableRipple checked={paymentMethod === 'card'} />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Box display="flex" alignItems="center">
                  <CardIcon />
                  <Box ml={3}>
                    <Typography variant='h4'>{PAY_DEBIT_CARD_TEXT}</Typography>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Box className={classes.paymentAccordionDetail}>
                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="firstName"
                        controllerLabel={FIRST_NAME}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="lastName"
                        controllerLabel={LAST_NAME}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <InputController
                        fieldType="number"
                        controllerName="cardNumber"
                        controllerLabel={CARD_NUMBER}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="expiryDate"
                            controllerLabel={EXPIRY_DATE}
                          />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <InputController
                            fieldType="number"
                            controllerName="cvv"
                            controllerLabel={CVV}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Box display="flex">
                    <Button variant="contained" color="primary">{PAY}</Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box className={classes.paymentAccordion} mt={2}>
            <Accordion expanded={paymentMethod === 'paypal'} onChange={handleChangeAccordion('paypal')}>
              <AccordionSummary
                expandIcon={<Radio color='primary' disableRipple checked={paymentMethod === 'paypal'} />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
                <Box display="flex" alignItems="center">
                  <PaypalIcon />
                  <Box ml={3}>
                    <Typography variant='h4'>{PAY_PAYPAL_TEXT}</Typography>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Box component={Link} mt={3} mb={3} className={classes.paymentAccordionDetail}>
                  <PaypalButton />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </>
      }
    </Box>
  );
};

export default PaymentComponent;
