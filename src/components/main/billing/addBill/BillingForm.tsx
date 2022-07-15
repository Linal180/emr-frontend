//packages block
import { ChangeEvent, FC, useState } from "react";
import { FormProvider } from "react-hook-form";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { AddCircleOutline, ChevronRight } from "@material-ui/icons";
import {
  Box, Button, Card, Checkbox, CircularProgress, colors, FormControlLabel, FormGroup, Grid, Tab, Typography
} from "@material-ui/core";
//components block
import Selector from "../../../common/Selector";
import CodesTable from "../../../common/CodesTable";
import CopayModal from "../../../common/CopayModal";
import CheckoutModal from "../../../common/CheckoutModal";
import DatePicker from "../../../common/DatePicker";
import InputController from "../../../../controller";
import TableSelector from "../../../common/Selector/TableSelector";
import DoctorSelector from "../../../common/Selector/DoctorSelector";
import InsuranceComponent from "../../patients/patientDetail/insurance";
import FacilitySelector from "../../../common/Selector/FacilitySelector";
//constants, utils, interfaces block
import { CodeType } from "../../../../generated/graphql";
import { BillingFormProps } from "../../../../interfacesTypes";
import { ActionType } from "../../../../reducers/billingReducer";
import { GREY_THREE, } from "../../../../theme";
import { formatValue, generateString, renderItem } from "../../../../utils";
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles";
import {
  ADD_ANOTHER, APPOINTMENT_FACILITY, AUTO_ACCIDENT, BILLING, BILLING_TABS, CHECKOUT, CLAIM_DATE, CLAIM_NO, CLAIM_STATUS,
  COPAY_AMOUNT, CPT_CODES, CREATE_CLAIM, EMPLOYMENT, HCFA_DESC, ICD_TEN_CODES, ITEM_MODULE, MAPPED_ONSET_DATE_TYPE,
  MAPPED_OTHER_DATE_TYPE, MAPPED_SERVICE_CODES, ONSET_DATE, ONSET_DATE_TYPE, OTHER_ACCIDENT, OTHER_DATE, UNCOVERED_AMT,
  OTHER_DATE_TYPE, PATIENT_PAYMENT_TYPE, POS, RESOURCE, SERVICE_DATE, SERVICING_PROVIDER, BILLING_PROVIDER, RENDERING_PROVIDER,
  BILLING_STATUS,
} from "../../../../constants";

