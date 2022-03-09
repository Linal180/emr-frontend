// packages block
import { FC } from "react";
// utils, styles  block, constants
import { WHITE_TWO } from '../../../../theme';
import { Box, Card, colors, Typography } from '@material-ui/core';
import { APPOINTMENT_CANCEL, APPOINTMENT_CANCEL_TEXT } from "../../../../constants";
import { confirmationStyles } from "../../../../styles/publicAppointmentStyles/confirmationStyles"

const AppointmentCancelComponent: FC = (): JSX.Element => {
  const classes = confirmationStyles();

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
      <Card>
        <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4"><strong>{APPOINTMENT_CANCEL}</strong></Typography>
        </Box>

        <Box className={classes.container}>
          <Typography variant="h5" component="h5">{APPOINTMENT_CANCEL_TEXT}</Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default AppointmentCancelComponent;
