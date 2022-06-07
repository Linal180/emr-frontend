// packages block
import { FC, useState } from 'react';
import { Grid } from "@material-ui/core";
// components block
import AllergyList from '../allergies/list';
import PatientCardComponent from "./PatientCardComponent";
import ProblemList from '../problems/list';
// interfaces, graphql, constants block /styles
import { PATIENT_CHARTING_DATA, VITALS_TEXT } from "../../../../constants";
import { ChartComponentProps } from '../../../../interfacesTypes';

const ChartCards: FC<ChartComponentProps> = ({ shouldDisableEdit }): JSX.Element => {
  const [isVitals] = useState<boolean>(true)

  return (
    <Grid container spacing={3}>
      <Grid item md={4} sm={12} xs={12}>
        <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd={!shouldDisableEdit} cardChartingData={PATIENT_CHARTING_DATA} vitalsCard={isVitals} />
      </Grid>

      <Grid item md={4} sm={12} xs={12}>
        <AllergyList shouldDisableEdit={shouldDisableEdit} />
      </Grid>

      <Grid item md={4} sm={12} xs={12}>
        <ProblemList shouldDisableEdit={shouldDisableEdit} />
      </Grid>
    </Grid>
  );
};
export default ChartCards;
