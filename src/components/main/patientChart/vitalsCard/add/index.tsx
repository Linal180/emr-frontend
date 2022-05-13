// packages block
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Box } from '@material-ui/core';
//component block
import Selector from '../../../../common/Selector';
import InputController from '../../../../../controller';
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { EMPTY_OPTION, MAPPED_SMOKING_STATUS, SAVE_TEXT, VITAL_ERROR_MSG } from '../../../../../constants';
import {
  HeadCircumferenceType, SmokingStatus, TempUnitType, UnitType, useAddPatientVitalMutation, WeightType
} from '../../../../../generated/graphql';
import { AddPatientVitalsProps, ParamsType, VitalFormInput } from '../../../../../interfacesTypes';
import { usePatientVitalFormStyles } from '../../../../../styles/patientVitalsStyles';
import {
  celsiusToFahrenheit, centimeterToInches, centimeterToMeter, fahrenheitToCelsius, getBMI, getCurrentDate,
  getDefaultHead, getDefaultHeight, getDefaultTemp, getDefaultWeight, inchesToCentimeter, inchesToMeter,
  kilogramToOunce, kilogramToPounds, ounceToKilogram, ounceToPounds, poundsToKilogram, poundsToOunce, renderTh,
} from '../../../../../utils'
import { patientVitalSchema } from '../../../../../validationSchemas';
import Alert from '../../../../common/Alert';
import { SlashIcon } from '../../../../../assets/svgs'
import { ActionType } from '../../../../../reducers/patientReducer';

export const AddVitals = memo(({ fetchPatientAllVitals, patientStates, dispatcher }: AddPatientVitalsProps) => {

  const classes = usePatientVitalFormStyles()
  const { id: patientId } = useParams<ParamsType>()
  const methods = useForm<VitalFormInput>({ mode: "all", resolver: yupResolver(patientVitalSchema) });
  const { handleSubmit, reset, watch, setValue } = methods;
  const { PatientHeight, PatientWeight, patientHeadCircumference, patientTemperature } = watch()
  const {
    prevHeightUnit, heightUnit, isHeightEdit, isWeightEdit, prevWeightUnit, weightUnit, isHeadEdit, prevHeadUnit,
    headCircumferenceUnit, isTempEdit, feverUnit, prevFeverUnit } = patientStates || {}

  const [loading, setLoading] = useState<boolean>(false)

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
      patientTemperature: temp
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
      await addPatientVital({
        variables: {
          createVitalInput: {
            patientId, weightUnit: WeightType.Kg, unitType: UnitType.Inch, temperatureUnitType: TempUnitType.DegF,
            headCircumference: HeadCircumferenceType.Inch, respiratoryRate, diastolicBloodPressure, PainRange,
            systolicBloodPressure, oxygenSaturation, PatientHeight, PatientWeight, PatientBMI, pulseRate,
            patientHeadCircumference, smokingStatus: smokingStatusLabel as SmokingStatus, patientTemperature
            , vitalCreationDate: new Date().toUTCString()
          }
        }
      })
      setLoading(false)
    } catch (error) {
      Alert.error(VITAL_ERROR_MSG)
    }
  }



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

    const bmi = getBMI(weight, height)
    bmi && setValue('PatientBMI', bmi?.toString())
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
        const height = inchesToCentimeter(patientHeight)
        height && setValue('PatientHeight', height?.toString())
      }

      else if (prevHeightUnit === UnitType.Centimeter && heightUnitType === UnitType.Inch) {
        const height = centimeterToInches(patientHeight)
        height && setValue('PatientHeight', height?.toString())
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
        const weight = kilogramToPounds(patientWeight)
        setValue('PatientWeight', weight.toString())
      }
      else if (prevWeightUnit === WeightType.Kg && weightUnitType === WeightType.PoundOunce) {
        const weight = kilogramToOunce(patientWeight)
        setValue('PatientWeight', weight.toString())
      }
      else if (prevWeightUnit === WeightType.Pound && weightUnitType === WeightType.Kg) {
        const weight = poundsToKilogram(patientWeight)
        setValue('PatientWeight', weight.toString())
      }
      else if (prevWeightUnit === WeightType.Pound && weightUnitType === WeightType.PoundOunce) {
        const weight = poundsToOunce(patientWeight)
        setValue('PatientWeight', weight.toString())
      }
      else if (prevWeightUnit === WeightType.PoundOunce && weightUnitType === WeightType.Kg) {
        const weight = ounceToKilogram(patientWeight)
        setValue('PatientWeight', weight.toString())
      }
      else if (prevWeightUnit === WeightType.PoundOunce && weightUnitType === WeightType.Pound) {
        const weight = ounceToPounds(patientWeight)
        setValue('PatientWeight', weight.toString())
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
        const head = inchesToCentimeter(patientHead)
        head && setValue('patientHeadCircumference', head?.toString())
      }

      else if (prevHeadUnit === HeadCircumferenceType.Centimeter && headUnitType === HeadCircumferenceType.Inch) {
        const head = centimeterToInches(patientHead)
        head && setValue('patientHeadCircumference', head?.toString())
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
        const temp = fahrenheitToCelsius(patientTemp)
        temp && setValue('patientTemperature', temp?.toString())
      }

      else if (prevFeverUnit === TempUnitType.DegC && feverUnitType === TempUnitType.DegF) {
        const temp = celsiusToFahrenheit(patientTemp)
        temp && setValue('patientTemperature', temp?.toString())
      }
    }
  }, [patientTemperature, dispatcher, feverUnit, prevFeverUnit, setValue])

  useEffect(() => {
    isTempEdit && tempUnitConvertHandler()
  }, [isTempEdit, tempUnitConvertHandler])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table >
          <TableHead>
            <TableRow>
              {renderTh(getCurrentDate(`${new Date()}`))}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="pulseRate"
                  controllerLabel={''}
                  margin={'none'}
                  notStep
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="respiratoryRate"
                  controllerLabel={''}
                  margin={'none'}
                  notStep
                />
              </TableCell>

            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <InputController
                    fieldType="number"
                    controllerName="systolicBloodPressure"
                    controllerLabel={''}
                    placeholder={'e.g 120'}
                    margin={'none'}
                    notStep
                  />
                  <Box mx={1} height={'100%'}>
                    <SlashIcon />
                  </Box>
                  <InputController
                    fieldType="number"
                    controllerName="diastolicBloodPressure"
                    controllerLabel={''}
                    placeholder={'e.g 80'}
                    margin={'none'}
                    notStep
                  />
                </Box>

              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="oxygenSaturation"
                  controllerLabel={''}
                  margin={'none'}
                  notStep
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="PatientHeight"
                  controllerLabel={''}
                  margin={'none'}
                  notStep
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="PatientWeight"
                  controllerLabel={''}
                  margin={'none'}
                  notStep
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="PatientBMI"
                  controllerLabel={''}
                  disabled
                  margin={'none'}
                  notStep
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="PainRange"
                  controllerLabel={''}
                  margin={'none'}
                  notStep
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <Selector
                  name="smokingStatus"
                  label={''}
                  value={EMPTY_OPTION}
                  options={MAPPED_SMOKING_STATUS}
                  margin={'none'}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="patientHeadCircumference"
                  controllerLabel={''}
                  margin={'none'}
                  notStep
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="patientTemperature"
                  controllerLabel={''}
                  margin={'none'}
                  notStep
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <Button type='submit' variant='contained' color='primary' disabled={loading} fullWidth>
                  {SAVE_TEXT}
                  {loading && <CircularProgress size={20} color="inherit" />}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>
    </FormProvider >
  )
})