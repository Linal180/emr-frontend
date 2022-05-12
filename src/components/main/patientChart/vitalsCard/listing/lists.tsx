// packages block
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import { Table, TableBody, TableCell, TableRow, TableHead, Typography, TableContainer, Box } from '@material-ui/core';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
// components
import Selector from '../../../../common/Selector';
import InputController from '../../../../../controller';
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { HeadCircumferenceType, UnitType, WeightType, TempUnitType, SmokingStatus, useUpdatePatientVitalMutation, UpdateVitalInput } from '../../../../../generated/graphql';
import { VitalFormInput, VitalListingTableProps } from '../../../../../interfacesTypes';
import { DASHES, EMPTY_OPTION, MAPPED_SMOKING_STATUS, VITAL_LABELS } from '../../../../../constants';
import {
  formatValue, getFormattedDateTime, inchesToCentimeter, renderTh, kilogramToPounds, kilogramToOunce,
  fahrenheitToCelsius
} from '../../../../../utils';
import { patientVitalSchema } from '../../../../../validationSchemas';
import { usePatientVitalFormStyles } from '../../../../../styles/patientVitalsStyles';
import { SlashIcon } from '../../../../../assets/svgs';

export const VitalListingTable = ({ patientVitals, patientStates, setPatientVitals }: VitalListingTableProps) => {

  const { heightUnit: { id: heightId }, weightUnit: { id: weightId }, headCircumferenceUnit: {
    id: headCircumferenceId }, feverUnit: { id: feverId } } = patientStates;
  const methods = useForm<VitalFormInput>({ mode: "all", resolver: yupResolver(patientVitalSchema) });
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
      return DASHES;
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
      return DASHES
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
      return DASHES
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
      return DASHES
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
        break;
      case VITAL_LABELS.PatientWeight:
        setValue('PatientWeight', val)
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
    const { pulseRate, PainRange, respiratoryRate, patientTemperature, oxygenSaturation, diastolicBloodPressure,
      patientHeadCircumference, systolicBloodPressure, PatientHeight, PatientWeight, smokingStatus } = data || {}
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
        vitalId && updateHandler({ id: vitalId, patientTemperature })
        break;
      case VITAL_LABELS.oxygenSaturation:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, oxygenSaturation })
        break;
      case VITAL_LABELS.patientHeadCircumference:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, patientHeadCircumference })
        break;
      case VITAL_LABELS.PatientHeight:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, PatientHeight })
        break;
      case VITAL_LABELS.PatientWeight:
        setType(VITAL_LABELS.createdAt)
        vitalId && updateHandler({ id: vitalId, PatientWeight })
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
                          onBlur={() => handleSubmit(onSubmit)}
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-pulseRate-${i}-${pulseRate}`}
                        scope="row" onDoubleClick={() => editHandler(id || '', VITAL_LABELS.pulseRate, pulseRate || '')}>
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
                          onBlur={() => handleSubmit(onSubmit)}
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-respiratoryRate-${i}-${respiratoryRate}`} scope="row"
                        onDoubleClick={() => editHandler(id || "", VITAL_LABELS.respiratoryRate, respiratoryRate || '')}
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
                            onBlur={() => handleSubmit(onSubmit)}
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
                            onBlur={() => handleSubmit(onSubmit)}
                          />
                        </Box>
                      </TableCell> :
                      (<TableCell key={`${id}-bloodPressure-${i}-${diastolicBloodPressure}`} scope="row"
                        onDoubleClick={() => editHandler(id || "", VITAL_LABELS.bloodPressure,
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
                          onBlur={() => handleSubmit(onSubmit)}
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-oxygenSaturation-${i}-${oxygenSaturation}`} scope="row"
                        onDoubleClick={() => editHandler(id || "", VITAL_LABELS.oxygenSaturation, oxygenSaturation || '')}
                      >{oxygenSaturation || DASHES}</TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, PatientHeight } = item || {};
                    const height = getHeightValue(PatientHeight || '')
                    return vitalId === id && type === VITAL_LABELS.PatientHeight ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="PatientHeight"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={() => handleSubmit(onSubmit)}
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-PatientHeight-${i}-${PatientHeight}`} scope="row"
                        onDoubleClick={() => editHandler(id || "", VITAL_LABELS.PatientHeight, height?.toString())}
                      >
                        {height}
                      </TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, PatientWeight } = item || {};
                    const weight = getWeightValue(PatientWeight || '')
                    return vitalId === id && type === VITAL_LABELS.PatientWeight ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="PatientWeight"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={() => handleSubmit(onSubmit)}
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-PatientWeight-${i}-${PatientWeight}`} scope="row"
                        onDoubleClick={() => editHandler(id || "", VITAL_LABELS.PatientWeight, weight?.toString())}
                      >
                        {weight}
                      </TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, PatientBMI } = item || {};
                    return (<TableCell key={`${id}-PatientBMI-${i}-${PatientBMI}`} scope="row">{PatientBMI || DASHES}</TableCell>)
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
                          onBlur={() => handleSubmit(onSubmit)}
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-PainRange-${i}-${PainRange}`} scope="row"
                        onDoubleClick={() => editHandler(id || "", VITAL_LABELS.PainRange, PainRange || '')}
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
                          onBlur={() => handleSubmit(onSubmit)}
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-smokingStatus-${i}-${smokingStatus}`} scope="row"
                        onDoubleClick={() => editHandler(id || "", VITAL_LABELS.smokingStatus, smokingStatus || '', status)}
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
                    const head = getHeadValue(patientHeadCircumference || '')

                    return vitalId === id && type === VITAL_LABELS.patientHeadCircumference ?
                      <TableCell className={classes.input}>
                        <InputController
                          fieldType="number"
                          controllerName="patientHeadCircumference"
                          controllerLabel={''}
                          margin={'none'}
                          onBlur={() => handleSubmit(onSubmit)}
                        />
                      </TableCell> :
                      (<TableCell key={`${id}-headCircumference-${i}-${patientHeadCircumference}`} scope="row"
                        onDoubleClick={() => editHandler(id || "", VITAL_LABELS.smokingStatus, head?.toString())}
                      >
                        <Typography>
                          {head}
                        </Typography>
                      </TableCell>)
                  })}
                </TableRow>

                <TableRow>
                  {patientVitals?.map((item, i) => {
                    const { id, patientTemperature } = item || {};
                    return (<TableCell key={`${id}-patientTemperature-${i}-${patientTemperature}`} scope="row">{getFeverValue(patientTemperature || '')}</TableCell>)
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