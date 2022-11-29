// packages block
import {
  IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@material-ui/core';
import moment from 'moment';
import { useParams } from 'react-router';
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { FormEditNewIcon } from '../../../../../assets/svgs';
import { DASHES, IN_TEXT, KG_TEXT } from '../../../../../constants';
import {
  HeadCircumferenceType, PatientVitalPayload, TempUnitType, UnitType, WeightType
} from '../../../../../generated/graphql';
import { ParamsType, VitalListingTableProps } from '../../../../../interfacesTypes';
import { ActionType } from '../../../../../reducers/patientReducer';
import { formatValue, getFormatDateString, isAbnormalBloodPressureRate, isAbnormalBMI, isAbnormalHeadCircumference, isAbnormalOxygenSaturation, isAbnormalPain, isAbnormalPulseRate, isAbnormalRespiratoryRate, isAbnormalTemperature, renderTh, roundOffUpto2Decimal } from '../../../../../utils';

export const VitalListingTable = ({
  patientStates, shouldDisableEdit, dispatcher }: VitalListingTableProps) => {
  const { appointmentId } = useParams<ParamsType>()
  const { patientVitals } = patientStates;

  const getWeightValue = (weight: string) => {
    if (weight) {
      return parseFloat(weight);
    }
  }

  const getHeightValue = (height: string) => {
    if (height) {
      return parseFloat(height);
    }
  }

  const getHeadValue = (head: string) => {
    if (head) {
      return parseFloat(head);
    }
  }

  const getFeverValue = (fever: string) => {
    if (fever) {
      return parseFloat(fever);
    }
  }

  const editHandler = (vital: PatientVitalPayload['patientVital']) => {
    dispatcher({ type: ActionType.SET_HEIGHT_UNIT, heightUnit: { id: UnitType.Inch, name: IN_TEXT } })
    dispatcher({ type: ActionType.SET_WEIGHT_UNIT, weightUnit: { id: WeightType.Kg, name: KG_TEXT } })
    dispatcher({
      type: ActionType.SET_HEAD_CIRCUMFERENCE_UNIT,
      headCircumferenceUnit: { id: HeadCircumferenceType.Inch, name: IN_TEXT }
    })

    dispatcher({
      type: ActionType.SET_FEVER_UNIT,
      feverUnit: { id: TempUnitType.DegF, name: formatValue(TempUnitType.DegF) }
    })

    dispatcher({ type: ActionType.SET_VITAL_TO_EDIT, vitalToEdit: vital })
    dispatcher({ type: ActionType.SET_OPEN_VITAL, openVital: true })
  }

  const renderIcon = (vital: PatientVitalPayload['patientVital']) =>
    <IconButton className='py-0 ml-5' size='small' onClick={() => editHandler(vital)}>
      <FormEditNewIcon />
    </IconButton>

  const getIsEditIconShown = (vitalCreationDate: string) => {
    if (appointmentId) {
      return !shouldDisableEdit && !moment(moment(vitalCreationDate).format('MM-DD-YYYY')).isBefore(moment().format('MM-DD-YYYY'))
    }

    return true
  }


  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {patientVitals?.map((vital) => {
              const { vitalCreationDate } = vital || {}

              return renderTh(`${getFormatDateString(vitalCreationDate || '', 'MM-DD-YYYY')} `,
                'left', false, '', true, getIsEditIconShown(vitalCreationDate || '') ? () => renderIcon(vital) : () => { })
            })}
          </TableRow>
        </TableHead>

        {!!patientVitals && patientVitals.length > 0 && (
          <TableBody>
            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, pulseRate } = item || {};

                return <TableCell key={`${id}-pulseRate-${i}-${pulseRate}`}
                  scope="row"
                >

                  <Typography variant='body1' className={`h-24 ${isAbnormalPulseRate(pulseRate || '') ? 'danger' : ''}`}>{pulseRate || DASHES}</Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, respiratoryRate } = item || {};
                return <TableCell key={`${id}-respiratoryRate-${i}-${respiratoryRate}`} scope="row">
                  <Typography variant='body1' className={`h-24 ${isAbnormalRespiratoryRate(respiratoryRate || '') ? 'danger' : ''}`}>{respiratoryRate || DASHES}</Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, systolicBloodPressure, diastolicBloodPressure } = item || {};
                return <TableCell key={`${id}-bloodPressure-${i}-${diastolicBloodPressure}`} scope="row">
                  <Typography variant='body1' className={`h-24 ${isAbnormalBloodPressureRate(systolicBloodPressure || '', diastolicBloodPressure || '') ? 'danger' : ''}`}>
                    {(systolicBloodPressure && `${systolicBloodPressure}/${diastolicBloodPressure}`) || DASHES}
                  </Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, oxygenSaturation } = item || {};

                return <TableCell key={`${id}-oxygenSaturation-${i}-${oxygenSaturation}`} scope="row">
                  <Typography variant='body1' className={`h-24 ${isAbnormalOxygenSaturation(oxygenSaturation || '') ? 'danger' : ''}`}>
                    {oxygenSaturation || DASHES}
                  </Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, PatientHeight } = item || {};
                const height = roundOffUpto2Decimal(getHeightValue(PatientHeight || ''))

                return <TableCell key={`${id}-PatientHeight-${i}-${PatientHeight}`} scope="row">
                  <Typography variant='body1' className='h-24'>
                    {height || DASHES}
                  </Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, PatientWeight } = item || {};
                const weight = roundOffUpto2Decimal(getWeightValue(PatientWeight || ''))

                return <TableCell key={`${id}-PatientWeight-${i}-${PatientWeight}`} scope="row">
                  <Typography variant='body1' className='h-24'>
                    {weight || DASHES}
                  </Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, PatientBMI } = item || {};

                return <TableCell key={`${id}-PatientBMI-${i}-${PatientBMI}`} scope="row">
                  <Typography variant='body1' className={`h-24 ${isAbnormalBMI(PatientBMI || '') ? 'danger' : ''}`}>
                    {roundOffUpto2Decimal(PatientBMI) || DASHES}
                  </Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, PainRange } = item || {};

                return <TableCell key={`${id}-PainRange-${i}-${PainRange}`} scope="row">
                  <Typography variant='body1' className={`h-24 ${isAbnormalPain(PainRange || '') ? 'danger' : ''}`}>
                    {roundOffUpto2Decimal(PainRange) || DASHES}
                  </Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, smokingStatus } = item || {};
                const status = formatValue(smokingStatus || "")

                return <TableCell key={`${id}-smokingStatus-${i}-${smokingStatus}`} scope="row">
                  <Typography noWrap variant='body1' className='h-24'>
                    {status || DASHES}
                  </Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, patientHeadCircumference } = item || {};
                const head = roundOffUpto2Decimal(getHeadValue(patientHeadCircumference || ''))

                return <TableCell key={`${id}-headCircumference-${i}-${patientHeadCircumference}`} scope="row">
                  <Typography variant='body1' className={`h-24 ${isAbnormalHeadCircumference(head || '') ? 'danger' : ''}`}>
                    {head || DASHES}
                  </Typography>
                </TableCell>
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, patientTemperature } = item || {};
                const fever = roundOffUpto2Decimal(getFeverValue(patientTemperature || ''))

                return <TableCell key={`${id}-patientTemperature-${i}-${patientTemperature}`} scope="row">
                  <Typography variant='body1' className={`h-24 ${isAbnormalTemperature(fever || '') ? 'danger' : ''}`}>
                    {fever || DASHES}
                  </Typography>
                </TableCell>
              })}
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  )
}
