// packages block
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleOutline, } from '@material-ui/icons';
import { GREY_NINE, GREY_SEVEN, GREY_THREE, WHITE } from "../../../../theme";
import { Box, colors, FormControl, Grid, InputLabel, Typography } from "@material-ui/core";
//components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import CodesTable from "../../../common/CodesTable";
import CopayModal from "../../../common/CopayModal";
import DatePicker from "../../../common/DatePicker";
import InputController from '../../../../controller';
import TableSelector from "../../../common/Selector/TableSelector";

// interface, utils
import history from "../../../../history";
import { formatValue, setRecord } from "../../../../utils";
import { createBillingSchema } from "../../../../validationSchemas";
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles";
import { AntSwitch } from "../../../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  BillingComponentProps, CodeTablesData, CodeTypeInterface, CreateBillingProps, ParamsType
} from "../../../../interfacesTypes";
import {
  Code, CodesInput, CodeType, OnsetDateType, OrderOfBenefitType, OtherDateType, PatientBillingStatus,
  PatientPaymentType, useCreateBillingMutation, useFetchBillingDetailsByAppointmentIdLazyQuery,
  useFetchPatientInsurancesLazyQuery
} from "../../../../generated/graphql";

//constants block
import {
  ADD_ANOTHER_PATIENT_PAYMENT, AMOUNT_DOLLAR, AUTO_ACCIDENT, BILLING_STATUS, CPT_CODES, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  EMPLOYMENT, EMPTY_OPTION, FORBIDDEN_EXCEPTION, HCFA_DESC, ICD_TEN_CODES, ITEM_MODULE, MAPPED_ONSET_DATE_TYPE,
  MAPPED_OTHER_DATE_TYPE, MAPPED_PATIENT_BILLING_STATUS, MAPPED_PATIENT_PAYMENT_TYPE, NO, ONSET_DATE, ONSET_DATE_TYPE,
  OTHER_ACCIDENT, OTHER_DATE, OTHER_DATE_TYPE, PAYMENT_TYPE, TABLE_SELECTOR_MODULES, VIEW_APPOINTMENTS_ROUTE, YES
} from "../../../../constants";

