import { Box, Grid, Typography } from '@material-ui/core';
import React from 'react';
import CardComponent from '../../../../../../../components/common/CardComponent';
import { GRAY_TWO } from '../../../../../../../theme';
import DropZoneContainer from '../../components/DropZoneContainer';


const index = () => {
  return (
    <CardComponent cardTitle="Document Verification">
      <Box py={2}>
        <Typography component="h4" variant="h4">Driving License</Typography>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <DropZoneContainer imageSide="Front Side" />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <DropZoneContainer imageSide="Back Side" />
          </Grid>
        </Grid>
      </Box>

      <Box py={2}>
        <Typography component="h4" variant="h4">Insurance Card</Typography>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <DropZoneContainer imageSide="Front Side" />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <DropZoneContainer imageSide="Back Side" />
          </Grid>
        </Grid>
      </Box>

      <Box py={2}>
        <Typography component="h4" variant="h4">Insurance Card <Box display="inline" color={GRAY_TWO}>(Secondary)</Box></Typography>
        <Grid container spacing={3}>
          <Grid item md={6} sm={12} xs={12}>
            <DropZoneContainer imageSide="Front Side" />
          </Grid>

          <Grid item md={6} sm={12} xs={12}>
            <DropZoneContainer imageSide="Back Side" />
          </Grid>
        </Grid>
      </Box>
    </CardComponent>
  );
};

export default index;
