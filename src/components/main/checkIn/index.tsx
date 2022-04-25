// packages block
import { useState, ChangeEvent } from "react";
import { AddCircleOutline, Check, ChevronRight, } from '@material-ui/icons';
import { FormProvider, SubmitHandler, useForm, Controller } from 'react-hook-form';
import {
  Box, Button, Card, colors, Grid, Step, Stepper, Typography, StepLabel, StepIconProps, Table, TableBody, TableHead, TableRow,
  TableCell, IconButton, FormControl, InputLabel, Collapse,
} from "@material-ui/core";
// component block
import Search from "../../common/Search";
import Selector from '../../common/Selector';
import InputController from '../../../controller';
import PageHeader from "../../common/PageHeader";
import PatientChartCards from "../patients/patientChart/patientChartCards";
import VitalsChartingTable from "../patients/patientChart/patientChartCards/vitalsCard/vitalChartComponent";
// constants, history, styling block
import clsx from 'clsx';
import { renderTh } from "../../../utils";
import { ClearIcon, UserIcon } from "../../../assets/svgs";
import { GREY_SEVEN, WHITE } from "../../../theme";
import { useTableStyles } from "../../../styles/tableStyles";
import PROFILE_IMAGE from "../../../assets/images/profile-image.svg";
import { usePublicAppointmentStyles } from "../../../styles/publicAppointmentStyles";
import { AntSwitch } from "../../../styles/publicAppointmentStyles/externalPatientStyles";
import { CheckInConnector, useCheckInStepIconStyles } from '../../../styles/checkInStyles';
import {
  ACTIONS, AMOUNT_DOLLAR, APPOINTMENT_INFO, APPOINTMENT_INFO_DATA, AUTO_ACCIDENT, BILLING, BILLING_STATUS, CHART_TEXT, CHECKOUT,
  CHECK_IN_STEPS, CODE, CPT_CODES, CUSTOM_CODES, DESCRIPTION, EMPLOYMENT, EMPTY_OPTION, GO_TO_PROFILE, HCFA_DESC, HCPCS_CODES, PRICE,
  ICD_TEN_CODES, ICD_TEN_CODES_DATA, INSURANCE, ONSET_DATE, ONSET_DATE_TYPE, OTHER_ACCIDENT, OTHER_DATE, OTHER_DATE_TYPE, PATIENT_INFO,
  PATIENT_PAYMENT_TYPE, PRIMARY_PROVIDER, RECORD_VITALS, SAVE_TEXT, TO_BILLING, TO_CHART, VITALS_TEXT, ADD_ANOTHER_PATIENT_PAYMENT, YES, NO
} from "../../../constants";

