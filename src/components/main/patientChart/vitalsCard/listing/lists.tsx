// packages block
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { FormEditNewIcon } from '../../../../../assets/svgs';
import { DASHES } from '../../../../../constants';
import {
  HeadCircumferenceType, PatientVitalPayload, TempUnitType, UnitType, WeightType
} from '../../../../../generated/graphql';
import { VitalListingTableProps } from '../../../../../interfacesTypes';
import {
  convertDateFromUnix,
  fahrenheitToCelsius, formatValue, inchesToCentimeter, kilogramToOunce, kilogramToPounds,
  renderTh, roundOffUpto2Decimal
} from '../../../../../utils';

export const VitalListingTable = ({ patientVitals, patientStates, setVitalToEdit, setOpen }: VitalListingTableProps) => {
  const { heightUnit: { id: heightId }, weightUnit: { id: weightId }, headCircumferenceUnit: {
    id: headCircumferenceId }, feverUnit: { id: feverId } } = patientStates;

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

  const renderIcon = (vital: PatientVitalPayload['patientVital']) => {
    return (
      <IconButton className='py-0 ml-5' onClick={() => {
        setVitalToEdit && setVitalToEdit(vital);
        setOpen && setOpen(true)
      }}>
        <FormEditNewIcon />
      </IconButton>
    )
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {patientVitals?.map((vital) => {
              const { createdAt } = vital || {}
              return renderTh(`${convertDateFromUnix(createdAt || '', 'ddd')} ${convertDateFromUnix(createdAt || '', 'MM/DD/YYYY')}`, 'left', false, '', true, () => renderIcon(vital))
            })}
          </TableRow>
        </TableHead>

        {!!patientVitals && patientVitals.length > 0 && (
          <TableBody>
            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, pulseRate } = item || {};
                return (<TableCell key={`${id}-pulseRate-${i}-${pulseRate}`}
                  scope="row">
                  {pulseRate || DASHES}
                </TableCell>)
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, respiratoryRate } = item || {};
                return (<TableCell key={`${id}-respiratoryRate-${i}-${respiratoryRate}`} scope="row"
                >{respiratoryRate || DASHES}</TableCell>)
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, systolicBloodPressure, diastolicBloodPressure } = item || {};
                return (<TableCell key={`${id}-bloodPressure-${i}-${diastolicBloodPressure}`} scope="row"
                >
                  {(systolicBloodPressure && `${systolicBloodPressure}/${diastolicBloodPressure}`) || DASHES}
                </TableCell>)
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, oxygenSaturation } = item || {};
                return (<TableCell key={`${id}-oxygenSaturation-${i}-${oxygenSaturation}`} scope="row"
                >{oxygenSaturation || DASHES}</TableCell>)
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, PatientHeight } = item || {};
                const height = roundOffUpto2Decimal(getHeightValue(PatientHeight || ''))
                return (<TableCell key={`${id}-PatientHeight-${i}-${PatientHeight}`} scope="row">
                  {height || DASHES}
                </TableCell>)
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, PatientWeight } = item || {};
                const weight = roundOffUpto2Decimal(getWeightValue(PatientWeight || ''))
                return (<TableCell key={`${id}-PatientWeight-${i}-${PatientWeight}`} scope="row">
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
                return (<TableCell key={`${id}-PainRange-${i}-${PainRange}`} scope="row"
                >{PainRange || DASHES}</TableCell>)
              })}
            </TableRow>

            <TableRow>
              {patientVitals?.map((item, i) => {
                const { id, smokingStatus } = item || {};
                const status = formatValue(smokingStatus || "")
                return (<TableCell key={`${id}-smokingStatus-${i}-${smokingStatus}`} scope="row">
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
                return (<TableCell key={`${id}-headCircumference-${i}-${patientHeadCircumference}`} scope="row">
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
                return (<TableCell key={`${id}-patientTemperature-${i}-${patientTemperature}`} scope="row">
                  <Typography>
                    {fever || DASHES}
                  </Typography>
                </TableCell>)
              })}
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  )
}
