//packages block
import {
  Box, Button, Card, Grid, Table, TableBody, TableHead, TableRow, Typography
} from "@material-ui/core";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import InputController from "../../../../controller";
//components block
import UpFrontPaymentType from "./UpFrontPaymentType";
import Alert from "../../../common/Alert";
import Loader from "../../../common/Loader";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router";
import {
  ACTION, ADJUSTMENTS, AMOUNT, AMOUNT_TYPE, BALANCE, CHARGE_ENTRY, EXPECTED, NOTES, NOT_FOUND_EXCEPTION, PAID, PAYMENT, TOTAL_CHARGES, TYPE,
  UPFRONT_INITIAL_VALUES, UPFRONT_PAYMENT_SUCCESS, UPFRONT_PAYMENT_TYPES, USER_NOT_FOUND_EXCEPTION_MESSAGE
} from "../../../../constants";
import { useCreateUpFrontPaymentMutation, useFetchUpFrontPaymentDetailsByAppointmentIdLazyQuery } from "../../../../generated/graphql";
import { CreateUpFrontPayment, FormForwardRef, ParamsType, UpFrontPaymentProps } from "../../../../interfacesTypes";
import { useTableStyles } from "../../../../styles/tableStyles";
import { GREEN, WHITE } from "../../../../theme";
import { renderTh, setRecord } from "../../../../utils";
import { createUpFrontPaymentSchema } from "../../../../validationSchemas";

