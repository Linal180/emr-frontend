import { Box, Checkbox, FormControl, FormControlLabel, Grid, Typography } from '@material-ui/core';
import React from 'react';
import CardComponent from '../../../../../../../components/common/CardComponent';
import { agreementPoints, AGREEMENT_HEADING } from '../../../../../../../constants';
import { consentAgreement } from '../../../../../../../styles/publicAppointment/consentAgreement';
import { BLUE_FOUR } from '../../../../../../../theme';

const index = () => {
  const classes = consentAgreement()
  return (
    <CardComponent cardTitle="Document Verification">
      <Box className={classes.agreementContainer}>
        <Typography component="h3" variant="h3">{AGREEMENT_HEADING}</Typography>
        <Grid container spacing={3}>
          <Grid item md={12} sm={12} xs={12}>
            <Box bgcolor={BLUE_FOUR} minHeight="80vh" my={2} p={3.75}>
              <ul>
                {agreementPoints.map((point) => {
                  return (
                    <li><Typography variant="h6" component="p">{point}</Typography></li>
                  )
                })
                }
              </ul>
            </Box>

            <Box pb={2}>
              <FormControlLabel control={<Checkbox defaultChecked />} label="I agree to the terms & conditions and hereby, authorize EMR health facilities to keep my personal health record." />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </CardComponent>
  );
};

export default index;
