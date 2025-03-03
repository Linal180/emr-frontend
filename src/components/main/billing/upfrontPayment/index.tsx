//packages block
import {
  Box, Button, Card, Grid, Table, TableBody, TableHead, TableRow, Typography
} from "@material-ui/core";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
import InputController from "../../../../controller";
//components block
import { createUpFrontPaymentSchema } from "../../../../validationSchemas";
import Alert from "../../../common/Alert";
import Loader from "../../../common/Loader";
import UpFrontPaymentType from "./UpFrontPaymentType";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ADJUSTMENTS, AMOUNT_TYPE, BALANCE, COLLECTED_AMOUNT, CPT_TEXT, DUE_AMOUNT, EXPECTED, NOTES, NOT_FOUND_EXCEPTION, PAID,
  PAY,
  PAYMENT, PAYMENT_TYPE, TOTAL_TEXT, UPFRONT_INITIAL_VALUES, UPFRONT_PAYMENT_SUCCESS, UPFRONT_PAYMENT_TYPES,
  USER_NOT_FOUND_EXCEPTION_MESSAGE
} from "../../../../constants";
import { Copay, OrderOfBenefitType, useCreateUpFrontPaymentMutation, useFetchPatientInsurancesLazyQuery, useFetchUpFrontPaymentDetailsByAppointmentIdLazyQuery, useFindAppointmentInsuranceStatusLazyQuery } from "../../../../generated/graphql";
import { CreateUpFrontPayment, FormForwardRef, ParamsType, UpFrontPaymentProps } from "../../../../interfacesTypes";
import { useTableStyles } from "../../../../styles/tableStyles";
import { GREY } from "../../../../theme";
import { renderTh, setRecord } from "../../../../utils";

