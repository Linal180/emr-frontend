import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@material-ui/core';

import CardComponent from '../../../../../../../components/common/CardComponent';
import { agreementPoints, AGREEMENT_HEADING, CONSENT_AGREEMENT_LABEL } from '../../../../../../../constants';
import { consentAgreement } from '../../../../../../../styles/publicAppointment/consentAgreement';
import { WHITE_SIX } from '../../../../../../../theme';

const index = () => {
  const classes = consentAgreement()

  return (
    <Box className={classes.container}>
      <CardComponent cardTitle="Document Verification">
        <Box className={classes.agreementContainer}>
          <Typography component="h3" variant="h3">{AGREEMENT_HEADING}</Typography>
          <Grid container spacing={3}>
            <Grid item md={12} sm={12} xs={12}>
              <Box bgcolor={WHITE_SIX} my={2} p={3.75} className={classes.agreementPointsContainer}>
                <ul>
                  {agreementPoints.map((point) => (
                    <li>
                      <Typography variant="h6" component="p">{point}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>

              <Box pb={2}>
                <FormControlLabel control={<Checkbox color="primary" defaultChecked />} label={CONSENT_AGREEMENT_LABEL} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardComponent>
    </Box>
  );
};

export default index;
