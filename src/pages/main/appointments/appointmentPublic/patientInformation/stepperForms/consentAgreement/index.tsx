import { Box, Checkbox, FormControlLabel, Typography } from '@material-ui/core';

import CardComponent from '../../../../../../../components/common/CardComponent';
import { agreementPoints, AGREEMENT_HEADING, CONSENT_AGREEMENT_LABEL } from '../../../../../../../constants';
import { consentAgreement } from '../../../../../../../styles/publicAppointment/consentAgreement';
import { WHITE_SIX } from '../../../../../../../theme';

const index = () => {
  const classes = consentAgreement()

  return (
    <CardComponent cardTitle="Document Verification">
      <Box className={classes.agreementContainer}>
        <Typography component="h3" variant="h3">{AGREEMENT_HEADING}</Typography>

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
      </Box>
    </CardComponent>
  );
};

export default index;
