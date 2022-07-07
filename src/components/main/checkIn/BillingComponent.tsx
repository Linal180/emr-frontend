// packages block
import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box, Button, Card, CircularProgress, colors, FormControl, Grid, InputLabel, Tab, Typography
} from "@material-ui/core";
import { GREY_SEVEN, WHITE } from "../../../theme";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { AddCircleOutline, ChevronRight } from '@material-ui/icons';
//components block
import Alert from "../../common/Alert";
import history from "../../../history";
import Selector from '../../common/Selector';
import CodesTable from "../../common/CodesTable";
import CopayModal from "../../common/CopayModal";
import DatePicker from "../../common/DatePicker";
import InputController from '../../../controller';
import TableSelector from "../../common/Selector/TableSelector";
//constants, interfaces, styles
import { formatValue, setRecord } from "../../../utils";
import { createBillingSchema } from "../../../validationSchemas";
import { usePublicAppointmentStyles } from "../../../styles/publicAppointmentStyles";
import { AntSwitch } from "../../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  BillingComponentProps, CodeTablesData, CodeTypeInterface, CreateBillingProps, ParamsType
} from "../../../interfacesTypes";
import {
  ADD_ANOTHER, APPOINTMENT_FACILITY, AUTO_ACCIDENT, BILLING, BILLING_TABS, CHECKOUT, CLAIM_DATE, CLAIM_NO, CLAIM_STATUS,
  COPAY_AMOUNT, CPT_CODES, EMAIL_OR_USERNAME_ALREADY_EXISTS, EMPLOYMENT, EMPTY_OPTION, FORBIDDEN_EXCEPTION,
  HCFA_DESC, ICD_TEN_CODES, ITEM_MODULE, NO, ONSET_DATE, ONSET_DATE_TYPE, OTHER_ACCIDENT, OTHER_DATE,
  POS, RENDERING, RESOURCE, SERVICE_DATE, SERVICING_PROVIDER, SUPERVISOR, SUPER_BILL, TABLE_SELECTOR_MODULES,
  VIEW_APPOINTMENTS_ROUTE, YES
} from "../../../constants";
import {
  Code, CodesInput, CodeType, OnsetDateType, OrderOfBenefitType, OtherDateType, PatientBillingStatus,
  PatientPaymentType, useCreateBillingMutation, useFetchBillingDetailsByAppointmentIdLazyQuery,
  useFetchPatientInsurancesLazyQuery
} from "../../../generated/graphql";
import InsuranceComponent from "../patients/patientDetail/insurance";