const BillingForm: FC<BillingFormProps> = (
  { methods, onSubmit, createBillingLoading, submitButtonText, createClaimCallback, shouldDisableEdit, dispatch, state, }) => {
  const classesToggle = usePublicAppointmentStyles();
  const { handleSubmit } = methods
  const { isModalOpen, tableCodesData, insuranceId, isCheckoutModalOpen } = state

  const [selectedTab, setSelectedTab] = useState<string>('1')
  const handleChange = (_: ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue)
  }

  // const toggleHandleChange = ({ target: { checked } }: ChangeEvent<HTMLInputElement>, name: string) => {
  //   switch (name) {
  //     case 'employment':
  //       dispatch({ type: ActionType.SET_EMPLOYMENT, employment: checked })
  //       break;
  //     case 'autoAccident':
  //       dispatch({ type: ActionType.SET_AUTO_ACCIDENT, autoAccident: checked })
  //       break;
  //     case 'otherAccident':
  //       dispatch({ type: ActionType.SET_OTHER_ACCIDENT, otherAccident: checked })
  //       break;
  //     default:
  //       break;
  //   }
  // };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant="h4">{BILLING}</Typography>

            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => createClaimCallback()}
              >
                {CREATE_CLAIM}
              </Button>

              <Box p={1} />

              <Button
                variant="outlined"
                color="default"
                onClick={() => createClaimCallback(true)}
              >
                HCFA - 1500 Form
              </Button>

              <Box p={1} />

              {!shouldDisableEdit && <Button
                variant="contained" color="primary" disabled={createBillingLoading}
                onClick={() => dispatch({ type: ActionType.SET_IS_CHECKOUT_MODAL_OPEN, isCheckoutModalOpen: !isCheckoutModalOpen })}
              >
                {submitButtonText ?? CHECKOUT}
                {createBillingLoading && <CircularProgress size={20} color="inherit" />}
                <ChevronRight />
              </Button>}
            </Box>
          </Box>

          <Box className="billing-inputs" mt={2} p={3}>
            <Grid container spacing={3} direction="row">
              <Grid item md={3} sm={12} xs={12}>
                <Box className={classesToggle.billingCard}>
                  <Grid container spacing={3} direction="row">
                    <Box pl={1.8} mb={2.5} className="claim-box">
                      {renderItem(CLAIM_NO, generateString(4))}
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
                        label={CLAIM_DATE}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        addEmpty
                        name="patientPaymentType"
                        label={PATIENT_PAYMENT_TYPE}
                        options={[]}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box className={classesToggle.billingCard}>
                  <Grid container spacing={3} direction="row">
                    <Grid item md={12} sm={12} xs={12}>
                      <Grid container spacing={3} direction="row">
                        <Grid item md={8} sm={12} xs={12}>
                          <FacilitySelector
                            addEmpty
                            label={APPOINTMENT_FACILITY}
                            name="facility"
                            disabled
                          />
                        </Grid>

                        <Grid item md={4} sm={12} xs={12}>
                          <Selector
                            label={POS}
                            name="pos"
                            options={MAPPED_SERVICE_CODES}
                            addEmpty
                          />
                        </Grid>
                      </Grid>
                    </Grid>

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
                      <Selector
                        name="resource"
                        label={RESOURCE}
                        options={[]}
                        addEmpty
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Grid container spacing={3} direction="row">
                        <Grid item md={6} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="amount"
                            controllerLabel={COPAY_AMOUNT}
                          />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="uncoveredAmount"
                            controllerLabel={UNCOVERED_AMT}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Box pr={2} width="100%"
                      onClick={() => dispatch({ type: ActionType.SET_IS_MODAL_OPEN, isModalOpen: !isModalOpen })}
                      className="billing-box" display="flex" justifyContent="flex-end"
                    >
                      <AddCircleOutline color='inherit' />

                      <Typography>{ADD_ANOTHER}</Typography>
                    </Box>
                  </Grid>
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box className={classesToggle.billingCard}>
                  <Grid container spacing={3} direction="row">
                    <Grid item md={12} sm={12} xs={12}>
                      <DoctorSelector
                        label={BILLING_PROVIDER}
                        name="billingProvider"
                        addEmpty
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <DoctorSelector
                        label={RENDERING_PROVIDER}
                        name="renderingProvider"
                        addEmpty
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        name="claimStatus"
                        label={CLAIM_STATUS}
                        addEmpty
                        options={[]}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        name="billingStatus"
                        label={BILLING_STATUS}
                        addEmpty
                        options={[]}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box>
                  <Grid container spacing={3} direction="row">
                    <Box pl={1.8} color={GREY_THREE}>
                      <Typography variant="h5" color="inherit">{HCFA_DESC}</Typography>
                    </Box>

                    <Box pl={1.8} mb={2}>
                      <FormGroup row>
                        <FormControlLabel
                          control={<Checkbox checked name="checkedA" color="primary"
                          />
                          }
                          label={EMPLOYMENT}
                        />

                        <FormControlLabel
                          control={<Checkbox name="checkedB" color="primary"
                          />
                          }
                          label={AUTO_ACCIDENT}
                        />

                        <FormControlLabel
                          control={<Checkbox name="checkedC" color="primary"
                          />
                          }
                          label={OTHER_ACCIDENT}
                        />
                      </FormGroup>

                      {/* <Grid container spacing={3} direction="row">
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

                        <Grid item md={6} sm={12} xs={12}>
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

                        <Grid item md={6} sm={12} xs={12}>
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
                      </Grid> */}
                    </Box>

                    <Grid item md={12} sm={12} xs={12}>
                      <Grid container spacing={3} direction="row">
                        <Grid item md={6} sm={12} xs={12}>
                          <Selector
                            disabled={shouldDisableEdit}
                            addEmpty
                            name="onsetDateType"
                            label={ONSET_DATE_TYPE}
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

                        <Grid item md={6} sm={12} xs={12}>
                          <Selector
                            disabled={shouldDisableEdit}
                            addEmpty
                            name="otherDateType"
                            label={OTHER_DATE_TYPE}
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
                  </Grid>
                </Box>
              </Grid>
            </Grid>
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
                        <TableSelector moduleName={ITEM_MODULE.cptCode} title={CPT_CODES} shouldShowPrice />
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
                  <Card>
                    <InsuranceComponent shouldDisableEdit={shouldDisableEdit} />
                  </Card>
                </Box>
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </form>

      {
        isModalOpen &&
        <CopayModal
          isOpen={isModalOpen}
          setIsOpen={(isOpen: boolean) => dispatch({ type: ActionType.SET_IS_MODAL_OPEN, isModalOpen: isOpen })}
          insuranceId={insuranceId}
        />
      }

      {
        isCheckoutModalOpen &&
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          setIsOpen={(isOpen: boolean) => dispatch({ type: ActionType.SET_IS_CHECKOUT_MODAL_OPEN, isCheckoutModalOpen: isOpen })}
          handleSubmit={handleSubmit(onSubmit)}
        />
      }
    </FormProvider >
  )
}

export default BillingForm;