const PaymentsComponent: FC<BillingComponentProps> = ({ shouldDisableEdit, labOrderNumber }) => {
  const classesToggle = usePublicAppointmentStyles();
  const { id, appointmentId } = useParams<ParamsType>()
  const [employment, setEmployment] = useState(false);
  const [autoAccident, setAutoAccident] = useState(false);
  const [otherAccident, setOtherAccident] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [insuranceId, setInsuranceId] = useState<string>('')
  const [billingCodes, setBillingCodes] = useState<CodeTypeInterface>({})
  const [tableCodesData, setTableCodesData] = useState<CodeTablesData>({})

  const methods = useForm<CreateBillingProps>({
    mode: "all",
    resolver: yupResolver(createBillingSchema)
  });
  const { handleSubmit, setValue, control, watch } = methods;
  const { paymentType } = watch()
  const { id: paymentTypeId } = paymentType ?? {}
  const shouldShowInsuranceFields = paymentTypeId === PatientPaymentType.NoInsurance

  const [createBilling] = useCreateBillingMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      if (labOrderNumber) {
        history.push(`/patients/${id}/details/10`)
        return
      }
      history.push(`${VIEW_APPOINTMENTS_ROUTE}`)
    }
  });

  const [fetchBillingDetailsByAppointmentId] = useFetchBillingDetailsByAppointmentIdLazyQuery({
    onCompleted(data) {
      if (data) {
        const { fetchBillingDetailsByAppointmentId } = data ?? {}
        const { billing } = fetchBillingDetailsByAppointmentId ?? {}
        const { onsetDateType, otherDateType, patientBillingStatus, patientPaymentType,
          autoAccident, codes, employment, onsetDate, otherDate, otherAccident, amount } = billing ?? {}

        const transformedCodes = codes?.reduce<CodeTablesData>((acc, codeValues) => {
          const codeType = codeValues.codeType
          const codeData = {
            id: codeValues.id,
            code: codeValues.code ?? '',
            description: codeValues.description ?? '',
            price: codeValues.price ?? ''
          }

          if (acc[codeType]) {
            acc[codeType]?.push(codeData)
            return acc
          }

          acc[codeType] = [codeData]
          return acc
        }, {})

        setTableCodesData(transformedCodes ?? {})

        setOtherAccident(otherAccident ?? false)
        setAutoAccident(autoAccident ?? false)
        setEmployment(employment ?? false)
        setValue('billingStatus', setRecord(patientBillingStatus, patientBillingStatus))
        setValue('paymentType', setRecord(patientPaymentType, patientPaymentType))
        setValue('otherDateType', setRecord(otherDateType, otherDateType))
        setValue('onsetDateType', setRecord(onsetDateType, onsetDateType))
        setValue('otherDate', otherDate ?? '')
        setValue('onsetDate', onsetDate ?? '')
        setValue('amount', amount ?? '')
      }
    }
  })

  const fetchBillingDetails = useCallback(async () => {
    try {
      fetchBillingDetailsByAppointmentId({
        variables: {
          appointmentId: appointmentId ?? ''
        }
      })
    } catch (error) { }
  }, [appointmentId, fetchBillingDetailsByAppointmentId])

  useEffect(() => {
    shouldDisableEdit && fetchBillingDetails();
  }, [fetchBillingDetails, shouldDisableEdit]);

  const getCodeType = (codeName: TABLE_SELECTOR_MODULES) => {
    switch (codeName) {
      case TABLE_SELECTOR_MODULES.icdCodes:
        return CodeType.Icd_10Code
      case TABLE_SELECTOR_MODULES.hcpcsCode:
        return CodeType.HcpcsCode
      case TABLE_SELECTOR_MODULES.customCode:
        return CodeType.CustomCode
      case TABLE_SELECTOR_MODULES.cptCode:
        return CodeType.CptCode
      default:
        break;
    }
  }

  const onSubmit: SubmitHandler<CreateBillingProps> = (values) => {
    if (shouldDisableEdit) {
      history.push(VIEW_APPOINTMENTS_ROUTE)
    } else {
      const { amount, billingStatus, paymentType, onsetDate, onsetDateType, otherDate, otherDateType } = values
      const { id: onSetDateTypeId } = onsetDateType ?? {}
      const { id: otherDateTypeId } = otherDateType ?? {}
      const { id: billingStatusId } = billingStatus ?? {}
      const { id: paymentTypeId } = paymentType ?? {}

      const transformedBillingCodes = billingCodes && Object.keys(billingCodes).reduce<CodesInput[]>((acc, key) => {
        const billingCodeValues = billingCodes[key as keyof CodeTypeInterface] ?? []
        const transformedBillingCodeValues = billingCodeValues.map((billingCodeValue) => {
          const { id, ...billingCodeToCreate } = billingCodeValue ?? {}
          return billingCodeToCreate
        })
        acc.push(...transformedBillingCodeValues)
        return acc
      }, [])

      const createBillingInput = {
        ...(appointmentId && { appointmentId: appointmentId || '' }),
        autoAccident: autoAccident,
        employment: employment,
        otherAccident: otherAccident,
        onsetDate: onsetDate,
        otherDate: otherDate,
        ...(onSetDateTypeId && { onsetDateType: onSetDateTypeId as OnsetDateType }),
        ...(otherDateTypeId && { otherDateType: otherDateTypeId as OtherDateType }),
        amount: amount,
        patientBillingStatus: billingStatusId as PatientBillingStatus,
        patientPaymentType: paymentTypeId as PatientPaymentType,
        patientId: id ?? '',
        codes: transformedBillingCodes,
        ...(labOrderNumber && { labOrderNumber: labOrderNumber })
      }

      createBilling({
        variables: {
          createBillingInput
        }
      })
    }
  }

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
          if (!shouldDisableEdit) {
            const { copays, id } = policies?.find((policyInfo) => policyInfo.orderOfBenefit === OrderOfBenefitType.Primary) ?? {}
            const totalAmount = copays?.reduce((acc, copay) => {
              return acc += copay.amount ? +copay.amount : 0
            }, 0)
            setValue('amount', String(totalAmount ?? ''))
            setInsuranceId(id ?? "")
          }
        }
      }
    }
  });

  useEffect(() => {
    fetchPatientInsurances()
  }, [fetchPatientInsurances])

  const toggleHandleChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>, name: string) => {
    switch (name) {
      case 'employment':
        setEmployment(checked)
        break;
      case 'autoAccident':
        setAutoAccident(checked)
        break;
      case 'otherAccident':
        setOtherAccident(checked)
        break;
      default:
        break;
    }
  };

  const handleCodes = useCallback((type: TABLE_SELECTOR_MODULES, codes: Code[]) => {
    setBillingCodes(prevValue => ({
      ...prevValue,
      [type]: codes.map((codeValues) => {
        return {
          ...codeValues,
          codeType: getCodeType(type) as CodeType
        }
      })
    }))
  }, [])

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box paddingX={3} paddingY={2}>
            <Grid container spacing={1}>
              <Grid item md={12} sm={12} xs={12}>
                <Selector
                  disabled={shouldDisableEdit}
                  isRequired
                  name="billingStatus"
                  label={BILLING_STATUS}
                  value={EMPTY_OPTION}
                  options={MAPPED_PATIENT_BILLING_STATUS}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Grid container spacing={3} direction='row'>
                  <Grid item md={8} sm={12} xs={12}>
                    <Selector
                      disabled={shouldDisableEdit}
                      isRequired
                      name="paymentType"
                      label={PAYMENT_TYPE}
                      value={EMPTY_OPTION}
                      options={MAPPED_PATIENT_PAYMENT_TYPE}
                    />
                  </Grid>

                  {
                    !shouldShowInsuranceFields && (
                      <Grid item md={4} sm={12} xs={12}>
                        <InputController
                          disabled={shouldDisableEdit}
                          fieldType="text"
                          controllerName="amount"
                          controllerLabel={AMOUNT_DOLLAR}
                        />
                      </Grid>
                    )
                  }
                </Grid>
              </Grid>
            </Grid>

            {
              !shouldShowInsuranceFields && (
                <Grid container spacing={1}>
                  <Grid item md={12} sm={12} xs={12}>
                    {!shouldDisableEdit && <Box>
                      <Box pb={2}
                        onClick={() => setIsModalOpen(!isModalOpen)}
                        className="billing-box" display="flex" alignItems="center"
                      >
                        <AddCircleOutline color='inherit' />

                        <Typography>{ADD_ANOTHER_PATIENT_PAYMENT}</Typography>
                      </Box>
                    </Box>}
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <Box color={GREY_THREE} mb={4}>
                      <Typography variant="h5">{HCFA_DESC}</Typography>
                    </Box>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={3} direction='row'>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          disabled={shouldDisableEdit}
                          name="onsetDateType"
                          label={ONSET_DATE_TYPE}
                          value={EMPTY_OPTION}
                          options={MAPPED_ONSET_DATE_TYPE}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker
                          disabled={shouldDisableEdit}
                          name="onsetDate"
                          label={ONSET_DATE}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={3} direction='row'>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          disabled={shouldDisableEdit}
                          name="otherDateType"
                          label={OTHER_DATE_TYPE}
                          value={EMPTY_OPTION}
                          options={MAPPED_OTHER_DATE_TYPE}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker
                          disabled={shouldDisableEdit}
                          name="otherDate"
                          label={OTHER_DATE}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <Grid container spacing={3} direction='row'>
                      <Grid item md={4} sm={12} xs={12}>
                        <Controller
                          name='employment'
                          control={control}
                          render={() => (
                            <FormControl disabled={shouldDisableEdit} fullWidth margin="normal" className={classesToggle.toggleContainer}>
                              <InputLabel shrink>{EMPLOYMENT}</InputLabel>

                              <label className="toggle-main">
                                <Box color={employment ? WHITE : GREY_SEVEN}>{YES}</Box>
                                <AntSwitch checked={employment} onChange={(event) => { toggleHandleChange(event, 'employment') }} name='employment' />
                                <Box color={employment ? GREY_SEVEN : WHITE}>{NO}</Box>
                              </label>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item md={4} sm={12} xs={12}>
                        <Controller
                          name='autoAccident'
                          control={control}
                          render={() => (
                            <FormControl disabled={shouldDisableEdit} fullWidth margin="normal" className={classesToggle.toggleContainer}>
                              <InputLabel shrink>{AUTO_ACCIDENT}</InputLabel>

                              <label className="toggle-main">
                                <Box color={autoAccident ? WHITE : GREY_SEVEN}>{YES}</Box>
                                <AntSwitch checked={autoAccident} onChange={(event) => { toggleHandleChange(event, 'autoAccident') }} name='autoAccident' />
                                <Box color={autoAccident ? GREY_SEVEN : WHITE}>{NO}</Box>
                              </label>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item md={4} sm={12} xs={12}>
                        <Controller
                          name='otherAccident'
                          control={control}
                          render={() => (
                            <FormControl disabled={shouldDisableEdit} fullWidth margin="normal" className={classesToggle.toggleContainer}>
                              <InputLabel shrink>{OTHER_ACCIDENT}</InputLabel>

                              <label className="toggle-main">
                                <Box color={otherAccident ? WHITE : GREY_SEVEN}>{YES}</Box>
                                <AntSwitch checked={otherAccident} onChange={(event) => { toggleHandleChange(event, 'otherAccident') }} name='otherAccident' />
                                <Box color={otherAccident ? GREY_SEVEN : WHITE}>{NO}</Box>
                              </label>
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )
            }
          </Box>

          <Box bgcolor={GREY_NINE} p={3} mt={2}>
            <Grid container spacing={1}>
              <Grid item md={12} sm={12} xs={12}>
                <Box border={`1px solid ${colors.grey[300]}`} borderRadius={8}>
                  {
                    shouldDisableEdit ?
                      <CodesTable title={formatValue(CodeType.Icd_10Code)} tableData={tableCodesData.ICD_10_CODE} /> :
                      <TableSelector handleCodes={handleCodes} moduleName={ITEM_MODULE.icdCodes} title={ICD_TEN_CODES} />
                  }
                </Box>
              </Grid>

              <Box p={1} />

              <Grid item md={12} sm={12} xs={12}>
                <Box border={`1px solid ${colors.grey[300]}`} borderRadius={8}>
                  {
                    shouldDisableEdit ?
                      <CodesTable title={formatValue(CodeType.CptCode)} shouldShowPrice tableData={tableCodesData.CPT_CODE} /> :
                      <TableSelector handleCodes={handleCodes} moduleName={ITEM_MODULE.cptCode} title={CPT_CODES} shouldShowPrice />
                  }
                </Box>
              </Grid>
            </Grid>
          </Box>
        </form>

        <CopayModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} insuranceId={insuranceId} />
      </FormProvider>
    </>
  )
}

export default PaymentsComponent;

