// packages block
import { FC, ChangeEvent, Reducer, useReducer, ReactElement, useState, } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import {
  Box, Button, Card, Grid, IconButton, Tab, Table, TableBody, TableCell, TableHead, TableRow, Typography, Dialog, DialogActions,
  DialogTitle, DialogContent, colors,
} from "@material-ui/core";
// components block
import Selector from '../../../common/Selector';
import BackButton from '../../../common/BackButton';
import InputController from '../../../../controller';
// interfaces, graphql, constants block /styles
import { renderTh } from '../../../../utils';
import { GREEN_TWO, GREY_THREE, } from '../../../../theme';
import { PatientInputProps } from '../../../../interfacesTypes';
import { useChartingStyles } from "../../../../styles/chartingStyles";
import { AddBlackIcon, FormEditNewIcon, PrinterBlackIcon, } from '../../../../assets/svgs';
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  ADD_VITALS, BLOOD_PRESSURE_TEXT_AND_UNIT, BMI_TEXT_AND_UNIT, EMPTY_OPTION, FEVER_TEXT_AND_UNIT, FORMER_SMOKER,
  FUNCTIONAL_HEARTBURN, HEAD_TEXT_AND_UNIT, HEIGHT_TEXT_AND_UNIT, ICD_TEN_CODE, LAST_READING_DATE, OXYGEN_SATURATION_TEXT_AND_UNIT,
  PAIN_TEXT_AND_UNIT, PATIENT_CHARTING_TABS, PROBLEMS_DUMMY_DATA, PROBLEMS_TEXT, PULSE_TEXT_AND_UNIT, RECENT_READINGS, VITALS_TEXT,
  RESPIRATORY_TEXT_AND_UNIT, SAVE_TEXT, SMOKING_STATUS_TEXT, SNOMED_CODE, UNITS, VITALS_DUMMY_DATA, WEIGHT_TEXT_AND_UNIT, EDIT_PROBLEMS, 
  REMOVE_TEXT, ALLERGIES_TEXT, ALLERGIES_DUMMY_DATA, EDIT_ALLERGY, ADD_ANOTHER_REACTION,
} from "../../../../constants";
import { AddCircleOutline } from '@material-ui/icons';

