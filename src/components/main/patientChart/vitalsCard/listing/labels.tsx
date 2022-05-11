import { Table, TableBody, TableHead, TableRow } from "@material-ui/core"
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  PULSE_TEXT, RESPIRATORY_RATE_TEXT, VITALS_TEXT, BLOOD_PRESSURE_TEXT, OXYGEN_SATURATION_TEXT,
  HEIGHT_TEXT, WEIGHT_TEXT, BMI_TEXT, PAIN_TEXT, SMOKING_STATUS_TEXT, HEAD_CIRCUMFERENCE, FEVER_TEXT, BPM_TEXT, RPM_TEXT, MMHG_TEXT, PERCENTAGE, KG_PER_METER_SQUARE_TEXT, ONE_TO_TEN_TEXT
} from "../../../../../constants"
import { VitalsLabelsProps } from "../../../../../interfacesTypes"
import { renderTh } from "../../../../../utils"

export const VitalsLabels = ({ patientStates }: VitalsLabelsProps) => {

  const { heightUnit: { name: heightName }, weightUnit: { name: weightName }, headCircumferenceUnit: {
    name: headCircumferenceName }, feverUnit: { name: feverName } } = patientStates;

  return (
    <Table>
      <TableHead>
        <TableRow>
          {renderTh(VITALS_TEXT)}
        </TableRow>
      </TableHead>

      <TableBody>
        <TableRow>
          {renderTh(`${PULSE_TEXT} (${BPM_TEXT})`)}
        </TableRow>

        <TableRow>
          {renderTh(`${RESPIRATORY_RATE_TEXT} (${RPM_TEXT})`)}
        </TableRow>

        <TableRow>
          {renderTh(`${BLOOD_PRESSURE_TEXT} (${MMHG_TEXT})`)}
        </TableRow>

        <TableRow>
          {renderTh(`${OXYGEN_SATURATION_TEXT} (${PERCENTAGE})`)}
        </TableRow>

        <TableRow>
          {renderTh(`${HEIGHT_TEXT} (${heightName})`)}
        </TableRow>

        <TableRow>
          {renderTh(`${WEIGHT_TEXT} (${weightName})`)}
        </TableRow>

        <TableRow>
          {renderTh(`${BMI_TEXT} (${KG_PER_METER_SQUARE_TEXT})`)}
        </TableRow>

        <TableRow>
          {renderTh(`${PAIN_TEXT} (${ONE_TO_TEN_TEXT})`)}
        </TableRow>

        <TableRow>
          {renderTh(`${SMOKING_STATUS_TEXT}`)}
        </TableRow>

        <TableRow>
          {renderTh(`${HEAD_CIRCUMFERENCE} (${headCircumferenceName})`)}
        </TableRow>

        <TableRow>
          {renderTh(`${FEVER_TEXT} (${feverName})`)}
        </TableRow>
      </TableBody>
    </Table>
  )
}
