// packages block
import { Box, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
// components block
import CardComponent from "../../../../common/CardComponent";
// constants and styles block
import { WHITE_SIX } from '../../../../../theme';
import { AGREEMENT_POINTS, AGREEMENT_HEADING, CONSENT_AGREEMENT_LABEL } from '../../../../../constants';
import { consentAgreementStyles } from '../../../../../styles/publicAppointmentStyles/consentAgreementStyles';

const ConsentFormComponent = () => {
  const classes = consentAgreementStyles()

  return (
    <CardComponent cardTitle="Document Verification">
      <Box className={classes.agreementContainer}>
        <Typography component="h3" variant="h3">{AGREEMENT_HEADING}</Typography>

        <Box bgcolor={WHITE_SIX} my={2} p={3.75} className={classes.AGREEMENT_POINTSContainer}>
          <ul>
            {AGREEMENT_POINTS.map((point) => (
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

export default ConsentFormComponent;
