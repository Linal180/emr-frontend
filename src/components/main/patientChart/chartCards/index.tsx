// packages block
import { FC, useState } from 'react';
import { Box, Grid } from "@material-ui/core";
// components block
import AllergyList from '../allergies/list';
import PatientCardComponent from "./PatientCardComponent";
// interfaces, graphql, constants block /styles
import { PATIENT_CHARTING_DATA, PROBLEMS_TEXT, VITALS_TEXT } from "../../../../constants";
import ProblemList from '../problems/list';

const ChartCards: FC = (): JSX.Element => {
  const [isVitals] = useState<boolean>(true)

  return (
    <Grid container spacing={3}>
      <Grid md={8} item>
        <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} vitalsCard={isVitals} />

        <Box pb={3} />

        <Grid container spacing={3}>
          <Grid md={6} item>
            {/* <PatientCardComponent cardTitle={ALLERGIES_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}

            <AllergyList  />

            <Box pb={3} />

            {/* <PatientCardComponent cardTitle={FAMILY_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}

            <Box pb={3} />

            {/* <PatientCardComponent cardTitle={MEDICAL_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}
          </Grid>

          <Grid md={6} item>
            {/* <PatientCardComponent cardTitle={PROBLEMS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}
            <ProblemList />
            
            <Box pb={3} />

            {/* <PatientCardComponent cardTitle={VACCINE_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}

            <Box pb={3} />

            {/* <PatientCardComponent cardTitle={SOCIAL_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}

            <Box pb={3} />

            {/* <PatientCardComponent cardTitle={IMPLANT_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}
          </Grid>
        </Grid>
      </Grid>

      <Grid md={4} item>
        {/* <PatientCardComponent cardTitle={MEDICATIONS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}

        <Box pb={3} />

        {/* <PatientCardComponent cardTitle={LAB_RESULTS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}

        <Box pb={3} />

        {/* <PatientCardComponent cardTitle={SURGICAL_HISTORY_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}

        <Box pb={3} />

        {/* <PatientCardComponent cardTitle={CARE_PLAN_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} /> */}
      </Grid>
    </Grid>
  );
};
export default ChartCards;