const CheckInStepIcon = (props: StepIconProps) => {
  const classes = useCheckInStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

const CheckInComponent = (): JSX.Element => {
  const classes = useTableStyles();
  const classesToggle = usePublicAppointmentStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const search = (query: string) => { }

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const methods = useForm<any>({ mode: "all" });
  const { handleSubmit, setValue, control } = methods;
  const onSubmit: SubmitHandler<any> = () => { }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CheckIn />
      case 1:
        return <PatientInfo />
      case 2:
        return <Insurance />
      case 3:
        return <Vitals />
      case 4:
        return <Chart />
      case 5:
        return <Billing />
      default:
        return 'Unknown step';
    }
  }

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    setIsChecked(checked);
    setValue('employment', checked)
  };

  // 0- CHECK-IN
  const CheckIn = () =>
    <>
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{APPOINTMENT_INFO}</Typography>

          <Button variant="contained" color="primary">
            {RECORD_VITALS}
            <ChevronRight />
          </Button>
        </Box>

        <Box p={2}>
          <Grid container spacing={0}>
            {APPOINTMENT_INFO_DATA.map((item) => (
              <Grid item md={4} sm={12} xs={12}>
                <Box my={2}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Box p={0.2} />
                  <Typography variant="body1">{item.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>
    </>

  // 1- PATIENT-INFO
  const PatientInfo = () =>
    <>
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{PATIENT_INFO}</Typography>

          <Button variant="contained" color="primary">
            {SAVE_TEXT}
            <ChevronRight />
          </Button>
        </Box>

        <Box p={2}></Box>
      </Card>
    </>

  // 2- INSURANCE
  const Insurance = () =>
    <>
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{INSURANCE}</Typography>

          <Button variant="contained" color="primary">
            {RECORD_VITALS}
            <ChevronRight />
          </Button>
        </Box>

        <Box p={2}></Box>
      </Card>
    </>

  // 3- VITALS
  const Vitals = () =>
    <>
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{VITALS_TEXT}</Typography>

          <Button variant="contained" color="primary">
            {TO_CHART}
            <ChevronRight />
          </Button>
        </Box>

        <VitalsChartingTable isCalendar={false} />
      </Card>
    </>

  // 4- CHART
  const Chart = () =>
    <>
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{CHART_TEXT}</Typography>

          <Button variant="contained" color="primary">
            {TO_BILLING}
            <ChevronRight />
          </Button>
        </Box>

        <PatientChartCards />
      </Card>
    </>

  // 5- BILLING
  const Billing = () =>
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
              <Typography variant="h4">{BILLING}</Typography>

              <Button variant="contained" color="primary">
                {CHECKOUT}
                <ChevronRight />
              </Button>
            </Box>

            <Box mt={1.5} p={3}>
              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="billingStatus"
                    label={BILLING_STATUS}
                    value={EMPTY_OPTION}
                    options={[]}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="paymentType"
                    label={PATIENT_PAYMENT_TYPE}
                    value={EMPTY_OPTION}
                    options={[]}
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="amount"
                    controllerLabel={AMOUNT_DOLLAR}
                  />
                </Grid>

                <Grid item md={4} sm={12} xs={12}>
                  <Box>
                    <Collapse in={!open} mountOnEnter unmountOnExit>
                      <Box pb={3}
                        onClick={() => setOpen(!open)}
                        className="billing-box" display="flex" alignItems="center"
                      >
                        <AddCircleOutline color='inherit' />

                        <Typography>{ADD_ANOTHER_PATIENT_PAYMENT}</Typography>
                      </Box>
                    </Collapse>

                    <Collapse in={open} mountOnEnter unmountOnExit>
                      <Box>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <Selector
                              name="paymentType"
                              label={PATIENT_PAYMENT_TYPE}
                              value={EMPTY_OPTION}
                              options={[]}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="amount"
                              controllerLabel={AMOUNT_DOLLAR}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Box>
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="onsetDateType"
                    label={ONSET_DATE_TYPE}
                    value={EMPTY_OPTION}
                    options={[]}
                  />
                </Grid>

                <Grid item md={2} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="onsetDate"
                    controllerLabel={ONSET_DATE}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="otherDateType"
                    label={OTHER_DATE_TYPE}
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

              <Typography variant="h5">{HCFA_DESC}</Typography>

              <Box p={2} />

              <Grid container spacing={3}>
                <Grid item md={2} sm={12} xs={12}>
                  <Controller
                    name='employment'
                    control={control}
                    render={() => (
                      <FormControl fullWidth margin="normal" className={classesToggle.toggleContainer}>
                        <InputLabel shrink>{EMPLOYMENT}</InputLabel>

                        <label className="toggle-main">
                          <Box color={isChecked ? WHITE : GREY_SEVEN}>{YES}</Box>
                          <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='employment' />
                          <Box color={isChecked ? GREY_SEVEN : WHITE}>{NO}</Box>
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
                      <FormControl fullWidth margin="normal" className={classesToggle.toggleContainer}>
                        <InputLabel shrink>{AUTO_ACCIDENT}</InputLabel>

                        <label className="toggle-main">
                          <Box color={isChecked ? WHITE : GREY_SEVEN}>{YES}</Box>
                          <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='autoAccident' />
                          <Box color={isChecked ? GREY_SEVEN : WHITE}>{NO}</Box>
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
                      <FormControl fullWidth margin="normal" className={classesToggle.toggleContainer}>
                        <InputLabel shrink>{OTHER_ACCIDENT}</InputLabel>

                        <label className="toggle-main">
                          <Box color={isChecked ? WHITE : GREY_SEVEN}>{YES}</Box>
                          <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='otherAccident' />
                          <Box color={isChecked ? GREY_SEVEN : WHITE}>{NO}</Box>
                        </label>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>

          <Box p={2} />

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Card>
                <Box p={2} className={classes.mainTableContainer}>
                  <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{ICD_TEN_CODES}</Typography>

                    <Search search={search} />
                  </Box>

                  <Box className="table-overflow">
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          {renderTh(CODE)}
                          {renderTh(DESCRIPTION)}
                          {renderTh(ACTIONS)}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {ICD_TEN_CODES_DATA.map(({
                          code, description
                        }) =>
                          <TableRow>
                            <TableCell scope="row">{code}</TableCell>
                            <TableCell scope="row">{description}</TableCell>
                            <TableCell scope="row">
                              <IconButton>
                                <ClearIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </Card>

              <Box p={2} />

              <Card>
                <Box p={2} className={classes.mainTableContainer}>
                  <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{HCPCS_CODES}</Typography>

                    <Search search={search} />
                  </Box>

                  <Box className="table-overflow">
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          {renderTh(CODE)}
                          {renderTh(DESCRIPTION)}
                          {renderTh(PRICE)}
                          {renderTh(ACTIONS)}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {ICD_TEN_CODES_DATA.map(({
                          code, description
                        }) =>
                          <TableRow>
                            <TableCell scope="row">{code}</TableCell>
                            <TableCell scope="row">{description}</TableCell>
                            <TableCell scope="row"></TableCell>
                            <TableCell scope="row">
                              <IconButton>
                                <ClearIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Card>
                <Box p={2} className={classes.mainTableContainer}>
                  <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{CPT_CODES}</Typography>

                    <Search search={Search} />
                  </Box>

                  <Box className="table-overflow">
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          {renderTh(CODE)}
                          {renderTh(DESCRIPTION)}
                          {renderTh(PRICE)}
                          {renderTh(ACTIONS)}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {ICD_TEN_CODES_DATA.map(({
                          code, description
                        }) =>
                          <TableRow>
                            <TableCell scope="row">{code}</TableCell>
                            <TableCell scope="row">{description}</TableCell>
                            <TableCell scope="row"></TableCell>
                            <TableCell scope="row">
                              <IconButton>
                                <ClearIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </Card>

              <Box p={2} />

              <Card>
                <Box p={2} className={classes.mainTableContainer}>
                  <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{CUSTOM_CODES}</Typography>

                    <Search search={search} />
                  </Box>

                  <Box className="table-overflow">
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          {renderTh(CODE)}
                          {renderTh(DESCRIPTION)}
                          {renderTh(PRICE)}
                          {renderTh(ACTIONS)}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {ICD_TEN_CODES_DATA.map(({
                          code, description
                        }) =>
                          <TableRow>
                            <TableCell scope="row">{code}</TableCell>
                            <TableCell scope="row">{description}</TableCell>
                            <TableCell scope="row"></TableCell>
                            <TableCell scope="row">
                              <IconButton>
                                <ClearIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </>

  return (
    <>
      <PageHeader title="Appointment on 20/4/2022 at 3:45 PM" />

      <Card>
        <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <img src={PROFILE_IMAGE} alt="" />

            <Box ml={2}>
              <Box display="flex" alignItems="center">
                <Typography variant="h4">Brad Dennis</Typography>

                <Box ml={1} color={GREY_SEVEN}>
                  <Typography variant="body1">(PT23453)</Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center">
                <UserIcon />

                <Box ml={1} color={GREY_SEVEN}>
                  <Typography variant="body1">24 Yrs Old </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box display="flex" alignItems="center">
            <Box mr={2}>
              <Typography variant="h6">{PRIMARY_PROVIDER}</Typography>

              <Box color={GREY_SEVEN} textAlign="right">
                <Typography variant="body1">John Doe</Typography>
              </Box>
            </Box>

            <Button variant="contained" color="secondary">{GO_TO_PROFILE}</Button>
          </Box>
        </Box>
      </Card>

      <Box p={2} />

      <Card>
        <Box px={3} pt={1} pb={1}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<CheckInConnector />}>
            {CHECK_IN_STEPS.map((label, index) => (
              <Step key={label}>
                <StepLabel onClick={handleStep(index)} StepIconComponent={CheckInStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Card>

      <Box p={2} />

      <Box>
        <Typography>{getStepContent(activeStep)}</Typography>
      </Box>
    </>
  )
};

export default CheckInComponent;
