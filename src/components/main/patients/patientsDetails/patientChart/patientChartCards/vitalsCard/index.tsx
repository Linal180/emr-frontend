// packages block
import { FC, useState } from 'react';
import { Box, Grid } from "@material-ui/core";
// components block
import PatientCardComponent from "../PatientCardComponent";
// interfaces, graphql, constants block /styles
import { GeneralFormProps } from '../../../../../../../interfacesTypes';
import {
  VITALS_TEXT,
} from "../../../../../../../constants";

const VitalsCards: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const [isVitals,] = useState<boolean>(true)

  const PatientChartingData = [
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
    {
      title: "Allergies",
      description: "Lorem ipsum",
      date: "25-11-22"
    },
  ]

  return (
    <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
      <Grid container spacing={3}>
        <Grid md={8} item>
          <PatientCardComponent cardTitle={VITALS_TEXT} hasAdd cardChartingData={PatientChartingData} vitalsCard={isVitals} />

          <Box pb={3} />

        </Grid>
      </Grid>
    </Box>
  );
};

export default VitalsCards;
