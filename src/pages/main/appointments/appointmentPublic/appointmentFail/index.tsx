// packages block
import { Box, Button, Card, Typography } from '@material-ui/core';
// styles and theme block
import { WHITE_TWO } from '../../../../../theme';
import { appointmentFailStyles } from '../../../../../styles/publicAppointment/appointmentFail';

const index = () => {
  const classes = appointmentFailStyles();

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
            <Typography component="h3" variant="h3" >This facility is not available. Please connect with your administrator</Typography>
          </Box>

          <Box display="flex" gridGap={20} mt={3}>
            <Button type="submit" variant="contained">
              Cancel Booking
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default index;
