// packages block
import { Box, Button, Card, colors, Typography } from '@material-ui/core';
// styles and theme block
import { WHITE_TWO } from '../../../../theme';
import { FORM_FAIL_DESCRIPTION, THANK_YOU_TEXT } from '../../../../constants';
import { failStyles } from '../../../../styles/publicAppointmentStyles/failsStyles';
//component
const FormFailComponent = () => {
  //style hook
  const classes = failStyles();
  //render
  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
      <Card>
        <Box width={570}>
          <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant="h3"><strong>{FORM_FAIL_DESCRIPTION}</strong></Typography>
          </Box>

          <Box className={classes.container}>
            <Typography variant="h3">{THANK_YOU_TEXT}</Typography>

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant='outlined' color='secondary'>Go Back</Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default FormFailComponent;
