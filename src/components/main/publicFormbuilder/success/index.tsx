// packages block
import { Box, Card, colors, Typography } from '@material-ui/core';
// styles and constants block
import { WHITE_TWO } from '../../../../theme';
import { successStyles } from '../../../../styles/publicAppointmentStyles/successStyles';
import {
  PUBLIC_FORM_SUCCESS_HEADING, PUBLIC_FORM_SUCCESS_TITLE, PUBLIC_FORM_SUCCESS_DESCRIPTION_1
} from '../../../../constants';

const UserFormSuccessComponent = () => {
  const classes = successStyles();

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
      <Card>
        <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4"><strong>{PUBLIC_FORM_SUCCESS_HEADING}</strong></Typography>
        </Box>

        <Box className={classes.container}>
          <Typography variant="h4">{PUBLIC_FORM_SUCCESS_TITLE}</Typography>

          <Box mb={3} />

          <Typography component="h5" variant="h5">
            <ul>
              <li>{PUBLIC_FORM_SUCCESS_DESCRIPTION_1}</li>
            </ul>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default UserFormSuccessComponent;
