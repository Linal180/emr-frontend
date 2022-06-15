import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core"
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { VITALS_TEXT, VITAL_LABELS } from "../../../../../constants"
import { VitalsLabelsProps } from "../../../../../interfacesTypes"
import { renderTh } from "../../../../../utils"

export const VitalsLabels = ({ patientStates }: VitalsLabelsProps) => {

  const { heightUnit: { name: heightName }, weightUnit: { name: weightName }, headCircumferenceUnit: {
    name: headCircumferenceName }, feverUnit: { name: feverName } } = patientStates;

  const getVitalLabel = (label: VITAL_LABELS) => {
    switch (label) {
      case VITAL_LABELS.PatientHeight:
        return `(${heightName})`;

      case VITAL_LABELS.PatientWeight:
        return `(${weightName})`;

      case VITAL_LABELS.patientHeadCircumference:
        return `(${headCircumferenceName})`;

      case VITAL_LABELS.patientTemperature:
        return `(${feverName})`;

      default:
        return '';
    }
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          {renderTh(VITALS_TEXT)}
        </TableRow>
      </TableHead>

      <TableBody>
        {Object.values(VITAL_LABELS).map(label => {
          const unit = getVitalLabel(label)

          return label && <TableRow className="vitals-column">
          {renderTh(`${label} ${unit}`,'left',false,'',true)}
        </TableRow>
        })}
      </TableBody>
    </Table>
  )
}