const UpFrontPayment = forwardRef<FormForwardRef | undefined, UpFrontPaymentProps>((
  { cptCodes, handleStep, shouldDisableEdit, setPrice }, ref
): JSX.Element => {
  const classes = useTableStyles();
  const { appointmentId, id } = useParams<ParamsType>()
  const [isInsurance, setIsInsurance] = useState(true)
  const [copays, setCopays] = useState<Copay[]>([])

  const methods = useForm<CreateUpFrontPayment>({
    defaultValues: {
      Additional: [{ ...UPFRONT_INITIAL_VALUES, paymentType: UPFRONT_PAYMENT_TYPES.Additional }],
      Copay: [{ ...UPFRONT_INITIAL_VALUES, paymentType: UPFRONT_PAYMENT_TYPES.Copay }],
      Previous: [{ ...UPFRONT_INITIAL_VALUES, paymentType: UPFRONT_PAYMENT_TYPES.Previous }],
    },
    resolver: yupResolver(createUpFrontPaymentSchema(copays, isInsurance))
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
    setValue('cptCodesAmount', String(totalCptCodeAmount))
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
        const { upFrontPayment, previous: accPrevious } = fetchUpFrontPaymentDetailsByAppointmentId
        const { UpFrontPaymentTypes, adjustments, balance, expected, paid, totalCharges } = upFrontPayment || {}
        setValue('adjustments', adjustments || '')
        setValue('balance', balance || '')
        setValue('expected', expected || '')
        setValue('totalCharges', totalCharges || '')
        setValue('paid', paid || '')
        setPrice && setPrice(paid || '')
        setValue('previous', String(accPrevious || 0))

        accPrevious && setValue(`${UPFRONT_PAYMENT_TYPES.Previous}.0.amount`, String(accPrevious) as never)

        const transformedUpFrontPayments = UpFrontPaymentTypes?.map((UpFrontPaymentType) => {
          const { amount, notes, paymentType, type, copayType } = UpFrontPaymentType
          return {
            amount: Number(amount),
            notes,
            paymentType,
            type: setRecord(type || '', type || ''),
            copayType: setRecord(copayType || '', copayType || ''),
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
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.copayType`, value?.copayType as never)
        })

        copay?.forEach((value, index) => {
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.amount`, value?.amount as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.notes`, value?.notes as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.type`, value?.type as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.paymentType`, value?.paymentType as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.copayType`, value?.copayType as never)
        })

        previous?.forEach((value, index) => {
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.amount`, (value?.amount as never || accPrevious))
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.notes`, value?.notes as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.type`, value?.type as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.paymentType`, value?.paymentType as never)
          setValue(`${value.paymentType as UPFRONT_PAYMENT_TYPES}.${index}.copayType`, value?.copayType as never)
        })


      }
    },
  });

  const fetchUpFrontPayments = useCallback(async () => {
    try {
      appointmentId && await getUpFrontPaymentDetails({
        variables: {
          appointmentId: appointmentId
        }
      })
    } catch (error) { }
  }, [appointmentId, getUpFrontPaymentDetails])



  const onSubmit: SubmitHandler<CreateUpFrontPayment> = async (values) => {
    const { balance, expected, totalCharges } = values
    const upFrontPaymentTypes = upFrontPayments.map(upFrontPayment => {
      return {
        ...upFrontPayment,
        amount: String(upFrontPayment.amount),
        type: upFrontPayment.type.id,
        copayType: upFrontPayment.copayType?.id,
        dueAmount: upFrontPayment.dueAmount,
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

  const [findInsuranceStatus] = useFindAppointmentInsuranceStatusLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: ({
      appointmentId: appointmentId || ''
    }),

    onCompleted(data) {
      const { findAppointmentInsuranceStatus } = data || {}
      if (findAppointmentInsuranceStatus) {
        const { insuranceStatus } = findAppointmentInsuranceStatus
        setIsInsurance(insuranceStatus === 'insurance')
      }
    }
  });

  const [fetchPatientInsurances] = useFetchPatientInsurancesLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: ({
      id: id
    }),

    onCompleted(data) {
      const { fetchPatientInsurances } = data || {}
      if (fetchPatientInsurances) {
        const { policies, response } = fetchPatientInsurances
        if (response && response.status === 200) {
          const primaryInsurance = policies?.find((policyInfo) => policyInfo.orderOfBenefit === OrderOfBenefitType.Primary)
          const secondaryInsurance = policies?.find((policyInfo) => policyInfo.orderOfBenefit === OrderOfBenefitType.Secondary)
          const tertiaryInsurance = policies?.find((policyInfo) => policyInfo.orderOfBenefit === OrderOfBenefitType.Tertiary)

          const insuranceInfo = primaryInsurance ? primaryInsurance : secondaryInsurance ? secondaryInsurance : tertiaryInsurance
          const { copays } = insuranceInfo || {}
          const { type, amount } = copays?.[0] || {}
          setValue(`Copay.0.dueAmount`, amount as never)
          setValue(`Copay.0.notes`, '' as never)
          setValue(`Copay.0.copayType`, setRecord(type || '', type || '') as never)
          setCopays(copays as Copay[])

        }
      }
    }
  });

  const getPatientInsurances = useCallback(async () => {
    try {

      await fetchPatientInsurances({
        variables: {
          id: id
        }
      })
    } catch (error) { }
  }, [fetchPatientInsurances, id])

  const fetchData = useCallback(async () => {
    try {
      await getPatientInsurances()
      await fetchUpFrontPayments()
      await findInsuranceStatus()
    }
    catch (e) { }
  }, [fetchUpFrontPayments, findInsuranceStatus, getPatientInsurances])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useImperativeHandle(ref, () => ({
    async submit() {
      await handleSubmit(onSubmit)()
    }
  }));

  if (getUpFrontPaymentDetailsLoading) {
    return <Loader loading loaderText="Fetching upFront Payments..." />
  }

  return (
    <>
      <FormProvider  {...methods}>
        <form>
          <Card>
            <Box pb={3} px={2}>
              <Box py={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                <Typography variant="h4">{PAYMENT}</Typography>
              </Box>

              <Box className={classes.mainTableContainer}>
                <Box className="table-overflow">
                  <Table className={`${classes.table} ${classes.paymentTable}`}>
                    <TableHead>
                      <TableRow>
                        {renderTh(AMOUNT_TYPE)}
                        {!!copays?.length && renderTh(DUE_AMOUNT)}
                        {renderTh(COLLECTED_AMOUNT)}
                        {renderTh(PAYMENT_TYPE)}
                        {renderTh(NOTES)}
                        {/* {!shouldDisableEdit && renderTh(ACTION)} */}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {!!copays?.length && isInsurance && <UpFrontPaymentType moduleName={UPFRONT_PAYMENT_TYPES.Copay} shouldDisableEdit={shouldDisableEdit} copays={copays} />}
                      <UpFrontPaymentType moduleName={UPFRONT_PAYMENT_TYPES.Additional} shouldDisableEdit={shouldDisableEdit} copays={copays} />
                      <UpFrontPaymentType moduleName={UPFRONT_PAYMENT_TYPES.Previous} shouldDisableEdit={shouldDisableEdit} copays={copays} />
                    </TableBody>
                  </Table>
                </Box>
              </Box>

              {cptCodes && <Box mt={3} px={3} pt={1} bgcolor={GREY} borderRadius={8}>
                <Grid container>
                  <Grid item md={8} sm={12} xs={12}>
                    <Grid container spacing={0} direction="row">
                      <Grid item md={3} sm={6} xs={12}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h5">{TOTAL_TEXT} :</Typography>

                          <Box ml={1} width={150}>
                            <InputController
                              fieldType="number"
                              controllerLabel={''}
                              controllerName="totalCharges"
                              disabled={shouldDisableEdit}
                              className="payment-input"
                            />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item md={3} sm={6} xs={12}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h5">{EXPECTED} :</Typography>

                          <Box ml={1} width={150}>
                            <InputController
                              fieldType="number"
                              controllerLabel={''}
                              controllerName="expected"
                              disabled={shouldDisableEdit}
                              className="payment-input"
                            />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item md={3} sm={6} xs={12}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h5">{ADJUSTMENTS} :</Typography>

                          <Box ml={1} width={150}>
                            <InputController
                              fieldType="number"
                              controllerLabel={''}
                              controllerName="adjustments"
                              disabled={shouldDisableEdit}
                              className="payment-input"
                            />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item md={3} sm={6} xs={12}>
                        <Box ml={1} display="flex" alignItems="center">
                          <Typography variant="h5">{CPT_TEXT} :</Typography>

                          <Box ml={1} width={150}>
                            <InputController
                              fieldType="number"
                              controllerLabel={''}
                              controllerName="cptCodesAmount"
                              disabled={true}
                              className="payment-input"
                              defaultValue={String(totalCptCodeAmount)}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={4} sm={12} xs={12}>
                    <Grid container spacing={0} direction="row">
                      <Grid item md={6} sm={6} xs={12}>
                        <Box ml={1} display="flex" alignItems="center">
                          <Typography variant="h5">{PAID} :</Typography>

                          <Box ml={1} width={150}>
                            <InputController
                              fieldType="number"
                              controllerLabel={''}
                              controllerName="paid"
                              disabled={shouldDisableEdit}
                              onChange={(value: string) => setPrice && setPrice(value)}
                              className="payment-input"
                            />
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item md={6} sm={6} xs={12}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h5">{BALANCE} :</Typography>

                          <Box ml={1} width={150}>
                            <InputController
                              fieldType="number"
                              controllerLabel={''}
                              controllerName="balance"
                              disabled={shouldDisableEdit}
                              className="payment-input"
                            />
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>}

              {!shouldDisableEdit && <Box mt={3} display="flex" justifyContent="flex-end" alignItems="center">
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={async () => {
                    await handleSubmit(onSubmit)()
                    await trigger() && Alert.success(UPFRONT_PAYMENT_SUCCESS)
                  }}
                  disabled={createUpFrontPaymentLoading}
                >
                  {PAY}
                </Button>
              </Box>}
            </Box>
          </Card>
        </form>
      </FormProvider>

    </>
  )
})

export default UpFrontPayment;
