// packages block
import { Box, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
// components block
import CardComponent from "../../../common/CardComponent";
// styles and constants block
import { WHITE_SIX } from "../../../../theme";
import { AGREEMENT_HEADING, CONSENT_AGREEMENT_LABEL } from "../../../../constants";
import { consentAgreementStyles } from "../../../../styles/publicAppointmentStyles/consentAgreementStyles";

const ConsentComponent = () => {
  const classes = consentAgreementStyles()

  return (
    <CardComponent cardTitle="Document Verification">
      <Box className={classes.agreementContainer}>
        <Typography component="h3" variant="h3">{AGREEMENT_HEADING}</Typography>

        <Box bgcolor={WHITE_SIX} my={2} p={3.75} className={classes.agreementPointsContainer}>
          <Typography variant="subtitle1" component="p">{`{{Terms of Service Content}}`}</Typography>
        </Box>

        <Box pb={2}>
          <FormControlLabel control={<Checkbox color="primary" defaultChecked />} label={CONSENT_AGREEMENT_LABEL} />
        </Box>
      </Box>
    </CardComponent>
  );
};

export default ConsentComponent;
