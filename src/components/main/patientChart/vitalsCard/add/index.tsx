// packages block
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography
} from '@material-ui/core';
//component block
import Alert from '../../../../common/Alert';
import Selector from '../../../../common/Selector';
import InputController from '../../../../../controller';
import DatePicker from '../../../../common/DatePicker';
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  HeadCircumferenceType, SmokingStatus, TempUnitType, UnitType, useAddPatientVitalMutation,
  useUpdatePatientVitalMutation, WeightType
} from '../../../../../generated/graphql';
import {
  ADD_VITALS, BLOOD_PRESSURE_TEXT, BMI_TEXT, BPM_TEXT, CANCEL_TEXT, DATE, FEVER_UNITS, 
  HEAD_CIRCUMFERENCE, HEAD_CIRCUMFERENCE_UNITS, HEIGHT_TEXT, KG_PER_METER_SQUARE_TEXT, 
  MMHG_TEXT, OXYGEN_SATURATION_TEXT, PAIN_TEXT, PATIENT_HEIGHT_UNITS, PATIENT_WEIGHT_UNITS, 
  RESPIRATORY_RATE_TEXT, RPM_TEXT, SAVE_TEXT, SMOKING_STATUS_TEXT, VITAL_ERROR_MSG, WEIGHT_TEXT,
  MAPPED_SMOKING_STATUS, PULSE_TEXT, TEMPERATURE_TEXT, UPDATE_VITALS
} from '../../../../../constants';

import { patientVitalSchema } from '../../../../../validationSchemas';
import { ActionType } from '../../../../../reducers/patientReducer';
import { useChartingStyles } from '../../../../../styles/chartingStyles';
import { AddPatientVitalsProps, ParamsType, VitalFormInput } from '../../../../../interfacesTypes';
import { GRAY_SIX, GREY_TWO } from '../../../../../theme';
import {
  celsiusToFahrenheit, centimeterToInches, centimeterToMeter, fahrenheitToCelsius, getBMI,
  getDefaultHead, getDefaultHeight, getDefaultTemp, getDefaultWeight, inchesToCentimeter, inchesToMeter,
  kilogramToOunce, kilogramToPounds, ounceToKilogram, ounceToPounds, poundsToKilogram, poundsToOunce, roundOffUpto2Decimal
} from '../../../../../utils';

