import { Table, TableBody, TableHead, TableRow } from "@material-ui/core"
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import {
  PULSE_TEXT, RESPIRATORY_RATE_TEXT, VITALS_TEXT, BLOOD_PRESSURE_TEXT, OXYGEN_SATURATION_TEXT,
  HEIGHT_TEXT, WEIGHT_TEXT, BMI_TEXT, PAIN_TEXT, SMOKING_STATUS_TEXT, HEAD_CIRCUMFERENCE, FEVER_TEXT
} from "../../../../../constants"
import { renderTh } from "../../../../../utils"

export const VitalsLabels = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {renderTh(VITALS_TEXT)}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow >
          {renderTh(`${PULSE_TEXT} (bpm)`)}
        </TableRow>
        <TableRow>
          {renderTh(`${RESPIRATORY_RATE_TEXT} (rpm)`)}
        </TableRow>
        <TableRow>
          {renderTh(`${BLOOD_PRESSURE_TEXT} (mmHg)`)}
        </TableRow>
        <TableRow>
          {renderTh(`${OXYGEN_SATURATION_TEXT} (%)`)}
        </TableRow>
        <TableRow>
          {renderTh(`${HEIGHT_TEXT} (in)`)}
        </TableRow>
        <TableRow>
          {renderTh(`${WEIGHT_TEXT} (in)`)}
        </TableRow>
        <TableRow>
          {renderTh(`${BMI_TEXT} (kg/m2)`)}
        </TableRow>
        <TableRow>
          {renderTh(`${PAIN_TEXT} (1-10)`)}
        </TableRow>
        <TableRow>
          {renderTh(`${SMOKING_STATUS_TEXT}`)}
        </TableRow>
        <TableRow>
          {renderTh(`${HEAD_CIRCUMFERENCE} (in)`)}
        </TableRow>
        <TableRow>
          {renderTh(`${FEVER_TEXT} (<sup>o</sup>C)`, 'left', true)}
        </TableRow>
      </TableBody>
    </Table>
  )
}