const BillingComponent: FC<BillingComponentProps> = ({ shouldDisableEdit, submitButtonText, labOrderNumber }) => {
  const classesToggle = usePublicAppointmentStyles();
  const { id, appointmentId } = useParams<ParamsType>()
  const [employment, setEmployment] = useState(false);

  const [autoAccident, setAutoAccident] = useState(false);
  const [otherAccident, setOtherAccident] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [insuranceId, setInsuranceId] = useState<string>('')
  const [billingCodes, setBillingCodes] = useState<CodeTypeInterface>({})
  const [tableCodesData, setTableCodesData] = useState<CodeTablesData>({})

  const [selectedTab, setSelectedTab] = useState<string>('1')
  const handleChange = (_: ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue)
  }

  const methods = useForm<CreateBillingProps>({
    mode: "all",
    resolver: yupResolver(createBillingSchema)
  });
  const { handleSubmit, setValue, control, watch } = methods;
  const { paymentType } = watch()
  const { id: paymentTypeId } = paymentType ?? {}
  const shouldShowInsuranceFields = paymentTypeId === PatientPaymentType.NoInsurance

  const [createBilling, { loading: createBillingLoading }] = useCreateBillingMutation({
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant="h4">{BILLING}</Typography>

            <Box display='flex' alignItems='center'>
              <Button variant="contained" color="secondary">{SUPER_BILL}</Button>

              <Box mx={3} minWidth={160} className="billing-selector">
                <Selector
                  label={''}
                  name="type"
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Box>

              {!shouldDisableEdit && <Button variant="contained" color="primary" type="submit" disabled={createBillingLoading}>
                {submitButtonText ?? CHECKOUT}
                {createBillingLoading && <CircularProgress size={20} color="inherit" />}
                <ChevronRight />
              </Button>}
            </Box>
          </Box>

          <Box mt={1.5} p={3}>
            <Grid container spacing={3}>
              <Grid item md={2} sm={12} xs={12}>
                <Box className="claim-box">
                  <InputController
                    fieldType="text"
                    controllerName="claim"
                    controllerLabel={CLAIM_NO}
                    placeholder="CL23825816"
                  />
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <DatePicker
                  name="serviceDate"
                  label={SERVICE_DATE}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <DatePicker
                  name="claimDate"
                  label={CLAIM_DATE}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
                  name="appointmentFacility"
                  label={APPOINTMENT_FACILITY}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="POS"
                  controllerLabel={POS}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="servicingProvider"
                  label={SERVICING_PROVIDER}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="resource"
                  label={RESOURCE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="copayAmount"
                  controllerLabel={COPAY_AMOUNT}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Box pt={3.7}
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="billing-box" display="flex" alignItems="center"
                >
                  <AddCircleOutline color='inherit' />

                  <Typography>{ADD_ANOTHER}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="billing"
                  label={BILLING}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="rendering"
                  label={RENDERING}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="supervisor"
                  label={SUPERVISOR}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="claimStatus"
                  label={CLAIM_STATUS}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>
            </Grid>

            <Typography variant="body2">{HCFA_DESC}</Typography>

            <Box p={2} />

            <Grid container spacing={3}>
              <Grid item md={2} sm={12} xs={12}>
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

              <Grid item md={2} sm={12} xs={12}>
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

              <Grid item md={2} sm={12} xs={12}>
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

            <Grid container spacing={3}>
              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="onSetDateType"
                  label={ONSET_DATE_TYPE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="onSetDate"
                  label={ONSET_DATE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="onSetDateType"
                  label={ONSET_DATE_TYPE}
                  value={EMPTY_OPTION}
                  options={[]}
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="otherDate"
                  controllerLabel={OTHER_DATE}
                />
              </Grid>
            </Grid>

            {/* {
                !shouldShowInsuranceFields && (
                  <>
                    <Grid item md={2} sm={12} xs={12}>
                      <InputController
                        disabled={shouldDisableEdit}
                        fieldType="text"
                        controllerName="amount"
                        controllerLabel={AMOUNT_DOLLAR}
                      />
                    </Grid>

                    <Grid item md={4} sm={12} xs={12}>
                      {!shouldDisableEdit && <Box>
                        <Box pb={3}
                          onClick={() => setIsModalOpen(!isModalOpen)}
                          className="billing-box" display="flex" alignItems="center"
                        >
                          <AddCircleOutline color='inherit' />

                          <Typography>{ADD_ANOTHER_PATIENT_PAYMENT}</Typography>
                        </Box>
                      </Box>}
                    </Grid>

                    <Typography variant="h5">{HCFA_DESC}</Typography>

                    <Box p={2} />

                    <Grid container spacing={3}>
                      <Grid item md={2} sm={12} xs={12}>
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

                      <Grid item md={2} sm={12} xs={12}>
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

                      <Grid item md={2} sm={12} xs={12}>
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

                    <Grid item md={3} sm={12} xs={12}>
                      <Selector
                        disabled={shouldDisableEdit}
                        name="onsetDateType"
                        label={ONSET_DATE_TYPE}
                        value={EMPTY_OPTION}
                        options={MAPPED_ONSET_DATE_TYPE}
                      />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <DatePicker
                        disabled={shouldDisableEdit}
                        name="onsetDate"
                        label={ONSET_DATE}
                      />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <Selector
                        disabled={shouldDisableEdit}
                        name="otherDateType"
                        label={OTHER_DATE_TYPE}
                        value={EMPTY_OPTION}
                        options={MAPPED_OTHER_DATE_TYPE}
                      />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <DatePicker
                        disabled={shouldDisableEdit}
                        name="otherDate"
                        label={OTHER_DATE}
                      />
                    </Grid>
                  </>
                )
              } */}
          </Box>
        </Card>

        <Box p={2} />

        <Box>
          <TabContext value={selectedTab}>
            <Box width='100%' display='flex' alignItems='center' justifyContent='space-between' flexWrap='wrap'>
              <TabList onChange={handleChange} aria-label="billing tabs">
                {BILLING_TABS.map(item => (
                  <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
                ))}
              </TabList>
            </Box>

            <Box mt={2} className="billing-tabs">
              <TabPanel value="1">
                <Grid container direction="row" spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Card>
                      {
                        shouldDisableEdit ?
                          <CodesTable title={formatValue(CodeType.Icd_10Code)} tableData={tableCodesData.ICD_10_CODE} /> :
                          <TableSelector handleCodes={handleCodes} moduleName={ITEM_MODULE.icdCodes} title={ICD_TEN_CODES} />
                      }
                    </Card>

                    <Box p={2} />

                    <Card>
                      {/* {
                      shouldDisableEdit ?
                        <CodesTable title={formatValue(CodeType.HcpcsCode)} shouldShowPrice tableData={tableCodesData.HCPCS_CODE} /> :
                        <TableSelector handleCodes={handleCodes} moduleName={TABLE_SELECTOR_MODULES.hcpcsCode} title={HCPCS_CODES} shouldShowPrice />
                    } */}
                    </Card>
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <Card>
                      {
                        shouldDisableEdit ?
                          <CodesTable title={formatValue(CodeType.CptCode)} shouldShowPrice tableData={tableCodesData.CPT_CODE} /> :
                          <TableSelector handleCodes={handleCodes} moduleName={ITEM_MODULE.cptCode} title={CPT_CODES} shouldShowPrice />
                      }
                    </Card>

                    <Box p={2} />

                    <Card>
                      {/* {
                          shouldDisableEdit ?
                            <CodesTable title={formatValue(CodeType.CustomCode)} shouldShowPrice tableData={tableCodesData.CUSTOM_CODE} /> :
                            <TableSelector handleCodes={handleCodes} moduleName={TABLE_SELECTOR_MODULES.customCode} title={CUSTOM_CODES} shouldShowPrice />
                        } */}
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value="2">
                <Box>
                  <Card>
                    <InsuranceComponent shouldDisableEdit={shouldDisableEdit} />
                  </Card>
                </Box>
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </form>

      <CopayModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} insuranceId={insuranceId} />
    </FormProvider>
  )
}

export default BillingComponent