const ChartCards: FC = (): JSX.Element => {
  const classes = useChartingStyles()

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const methods = useForm<PatientInputProps>({
    mode: "all",
  });

  const [{ tabValue }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const renderIcon = () => {
    return (
      <IconButton onClick={handleClickOpen}>
        <FormEditNewIcon />
      </IconButton>
    )
  }

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

      <Box>
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
                <Grid container direction='row' spacing={3}>
                  <Grid item md={6} sm={8} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <Box p={2} bgcolor={GREEN_TWO} display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant='h4'>{RECENT_READINGS}</Typography>

                          <Box display="flex" alignItems="center">
                            <Box className={classes.iconBox}>
                              <IconButton>
                                <PrinterBlackIcon />
                              </IconButton>
                            </Box>

                            <Box ml={1} className={classes.iconBox}>
                              <IconButton>
                                <AddBlackIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>

                        <Box p={3}>
                          <Box py={2}>
                            <Typography display='inline' variant='h4'>{LAST_READING_DATE}</Typography>

                            <Typography display='inline' variant='h4' color='primary'>May 2, 2022</Typography>
                          </Box>

                          {VITALS_DUMMY_DATA.map((item, index) => (
                            <Box key={index} py={2} display="flex" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="h4" color='error'>{item.value}</Typography>
                                <Typography variant="body2">{item.name}</Typography>
                              </Box>

                              <Box textAlign='right'>
                                <Typography variant="h5" color='primary'>{item.value}</Typography>
                                <Typography variant="body2">{item.name}</Typography>
                              </Box>
                            </Box>
                          ))}

                          <Box my={2}>
                            <Typography variant='h4'>{FORMER_SMOKER}</Typography>
                            <Typography variant="body2">{SMOKING_STATUS_TEXT}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item md={6} sm={8} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <Box p={2} bgcolor={GREEN_TWO} display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant='h4'>{ADD_VITALS}</Typography>

                          <Button variant='contained' color='primary'>{SAVE_TEXT}</Button>
                        </Box>

                        <Box p={3}>
                          <FormProvider {...methods}>
                            <form>
                              <Grid container spacing={3}>
                                <Grid item md={4} sm={12} xs={12}>
                                  <Box mt={1} className={classes.unitsDropdown}>
                                    <Selector
                                      name="units"
                                      label={UNITS}
                                      value={EMPTY_OPTION}
                                    />
                                  </Box>
                                </Grid>
                              </Grid>

                              <Grid container spacing={3}>
                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={PULSE_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={BLOOD_PRESSURE_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={OXYGEN_SATURATION_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={RESPIRATORY_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={FEVER_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={PAIN_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={HEIGHT_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={WEIGHT_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={BMI_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <InputController
                                    fieldType="text"
                                    controllerName="pulse"
                                    controllerLabel={HEAD_TEXT_AND_UNIT}
                                  />
                                </Grid>

                                <Grid item md={6} sm={12} xs={12}>
                                  <Selector
                                    value={EMPTY_OPTION}
                                    label={SMOKING_STATUS_TEXT}
                                    name="smokingStatus"
                                  />
                                </Grid>
                              </Grid>
                            </form>
                          </FormProvider>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>

                <Box p={2} />

                <Grid container spacing={3}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <FormProvider {...methods}>
                          <form>
                            <Box px={2} pt={2} bgcolor={GREEN_TWO} display="flex" justifyContent="space-between" alignItems="center">
                              <Box mt={1} className={classes.tableHeaderDropdown}>
                                <Selector
                                  name="units"
                                  label={''}
                                  value={EMPTY_OPTION}
                                />
                              </Box>

                              <Box mt={1} className={classes.tableHeaderDropdown}>
                                <Selector
                                  name="results"
                                  label={''}
                                  value={EMPTY_OPTION}
                                />
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
                              <TableRow>
                                <TableCell scope="row"></TableCell>
                                <TableCell scope="row"></TableCell>
                                <TableCell scope="row"></TableCell>
                                <TableCell scope="row"></TableCell>
                                <TableCell scope="row"></TableCell>
                                <TableCell scope="row"></TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Box>
                    </Card>

                    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                      <DialogTitle>
                        <Typography variant="h4">WED, 22/4/2022</Typography>
                      </DialogTitle>

                      <DialogContent>
                        <FormProvider {...methods}>
                          <form>
                            <Grid container spacing={3}>
                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="fever"
                                  controllerLabel={FEVER_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="pulse"
                                  controllerLabel={PULSE_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="respiratory"
                                  controllerLabel={RESPIRATORY_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="bloodPressure"
                                  controllerLabel={BLOOD_PRESSURE_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="oxygenSaturation"
                                  controllerLabel={OXYGEN_SATURATION_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="height"
                                  controllerLabel={HEIGHT_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="weight"
                                  controllerLabel={WEIGHT_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="bmi"
                                  controllerLabel={BMI_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="pain"
                                  controllerLabel={PAIN_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <InputController
                                  fieldType="text"
                                  controllerName="headCircumference"
                                  controllerLabel={HEAD_TEXT_AND_UNIT}
                                />
                              </Grid>

                              <Grid item md={4} sm={12} xs={12}>
                                <Selector
                                  value={EMPTY_OPTION}
                                  label={SMOKING_STATUS_TEXT}
                                  name="smokingStatus"
                                />
                              </Grid>
                            </Grid>
                          </form>
                        </FormProvider>
                      </DialogContent>

                      <DialogActions>
                        <Box display='flex' justifyContent='flex-end'>
                          <Button variant='contained' color="primary">
                            {SAVE_TEXT}
                          </Button>
                        </Box>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value="2" className='tab-panel'>
                <Grid container direction='row' spacing={3}>
                  <Grid item md={6} sm={8} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <Box p={2} bgcolor={GREEN_TWO} display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant='h4'>{PROBLEMS_TEXT}</Typography>

                          <Box display="flex" alignItems="center">
                            <Box className={classes.iconBox}>
                              <IconButton>
                                <PrinterBlackIcon />
                              </IconButton>
                            </Box>

                            <Box ml={1} className={classes.iconBox}>
                              <IconButton>
                                <AddBlackIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>

                        <Box p={3}>
                          {PROBLEMS_DUMMY_DATA.map((item, index) => (
                            <Box key={index} py={2} display="flex" justifyContent="space-between" alignItems="center">
                              <ul>
                                <li>
                                  <Typography variant="h6" color='secondary'>{item.name}</Typography>
                                  <Typography variant="body2" color='textPrimary'>{item.value}</Typography>
                                </li>
                              </ul>

                              <Box textAlign='right' color={GREY_THREE}>
                                <Typography variant="h6">{item.status}</Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item md={6} sm={8} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <Box p={2} bgcolor={GREEN_TWO} display="flex" justifyContent="space-between" alignItems="center">
                          {/* <Typography variant='h4'>{ADD_PROBLEMS}</Typography> */}
                          <Typography variant='h4'>{EDIT_PROBLEMS}</Typography>

                          {/* <Button variant='contained' color='primary'>{ADD}</Button> */}
                          <Box display='flex' alignItems='center'>
                            <Button variant='outlined' color='inherit' className='danger'>{REMOVE_TEXT}</Button>
                            <Box p={1} />
                            <Button variant='contained' color='primary' size='medium'>{SAVE_TEXT}</Button>
                          </Box>
                        </Box>

                        <Box p={3}>
                          <FormProvider {...methods}>
                            <form>
                              {/* <Typography variant="h6">{TYPE}</Typography> */}
                              {/* Add Filer Search component here */}

                              <Box display='flex' alignItems='center'>
                                <BackButton to={''} />

                                <Box ml={2}>
                                  <Typography variant="h6">{FUNCTIONAL_HEARTBURN}</Typography>

                                  <Box mt={1} display="flex">
                                    <Box display="flex" color={GREY_THREE}>
                                      <Typography variant="h6" >{ICD_TEN_CODE}&nbsp;</Typography>
                                      <Typography variant="body2">R12</Typography>
                                    </Box>

                                    <Box mx={2} py={1.5} borderLeft={`1px solid ${colors.grey[400]}`}></Box>

                                    <Box display="flex" color={GREY_THREE}>
                                      <Typography variant="h6" >{SNOMED_CODE}&nbsp;</Typography>
                                      <Typography variant="body2">722876002</Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </form>
                          </FormProvider>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value="3" className='tab-panel'>
                <Grid container direction='row' spacing={3}>
                  <Grid item md={6} sm={8} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <Box p={2} bgcolor={GREEN_TWO} display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant='h4'>{ALLERGIES_TEXT}</Typography>

                          <Box display="flex" alignItems="center">
                            <Box className={classes.iconBox}>
                              <IconButton>
                                <PrinterBlackIcon />
                              </IconButton>
                            </Box>

                            <Box ml={1} className={classes.iconBox}>
                              <IconButton>
                                <AddBlackIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>

                        <Box p={3}>
                          {ALLERGIES_DUMMY_DATA.map((item, index) => (
                            <Box key={index} py={2} display="flex" justifyContent="space-between" alignItems="center">
                              <ul>
                                <li>
                                  <Typography variant="h6" color='secondary'>{item.name}</Typography>
                                  <Typography variant="body2" color='textPrimary'>{item.value}</Typography>
                                </li>
                              </ul>

                              <Box textAlign='right' color={GREY_THREE}>
                                <Typography variant="h6">{item.status}</Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item md={6} sm={8} xs={12}>
                    <Card>
                      <Box className={classes.cardBox}>
                        <Box p={2} bgcolor={GREEN_TWO} display="flex" justifyContent="space-between" alignItems="center">
                          {/* <Typography variant='h4'>{ADD_ALLERGY}</Typography> */}
                          <Typography variant='h4'>{EDIT_ALLERGY}</Typography>

                          {/* <Button variant='contained' color='primary'>{ADD}</Button> */}
                          <Box display='flex' alignItems='center'>
                            <Button variant='outlined' color='inherit' className='danger'>{REMOVE_TEXT}</Button>
                            <Box p={1} />
                            <Button variant='contained' color='primary' size='medium'>{SAVE_TEXT}</Button>
                          </Box>
                        </Box>

                        <Box p={3}>
                          <FormProvider {...methods}>
                            <form>
                              {/* <Typography variant="h6">{TYPE}</Typography> */}
                              {/* Add Filer Search component here */}

                              <Box display='flex' alignItems='center'>
                                <BackButton to={''} />

                                <Box ml={2}>
                                  <Typography variant="h5">Peanut</Typography>
                                </Box>
                              </Box>

                              {/* <Box mt={5} width='100%' style={{ border: '1px solid red' }}> */}
                                <Box my={3} pb={2}
                                  onClick={() => { }}
                                  className="billing-box" display="flex" alignItems="center" justifyContent='flex-end'
                                >
                                  <AddCircleOutline color='inherit' />

                                  <Typography>{ADD_ANOTHER_REACTION}</Typography>
                                </Box>
                              {/* </Box> */}
                            </form>
                          </FormProvider>
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
  );
};
export default ChartCards;
