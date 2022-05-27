// packages block
import { FC, ChangeEvent, Reducer, useReducer, ReactElement } from 'react';
import { Box, Button, Card, Grid, IconButton, Tab, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
// components block
// interfaces, graphql, constants block /styles
import { useChartingStyles } from "../../../../styles/chartingStyles";
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  ADD_VITALS, BLOOD_PRESSURE_TEXT_AND_UNIT, BMI_TEXT_AND_UNIT, EMPTY_OPTION, FEVER_TEXT_AND_UNIT, FORMER_SMOKER,
  HEAD_TEXT_AND_UNIT, HEIGHT_TEXT_AND_UNIT, LAST_FIVE_RESULTS, LAST_READING_DATE, OXYGEN_SATURATION_TEXT_AND_UNIT, PAIN_TEXT_AND_UNIT,
  PATIENT_CHARTING_TABS, PULSE_TEXT_AND_UNIT, RECENT_READINGS, RESPIRATORY_TEXT_AND_UNIT, SAVE_TEXT, SMOKING_STATUS_TEXT,
  UNITS, VITALS_DUMMY_DATA, VITALS_TEXT, WEIGHT_TEXT_AND_UNIT,
} from "../../../../constants";
import { AddBlackIcon, PrinterBlackIcon, } from '../../../../assets/svgs';
import { GREEN_TWO } from '../../../../theme';
import { FormProvider, useForm } from 'react-hook-form';
import { PatientInputProps } from '../../../../interfacesTypes';
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
import { renderTh } from '../../../../utils';

const ChartCards: FC = (): JSX.Element => {
  const classes = useChartingStyles()

  const methods = useForm<PatientInputProps>({
    mode: "all",
  });

  const [{ tabValue }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

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
                              <Box mt={1} className={classes.unitsDropdown}>
                                <Selector
                                  name="units"
                                  label={UNITS}
                                  value={EMPTY_OPTION}
                                />
                              </Box>

                              <Box mt={1} className={classes.unitsDropdown}>
                                <Selector
                                  name="results"
                                  label={LAST_FIVE_RESULTS}
                                  value={EMPTY_OPTION}
                                />
                              </Box>
                            </Box>
                          </form>
                        </FormProvider>

                        <Box className="table-overflow">
                          <Table aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                {renderTh(VITALS_TEXT)}
                                {renderTh('Wed, 22/4/2022')}
                                {renderTh('Wed, 22/4/2022')}
                                {renderTh('Wed, 22/4/2022')}
                                {renderTh('Wed, 22/4/2022')}
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
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value="2" className='tab-panel'>sss</TabPanel>

              <TabPanel value="3" className='tab-panel'>ssssssss</TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Box>
    </>
  );
};
export default ChartCards;
