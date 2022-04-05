// packages block
import { Box, Card, colors, Typography } from '@material-ui/core';
// styles and constants block
import { WHITE_TWO } from '../../../../theme';
import { successStyles } from '../../../../styles/publicAppointmentStyles/successStyles';
import {
  APPOINTMENT_CONFIRMED, APPOINTMENT_SUCCESS_DOCUMENTS_HEADING, APPOINTMENT_SUCCESS_DOCUMENTS_SUBHEADING1,
  APPOINTMENT_SUCCESS_DOCUMENTS_SUBHEADING2,
} from '../../../../constants';

const AppointmentSuccessComponent = () => {
  const classes = successStyles();

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
      <Card>
        <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4"><strong>{APPOINTMENT_CONFIRMED}</strong></Typography>
        </Box>

        <Box className={classes.container}>
          <Typography variant="h4">{APPOINTMENT_SUCCESS_DOCUMENTS_HEADING}</Typography>

          <Box mb={3} />

          <Typography component="h5" variant="h5">
            <ul>
              <li>{APPOINTMENT_SUCCESS_DOCUMENTS_SUBHEADING1}</li>
              <li>{APPOINTMENT_SUCCESS_DOCUMENTS_SUBHEADING2}</li>
            </ul>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default AppointmentSuccessComponent;
