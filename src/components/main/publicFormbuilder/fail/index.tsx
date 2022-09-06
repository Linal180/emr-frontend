// packages block
import { Box, Card, colors, Grid, Typography } from '@material-ui/core';
// styles and theme block
import { WHITE_TWO } from '../../../../theme';
import { FORM_FAIL_DESCRIPTION, } from '../../../../constants';

const FormFailComponent = () => {
  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75} display="flex" justifyContent="center" alignItems="center">
      <Grid container justifyContent='center'>
        <Grid item md={4} sm={12}>
          <Card>
            <Box maxWidth={570}>
              <Box p={3} borderBottom={`1px solid ${colors.grey[300]}`}>
                <Typography variant="h3"><strong>{FORM_FAIL_DESCRIPTION}</strong></Typography>
              </Box>

              <Box p={3} minHeight={160} display="flex" flexDirection="column">
                <Typography variant="h5">Form link has expired, kindly contact with our support team.</Typography>

                <Box mt={1} component='span'>
                  <a href='mailto:support@aimed.com'>support@aimed.com</a>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FormFailComponent;
