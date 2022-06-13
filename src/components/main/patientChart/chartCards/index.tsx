// packages block
import { FC, ChangeEvent, Reducer, useReducer, ReactElement, useState, } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import {
  Box, Button, Card, Grid, IconButton, Tab, Table, TableBody, TableCell, TableHead, TableRow, Typography, Dialog, DialogActions,
  DialogTitle, DialogContent, FormControl,
} from "@material-ui/core";
// components block
import Selector from '../../../common/Selector';
import DatePicker from '../../../common/DatePicker';
import InputController from '../../../../controller';
// interfaces, graphql, constants block /styles
import { renderTh } from '../../../../utils';
import { PatientInputProps } from '../../../../interfacesTypes';
import { useHeaderStyles } from '../../../../styles/headerStyles';
import { AntSwitch, useChartingStyles } from "../../../../styles/chartingStyles";
import { GRAY_THREE, GREEN, GREY_TWO, ORANGE_ONE, WHITE, } from '../../../../theme';
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import { AddWhiteIcon, EditOutlinedIcon, FormEditNewIcon, PrinterWhiteIcon, TrashOutlinedSmallIcon, } from '../../../../assets/svgs';
import {
  ADD_VITALS, EMPTY_OPTION, PATIENT_CHARTING_TABS, PROBLEMS_TEXT, VITALS_TEXT, SAVE_TEXT, SMOKING_STATUS_TEXT, ALLERGIES_TEXT, 
  PRINT_CHART, ADD_NEW_TEXT, VITALS_TABLE_DUMMY_DATA, DATE, FEVER, PULSE_TEXT, RESPIRATORY_RATE_TEXT, BPM_TEXT, RPM_TEXT, 
  BLOOD_PRESSURE_TEXT, MMHG_TEXT, OXYGEN_SATURATION_TEXT, HEIGHT_TEXT, WEIGHT_TEXT, BMI_TEXT, KG_PER_METER_SQUARE_TEXT, PAIN_TEXT, 
  HEAD_CIRCUMFERENCE, CANCEL_TEXT, ICD_CODE, ONSET_DATE, TYPE, NOTES, STATUS, ACTIONS, PROBLEM_TEXT, PROBLEMS_TABLE_DUMMY_DATA,
} from "../../../../constants";

