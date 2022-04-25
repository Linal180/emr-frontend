// packages block
import { Box, Button, Card, colors, Typography } from '@material-ui/core';
// styles and constants block
import { WHITE_TWO } from '../../../../theme';
import { successStyles } from '../../../../styles/publicAppointmentStyles/successStyles';
import {
  PUBLIC_FORM_SUCCESS_HEADING, PUBLIC_FORM_SUCCESS_TITLE, PUBLIC_FORM_SUCCESS_DESCRIPTION_1,
} from '../../../../constants';

const UserFormSuccessComponent = () => {
  const classes = successStyles();

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
      <Card>
        <Box width={570}>
          <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
            <Typography variant="h3"><strong>{PUBLIC_FORM_SUCCESS_HEADING}</strong></Typography>
          </Box>

          <Box className={classes.container}>
            <Typography variant="h3">{PUBLIC_FORM_SUCCESS_TITLE}</Typography>

            <Box mb={2} />

            <Typography variant="h6">
              <ul>
                <li>{PUBLIC_FORM_SUCCESS_DESCRIPTION_1}</li>
              </ul>
            </Typography>

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant='outlined' color='secondary'>Go Back</Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default UserFormSuccessComponent;
