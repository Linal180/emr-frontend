//packages block
import {
  Box, Button, Card, Checkbox, CircularProgress, colors, FormControlLabel, FormGroup, Grid, Tab, Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { FormProvider } from "react-hook-form";
import { ChangeEvent, FC, useRef } from "react";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { AddCircleOutline, ChevronRight } from "@material-ui/icons";
//components block
import Alert from "../../../common/Alert";
import SelfPayComponent from "./PaymentModal";
import UpFrontPayment from "../upfrontPayment";
import Selector from "../../../common/Selector";
import CodesTable from "../../../common/CodesTable";
import CopayModal from "../../../common/CopayModal";
import DatePicker from "../../../common/DatePicker";
import InputController from "../../../../controller";
import ItemSelector from "../../../common/ItemSelector";
import CheckoutModal from "../../../common/CheckoutModal";
import TableSelector from "../../../common/Selector/TableSelector";
import DoctorSelector from "../../../common/Selector/DoctorSelector";
import InsuranceComponent from "../../patients/patientDetail/insurance";
import FacilitySelector from "../../../common/Selector/FacilitySelector";
//constants, utils, interfaces block
import {
  ADD_ANOTHER_COPAY, APPOINTMENT_FACILITY, AUTO_ACCIDENT, BILLING, BILLING_TABS, CHECKOUT, CLAIM_STATUS,
  COPAY_AMOUNT, CPT_CODES, EMPLOYMENT, FEE_SCHEDULE, FROM, HCFA_1500_FORM, HCFA_DESC, ICD_TEN_CODES,
  INVOICE_DATE, INVOICE_NO, ITEM_MODULE, LAST_VISITED, MAPPED_ONSET_DATE_TYPE, MAPPED_PATIENT_PAYMENT_TYPE,
  MAPPED_SERVICE_CODES, ONSET_DATE, ONSET_DATE_TYPE, OTHER_ACCIDENT, PATIENT_PAYMENT_TYPE, POS, PRACTICE,
  RENDERING_PROVIDER, SAVE_TEXT, SELECT_ANOTHER_STATUS, SERVICE_DATE, SERVICING_PROVIDER, SUPER_BILL,
  SUPER_BILL_ROUTE, SystemBillingStatuses, TO, UNCOVERED_AMT
} from "../../../../constants";
import { GREY_THREE } from "../../../../theme";
import { ActionType } from "../../../../reducers/billingReducer";
import { formatValue, getClaimBtnText, renderItem } from "../../../../utils";
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles";
import { BillingStatus, CodeType, OnsetDateType, PatientPaymentType } from "../../../../generated/graphql";
import { BillingFormProps, FormForwardRef, ItemSelectorOption, ParamsType, SelectorOption } from "../../../../interfacesTypes";

const BillingForm: FC<BillingFormProps> = ({
  methods, onSubmit, createBillingLoading, submitButtonText, createClaimCallback, shouldDisableEdit, dispatch, state,
  createClaimLoading, refetch
}) => {
  const classesToggle = usePublicAppointmentStyles();
  const billingRef = useRef<FormForwardRef>();
  const { appointmentId } = useParams<ParamsType>()
  const { handleSubmit, trigger, watch, setValue } = methods
  const { onsetDateType, practice, feeSchedule, claimStatus, paymentType, cptFeeSchedule } = watch()
  const { id: onsetDateTypeId } = onsetDateType || {}
  const { statusName } = claimStatus || {}
  const {
    isModalOpen, tableCodesData, insuranceId, isCheckoutModalOpen, employment, autoAccident, otherAccident,
    claimNumber, practiceId, selectedTab, isClaimCreated, selfPayModal, billingStatus, insuranceStatus
  } = state


  const handleChange = (_: ChangeEvent<{}>, newValue: string) => {
    dispatch({ type: ActionType.SET_SELECTED_TAB, selectedTab: newValue })
  }

  const toggleHandleChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>, name: string) => {
    switch (name) {
      case 'employment':
        dispatch({ type: ActionType.SET_EMPLOYMENT, employment: checked })
        break;
      case 'autoAccident':
        dispatch({ type: ActionType.SET_AUTO_ACCIDENT, autoAccident: checked })
        break;
      case 'otherAccident':
        dispatch({ type: ActionType.SET_OTHER_ACCIDENT, otherAccident: checked })
        break;
      default:
        break;
    }
  };

  const handleCheckout = async (shouldCheckout: boolean) => {
    const isValid = await trigger()
    dispatch({ type: ActionType.SET_SHOULD_CHECKOUT, shouldCheckout: shouldCheckout })
    if (isValid) {
      if (shouldCheckout) {
        if (insuranceStatus === PatientPaymentType.Insurance) {
          dispatch({ type: ActionType.SET_IS_CHECKOUT_MODAL_OPEN, isCheckoutModalOpen: !isCheckoutModalOpen })
        }
        else {
          if (insuranceStatus === PatientPaymentType.NoInsurance) {
            if (billingStatus !== BillingStatus.Paid) {
              selfModalHandler(true)
            }
          }
        }
      } else {
        handleSubmit(onSubmit)()
      }
    }
  }

  const handleOnSetDateChange = (data: SelectorOption) => {
    const { id: onSetId } = data
    if (onSetId === OnsetDateType.DateOfHospitalization) {
      setValue('onsetDate', undefined)
    } else {
      setValue('to', undefined)
      setValue('from', undefined)
    }
  }

  const onClaimStatusHandler = (data: ItemSelectorOption) => {
    if (isClaimCreated) {
      const { statusName } = data || {}
      if (statusName) {
        Alert.error(SELECT_ANOTHER_STATUS)
      }
    }
  }

  const insuranceStatusHandler = (data: SelectorOption) => {
    const { id } = data || {}
    id ? dispatch({ type: ActionType.SET_INSURANCE_STATUS, insuranceStatus: id }) : dispatch({ type: ActionType.SET_INSURANCE_STATUS, insuranceStatus: '' })
  }

  const selfModalHandler = (selfPayModal: boolean) => dispatch({ type: ActionType.SET_SELF_PAY_MODAL, selfPayModal })

  const isInsurancePayment = paymentType?.id === PatientPaymentType.Insurance

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Box p={2} display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant="h4">{BILLING}</Typography>

            {!shouldDisableEdit && <Box display="flex" alignItems="center" flexWrap="wrap">
              <Box m={0.5}>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  target="_blank"
                  to={`${SUPER_BILL_ROUTE}/${appointmentId}`}
                >
                  {SUPER_BILL}
                </Button>
              </Box>

              {isInsurancePayment && <>
                <Box m={0.5}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => createClaimCallback()}
                    disabled={!!createClaimLoading || (statusName === SystemBillingStatuses.ACKNOWLEDGED)}
                  >
                    {createClaimLoading && <CircularProgress size={20} color="inherit" />}
                    {getClaimBtnText(statusName || '')}
                  </Button>
                </Box>

                <Box m={0.5}>
                  <Button
                    variant="outlined"
                    color="default"
                    onClick={() => createClaimCallback(true)}
                  >
                    {HCFA_1500_FORM}
                  </Button>
                </Box>
              </>}


              <Box m={0.5}>
                <Button
                  variant="outlined"
                  color="default"
                  onClick={async () => {
                    await handleCheckout(false)
                    billingRef.current?.submit()
                  }}
                >
                  {SAVE_TEXT}
                </Button>
              </Box>

              <Box m={0.5}>
                <Button
                  variant="contained" color="primary" disabled={createBillingLoading}
                  onClick={async () => {
                    await handleCheckout(true)
                    billingRef.current?.submit()
                  }}
                  endIcon={<Box width={20}><ChevronRight /></Box>}
                >
                  {submitButtonText ?? CHECKOUT}
                  {createBillingLoading && <CircularProgress size={20} color="inherit" />}
                </Button>
              </Box>
            </Box>}
          </Box>

          <Box className="billing-inputs" mt={2} px={2} py={3}>
            <Grid container spacing={3} direction="row">
              <Grid item lg={3} md={6} sm={12} xs={12}>
                <Box className={classesToggle.billingCard}>
                  <Grid container spacing={3} direction="row">
                    <Box pl={1.8} mb={2.5} className="claim-box">
                      {renderItem(INVOICE_NO, claimNumber)}
                    </Box>

                    <Grid item md={12} sm={12} xs={12}>
                      <DatePicker
                        name="serviceDate"
                        label={SERVICE_DATE}
                        disabled
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <DatePicker
                        name="claimDate"
                        label={INVOICE_DATE}
                        disabled={shouldDisableEdit}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        addEmpty
                        name="paymentType"
                        onSelect={insuranceStatusHandler}
                        label={PATIENT_PAYMENT_TYPE}
                        options={MAPPED_PATIENT_PAYMENT_TYPE}
                        disabled={shouldDisableEdit}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item lg={3} md={6} sm={12} xs={12}>
                <Box className={classesToggle.billingCard}>
                  <Grid container spacing={3} direction="row">

                    <Box pl={1.8} mb={2.5} className="claim-box">
                      {renderItem(PRACTICE, practice)}
                    </Box>

                    <Grid item md={12} sm={12} xs={12}>
                      <FacilitySelector
                        disabled
                        addEmpty
                        key='facility'
                        name="facility"
                        label={APPOINTMENT_FACILITY}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        addEmpty
                        key='pos'
                        name="pos"
                        label={POS}
                        options={MAPPED_SERVICE_CODES}
                        disabled={shouldDisableEdit}
                      />
                    </Grid>
                    {isInsurancePayment &&
                      <>
                        < Grid item md={12} sm={12} xs={12}>
                          <Grid container spacing={3} direction="row">
                            <Grid item lg={6} md={12} sm={12} xs={12}>
                              <InputController
                                key='amount'
                                fieldType="number"
                                controllerName="amount"
                                controllerLabel={COPAY_AMOUNT}
                                disabled={shouldDisableEdit}
                              />
                            </Grid>

                            <Grid item lg={6} md={12} sm={12} xs={12}>
                              <InputController
                                fieldType="number"
                                key='uncoveredAmount'
                                controllerName="uncoveredAmount"
                                controllerLabel={UNCOVERED_AMT}
                                disabled={shouldDisableEdit}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        {
                          !shouldDisableEdit && <Box pr={2} width="100%"
                            onClick={() => dispatch({ type: ActionType.SET_IS_MODAL_OPEN, isModalOpen: !isModalOpen })}
                            className="billing-box" display="flex" justifyContent="flex-end"
                          >
                            <AddCircleOutline color='inherit' />
                            <Typography>{ADD_ANOTHER_COPAY}</Typography>
                          </Box>
                        }

                        {/* <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        name="resource"
                        label={RESOURCE}
                        options={[]}
                        addEmpty
                      />
                    </Grid> */}
                      </>
                    }
                  </Grid>
                </Box>
              </Grid>

              <Grid item lg={3} md={6} sm={12} xs={12}>
                <Box className={classesToggle.billingCard}>
                  <Grid container spacing={3} direction="row">
                    <Grid item md={12} sm={12} xs={12}>
                      <DoctorSelector
                        label={RENDERING_PROVIDER}
                        name="renderingProvider"
                        addEmpty
                        shouldOmitFacilityId
                        disabled
                      />
                    </Grid>

                    {isInsurancePayment && <Grid item md={12} sm={12} xs={12}>
                      <ItemSelector
                        isEdit
                        label={CLAIM_STATUS}
                        name="claimStatus"
                        onSelect={onClaimStatusHandler}
                        modalName={ITEM_MODULE.claimStatus}
                        disabled={shouldDisableEdit}
                      />
                    </Grid>}

                    <Grid item md={12} sm={12} xs={12}>
                      <DoctorSelector
                        label={SERVICING_PROVIDER}
                        name="servicingProvider"
                        shouldOmitFacilityId
                        addEmpty
                        disabled
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <ItemSelector
                        isEdit
                        label={FEE_SCHEDULE}
                        name="feeSchedule"
                        modalName={ITEM_MODULE.feeSchedule}
                        disabled={shouldDisableEdit}
                        practiceId={practiceId}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item lg={3} md={6} sm={12} xs={12}>
                <Box>
                  <Grid container spacing={3} direction="row">
                    <Box pl={1.8} color={GREY_THREE}>
                      <Typography variant="h5" color="inherit">{HCFA_DESC}</Typography>
                    </Box>

                    <Box pl={1.8} mb={2}>
                      <FormGroup row>
                        <FormControlLabel
                          control={<Checkbox checked={employment} name="checkedA" color="primary" onChange={(event) => { toggleHandleChange(event, 'employment') }} disabled={shouldDisableEdit} />}
                          label={EMPLOYMENT}
                        />

                        <FormControlLabel
                          control={<Checkbox checked={autoAccident} name="checkedB" color="primary" onChange={(event) => { toggleHandleChange(event, 'autoAccident') }} disabled={shouldDisableEdit} />}
                          label={AUTO_ACCIDENT}
                        />

                        <FormControlLabel
                          control={<Checkbox checked={otherAccident} name="checkedC" color="primary" onChange={(event) => { toggleHandleChange(event, 'otherAccident') }} disabled={shouldDisableEdit} />}
                          label={OTHER_ACCIDENT}
                        />
                      </FormGroup>
                    </Box>

                    <Grid item md={12} sm={12} xs={12}>
                      <Grid container spacing={3} direction="row">
                        <Grid item md={12} sm={12} xs={12}>
                          <Selector
                            disabled={shouldDisableEdit}
                            addEmpty
                            name="onsetDateType"
                            label={ONSET_DATE_TYPE}
                            options={MAPPED_ONSET_DATE_TYPE}
                            onSelect={(data: SelectorOption) => handleOnSetDateChange(data)}
                          />
                        </Grid>

                        {onsetDateTypeId === OnsetDateType.DateOfHospitalization ?
                          <Grid item container spacing={3} direction="row">
                            <Grid item md={6} sm={12} xs={12}>
                              <DatePicker
                                disabled={shouldDisableEdit}
                                name="from"
                                disableFuture
                                label={FROM}
                              />
                            </Grid>

                            <Grid item md={6} sm={12} xs={12}>
                              <DatePicker
                                disabled={shouldDisableEdit}
                                name="to"
                                label={TO}
                              />
                            </Grid>
                          </Grid> : <Grid item md={12} sm={12} xs={12}>
                            <DatePicker
                              disabled={shouldDisableEdit}
                              name="onsetDate"
                              disableFuture
                              label={ONSET_DATE}
                            />
                          </Grid>
                        }

                        {/* <Grid item md={6} sm={12} xs={12}>
                          <Selector
                            disabled={shouldDisableEdit}
                            addEmpty
                            name="otherDateType"
                            label={OTHER_DATE_TYPE}
                            options={MAPPED_OTHER_DATE_TYPE}
                          />
                        </Grid> */}

                        <Grid item md={12} sm={12} xs={12}>
                          <DatePicker
                            disabled
                            name="otherDate"
                            label={LAST_VISITED}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card >

        <Box p={1} />

        <Box>
          <TabContext value={selectedTab}>
            <Box width='100%' display='flex' alignItems='center' justifyContent='space-between' flexWrap='wrap'>
              <TabList onChange={handleChange} aria-label="billing tabs">
                {BILLING_TABS.map(item => {
                  return (
                    <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
                  )
                })}
              </TabList>
            </Box>

            <Box mt={2} className="billing-tabs">
              <TabPanel value="1">
                <Grid container spacing={3}>
                  <Grid item md={12} sm={12} xs={12}>
                    {
                      shouldDisableEdit ?
                        <CodesTable title={formatValue(CodeType.Icd_10Code)} tableData={tableCodesData.ICD_10_CODE} /> :
                        <TableSelector moduleName={ITEM_MODULE.icdCodes} title={ICD_TEN_CODES} />
                    }
                    <Box p={1} />
                    {/* {
                      shouldDisableEdit ?
                        <CodesTable title={formatValue(CodeType.HcpcsCode)} shouldShowPrice tableData={tableCodesData.HCPCS_CODE} /> :
                        <TableSelector moduleName={TABLE_SELECTOR_MODULES.hcpcsCode} title={HCPCS_CODES} shouldShowPrice />
                    } */}
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    {
                      shouldDisableEdit ?
                        <CodesTable title={formatValue(CodeType.CptCode)} shouldShowPrice tableData={tableCodesData.CPT_CODE} /> :
                        <TableSelector moduleName={ITEM_MODULE.cptFeeSchedule} title={CPT_CODES} shouldShowPrice feeScheduleId={feeSchedule?.id} />
                    }
                    <Box p={1} />
                    {/* {
                    shouldDisableEdit ?
                      <CodesTable title={formatValue(CodeType.CustomCode)} shouldShowPrice tableData={tableCodesData.CUSTOM_CODE} /> :
                      <TableSelector moduleName={TABLE_SELECTOR_MODULES.customCode} title={CUSTOM_CODES} shouldShowPrice />
                  } */}
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value="2">
                <Box>
                  {/* <Card> */}
                  <InsuranceComponent shouldDisableEdit={shouldDisableEdit} refetch={refetch} />
                  {/* </Card> */}
                </Box>
              </TabPanel>
            </Box>
          </TabContext>
        </Box>

        <Box p={1} />

        <UpFrontPayment
          cptCodes={cptFeeSchedule ?? []}
          ref={billingRef}
          setPrice={(price) => dispatch({ type: ActionType.SET_TOTAL_PRICE, totalPrice: price || '' })}
          shouldDisableEdit={shouldDisableEdit}
        />
      </form>

      {isModalOpen &&
        <CopayModal
          isOpen={isModalOpen}
          setIsOpen={(isOpen: boolean) => dispatch({ type: ActionType.SET_IS_MODAL_OPEN, isModalOpen: isOpen })}
          insuranceId={insuranceId}
        />
      }

      {isCheckoutModalOpen &&
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          setIsOpen={(isOpen: boolean) => dispatch({ type: ActionType.SET_IS_CHECKOUT_MODAL_OPEN, isCheckoutModalOpen: isOpen })}
          handleSubmit={handleSubmit(onSubmit)}
        />
      }

      {selfPayModal &&
        <SelfPayComponent state={state} onCloseHandler={(open) => selfModalHandler(open)} isOpen={selfPayModal} checkOutHandler={handleSubmit(onSubmit)} />
      }
    </FormProvider >
  )
}

export default BillingForm;
