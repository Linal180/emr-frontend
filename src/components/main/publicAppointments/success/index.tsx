
import { Box, Button, Card, Typography } from '@material-ui/core';
import { successStyles } from '../../../../styles/publicAppointmentStyles/successStyles';
import { WHITE_TWO } from '../../../../theme';

const AppointmentSuccessComponent = () => {
  const classes = successStyles();

  return (
    <Box bgcolor={WHITE_TWO}
      minHeight="100vh"
      p={3.75}
      sx={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Card>
        <Box minHeight="580px" className={classes.container}>
          <Box maxWidth="700px">
            <Typography component="h3" variant="h3">Thank you! When you arrive, Please make sure to have these documents with you.</Typography>
          </Box>

          <Box pt={3}>
            <ul>
              <li><Typography component="h5" variant="h5">Please bring a valid photo ID and any insurance cards (if applicable).</Typography></li>
              <li><Typography component="h5" variant="h5">Please consult your personal benefit plan details for any out-of-pocket costs which might apply (if applicable).</Typography></li>
            </ul>
          </Box>

          <Box display="flex" gridGap={20} mt={3}>
            <Button type="submit" variant="contained">
              Cancel Booking
            </Button>
            <Button type="submit" variant="contained" className='blue-button'>
              Confirm it!
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default AppointmentSuccessComponent;
