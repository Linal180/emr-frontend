
import { Box, Button, Card, colors, Typography } from '@material-ui/core';
import {
  APPOINTMENT_CONFIRMED, APPOINTMENT_SUCCESS_HEADING, APPOINTMENT_SUCCESS_SUBHEADING,
  CANCEL_APPOINTMENT_TEXT, CONTINUE_TEXT
} from '../../../../constants';
import { successStyles } from '../../../../styles/publicAppointmentStyles/successStyles';
import { GRAY_FIVE, WHITE_TWO } from '../../../../theme';

const AppointmentSuccessComponent = () => {
  const classes = successStyles();

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
      <Card>
        <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4"><strong>{APPOINTMENT_CONFIRMED}</strong></Typography>
        </Box>

        <Box className={classes.container}>
          <Typography variant="h4">{APPOINTMENT_SUCCESS_HEADING}</Typography>

          <Box mb={3} />

          <Typography component="h5" variant="h5">{APPOINTMENT_SUCCESS_SUBHEADING}</Typography>
        </Box>

        <Box mt={5} py={4} p={3} bgcolor={GRAY_FIVE} display="flex" justifyContent="flex-end" flexWrap="wrap">
          <Button variant="outlined" color="secondary">{CANCEL_APPOINTMENT_TEXT}</Button>

          <Box p={1} />

          <Button variant="contained" color="primary">{CONTINUE_TEXT}</Button>
        </Box>
      </Card>
    </Box>
  );
};

export default AppointmentSuccessComponent;
