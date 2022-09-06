// packages block
import { Box, Card, colors, Grid, Typography } from '@material-ui/core';
// styles and constants block
import { WHITE_TWO } from '../../../../theme';
import { PUBLIC_FORM_SUCCESS_HEADING, PUBLIC_FORM_SUCCESS_TITLE } from '../../../../constants';

const UserFormSuccessComponent = () => {

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
      <Grid container justifyContent='center'>
        <Grid item md={4} sm={12}>
          <Card>
            <Box maxWidth={570}>
              <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant="h3"><strong>{PUBLIC_FORM_SUCCESS_HEADING}</strong></Typography>
              </Box>

              <Box p={5}>
                <Typography variant="h3">{PUBLIC_FORM_SUCCESS_TITLE}</Typography>

                <Box mb={2} />

              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserFormSuccessComponent;
