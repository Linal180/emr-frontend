// packages block
import { FC, useState } from 'react';
import { Box, Grid } from "@material-ui/core";
// components block
import PatientCardComponent from "./PatientCardComponent";
// interfaces, graphql, constants block /styles
import { GeneralFormProps } from '../../../../../interfacesTypes';
import {
  ALLERGIES_TEXT, CARE_PLAN_TEXT, FAMILY_HISTORY_TEXT, IMPLANT_HISTORY_TEXT, LAB_RESULTS_TEXT,
  MEDICAL_HISTORY_TEXT, MEDICATIONS_TEXT, PATIENT_CHARTING_DATA, PROBLEMS_TEXT, SOCIAL_HISTORY_TEXT,
  SURGICAL_HISTORY_TEXT, VACCINE_TEXT, VITALS_TEXT,
} from "../../../../../constants";

const PatientChartCards: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const [isVitals,] = useState<boolean>(true)

  return (
    <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
      <Grid container spacing={3}>
        <Grid md={8} item>
          <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} vitalsCard={isVitals} />

          <Box pb={3} />

          <Grid container spacing={3}>
            <Grid md={6} item>
              <PatientCardComponent cardTitle={ALLERGIES_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />

              <Box pb={3} />
              <PatientCardComponent cardTitle={FAMILY_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />

              <Box pb={3} />

              <PatientCardComponent cardTitle={MEDICAL_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />
            </Grid>

            <Grid md={6} item>
              <PatientCardComponent cardTitle={PROBLEMS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />

              <Box pb={3} />

              <PatientCardComponent cardTitle={VACCINE_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />

              <Box pb={3} />

              <PatientCardComponent cardTitle={SOCIAL_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />

              <Box pb={3} />

              <PatientCardComponent cardTitle={IMPLANT_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />
            </Grid>
          </Grid>
        </Grid>

        <Grid md={4} item>
          <PatientCardComponent cardTitle={MEDICATIONS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />

          <Box pb={3} />

          <PatientCardComponent cardTitle={LAB_RESULTS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />

          <Box pb={3} />

          <PatientCardComponent cardTitle={SURGICAL_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />

          <Box pb={3} />

          <PatientCardComponent cardTitle={CARE_PLAN_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default PatientChartCards;
