//packages import
import { FC } from "react"
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid } from "@material-ui/core"
//components import
import CardComponent from "../../../common/CardComponent"
//constants, interfaces, reducer imports
import { PatientCardsProps } from "../../../../interfacesTypes"
import { ActionType } from "../../../../reducers/patientReducer"
import { useExternalPatientStyles } from "../../../../styles/publicAppointmentStyles/externalPatientStyles"
import {
  CONSENT_TO_CALL, CONSENT_TO_MESSAGES, CONSENT_TO_MESSAGES_DESCRIPTION, GRANTED_TEXT,
  MEDICATION_HISTORY_AUTHORITY, NOTICE_ON_FILE, PRIVACY, PRIVACY_NOTICE, RELEASE_OF_BILLING_INFO
} from "../../../../constants"

const PatientPrivacyCard: FC<PatientCardsProps> = ({
  state, dispatch, shouldDisableEdit, disableSubmit, isEdit
}) => {
  const { privacyNotice, releaseOfInfoBill, callToConsent, medicationHistoryAuthority, smsPermission } = state || {}
  const classes = useExternalPatientStyles()

  return (
    <CardComponent cardTitle={PRIVACY} state={state} saveBtn disableSubmit={disableSubmit} isEdit={isEdit}>
      <Grid item md={12} sm={12} xs={12}>
        <FormControl component="fieldset">
          <FormLabel className={classes.privacyLabelHeader} component="li">{NOTICE_ON_FILE}</FormLabel>
          <FormGroup className={classes.privacyFormGroup}>
            <FormControlLabel
              className={classes.privacyLabelDescription}
              control={
                <Checkbox
                  disabled={shouldDisableEdit}
                  color="primary"
                  checked={privacyNotice}
                  onChange={(event) => dispatch && dispatch({ type: ActionType.SET_PRIVACY_NOTICE, privacyNotice: event.target.checked })}
                />
              }
              label={PRIVACY_NOTICE}
            />

            <FormControlLabel
              className={classes.privacyLabelDescription}
              control={
                <Checkbox
                  disabled={shouldDisableEdit}
                  color="primary"
                  checked={releaseOfInfoBill}
                  onChange={(event) => dispatch && dispatch({ type: ActionType.SET_RELEASE_OF_INFO_BILL, releaseOfInfoBill: event.target.checked })}
                />
              }
              label={RELEASE_OF_BILLING_INFO}
            />
          </FormGroup>
        </FormControl>

        <Box>
          <FormControl component="fieldset">
            <FormGroup>
              <Box mr={3} mb={2} mt={2}>
                <FormLabel className={classes.privacyLabelHeader} component="li">{CONSENT_TO_CALL}</FormLabel>
                <FormControlLabel
                  className={classes.privacyLabelDescription}
                  control={
                    <Checkbox
                      disabled={shouldDisableEdit}
                      color="primary"
                      checked={callToConsent}
                      onChange={(event) => dispatch && dispatch({ type: ActionType.SET_CALL_TO_CONSENT, callToConsent: event.target.checked })}
                    />
                  }
                  label={GRANTED_TEXT}
                />
              </Box>
            </FormGroup>
          </FormControl>
        </Box>

        <Box>
          <FormControl component="fieldset">
            <FormGroup>
              <Box>
                <FormLabel className={classes.privacyLabelHeader} component="li">{MEDICATION_HISTORY_AUTHORITY}</FormLabel>
                <FormControlLabel
                  className={classes.privacyLabelDescription}
                  control={
                    <Checkbox
                      disabled={shouldDisableEdit}
                      color="primary"
                      checked={medicationHistoryAuthority}
                      onChange={(event) => dispatch && dispatch({ type: ActionType.SET_MEDICATION_HISTORY_AUTHORITY, medicationHistoryAuthority: event.target.checked })}
                    />
                  }
                  label={GRANTED_TEXT}
                />
              </Box>
            </FormGroup>
          </FormControl>
        </Box>

        <Box>
          <FormControl component="fieldset">
            <FormGroup>
              <Box mr={3} mb={2} mt={2}>
                <FormLabel className={classes.privacyLabelHeader} component="li">{CONSENT_TO_MESSAGES}</FormLabel>
                <FormControlLabel
                  className={classes.privacyLabelDescription}
                  control={
                    <Checkbox
                      disabled={shouldDisableEdit}
                      color="primary"
                      checked={smsPermission}
                      onChange={(event) => dispatch && dispatch({ type: ActionType.SET_SMS_PERMISSION, smsPermission: event.target.checked })}
                    />
                  }
                  label={CONSENT_TO_MESSAGES_DESCRIPTION}
                />
              </Box>
            </FormGroup>
          </FormControl>
        </Box>
      </Grid>
    </CardComponent>
  )
}

export default PatientPrivacyCard
