// packages block
import { Box, Grid, Typography } from '@material-ui/core';
// packages block
import CardComponent from "../../../../common/CardComponent";
import DropzoneContainer from "../../../../common/DropzoneContainer";
// theme block
import { GRAY_TWO } from '../../../../../theme';

const DocumentVerificationForm = () => {
  return (
    <Box>
      <CardComponent cardTitle="Document Verification">
        <Box py={2}>
          <Typography component="h4" variant="h4">Driving License</Typography>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <DropzoneContainer imageSide="Front Side" />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <DropzoneContainer imageSide="Back Side" />
            </Grid>
          </Grid>
        </Box>

        <Box py={2}>
          <Typography component="h4" variant="h4">Insurance Card</Typography>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <DropzoneContainer imageSide="Front Side" />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <DropzoneContainer imageSide="Back Side" />
            </Grid>
          </Grid>
        </Box>

        <Box py={2}>
          <Typography component="h4" variant="h4">Insurance Card <Box display="inline" color={GRAY_TWO}>(Secondary)</Box></Typography>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <DropzoneContainer imageSide="Front Side" />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <DropzoneContainer imageSide="Back Side" />
            </Grid>
          </Grid>
        </Box>
      </CardComponent>
    </Box>
  );
};

export default DocumentVerificationForm;
