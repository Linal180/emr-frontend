//packages block
import { ChangeEvent, FC, useState } from "react"
import { Box, Button, Card, CircularProgress, colors, FormControl, Grid, InputLabel, Tab, Typography } from "@material-ui/core"
import { AddCircleOutline, ChevronRight } from "@material-ui/icons"
import { Controller, FormProvider } from "react-hook-form"
//components block
import InputController from "../../../../controller"
import CodesTable from "../../../common/CodesTable"
import CopayModal from "../../../common/CopayModal"
import DatePicker from "../../../common/DatePicker"
import Selector from "../../../common/Selector"
import DoctorSelector from "../../../common/Selector/DoctorSelector"
import FacilitySelector from "../../../common/Selector/FacilitySelector"
import TableSelector from "../../../common/Selector/TableSelector"
//constants, utils, interfaces block
import {
  ADD_ANOTHER, APPOINTMENT_FACILITY, AUTO_ACCIDENT, BILLING, BILLING_TABS, CHECKOUT, CLAIM_DATE, CLAIM_NO, CLAIM_STATUS, COPAY_AMOUNT,
  CPT_CODES, EMPLOYMENT, HCFA_DESC, ICD_TEN_CODES, ITEM_MODULE, MAPPED_ONSET_DATE_TYPE, MAPPED_OTHER_DATE_TYPE,
  MAPPED_SERVICE_CODES, NO, ONSET_DATE, ONSET_DATE_TYPE, OTHER_ACCIDENT, OTHER_DATE, OTHER_DATE_TYPE, POS, RENDERING, SERVICE_DATE, SERVICING_PROVIDER, YES
} from "../../../../constants"
import { CodeType } from "../../../../generated/graphql"
import { BillingFormProps } from "../../../../interfacesTypes"
import { AntSwitch } from "../../../../styles/publicAppointmentStyles/externalPatientStyles"
import { GREY_SEVEN, WHITE } from "../../../../theme"
import { formatValue, generateString, renderItem } from "../../../../utils"
import { ActionType } from "../../../../reducers/billingReducer"
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import InsuranceComponent from "../../patients/patientDetail/insurance"


const BillingForm: FC<BillingFormProps> = (
  { methods, onSubmit, createBillingLoading, submitButtonText, createClaimCallback, shouldDisableEdit, dispatch, state, }) => {
  const classesToggle = usePublicAppointmentStyles();
  const { handleSubmit, control } = methods
  const { isModalOpen, employment, autoAccident, otherAccident, tableCodesData, insuranceId } = state

  const [selectedTab, setSelectedTab] = useState<string>('1')
  const handleChange = (_: ChangeEvent<{}>, newValue: string) => {
    setSelectedTab(newValue)
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant="h4">{BILLING}</Typography>

            <Box>
              {!shouldDisableEdit && <Button variant="contained" color="primary" type="submit" disabled={createBillingLoading}>
                {submitButtonText ?? CHECKOUT}
                {createBillingLoading && <CircularProgress size={20} color="inherit" />}
                <ChevronRight />
              </Button>}
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 20 }}
                onClick={() => createClaimCallback()}
              >
                Create Claim
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 20 }}
                onClick={() => createClaimCallback(true)}
              >
                HCFA - 1500 Form
              </Button>
            </Box>
          </Box>

          <Box mt={1.5} p={3}>
            <Grid container spacing={3}>
              <Grid item md={2} sm={12} xs={12}>
                <Box className="claim-box">
                  {renderItem(CLAIM_NO, generateString(4))}
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
                <FacilitySelector
                  addEmpty
                  label={APPOINTMENT_FACILITY}
                  name="facility"
                />
              </Grid>

              <Grid item md={2} sm={12} xs={12}>
                <Selector
                  label={POS}
                  name="pos"
                  options={MAPPED_SERVICE_CODES}
                  addEmpty
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={3} sm={12} xs={12}>
                <DoctorSelector
                  label={SERVICING_PROVIDER}
                  name="servicingProvider"
                  shouldOmitFacilityId
                  addEmpty
                />
              </Grid>

              {/* <Grid item md={3} sm={12} xs={12}>
            <Selector
              name="resource"
              label={RESOURCE}
              options={[]}
              addEmpty
            />
          </Grid> */}

              <Grid item md={3} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="amount"
                  controllerLabel={COPAY_AMOUNT}
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box pt={3.7}
                  onClick={() => dispatch({ type: ActionType.SET_IS_MODAL_OPEN, isModalOpen: !isModalOpen })}
                  className="billing-box" display="flex" alignItems="center"
                >
                  <AddCircleOutline color='inherit' />

                  <Typography>{ADD_ANOTHER}</Typography>
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {/* <Grid item md={3} sm={12} xs={12}>
            <Selector
              name="billing"
              label={BILLING}
              addEmpty
              options={[]}
            />
          </Grid> */}

              <Grid item md={3} sm={12} xs={12}>
                <DoctorSelector
                  label={RENDERING}
                  name="renderingProvider"
                  shouldOmitFacilityId
                  addEmpty
                />
              </Grid>

              {/* <Grid item md={3} sm={12} xs={12}>
            <Selector
              name="supervisor"
              label={SUPERVISOR}
              addEmpty
              options={[]}
            />
          </Grid> */}

              <Grid item md={3} sm={12} xs={12}>
                <Selector
                  name="claimStatus"
                  label={CLAIM_STATUS}
                  addEmpty
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
                  disabled={shouldDisableEdit}
                  addEmpty
                  name="onsetDateType"
                  label={ONSET_DATE_TYPE}
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
                  addEmpty
                  name="otherDateType"
                  label={OTHER_DATE_TYPE}
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
                  <Grid item md={6} sm={12} xs={12}>
                    {
                      shouldDisableEdit ?
                        <CodesTable title={formatValue(CodeType.Icd_10Code)} tableData={tableCodesData.ICD_10_CODE} /> :
                        <TableSelector moduleName={ITEM_MODULE.icdCodes} title={ICD_TEN_CODES} />
                    }
                    <Box p={2} />
                    {/* {
                      shouldDisableEdit ?
                        <CodesTable title={formatValue(CodeType.HcpcsCode)} shouldShowPrice tableData={tableCodesData.HCPCS_CODE} /> :
                        <TableSelector moduleName={TABLE_SELECTOR_MODULES.hcpcsCode} title={HCPCS_CODES} shouldShowPrice />
                    } */}
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    {
                      shouldDisableEdit ?
                        <CodesTable title={formatValue(CodeType.CptCode)} shouldShowPrice tableData={tableCodesData.CPT_CODE} /> :
                        <TableSelector moduleName={ITEM_MODULE.cptCode} title={CPT_CODES} shouldShowPrice />
                    }
                    <Box p={2} />
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
    </FormProvider >
  )
}

export default BillingForm