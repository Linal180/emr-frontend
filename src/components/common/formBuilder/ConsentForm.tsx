//packages block
import { FC } from "react"
import { Box, FormControl, FormGroup, FormLabel, Grid } from "@material-ui/core"
//components
import CheckboxController from "../CheckboxController"
//constants, styles
import { useExternalPatientStyles } from "../../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  CELL_PHONE_PERMISSION, CONSENTS, IMMUNIZATION_CONSENT, MEDICAL_PERMISSION, MEDICATION_HISTORY_CONSENT,
  PERMISSIONS_TEXT, PHONE_EMAIL_PERMISSION, RESULT_CONSENT
} from "../../../constants"

const ConsentForm: FC = (): JSX.Element => {
  const classes = useExternalPatientStyles()
  return <Box my={3}>
    <Grid container spacing={3}>
      <Grid item md={12} sm={12} xs={12}>
        <FormControl component="fieldset">
          <FormLabel className={classes.privacyLabelHeader} component="li">{PERMISSIONS_TEXT}</FormLabel>
          <FormGroup className={classes.privacyFormGroup}>
            <CheckboxController className={classes.privacyLabelDescription} controllerName="phoneEmailPermission" controllerLabel={PHONE_EMAIL_PERMISSION} margin="none" />
            <CheckboxController className={classes.privacyLabelDescription} controllerName="cellPhonePermission" controllerLabel={CELL_PHONE_PERMISSION} margin="none" />
            <CheckboxController className={classes.privacyLabelDescription} controllerName="medicalPermission" controllerLabel={MEDICAL_PERMISSION} margin="none" />
          </FormGroup>
        </FormControl>

        <Box>
          <FormControl component="fieldset">
            <FormGroup>
              <Box mr={3} mb={2} mt={2}>
                <FormLabel className={classes.privacyLabelHeader} component="li">{CONSENTS}</FormLabel>
                <CheckboxController className={classes.privacyLabelDescription} controllerName="resultConsent" controllerLabel={RESULT_CONSENT} margin="none" />
                <CheckboxController className={classes.privacyLabelDescription} controllerName="immunizationConsent" controllerLabel={IMMUNIZATION_CONSENT} margin="none" />
                <CheckboxController className={classes.privacyLabelDescription} controllerName="medicationHistoryConsent" controllerLabel={MEDICATION_HISTORY_CONSENT} margin="none" />
              </Box>
            </FormGroup>
          </FormControl>
        </Box>

      </Grid>
    </Grid>
  </Box>
}

export default ConsentForm