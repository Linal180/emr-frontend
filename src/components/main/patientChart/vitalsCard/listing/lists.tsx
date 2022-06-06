// packages block
import { useState, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { Table, TableBody, TableCell, TableRow, TableHead, Typography, TableContainer, Box } from '@material-ui/core';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// components
import Selector from '../../../../common/Selector';
import InputController from '../../../../../controller';
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  HeadCircumferenceType, UnitType, WeightType, TempUnitType, SmokingStatus, useUpdatePatientVitalMutation,
  UpdateVitalInput
} from '../../../../../generated/graphql';
import { VitalFormInput, VitalListingTableProps } from '../../../../../interfacesTypes';
import { DASHES, EMPTY_OPTION, MAPPED_SMOKING_STATUS, VITAL_LABELS } from '../../../../../constants';
import {
  formatValue, getFormattedDateTime, inchesToCentimeter, renderTh, kilogramToPounds, kilogramToOunce,
  fahrenheitToCelsius, getDefaultHeight, getDefaultWeight, getDefaultHead, getDefaultTemp, getBMI,
  centimeterToMeter, inchesToMeter, poundsToKilogram, ounceToKilogram, roundOffUpto2Decimal
} from '../../../../../utils';
import { patientVitalUpdateSchema } from '../../../../../validationSchemas';
import { usePatientVitalFormStyles } from '../../../../../styles/patientVitalsStyles';
import { SlashIcon } from '../../../../../assets/svgs';

