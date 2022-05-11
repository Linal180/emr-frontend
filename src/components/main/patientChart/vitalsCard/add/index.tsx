// packages block
import { memo, useCallback, useMemo, useState } from 'react'
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
import { getBMI, getCurrentDate, inchesToMeter, renderTh, } from '../../../../../utils'
import { patientVitalSchema } from '../../../../../validationSchemas';
import Alert from '../../../../common/Alert';
import { SlashIcon } from '../../../../../assets/svgs'

export const AddVitals = memo(({ fetchPatientAllVitals }: AddPatientVitalsProps) => {

  const classes = usePatientVitalFormStyles()
  const { id: patientId } = useParams<ParamsType>()
  const methods = useForm<VitalFormInput>({ mode: "all", resolver: yupResolver(patientVitalSchema) });
  const { handleSubmit, reset, watch, setValue } = methods;
  const { PatientHeight, PatientWeight } = watch()

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
      smokingStatus, respiratoryRate, diastolicBloodPressure, systolicBloodPressure, oxygenSaturation, PatientHeight, PatientWeight, PatientBMI,
      PainRange, pulseRate, patientHeadCircumference, patientTemperature } = data || {}
    const { id: smokingStatusLabel } = smokingStatus || {}

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

    const height = inchesToMeter(patientHeight)
    const bmi = getBMI(patientWeight, height)

    bmi && setValue('PatientBMI', bmi?.toString())
  }, [PatientWeight, PatientHeight, setValue])

  useMemo(() => {
    PatientWeight && PatientHeight && setPatientBMI()
  }, [PatientWeight, PatientHeight, setPatientBMI])

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
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="PatientHeight"
                  controllerLabel={''}
                  // endAdornment={<Fragment>{IN_TEXT}</Fragment>}
                  margin={'none'}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="PatientWeight"
                  // endAdornment={<Fragment>{KG_TEXT}</Fragment>}
                  controllerLabel={''}
                  margin={'none'}
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
                  // endAdornment={<Fragment>{IN_TEXT}</Fragment>}
                  margin={'none'}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.input}>
                <InputController
                  fieldType="number"
                  controllerName="patientTemperature"
                  controllerLabel={''}
                  // endAdornment={<Box dangerouslySetInnerHTML={{ __html: `<sup>o</sup>F` }} ></Box>}
                  margin={'none'}
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
    </FormProvider>
  )
})