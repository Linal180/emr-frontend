// packages block
import { Box, Card, Typography } from '@material-ui/core';
// styles and theme block
import { WHITE_TWO } from '../../../../theme';
import { failStyles } from '../../../../styles/publicAppointmentStyles/failsStyles';

const FormFailComponent = () => {
  const classes = failStyles();

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
            <Typography component="h3" variant="h3">
              Could not get your form right now. Your facility may be unavailable.
              Please try again later or contact to facility administrator for more information.
              <br />
              <br />
              Thank you!
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default FormFailComponent;
