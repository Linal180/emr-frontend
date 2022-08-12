import { Table, TableBody, TableHead, TableRow } from "@material-ui/core"
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { DATE, IN_TEXT, KG_TEXT, VITAL_LABELS } from "../../../../../constants"
import { TempUnitType } from "../../../../../generated/graphql"
import { formatValue, renderTh } from "../../../../../utils"

export const VitalsLabels = () => {
  const getVitalLabel = (label: VITAL_LABELS) => {
    switch (label) {
      case VITAL_LABELS.PatientHeight:
        return `(${IN_TEXT})`;

      case VITAL_LABELS.PatientWeight:
        return `(${KG_TEXT})`;

      case VITAL_LABELS.patientHeadCircumference:
        return `(${IN_TEXT})`;

      case VITAL_LABELS.patientTemperature:
        return `(${formatValue(TempUnitType.DegF)})`;

      default:
        return '';
    }
  }

  return (
    <Table>
      <TableHead>
        <TableRow className="vitals-header">
          {renderTh(DATE)}
        </TableRow>
      </TableHead>

      <TableBody>
        {Object.values(VITAL_LABELS).map(label => {
          const unit = getVitalLabel(label)

          return label && <TableRow className="vitals-column">
            {renderTh(`${label} ${unit}`, 'left', false, '', true)}
          </TableRow>
        })}
      </TableBody>
    </Table>
  )
}
