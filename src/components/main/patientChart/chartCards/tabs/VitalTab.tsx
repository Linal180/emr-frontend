import { ChangeEvent, useState } from "react"
import { Grid, Card, Box, Button, Table, TableHead, TableRow, TableBody, TableCell, Typography, Dialog, DialogTitle, DialogContent, FormControl, DialogActions, IconButton } from "@material-ui/core"
import { FormProvider, Controller, useForm } from "react-hook-form"
import { AddWhiteIcon, PrinterWhiteIcon, FormEditNewIcon } from "../../../../../assets/svgs"
import { EMPTY_OPTION, PRINT_CHART, ADD_NEW_TEXT, VITALS_TEXT, VITALS_TABLE_DUMMY_DATA, ADD_VITALS, DATE, FEVER, PULSE_TEXT, BPM_TEXT, RESPIRATORY_RATE_TEXT, RPM_TEXT, BLOOD_PRESSURE_TEXT, MMHG_TEXT, OXYGEN_SATURATION_TEXT, HEIGHT_TEXT, WEIGHT_TEXT, BMI_TEXT, KG_PER_METER_SQUARE_TEXT, PAIN_TEXT, SMOKING_STATUS_TEXT, HEAD_CIRCUMFERENCE, CANCEL_TEXT, SAVE_TEXT } from "../../../../../constants"
import InputController from "../../../../../controller"
import { PatientInputProps } from "../../../../../interfacesTypes"
import { AntSwitch, useChartingStyles } from "../../../../../styles/chartingStyles"
import { useHeaderStyles } from "../../../../../styles/headerStyles"
import { WHITE, GRAY_THREE, GREY_TWO } from "../../../../../theme"
import { renderTh } from "../../../../../utils"
import Selector from "../../../../common/Selector"
import DatePicker from "../../../../common/DatePicker"

const VitalTab = () => {
  const classes = useChartingStyles()
  const headerClasses = useHeaderStyles();
  const feverUnits = ['degF', 'degC'];
  const heightUnits = ['IN', 'CM'];
  const headUnits = ['IN', 'CM'];
  const weightUnits = ['LB', 'OZ', 'KG'];
  const [checked, setChecked] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => setOpen(false);

  const methods = useForm<PatientInputProps>({
    mode: "all",
  });
  const { control } = methods

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(!checked)
  };
  
  const renderIcon = () => {
    return (
      <IconButton onClick={() => setOpen(true)}>
        <FormEditNewIcon />
      </IconButton>
    )
  }

  return (
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
                                <AntSwitch checked={checked} onChange={toggleHandleChange} name='emergencyAddress' />
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
  )
}

export default VitalTab;
