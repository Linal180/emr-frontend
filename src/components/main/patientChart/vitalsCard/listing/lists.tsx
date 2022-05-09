// packages block
import { Table, TableBody, TableCell, TableRow, TableHead, Typography } from '@material-ui/core'
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { VitalListingTableProps } from '../../../../../interfacesTypes';
import { getFormattedDateTime, renderTh } from '../../../../../utils';

export const VitalListingTable = ({ patientVitals }: VitalListingTableProps) => {

  return (
    <Table>
      <TableHead>
        <TableRow>
          {patientVitals?.map((vital) => {
            const { createdAt,vitalCreationDate } = vital || {}
            return (renderTh(getFormattedDateTime( createdAt || '')))
          })}
        </TableRow>
      </TableHead>
      {!!patientVitals && patientVitals.length > 0 && (
        <TableBody>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, respiratoryRate } = item || {};
              return (<TableCell key={`${id}-respiratoryRate-${i}-${respiratoryRate}`} scope="row">
                <Typography>
                  {respiratoryRate || '----'}
                </Typography>
              </TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, respiratoryRate } = item || {};
              return (<TableCell key={`${id}-respiratoryRate-${i}-${respiratoryRate}`} scope="row">{respiratoryRate || '----'}</TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, bloodPressure } = item || {};
              return (<TableCell key={`${id}-bloodPressure-${i}-${bloodPressure}`} scope="row">{bloodPressure || '----'}</TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, oxygenSaturation } = item || {};
              return (<TableCell key={`${id}-oxygenSaturation-${i}-${oxygenSaturation}`} scope="row">{oxygenSaturation || '----'}</TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, PatientHeight } = item || {};
              return (<TableCell key={`${id}-PatientHeight-${i}-${PatientHeight}`} scope="row">{PatientHeight || '----'}</TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, PatientWeight } = item || {};
              return (<TableCell key={`${id}-PatientWeight-${i}-${PatientWeight}`} scope="row">{PatientWeight || '----'}</TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, PatientBMI } = item || {};
              return (<TableCell key={`${id}-PatientBMI-${i}-${PatientBMI}`} scope="row">{PatientBMI || '----'}</TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, PainRange } = item || {};
              return (<TableCell key={`${id}-PainRange-${i}-${PainRange}`} scope="row">{PainRange || '----'}</TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, smokingStatus } = item || {};
              return (<TableCell key={`${id}-smokingStatus-${i}-${smokingStatus}`} scope="row">{smokingStatus || '----'}</TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, headCircumference } = item || {};
              return (<TableCell key={`${id}-headCircumference-${i}-${headCircumference}`} scope="row">
                <Typography>
                  {headCircumference || '----'}
                </Typography>
              </TableCell>)
            })}
          </TableRow>
          <TableRow >
            {patientVitals?.map((item, i) => {
              const { id, patientTemperature } = item || {};
              return (<TableCell key={`${id}-patientTemperature-${i}-${patientTemperature}`} scope="row">{patientTemperature || '----'}</TableCell>)
            })}
          </TableRow>
        </TableBody>
      )}
    </Table>
  )
}