const UpFrontPayment = forwardRef<FormForwardRef | undefined, UpFrontPaymentProps>((
  { cptCodes, handleStep, shouldDisableEdit }, ref
): JSX.Element => {
  const classes = useTableStyles();
  const { appointmentId, id } = useParams<ParamsType>()
  const methods = useForm<CreateUpFrontPayment>({
    defaultValues: {
      Additional: [{ ...UPFRONT_INITIAL_VALUES, paymentType: UPFRONT_PAYMENT_TYPES.Additional }],
      Copay: [{ ...UPFRONT_INITIAL_VALUES, paymentType: UPFRONT_PAYMENT_TYPES.Copay }],
      Previous: [{ ...UPFRONT_INITIAL_VALUES, paymentType: UPFRONT_PAYMENT_TYPES.Previous }],
    },
    resolver: yupResolver(createUpFrontPaymentSchema)
  })

  const { watch, setValue, handleSubmit, trigger } = methods
  const { Additional, Copay, Previous, adjustments, paid } = watch()
  const upFrontPayments = [...Additional, ...Copay, ...Previous]
  const totalCharge = upFrontPayments.reduce((acc, upFrontPayment) => {
    return acc += Number(upFrontPayment.amount)
  }, 0)

  const totalCptCodeAmount = cptCodes?.reduce((acc, cptCode) => {
    return acc += Number(cptCode.price)
  }, 0) || 0

  useEffect(() => {
    const totalAmount = Number(totalCharge + totalCptCodeAmount)

    const balanceAmount = Number(totalAmount) - Number(adjustments) - Number(paid)

    setValue('totalCharges', String(totalAmount))
    setValue('expected', String(totalAmount))
    setValue('balance', String(balanceAmount))
  }, [Additional, Copay, Previous, adjustments, paid, setValue, totalCharge, totalCptCodeAmount])

  const [createUpFrontPayment, { loading: createUpFrontPaymentLoading }] = useCreateUpFrontPaymentMutation({
    onError({ message }) {
      message === NOT_FOUND_EXCEPTION ?
        Alert.error(USER_NOT_FOUND_EXCEPTION_MESSAGE)
        :
        Alert.error(message)
    },

    onCompleted() {
      Alert.success(UPFRONT_PAYMENT_SUCCESS);
    }
  });

  const [getUpFrontPaymentDetails, { loading: getUpFrontPaymentDetailsLoading }] = useFetchUpFrontPaymentDetailsByAppointmentIdLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      return null
    },

    onCompleted(data) {
      const { fetchUpFrontPaymentDetailsByAppointmentId } = data || {};

      if (fetchUpFrontPaymentDetailsByAppointmentId) {
        const { upFrontPayment } = fetchUpFrontPaymentDetailsByAppointmentId
        const { UpFrontPaymentTypes, adjustments, balance, expected, paid, totalCharges } = upFrontPayment
        setValue('adjustments', adjustments || '')
        setValue('balance', balance || '')
        setValue('expected', expected || '')
        setValue('totalCharges', totalCharges || '')
        setValue('paid', paid || '')

        const transformedUpFrontPayments = UpFrontPaymentTypes?.map((UpFrontPaymentType) => {
          const { amount, notes, paymentType, type } = UpFrontPaymentType
          return {
            amount: Number(amount),
            notes,
            paymentType,
            type: setRecord(type || '', type || '')
          }
        }) || []

        const additional = transformedUpFrontPayments?.filter((UpFrontPaymentType) => UpFrontPaymentType.paymentType === UPFRONT_PAYMENT_TYPES.Additional) || []
        const copay = transformedUpFrontPayments?.filter((UpFrontPaymentType) => UpFrontPaymentType.paymentType === UPFRONT_PAYMENT_TYPES.Copay) || []
        const previous = transformedUpFrontPayments?.filter((UpFrontPaymentType) => UpFrontPaymentType.paymentType === UPFRONT_PAYMENT_TYPES.Previous) || []

        additional?.forEach((value, index) => {
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.amount`, value?.amount as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.notes`, value?.notes as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.type`, value?.type as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.paymentType`, value?.paymentType as never)
        })

        copay?.forEach((value, index) => {
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.amount`, value?.amount as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.notes`, value?.notes as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.type`, value?.type as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.paymentType`, value?.paymentType as never)
        })

        previous?.forEach((value, index) => {
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.amount`, value?.amount as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.notes`, value?.notes as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.type`, value?.type as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.paymentType`, value?.paymentType as never)
        })

        trigger()
      }
    },
  });

  const fetchUpFrontPayments = useCallback(() => {
    try {
      appointmentId && getUpFrontPaymentDetails({
        variables: {
          appointmentId: appointmentId
        }
      })
    } catch (error) { }
  }, [appointmentId, getUpFrontPaymentDetails])

  useEffect(() => {
    fetchUpFrontPayments()
  }, [fetchUpFrontPayments])

  const onSubmit: SubmitHandler<CreateUpFrontPayment> = async (values) => {
    const { balance, expected, totalCharges } = values
    const upFrontPaymentTypes = upFrontPayments.map(upFrontPayment => {
      return {
        ...upFrontPayment,
        amount: String(upFrontPayment.amount),
        type: upFrontPayment.type.id
      }
    })
    await createUpFrontPayment({
      variables: {
        createUpFrontPaymentInput: {
          appointmentId: appointmentId,
          patientId: id,
          upFrontPaymentTypes: upFrontPaymentTypes,
          adjustments,
          balance,
          expected,
          paid,
          totalCharges
        }
      }
    })

    handleStep && handleStep(4)
  }

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit(onSubmit)()
    }
  }));

  if (getUpFrontPaymentDetailsLoading) {
    return <Loader loaderText="Fetching upFront Payments..." loading />
  }


  return (
    <>
      <FormProvider  {...methods}>
        <form>
          <Card>
            <Box pb={3} px={2}>
              <Box py={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Typography variant="h4">{PAYMENT}</Typography>

                {!shouldDisableEdit && <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit(onSubmit)()}
                  disabled={createUpFrontPaymentLoading}
                >
                  {CHARGE_ENTRY}
                </Button>}
              </Box>

              <Box className={classes.mainTableContainer}>
                <Box className="table-overflow">
                  <Table className={`${classes.table} ${classes.paymentTable}`}>
                    <TableHead>
                      <TableRow>
                        {renderTh(AMOUNT_TYPE)}
                        {renderTh(AMOUNT)}
                        {renderTh(TYPE)}
                        {renderTh(NOTES)}
                        {!shouldDisableEdit && renderTh(ACTION)}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <UpFrontPaymentType moduleName={UPFRONT_PAYMENT_TYPES.Copay} shouldDisableEdit={shouldDisableEdit} />
                      <UpFrontPaymentType moduleName={UPFRONT_PAYMENT_TYPES.Additional} shouldDisableEdit={shouldDisableEdit} />
                      <UpFrontPaymentType moduleName={UPFRONT_PAYMENT_TYPES.Previous} shouldDisableEdit={shouldDisableEdit} />
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Box>
          </Card>

          <Box p={2} />

          <Card>
            <Box px={3} pt={1} bgcolor={GREEN} borderRadius={8}>
              <Grid container>
                <Grid item md={8} sm={12} xs={12}>
                  <Grid container spacing={2} direction="row">
                    <Grid item md={4} sm={6} xs={12}>
                      <Box color={WHITE} display="flex" alignItems="center">
                        <Typography variant="h5">{TOTAL_CHARGES}</Typography>

                        <Box ml={1} width={150}>
                          <InputController
                            fieldType="text"
                            controllerLabel={''}
                            controllerName="totalCharges"
                            disabled={shouldDisableEdit}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item md={4} sm={6} xs={12}>
                      <Box color={WHITE} display="flex" alignItems="center">
                        <Typography variant="h5">{EXPECTED} :</Typography>

                        <Box ml={1} width={150}>
                          <InputController
                            fieldType="text"
                            controllerLabel={''}
                            controllerName="expected"
                            disabled={shouldDisableEdit}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item md={4} sm={6} xs={12}>
                      <Box color={WHITE} display="flex" alignItems="center">
                        <Typography variant="h5">{ADJUSTMENTS} :</Typography>

                        <Box ml={1} width={150}>
                          <InputController
                            fieldType="text"
                            controllerLabel={''}
                            controllerName="adjustments"
                            disabled={shouldDisableEdit}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <Grid container spacing={2} direction="row">
                    <Grid item md={6} sm={6} xs={12}>
                      <Box color={WHITE} display="flex" alignItems="center">
                        <Typography variant="h5">{PAID} :</Typography>

                        <Box ml={1} width={150}>
                          <InputController
                            fieldType="text"
                            controllerLabel={''}
                            controllerName="paid"
                            disabled={shouldDisableEdit}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item md={6} sm={6} xs={12}>
                      <Box color={WHITE} display="flex" alignItems="center">
                        <Typography variant="h5">{BALANCE} :</Typography>

                        <Box ml={1} width={150}>
                          <InputController
                            fieldType="text"
                            controllerLabel={''}
                            controllerName="balance"
                            disabled={shouldDisableEdit}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </form>
      </FormProvider>

    </>
  )
})

export default UpFrontPayment;
