//packages block
import { FC } from "react"
import { Box, FormControl, FormGroup, FormLabel, Grid } from "@material-ui/core"
//components
import CheckboxController from "../CheckboxController"
//constants, styles
import { useExternalPatientStyles } from "../../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  CONSENT_TO_CALL, CONSENT_TO_MESSAGES, CONSENT_TO_MESSAGES_DESCRIPTION, GRANTED_TEXT, NOTICE_ON_FILE, PRIVACY_NOTICE,
  RELEASE_OF_BILLING_INFO
} from "../../../constants"

const ConsentForm: FC = (): JSX.Element => {
  const classes = useExternalPatientStyles()
  return <Box my={3}>
    <Grid container spacing={3}>
      <Grid item md={12} sm={12} xs={12}>
        <FormControl component="fieldset">
          <FormLabel className={classes.privacyLabelHeader} component="li">{NOTICE_ON_FILE}</FormLabel>
          <FormGroup className={classes.privacyFormGroup}>
            <CheckboxController className={classes.privacyLabelDescription} controllerName="privacyNotice" controllerLabel={PRIVACY_NOTICE} margin="none" />
            <CheckboxController className={classes.privacyLabelDescription} controllerName="releaseOfInfoBill" controllerLabel={RELEASE_OF_BILLING_INFO} margin="none" />
          </FormGroup>
        </FormControl>

        <Box>
          <FormControl component="fieldset">
            <FormGroup>
              <Box mr={3} mb={2} mt={2}>
                <FormLabel className={classes.privacyLabelHeader} component="li">{CONSENT_TO_CALL}</FormLabel>
                <CheckboxController className={classes.privacyLabelDescription} controllerName="phonePermission" controllerLabel={GRANTED_TEXT} margin="none" />
              </Box>
            </FormGroup>
          </FormControl>
        </Box>

        <Box>
          <FormControl component="fieldset">
            <FormGroup>
              <Box mr={3} mb={2} mt={2}>
                <FormLabel className={classes.privacyLabelHeader} component="li">{CONSENT_TO_MESSAGES}</FormLabel>
                <CheckboxController className={classes.privacyLabelDescription} controllerName="smsPermission" controllerLabel={CONSENT_TO_MESSAGES_DESCRIPTION} margin="none" />
              </Box>
            </FormGroup>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  </Box>
}

export default ConsentForm