export const AddVitals = memo(({
  fetchPatientAllVitals, patientStates, dispatcher, isOpen = false, handleClose, vitalToEdit }: AddPatientVitalsProps) => {
  const chartingClasses = useChartingStyles()
  const { id: patientId } = useParams<ParamsType>()
  const methods = useForm<VitalFormInput>({ mode: "all", resolver: yupResolver(patientVitalSchema) });
  const { handleSubmit, reset, watch, setValue } = methods;
  const { PatientHeight, PatientWeight, patientHeadCircumference, patientTemperature } = watch()
  const {
    prevHeightUnit, heightUnit, isHeightEdit, isWeightEdit, prevWeightUnit, weightUnit, isHeadEdit, prevHeadUnit,
    headCircumferenceUnit, isTempEdit, feverUnit, prevFeverUnit } = patientStates || {}
  const { id: feverUnitId } = feverUnit
  const { id: heightUnitId } = heightUnit
  const { id: weightUnitId } = weightUnit
  const { id: headCircumferenceUnitId } = headCircumferenceUnit

  const [loading, setLoading] = useState<boolean>(false)

  const handleModalClose = () => {
    reset()
    handleClose && handleClose()
  }

  const [addPatientVital] = useAddPatientVitalMutation({
    onCompleted: (data) => {
      const { addPatientVital: { patientVital, response } } = data || {}
      const { id } = patientVital || {}
      if (response) {
        const { status, message } = response || {}
        if (status === 200 && id) {
          message && Alert.success(message)
          reset()
          fetchPatientAllVitals()
          handleModalClose()
        }
      }
    },
    onError: () => {
      Alert.error(VITAL_ERROR_MSG)
    }
  })

  const [updatePatientVital] = useUpdatePatientVitalMutation({
    onCompleted: (data) => {
      const { updatePatientVital: { patientVital, response } } = data || {}
      const { id } = patientVital || {}
      if (response) {
        const { status, message } = response || {}
        if (status === 200 && id) {
          message && Alert.success(message)
          reset()
          fetchPatientAllVitals()
          handleModalClose()
        }
      }
    },
    onError: () => {
      Alert.error(VITAL_ERROR_MSG)
    }
  })

  const onSubmit: SubmitHandler<VitalFormInput> = async (data) => {
    const {
      smokingStatus, respiratoryRate, diastolicBloodPressure, systolicBloodPressure, oxygenSaturation, PatientBMI,
      PainRange, pulseRate, PatientHeight: height, PatientWeight: weight, patientHeadCircumference: head,
      patientTemperature: temp, vitalsDate
    } = data || {}

    const { id: smokingStatusLabel } = smokingStatus || {}
    const { id: heightUnitType } = heightUnit || {}
    const { id: weightUnitType } = weightUnit || {}
    const { id: headUnitType } = headCircumferenceUnit || {}
    const { id: feverUnitType } = feverUnit || {}

    const PatientHeight = getDefaultHeight(heightUnitType, height)
    const PatientWeight = getDefaultWeight(weightUnitType, weight)
    const patientHeadCircumference = getDefaultHead(headUnitType, head)
    const patientTemperature = getDefaultTemp(feverUnitType, temp)

    try {
      setLoading(true)
      if (vitalToEdit) {
        await updatePatientVital({
          variables: {
            updateVitalInput: {
              id: vitalToEdit.id, weightUnit: WeightType.Kg, unitType: UnitType.Inch, temperatureUnitType: TempUnitType.DegF,
              headCircumference: HeadCircumferenceType.Inch, respiratoryRate, diastolicBloodPressure, PainRange,
              systolicBloodPressure, oxygenSaturation, PatientHeight, PatientWeight, PatientBMI, pulseRate,
              patientHeadCircumference, smokingStatus: smokingStatusLabel as SmokingStatus, patientTemperature,
              vitalCreationDate: vitalsDate ?? new Date().toUTCString()
            }
          }
        })
        setLoading(false)
        return
      }
      await addPatientVital({
        variables: {
          createVitalInput: {
            patientId, weightUnit: WeightType.Kg, unitType: UnitType.Inch, temperatureUnitType: TempUnitType.DegF,
            headCircumference: HeadCircumferenceType.Inch, respiratoryRate, diastolicBloodPressure, PainRange,
            systolicBloodPressure, oxygenSaturation, PatientHeight, PatientWeight, PatientBMI, pulseRate,
            patientHeadCircumference, smokingStatus: smokingStatusLabel as SmokingStatus, patientTemperature,
            vitalCreationDate: vitalsDate ?? new Date().toUTCString()
          }
        }
      })
      setLoading(false)
    } catch (error) {
      Alert.error(VITAL_ERROR_MSG)
    }
  }

  useEffect(() => {
    if (vitalToEdit) {
      const { smokingStatus, PainRange, PatientBMI, PatientHeight,
        PatientWeight, diastolicBloodPressure, oxygenSaturation, patientHeadCircumference, systolicBloodPressure,
        patientTemperature, pulseRate, vitalCreationDate, respiratoryRate } = vitalToEdit ?? {}
      setValue('pulseRate', pulseRate || '')
      setValue('PainRange', PainRange || '')
      setValue('respiratoryRate', respiratoryRate || '')
      setValue('patientTemperature', patientTemperature || '')
      setValue('oxygenSaturation', oxygenSaturation || '')
      setValue('patientHeadCircumference', patientHeadCircumference || '')
      setValue('PatientHeight', PatientHeight || '')
      setValue('PatientWeight', PatientWeight || '')
      setValue('smokingStatus', { id: smokingStatus as SmokingStatus, name: smokingStatus })
      setValue('systolicBloodPressure', systolicBloodPressure || '')
      setValue('diastolicBloodPressure', diastolicBloodPressure || '')
      setValue('PatientBMI', PatientBMI || '')
      setValue('vitalsDate', vitalCreationDate || '')
    }
  }, [setValue, vitalToEdit])

  const setPatientBMI = useCallback(() => {

    const patientHeight = parseFloat(PatientHeight);
    const patientWeight = parseFloat(PatientWeight);
    const { id: heightUnitType } = heightUnit || {}
    const { id: weightUnitType } = weightUnit || {}
    let height = 0;
    let weight = 0;

    switch (heightUnitType) {
      case UnitType.Centimeter:
        height = centimeterToMeter(patientHeight)
        break;
      case UnitType.Inch:
        height = inchesToMeter(patientHeight)
        break;
      default:
        height = inchesToMeter(patientHeight)
        break;
    }

    switch (weightUnitType) {
      case WeightType.Kg:
        weight = patientWeight
        break;
      case WeightType.Pound:
        weight = poundsToKilogram(patientWeight)
        break;
      case WeightType.PoundOunce:
        weight = ounceToKilogram(patientWeight)
        break;
      default:
        weight = patientWeight
        break;
    }

    const bmi = roundOffUpto2Decimal(getBMI(weight, height))
    bmi && setValue('PatientBMI', bmi)
  }, [PatientWeight, PatientHeight, heightUnit, weightUnit, setValue])

  useMemo(() => {
    PatientWeight && PatientHeight ? setPatientBMI() : setValue('PatientBMI', '')
  }, [PatientWeight, PatientHeight, setPatientBMI, setValue])

  const heightUnitConvertHandler = useCallback(() => {
    dispatcher({ type: ActionType.SET_EDIT_HEIGHT, isHeightEdit: false })
    if (PatientHeight) {
      const { id: heightUnitType } = heightUnit || {}
      const patientHeight = parseFloat(PatientHeight);

      if (prevHeightUnit === UnitType.Inch && heightUnitType === UnitType.Centimeter) {
        const height = roundOffUpto2Decimal(inchesToCentimeter(patientHeight))
        height && setValue('PatientHeight', height)
      }

      else if (prevHeightUnit === UnitType.Centimeter && heightUnitType === UnitType.Inch) {
        const height = roundOffUpto2Decimal(centimeterToInches(patientHeight))
        height && setValue('PatientHeight', height)
      }
    }
  }, [prevHeightUnit, heightUnit, PatientHeight, setValue, dispatcher])

  useEffect(() => {
    isHeightEdit && heightUnitConvertHandler()
  }, [isHeightEdit, heightUnitConvertHandler])

  const weightUnitConvertHandler = useCallback(() => {
    dispatcher({ type: ActionType.SET_EDIT_WEIGHT, isWeightEdit: false })
    if (PatientWeight) {
      const { id: weightUnitType } = weightUnit || {}
      const patientWeight = parseFloat(PatientWeight);

      if (prevWeightUnit === WeightType.Kg && weightUnitType === WeightType.Pound) {
        const weight = roundOffUpto2Decimal(kilogramToPounds(patientWeight))
        setValue('PatientWeight', weight)
      }
      else if (prevWeightUnit === WeightType.Kg && weightUnitType === WeightType.PoundOunce) {
        const weight = roundOffUpto2Decimal(kilogramToOunce(patientWeight))
        setValue('PatientWeight', weight)
      }
      else if (prevWeightUnit === WeightType.Pound && weightUnitType === WeightType.Kg) {
        const weight = roundOffUpto2Decimal(poundsToKilogram(patientWeight))
        setValue('PatientWeight', weight)
      }
      else if (prevWeightUnit === WeightType.Pound && weightUnitType === WeightType.PoundOunce) {
        const weight = roundOffUpto2Decimal(poundsToOunce(patientWeight))
        setValue('PatientWeight', weight)
      }
      else if (prevWeightUnit === WeightType.PoundOunce && weightUnitType === WeightType.Kg) {
        const weight = roundOffUpto2Decimal(ounceToKilogram(patientWeight))
        setValue('PatientWeight', weight)
      }
      else if (prevWeightUnit === WeightType.PoundOunce && weightUnitType === WeightType.Pound) {
        const weight = roundOffUpto2Decimal(ounceToPounds(patientWeight))
        setValue('PatientWeight', weight)
      }
    }
  }, [prevWeightUnit, weightUnit, PatientWeight, setValue, dispatcher])

  useEffect(() => {
    isWeightEdit && weightUnitConvertHandler()
  }, [isWeightEdit, weightUnitConvertHandler])

  const headUnitConvertHandler = useCallback(() => {
    dispatcher({ type: ActionType.SET_EDIT_HEAD, isHeadEdit: false })
    if (patientHeadCircumference) {
      const { id: headUnitType } = headCircumferenceUnit || {}
      const patientHead = parseFloat(patientHeadCircumference);

      if (prevHeadUnit === HeadCircumferenceType.Inch && headUnitType === HeadCircumferenceType.Centimeter) {
        const head = roundOffUpto2Decimal(inchesToCentimeter(patientHead))
        head && setValue('patientHeadCircumference', head)
      }

      else if (prevHeadUnit === HeadCircumferenceType.Centimeter && headUnitType === HeadCircumferenceType.Inch) {
        const head = roundOffUpto2Decimal(centimeterToInches(patientHead))
        head && setValue('patientHeadCircumference', head)
      }
    }
  }, [patientHeadCircumference, headCircumferenceUnit, prevHeadUnit, setValue, dispatcher])

  useEffect(() => {
    isHeadEdit && headUnitConvertHandler()
  }, [isHeadEdit, headUnitConvertHandler])

  const tempUnitConvertHandler = useCallback(() => {
    dispatcher({ type: ActionType.SET_EDIT_TEMP, isTempEdit: false })
    if (patientTemperature) {
      const { id: feverUnitType } = feverUnit || {}
      const patientTemp = parseFloat(patientTemperature);
      if (prevFeverUnit === TempUnitType.DegF && feverUnitType === TempUnitType.DegC) {
        const temp = roundOffUpto2Decimal(fahrenheitToCelsius(patientTemp))
        temp && setValue('patientTemperature', temp)
      }

      else if (prevFeverUnit === TempUnitType.DegC && feverUnitType === TempUnitType.DegF) {
        const temp = roundOffUpto2Decimal(celsiusToFahrenheit(patientTemp))
        temp && setValue('patientTemperature', temp)
      }
    }
  }, [patientTemperature, dispatcher, feverUnit, prevFeverUnit, setValue])

  useEffect(() => {
    isTempEdit && tempUnitConvertHandler()
  }, [isTempEdit, tempUnitConvertHandler])

  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleModalClose}>
      <DialogTitle>
        <Typography variant="h4">{vitalToEdit ? UPDATE_VITALS : ADD_VITALS}</Typography>
      </DialogTitle>

      <FormProvider {...methods}>
        <DialogContent className={chartingClasses.chartModalBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{DATE}</Typography>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <DatePicker defaultValue={new Date()} name='vitalsDate' label={''} />
              </Grid>

              <Grid item md={3} sm={12} xs={12}></Grid>
            </Grid>

            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{TEMPERATURE_TEXT}</Typography>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="number"
                  controllerName="patientTemperature"
                  controllerLabel={''}
                  notStep
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box className={`${chartingClasses.toggleProblem} ${chartingClasses.toggleBox}`}>
                  <Box display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                    {FEVER_UNITS?.map((temp, index) => {
                      const { id, name } = temp || {}
                      return (<Box key={`${index}-${name}-${id}`}
                        className={id === feverUnitId ? 'selectedBox selectBox' : 'selectBox'}
                        onClick={() => dispatcher({ type: ActionType.SET_FEVER_UNIT, feverUnit: temp })}
                      >
                        <Typography variant='h6'>{name}</Typography>
                      </Box>
                      )
                    })}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{PULSE_TEXT}</Typography>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="number"
                  controllerName="pulseRate"
                  controllerLabel={''}
                  notStep
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
                  fieldType="number"
                  controllerName="respiratoryRate"
                  controllerLabel={''}
                  notStep
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
                      fieldType="number"
                      controllerName="systolicBloodPressure"
                      controllerLabel={''}
                      placeholder={'e.g 120'}
                      notStep
                    />
                  </Grid>

                  <Grid item md={2}></Grid>

                  <Grid item md={5}>
                    <InputController
                      fieldType="number"
                      controllerName="diastolicBloodPressure"
                      controllerLabel={''}
                      placeholder={'e.g 80'}
                      notStep
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
                  fieldType="number"
                  controllerName="oxygenSaturation"
                  controllerLabel={''}
                  notStep
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
                  fieldType="number"
                  controllerName="PatientHeight"
                  controllerLabel={''}
                  notStep
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box className={`${chartingClasses.toggleProblem} ${chartingClasses.toggleBox}`}>
                  <Box display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                    {PATIENT_HEIGHT_UNITS?.map((height, index) => {
                      const { id, name } = height || {}
                      return (<Box key={`${index}-${name}-${id}`}
                        className={id === heightUnitId ? 'selectedBox selectBox' : 'selectBox'}
                        onClick={() => dispatcher({ type: ActionType.SET_HEIGHT_UNIT, heightUnit: height })}
                      >
                        <Typography variant='h6'>{name}</Typography>
                      </Box>
                      )
                    })}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{WEIGHT_TEXT}</Typography>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="number"
                  controllerName="PatientWeight"
                  controllerLabel={''}
                  notStep
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box className={`${chartingClasses.toggleProblem} ${chartingClasses.toggleBox}`}>
                  <Box display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                    {PATIENT_WEIGHT_UNITS?.map((weight, index) => {
                      const { id, name } = weight || {}
                      return (<Box key={`${index}-${name}-${id}`}
                        className={id === weightUnitId ? 'selectedBox selectBox' : 'selectBox'}
                        onClick={() => dispatcher({ type: ActionType.SET_WEIGHT_UNIT, weightUnit: weight })}
                      >
                        <Typography variant='h6'>{name}</Typography>
                      </Box>
                      )
                    })}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{BMI_TEXT}</Typography>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="number"
                  controllerName="PatientBMI"
                  controllerLabel={''}
                  disabled
                  notStep
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
                  fieldType="number"
                  controllerName="PainRange"
                  controllerLabel={''}
                  notStep
                />
              </Grid>
            </Grid>

            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{SMOKING_STATUS_TEXT}</Typography>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <Selector
                  name="smokingStatus"
                  label={''}
                  options={MAPPED_SMOKING_STATUS}
                />
              </Grid>
            </Grid>

            <Grid container alignContent='center' alignItems='center'>
              <Grid item md={3} sm={12} xs={12}>
                <Typography variant='body1'>{HEAD_CIRCUMFERENCE}</Typography>
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="number"
                  controllerName="patientHeadCircumference"
                  controllerLabel={''}
                  notStep
                />
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <Box className={`${chartingClasses.toggleProblem} ${chartingClasses.toggleBox}`}>
                  <Box display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                    {HEAD_CIRCUMFERENCE_UNITS?.map((head, index) => {
                      const { id, name } = head || {}
                      return (<Box key={`${index}-${name}-${id}`}
                        className={id === headCircumferenceUnitId ? 'selectedBox selectBox' : 'selectBox'}
                        onClick={() => dispatcher({ type: ActionType.SET_HEAD_CIRCUMFERENCE_UNIT, headCircumferenceUnit: head })}
                      >
                        <Typography variant='h6'>{name}</Typography>
                      </Box>
                      )
                    })}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        <DialogActions>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <Button variant='text' color='default' onClick={handleModalClose}>{CANCEL_TEXT}</Button>

            <Box p={1} />

            <Button type='submit' variant='contained' color='primary' disabled={loading} fullWidth onClick={handleSubmit(onSubmit)}>
              {SAVE_TEXT}
              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
})
