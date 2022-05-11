// packages block
import { FC, useState } from 'react';
import { Grid } from "@material-ui/core";
// components block
import AllergyList from '../allergies/list';
import PatientCardComponent from "./PatientCardComponent";
// interfaces, graphql, constants block /styles
import { PATIENT_CHARTING_DATA, VITALS_TEXT } from "../../../../constants";
import ProblemList from '../problems/list';

const ChartCards: FC = (): JSX.Element => {
  const [isVitals] = useState<boolean>(true)

  return (
    <Grid container spacing={3}>
      <Grid item md={4} sm={12} xs={12}>
        <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd cardChartingData={PATIENT_CHARTING_DATA} vitalsCard={isVitals} />
      </Grid>

      <Grid item md={4} sm={12} xs={12}>
        <AllergyList  />
      </Grid>

      <Grid item md={4} sm={12} xs={12}>
        <ProblemList />
      </Grid>
    </Grid>
  );
};
export default ChartCards;
