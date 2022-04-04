// packages block
import { Box, Card, Typography } from '@material-ui/core';
// styles and theme block
import { WHITE_TWO } from '../../../../theme';
import { failStyles } from '../../../../styles/publicAppointmentStyles/failsStyles';
import { FORM_FAIL_DESCRIPTION, THANK_YOU_TEXT } from '../../../../constants';
//component
const FormFailComponent = () => {
  //style hook
  const classes = failStyles();
  //render
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
              {FORM_FAIL_DESCRIPTION}
              <br />
              <br />
              {THANK_YOU_TEXT}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default FormFailComponent;