export const VitalListingTable = ({ patientVitals, patientStates, setPatientVitals, shouldDisableEdit }: VitalListingTableProps) => {

  const { heightUnit: { id: heightId }, weightUnit: { id: weightId }, headCircumferenceUnit: {
    id: headCircumferenceId }, feverUnit: { id: feverId } } = patientStates;
  const methods = useForm<VitalFormInput>({ mode: "all", resolver: yupResolver(patientVitalUpdateSchema) });
  const { handleSubmit, reset, setValue } = methods;
  const classes = usePatientVitalFormStyles()

  const [vitalId, setVitalId] = useState('')
  const [type, setType] = useState<VITAL_LABELS>(VITAL_LABELS.createdAt);

  const [updatePatientVital] = useUpdatePatientVitalMutation({
    onCompleted: ({ updatePatientVital }) => {
      const { patientVital, response } = updatePatientVital || {}
      const { status } = response || {}
      if (status && status === 200) {
        const { id } = patientVital || {}

        const arr = patientVitals?.map((v) => {
          const { id: vitalId } = v || {}
          if (vitalId && id && id === vitalId) {
            return patientVital ? patientVital : v
          }
          return v
        })

        setPatientVitals(arr)
        setVitalId('')
        reset()
      }
    },
    onError: () => {

    }
  })

  const getWeightValue = (weight: string) => {
    if (weight) {
      const patientWeight = parseFloat(weight);
      switch (weightId) {
        case WeightType.Kg:
          return patientWeight;
        case WeightType.Pound:
          return kilogramToPounds(patientWeight);
        case WeightType.PoundOunce:
          return kilogramToOunce(patientWeight);
        default:
          return patientWeight;
      }
    }
    else {
      return '';
    }
  }

  const getHeightValue = (height: string) => {
    if (height) {
      const patientHeight = parseFloat(height);
      switch (heightId) {
        case UnitType.Centimeter:
          return inchesToCentimeter(patientHeight)
        case UnitType.Inch:
          return patientHeight
        default:
          return patientHeight
      }
    }
    else {
      return ''
    }
  }

  const getHeadValue = (head: string) => {
    if (head) {
      const patientHead = parseFloat(head);
      switch (headCircumferenceId) {
        case HeadCircumferenceType.Centimeter:
          return inchesToCentimeter(patientHead)
        case HeadCircumferenceType.Inch:
          return patientHead
        default:
          return patientHead
      }
    }
    else {
      return ''
    }
  }

  const getFeverValue = (fever: string) => {
    if (fever) {
      const patientFever = parseFloat(fever);
      switch (feverId) {
        case TempUnitType.DegC:
          return fahrenheitToCelsius(patientFever)
        case TempUnitType.DegF:
          return patientFever
        default:
          return patientFever
      }
    }
    else {
      return ''
    }
  }

  const editHandler = (vital: string, type: VITAL_LABELS, val: string, val1?: string) => {
    setVitalId(vital)
    setType(type)
    switch (type) {
      case VITAL_LABELS.pulseRate:
        setValue('pulseRate', val)
        break;
      case VITAL_LABELS.PainRange:
        setValue('PainRange', val)
        break;
      case VITAL_LABELS.respiratoryRate:
        setValue('respiratoryRate', val)
        break;
      case VITAL_LABELS.patientTemperature:
        setValue('patientTemperature', val)
        break;
      case VITAL_LABELS.oxygenSaturation:
        setValue('oxygenSaturation', val)
        break;
      case VITAL_LABELS.patientHeadCircumference:
        setValue('patientHeadCircumference', val)
        break;
      case VITAL_LABELS.PatientHeight:
        setValue('PatientHeight', val)
        setValue('PatientWeight', val1 || '')
        break;
      case VITAL_LABELS.PatientWeight:
        setValue('PatientWeight', val)
        setValue('PatientHeight', val1 || '')
        break;
      case VITAL_LABELS.smokingStatus:
        setValue('smokingStatus', { id: val as SmokingStatus, name: val1 })
        break;
      case VITAL_LABELS.bloodPressure:
        setValue('systolicBloodPressure', val)
        setValue('diastolicBloodPressure', val1 || '')
        break;
      default:
        break;
    }
  }

  const updateHandler = async (input: UpdateVitalInput) => {
    try {
      await updatePatientVital({ variables: { updateVitalInput: { ...input } } })
    } catch (error) { }
  }

  const updateVitalHandler = async (data: VitalFormInput) => {
    const { pulseRate, PainRange, respiratoryRate, patientTemperature: temp, oxygenSaturation, PatientHeight: height,
      diastolicBloodPressure, patientHeadCircumference: head, systolicBloodPressure, PatientWeight: weight,
      smokingStatus } = data || {}
    const { id: smokingStatusId } = smokingStatus || {}

    switch (type) {
      case VITAL_LABELS.pulseRate:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, pulseRate })
        break;
      case VITAL_LABELS.PainRange:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, PainRange })
        break;
      case VITAL_LABELS.respiratoryRate:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, respiratoryRate })
        break;
      case VITAL_LABELS.patientTemperature:
        setType(VITAL_LABELS.createdAt)
        const patientTemperature = getDefaultTemp(feverId, temp)
        vitalId && updateHandler({ id: vitalId, patientTemperature })
        break;
      case VITAL_LABELS.oxygenSaturation:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, oxygenSaturation })
        break;
      case VITAL_LABELS.patientHeadCircumference:
        setType(VITAL_LABELS.createdAt)
        const patientHeadCircumference = getDefaultHead(headCircumferenceId, head)
        vitalId && updateHandler({ id: vitalId, patientHeadCircumference })
        break;
      case VITAL_LABELS.PatientHeight:
        setType(VITAL_LABELS.createdAt)
        const PatientHeight = getDefaultHeight(heightId, height)
        const PatientBMI = setPatientBMI(weight, height)
        vitalId && updateHandler({ id: vitalId, PatientHeight, PatientBMI })
        break;
      case VITAL_LABELS.PatientWeight:
        setType(VITAL_LABELS.createdAt)
        const PatientWeight = getDefaultWeight(weightId, weight)
        const patientBmi = setPatientBMI(weight, height)
        vitalId && updateHandler({ id: vitalId, PatientWeight, PatientBMI: patientBmi })
        break;
      case VITAL_LABELS.smokingStatus:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, smokingStatus: smokingStatusId as SmokingStatus })
        break;
      case VITAL_LABELS.bloodPressure:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, systolicBloodPressure, diastolicBloodPressure })
        break;
      default:
        break;
    }
  }

  const onSubmit: SubmitHandler<VitalFormInput> = (data) => {
    updateVitalHandler(data)
  }

  const setPatientBMI = (PatientWeight: string, PatientHeight: string) => {
    const patientHeight = parseFloat(PatientHeight);
    const patientWeight = parseFloat(PatientWeight);
    let height = 0;
    let weight = 0;

    switch (heightId) {
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

    switch (weightId) {
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
    return Number.isNaN(bmi) ? '' : bmi?.toString()
  }

  useEffect(() => {
    setVitalId('')
    setType(VITAL_LABELS.createdAt)
  }, [heightId, weightId, headCircumferenceId, feverId])

  return (
    <TableContainer>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table>
            <TableHead>
              <TableRow>
                {patientVitals?.map((vital) => {
                  const { createdAt } = vital || {}

                  return (renderTh(getFormattedDateTime(createdAt || ''), 'left', false, '', true))
                })}
              </TableRow>
            </TableHead>

            {!!patientVitals && patientVitals.length > 0 && (
              <TableBody>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, pulseRate } = item || {};

                    return vitalId === id && type === VITAL_LABELS.pulseRate ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="pulseRate"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={handleSubmit(onSubmit)}
                          notStep
                          isHelperText
                          autoFocus
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-pulseRate-${i}-${pulseRate}`}
                        scope="row" onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || '', VITAL_LABELS.pulseRate, pulseRate || '')}>
                        <Typography>
                          {pulseRate || DASHES}
                        </Typography>
                      </TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, respiratoryRate } = item || {};

                    return vitalId === id && type === VITAL_LABELS.respiratoryRate ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="respiratoryRate"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={handleSubmit(onSubmit)}
                          notStep
                          isHelperText
                          autoFocus
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-respiratoryRate-${i}-${respiratoryRate}`} scope="row"
                        onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || "", VITAL_LABELS.respiratoryRate, respiratoryRate || '')}
                      >{respiratoryRate || DASHES}</TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, systolicBloodPressure, diastolicBloodPressure } = item || {};

                    return vitalId === id && type === VITAL_LABELS.bloodPressure ?
                      <TableCell className={classes.input}>
                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                          <InputController
                            fieldType="number"
                            controllerName="systolicBloodPressure"
                            controllerLabel={''}
                            placeholder={'e.g 120'}
                            margin={'none'}
                            onBlur={handleSubmit(onSubmit)}
                            notStep
                            isHelperText

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
                            onBlur={handleSubmit(onSubmit)}
                            notStep
                            isHelperText

                          />
                        </Box>
                      </TableCell> :
                      (<TableCell key={`${id}-bloodPressure-${i}-${diastolicBloodPressure}`} scope="row"
                        onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || "", VITAL_LABELS.bloodPressure,
                          systolicBloodPressure || '', diastolicBloodPressure || '')}
                      >
                        {(systolicBloodPressure && `${systolicBloodPressure}/${diastolicBloodPressure}`) || DASHES}
                      </TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, oxygenSaturation } = item || {};
                    return vitalId === id && type === VITAL_LABELS.oxygenSaturation ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="oxygenSaturation"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={handleSubmit(onSubmit)}
                          notStep
                          isHelperText
                          autoFocus
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-oxygenSaturation-${i}-${oxygenSaturation}`} scope="row"
                        onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || "", VITAL_LABELS.oxygenSaturation, oxygenSaturation || '')}
                      >{oxygenSaturation || DASHES}</TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, PatientHeight, PatientWeight } = item || {};
                    const height = roundOffUpto2Decimal(getHeightValue(PatientHeight || ''))
                    const weight = roundOffUpto2Decimal(getWeightValue(PatientWeight || ''))

                    return vitalId === id && type === VITAL_LABELS.PatientHeight ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="PatientHeight"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={handleSubmit(onSubmit)}
                          notStep
                          isHelperText
                          autoFocus
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-PatientHeight-${i}-${PatientHeight}`} scope="row"
                        onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || "", VITAL_LABELS.PatientHeight, height, weight)}
                      >
                        {height || DASHES}
                      </TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, PatientWeight, PatientHeight } = item || {};
                    const height = roundOffUpto2Decimal(getHeightValue(PatientHeight || ''))
                    const weight = roundOffUpto2Decimal(getWeightValue(PatientWeight || ''))
                    return vitalId === id && type === VITAL_LABELS.PatientWeight ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="PatientWeight"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={handleSubmit(onSubmit)}
                          notStep
                          isHelperText
                          autoFocus
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-PatientWeight-${i}-${PatientWeight}`} scope="row"
                        onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || "", VITAL_LABELS.PatientWeight, weight, height)}
                      >
                        {weight || DASHES}
                      </TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, PatientBMI } = item || {};
                    return (<TableCell key={`${id}-PatientBMI-${i}-${PatientBMI}`} scope="row">{roundOffUpto2Decimal(PatientBMI) || DASHES}</TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, PainRange } = item || {};

                    return vitalId === id && type === VITAL_LABELS.PainRange ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="PainRange"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={handleSubmit(onSubmit)}
                          notStep
                          isHelperText
                          autoFocus
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-PainRange-${i}-${PainRange}`} scope="row"
                        onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || "", VITAL_LABELS.PainRange, PainRange || '')}
                      >{PainRange || DASHES}</TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, smokingStatus } = item || {};
                    const status = formatValue(smokingStatus || "")

                    return vitalId === id && type === VITAL_LABELS.smokingStatus ?
                      <TableCell className={classes.input}>
                        <Selector
                          name="smokingStatus"
                          label={''}
                          value={EMPTY_OPTION}
                          options={MAPPED_SMOKING_STATUS}
                          margin={'none'}
                          onBlur={handleSubmit(onSubmit)}
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-smokingStatus-${i}-${smokingStatus}`} scope="row"
                        onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || "", VITAL_LABELS.smokingStatus, smokingStatus || '', status)}
                      >
                        <Typography noWrap>
                          {status || DASHES}
                        </Typography>
                      </TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, patientHeadCircumference } = item || {};
                    const head = roundOffUpto2Decimal(getHeadValue(patientHeadCircumference || ''))

                    return vitalId === id && type === VITAL_LABELS.patientHeadCircumference ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="patientHeadCircumference"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={handleSubmit(onSubmit)}
                          notStep
                          isHelperText
                          autoFocus
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-headCircumference-${i}-${patientHeadCircumference}`} scope="row"
                        onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || "", VITAL_LABELS.patientHeadCircumference, head)}
                      >
                        <Typography>
                          {head || DASHES}
                        </Typography>
                      </TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, patientTemperature } = item || {};
                    const fever = roundOffUpto2Decimal(getFeverValue(patientTemperature || ''))
                    return vitalId === id && type === VITAL_LABELS.patientTemperature ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="patientTemperature"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={handleSubmit(onSubmit)}
                          notStep
                          isHelperText
                          autoFocus
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-patientTemperature-${i}-${patientTemperature}`} scope="row"
                        onDoubleClick={shouldDisableEdit ? () => { } : () => editHandler(id || "", VITAL_LABELS.patientTemperature, fever)}>
                        <Typography>
                          {fever || DASHES}
                        </Typography>
                      </TableCell>)
                  })}
                </TableRow>
              </TableBody>
            )}
          </Table>
        </form>
      </FormProvider>
    </TableContainer>
  )
}