const ChartCards: FC = (): JSX.Element => {
  const classes = useChartingStyles()
  const headerClasses = useHeaderStyles();
  const feverUnits = ['degF', 'degC'];
  const heightUnits = ['IN', 'CM'];
  const headUnits = ['IN', 'CM'];
  const weightUnits = ['LB', 'OZ', 'KG'];
  const [checked, setChecked] = useState<boolean>(false)

  const [open, setOpen] = useState<boolean>(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  const methods = useForm<PatientInputProps>({
    mode: "all",
  });
  const { control } = methods

  const [{ tabValue }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const renderIcon = () => {
    return (
      <IconButton onClick={() => setOpen(true)}>
        <FormEditNewIcon />
      </IconButton>
    )
  }

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked)
  };

  return (

    <>
      {/* <Grid container spacing={3}>
        <Grid item md={4} sm={12} xs={12}>
          <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} vitalsCard={isVitals} />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <AllergyList />
        </Grid> 

        <Grid item md={4} sm={12} xs={12}>
          <ProblemList />
        </Grid> 
      </Grid> */}

      <Box mt={3}>
        <TabContext value={tabValue} >
          <Grid container spacing={3}>
            <Grid item md={2} sm={4} xs={12}>
              <Card>
                <Box p={3} className={classes.cardBox} minHeight={450}>
                  <TabList className={classes.tabList} orientation='vertical' onChange={handleChange} aria-label="communication tabs">
                    {PATIENT_CHARTING_TABS.map(item => {
                      const { icon: Icon, title, value } = item

                      return <Tab className={classes.tab} key={`${title}-${value}`} label={title} value={value} icon={<Icon /> as unknown as ReactElement} />
                    })}
                  </TabList>
                </Box>
              </Card>
            </Grid>

            <Grid item md={10} sm={8} xs={12}>
              <TabPanel value="1" className='tab-panel'>
                <Grid container spacing={3}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <FormProvider {...methods}>
                          <form>
                            <Box px={2} pt={2} display="flex" justifyContent="space-between" alignItems="center">
                              <Box display="flex" alignItems="center">
                                <Box className={classes.tableHeaderDropdown}>
                                  <Selector
                                    name="units"
                                    label={''}
                                    value={EMPTY_OPTION}
                                  />
                                </Box>

                                <Box p={2} />

                                <Box className={classes.tableHeaderDropdown}>
                                  <Selector
                                    name="results"
                                    label={''}
                                    value={EMPTY_OPTION}
                                  />
                                </Box>
                              </Box>

                              <Box display="flex" alignItems="center">
                                <Button variant='contained' color='secondary'>
                                  <PrinterWhiteIcon />
                                  <Box p={0.5} />
                                  {PRINT_CHART}
                                </Button>

                                <Box p={1} />

                                <Button onClick={() => setOpen(true)} variant='contained' color='primary'>
                                  <AddWhiteIcon />
                                  <Box p={0.5} />
                                  {ADD_NEW_TEXT}
                                </Button>
                              </Box>
                            </Box>
                          </form>
                        </FormProvider>

                        <Box className={classes.tableBox}>
                          <Table aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                {renderTh(VITALS_TEXT)}
                                {renderTh('Wed, 22/4/2022')}
                                {renderTh('Wed, 22/4/2022', undefined, undefined, undefined, undefined, renderIcon)}
                                {renderTh('Wed, 22/4/2022')}
                                {renderTh('Wed, 22/4/2022', undefined, undefined, undefined, undefined, renderIcon)}
                                {renderTh('Wed, 22/4/2022')}
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {VITALS_TABLE_DUMMY_DATA.map(({
                                vitals, valueOne, valueTwo, valueThree, valueFour, valueFive
                              }) => {
                                return (
                                  <TableRow>
                                    <TableCell scope="row">
                                      <Typography variant='h6'>{vitals}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography variant='h6'>{valueOne}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography variant='h6'>{valueTwo}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography variant='h6'>{valueThree}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography variant='h6'>{valueFour}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography variant='h6'>{valueFive}</Typography>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Box>
                    </Card>

                    {/* DIALOG */}
                    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                      <DialogTitle>
                        <Typography variant="h4">{ADD_VITALS}</Typography>
                      </DialogTitle>

                      <DialogContent className={classes.chartModalBox}>
                        <FormProvider {...methods}>
                          <form>
                            <Box>
                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{DATE}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <DatePicker name={''} label={''} />
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}></Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{FEVER}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="fever"
                                    controllerLabel={''}
                                  />
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                  <Controller
                                    name='basicAddress'
                                    control={control}
                                    render={() => (
                                      <FormControl fullWidth className={headerClasses.toggleContainer}>
                                        <Box className={classes.toggleMain}>
                                          <label className="toggle-main">
                                            <Box color={checked ? WHITE : GRAY_THREE} pr={1}>{feverUnits[0]}</Box>
                                            <AntSwitch checked={checked} onChange={(event) => { toggleHandleChange(event) }} name='basicAddress' />
                                            <Box color={checked ? GRAY_THREE : WHITE}>{feverUnits[1]}</Box>
                                          </label>
                                        </Box>
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{PULSE_TEXT}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={''}
                                  />
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                  <Box ml={2} color={GREY_TWO}>
                                    <strong>{BPM_TEXT}</strong>
                                  </Box>
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{RESPIRATORY_RATE_TEXT}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="respiratory"
                                    controllerLabel={''}
                                  />
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                  <Box ml={2} color={GREY_TWO}>
                                    <strong>{RPM_TEXT}</strong>
                                  </Box>
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{BLOOD_PRESSURE_TEXT}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <Grid container>
                                    <Grid item md={5}>
                                      <InputController
                                        fieldType="text"
                                        controllerName="bloodPressure"
                                        controllerLabel={''}
                                      />
                                    </Grid>

                                    <Grid item md={2}></Grid>

                                    <Grid item md={5}>
                                      <InputController
                                        fieldType="text"
                                        controllerName="bloodPressure"
                                        controllerLabel={''}
                                      />
                                    </Grid>
                                  </Grid>
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                  <Box ml={2} color={GREY_TWO}>
                                    <strong>{MMHG_TEXT}</strong>
                                  </Box>
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{OXYGEN_SATURATION_TEXT}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="oxygen"
                                    controllerLabel={''}
                                  />
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                  <Box ml={2} color={GREY_TWO}>
                                    <strong>%</strong>
                                  </Box>
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{HEIGHT_TEXT}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="height"
                                    controllerLabel={''}
                                  />
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                  <Controller
                                    name='emergencyAddress'
                                    control={control}
                                    render={() => (
                                      <FormControl fullWidth className={headerClasses.toggleContainer}>
                                        <Box className={classes.toggleMain}>
                                          <label className="toggle-main">
                                            <Box color={checked ? WHITE : GRAY_THREE} pr={1}>{heightUnits[0]}</Box>
                                            <AntSwitch checked={checked} onChange={(event) => { toggleHandleChange(event) }} name='emergencyAddress' />
                                            <Box color={checked ? GRAY_THREE : WHITE}>{heightUnits[1]}</Box>
                                          </label>
                                        </Box>
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{WEIGHT_TEXT}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="weight"
                                    controllerLabel={''}
                                  />
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                  <Controller
                                    name='emergencyAddress'
                                    control={control}
                                    render={() => (
                                      <FormControl fullWidth className={headerClasses.toggleContainer}>
                                        <Box className={classes.toggleMain}>
                                          <label className="toggle-main">
                                            <Box color={checked ? WHITE : GRAY_THREE} pr={1}>{weightUnits[0]}</Box>
                                            <AntSwitch checked={checked} onChange={(event) => { toggleHandleChange(event) }} name='emergencyAddress' />
                                            <Box color={checked ? GRAY_THREE : WHITE}>{weightUnits[1]}</Box>
                                          </label>
                                        </Box>
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{BMI_TEXT}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="bmi"
                                    controllerLabel={''}
                                  />
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                  <Box ml={2} color={GREY_TWO}>
                                    <strong>{KG_PER_METER_SQUARE_TEXT}</strong>
                                  </Box>
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{PAIN_TEXT}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pain"
                                    controllerLabel={''}
                                  />
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{SMOKING_STATUS_TEXT}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <Selector
                                    value={EMPTY_OPTION}
                                    label={''}
                                    name="smokingStatus"
                                  />
                                </Grid>
                              </Grid>

                              <Grid container alignContent='center' alignItems='center'>
                                <Grid item md={3} sm={12} xs={12}>
                                  <Typography variant='body1'>{HEAD_CIRCUMFERENCE}</Typography>
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="headCircumference"
                                    controllerLabel={''}
                                  />
                                </Grid>

                                <Grid item md={3} sm={12} xs={12}>
                                  <Controller
                                    name='emergencyAddress'
                                    control={control}
                                    render={() => (
                                      <FormControl fullWidth className={headerClasses.toggleContainer}>
                                        <Box className={classes.toggleMain}>
                                          <label className="toggle-main">
                                            <Box color={checked ? WHITE : GRAY_THREE} pr={1}>{headUnits[0]}</Box>
                                            <AntSwitch checked={checked} onChange={(event) => { toggleHandleChange(event) }} name='emergencyAddress' />
                                            <Box color={checked ? GRAY_THREE : WHITE}>{headUnits[1]}</Box>
                                          </label>
                                        </Box>
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </form>
                        </FormProvider>
                      </DialogContent>

                      <DialogActions>
                        <Box display='flex' justifyContent='flex-end' alignItems='center'>
                          <Button variant='outlined' color='default'>{CANCEL_TEXT}</Button>
                          <Box p={1} />
                          <Button variant='contained' color='primary'>{SAVE_TEXT}</Button>
                        </Box>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value="2" className='tab-panel'>
                <Grid container spacing={3}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <FormProvider {...methods}>
                          <form>
                            <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant='h3'>{PROBLEMS_TEXT}</Typography>

                              <Button variant='contained' color='primary'>
                                <AddWhiteIcon />
                                <Box p={0.5} />
                                {ADD_NEW_TEXT}
                              </Button>
                            </Box>
                          </form>
                        </FormProvider>

                        <Box className={classes.tableBox}>
                          <Table aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                {renderTh(ICD_CODE)}
                                {renderTh(PROBLEM_TEXT)}
                                {renderTh(ONSET_DATE)}
                                {renderTh(TYPE)}
                                {renderTh(NOTES)}
                                {renderTh(STATUS)}
                                {renderTh(ACTIONS)}
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {PROBLEMS_TABLE_DUMMY_DATA.map(({
                                code, problem, onsetDate, type, notes, status, edit,
                              }) => {
                                return (
                                  <TableRow>
                                    <TableCell scope="row">
                                      <Typography>{code}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography>{problem}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography>{onsetDate}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Box className={classes.activeBox} bgcolor={ORANGE_ONE}>
                                        {type}
                                      </Box>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography className={classes.textOverflow}>{notes}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Box className={classes.activeBox} bgcolor={GREEN}>
                                        {status}
                                      </Box>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Box display='flex' alignItems='center'>
                                        <IconButton>
                                          <EditOutlinedIcon />
                                        </IconButton>

                                        <IconButton>
                                          <TrashOutlinedSmallIcon />
                                        </IconButton>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value="3" className='tab-panel'>
                <Grid container spacing={3}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <FormProvider {...methods}>
                          <form>
                            <Box px={2} py={2} display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant='h3'>{ALLERGIES_TEXT}</Typography>

                              <Button variant='contained' color='primary'>
                                <AddWhiteIcon />
                                <Box p={0.5} />
                                {ADD_NEW_TEXT}
                              </Button>
                            </Box>
                          </form>
                        </FormProvider>
                        
                        <Box className={classes.tableBox}>
                          <Table aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                {renderTh(ALLERGIES_TEXT)}
                                {renderTh(PROBLEM_TEXT)}
                                {renderTh(ONSET_DATE)}
                                {renderTh(TYPE)}
                                {renderTh(NOTES)}
                                {renderTh(STATUS)}
                                {renderTh(ACTIONS)}
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {PROBLEMS_TABLE_DUMMY_DATA.map(({
                                code, problem, onsetDate, type, notes, status, edit,
                              }) => {
                                return (
                                  <TableRow>
                                    <TableCell scope="row">
                                      <Typography>{code}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography>{problem}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography>{onsetDate}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Box className={classes.activeBox} bgcolor={ORANGE_ONE}>
                                        {type}
                                      </Box>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Typography className={classes.textOverflow}>{notes}</Typography>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Box className={classes.activeBox} bgcolor={GREEN}>
                                        {status}
                                      </Box>
                                    </TableCell>
                                    <TableCell scope="row">
                                      <Box display='flex' alignItems='center'>
                                        <IconButton>
                                          <EditOutlinedIcon />
                                        </IconButton>

                                        <IconButton>
                                          <TrashOutlinedSmallIcon />
                                        </IconButton>
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Box>
    </>
    // import AllergyList from '../allergies/list';
    // import PatientCardComponent from "./PatientCardComponent";
    // import ProblemList from '../problems/list';
    // // interfaces, graphql, constants block /styles
    // import { PATIENT_CHARTING_DATA, VITALS_TEXT } from "../../../../constants";
    // import { ChartComponentProps } from '../../../../interfacesTypes';

    // const ChartCards: FC<ChartComponentProps> = ({ shouldDisableEdit }): JSX.Element => {
    //   const [isVitals] = useState<boolean>(true)

    //   return (
    //     <Grid container spacing={3}>
    //       <Grid item md={4} sm={12} xs={12}>
    //         <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd={!shouldDisableEdit} cardChartingData={PATIENT_CHARTING_DATA} vitalsCard={isVitals} />
    //       </Grid>

    //       <Grid item md={4} sm={12} xs={12}>
    //         <AllergyList shouldDisableEdit={shouldDisableEdit} />
    //       </Grid>

    //       <Grid item md={4} sm={12} xs={12}>
    //         <ProblemList shouldDisableEdit={shouldDisableEdit} />
    //       </Grid>
    //     </Grid>
  );
};
export default ChartCards;
