// packages block
import { Table, TableBody, TableCell, TableRow, TableHead, Typography, TableContainer } from '@material-ui/core';
import { DASHES } from '../../../../../constants';
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { HeadCircumferenceType, UnitType, WeightType, TempUnitType } from '../../../../../generated/graphql';
import { VitalListingTableProps } from '../../../../../interfacesTypes';
import {
  formatValue, getFormattedDateTime, inchesToCentimeter, renderTh, kilogramToPounds, kilogramToOunce,
  fahrenheitToCelsius
} from '../../../../../utils';

export const VitalListingTable = ({ patientVitals, patientStates }: VitalListingTableProps) => {

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

  return (
    <TableContainer>
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
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, pulseRate } = item || {};
                return (<TableCell key={`${id}-pulseRate-${i}-${pulseRate}`} scope="row">
                  <Typography>
                    {pulseRate || DASHES}
                  </Typography>
                </TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, respiratoryRate } = item || {};
                return (<TableCell key={`${id}-respiratoryRate-${i}-${respiratoryRate}`} scope="row">{respiratoryRate || DASHES}</TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, systolicBloodPressure, diastolicBloodPressure } = item || {};
                return (<TableCell key={`${id}-bloodPressure-${i}-${diastolicBloodPressure}`} scope="row">
                  {(systolicBloodPressure && `${systolicBloodPressure}/${diastolicBloodPressure}`) || DASHES}
                </TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, oxygenSaturation } = item || {};
                return (<TableCell key={`${id}-oxygenSaturation-${i}-${oxygenSaturation}`} scope="row">{oxygenSaturation || DASHES}</TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, PatientHeight } = item || {};
                return (<TableCell key={`${id}-PatientHeight-${i}-${PatientHeight}`} scope="row">
                  {getHeightValue(PatientHeight || '')}
                </TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, PatientWeight } = item || {};
                return (<TableCell key={`${id}-PatientWeight-${i}-${PatientWeight}`} scope="row">
                  {getWeightValue(PatientWeight || '')}
                </TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, PatientBMI } = item || {};
                return (<TableCell key={`${id}-PatientBMI-${i}-${PatientBMI}`} scope="row">{PatientBMI || DASHES}</TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, PainRange } = item || {};
                return (<TableCell key={`${id}-PainRange-${i}-${PainRange}`} scope="row">{PainRange || DASHES}</TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, smokingStatus } = item || {};
                return (<TableCell key={`${id}-smokingStatus-${i}-${smokingStatus}`} scope="row">
                  {formatValue(smokingStatus || "") || DASHES}</TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, patientHeadCircumference } = item || {};
                return (<TableCell key={`${id}-headCircumference-${i}-${patientHeadCircumference}`} scope="row">
                  <Typography>
                    {getHeadValue(patientHeadCircumference || '')}
                  </Typography>
                </TableCell>)
              })}
            </TableRow>
            <TableRow >
              {patientVitals?.map((item, i) => {
                const { id, patientTemperature } = item || {};
                return (<TableCell key={`${id}-patientTemperature-${i}-${patientTemperature}`} scope="row">{getFeverValue(patientTemperature || '')}</TableCell>)
              })}
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  )
}