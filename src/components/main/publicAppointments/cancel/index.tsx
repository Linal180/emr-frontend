// packages block
import { FC } from "react";
import { Box, Card, Typography } from '@material-ui/core';
// utils, styles  block, constants
import { WHITE_TWO } from '../../../../theme';
import { APPOINTMENT_CANCEL } from "../../../../constants";
import { confirmationStyles } from "../../../../styles/publicAppointmentStyles/confirmationStyles"

const AppointmentCancelComponent: FC = (): JSX.Element => {
  const classes = confirmationStyles();

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Card>
        <Box minHeight="580px" className={classes.container}>
          <Box maxWidth="700px">
            <Typography component="h3" variant="h3">{APPOINTMENT_CANCEL}</Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default AppointmentCancelComponent;
