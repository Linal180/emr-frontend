//packages import
import { FC } from "react"
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid } from "@material-ui/core"
//components import
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
//constants, interfaces, reducer imports
import { PatientCardsProps } from "../../../../interfacesTypes"
import { ActionType } from "../../../../reducers/patientReducer"
import {
  CONSENT_TO_CALL, CONSENT_TO_MESSAGES, CONSENT_TO_MESSAGES_DESCRIPTION, GRANTED_TEXT, MEDICATION_HISTORY_AUTHORITY, NOTICE_ON_FILE,
  PRIVACY, PRIVACY_NOTICE, RELEASE_OF_BILLING_INFO
} from "../../../../constants"

const PatientPrivacyCard: FC<PatientCardsProps> = ({ getPatientLoading, state, dispatch, shouldDisableEdit }) => {
  const { privacyNotice, releaseOfInfoBill, callToConsent, medicationHistoryAuthority, smsPermission } = state || {}

  return (
    <CardComponent cardTitle={PRIVACY}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid item md={12} sm={12} xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{NOTICE_ON_FILE}</FormLabel>
              <FormGroup>
                <FormControlLabel
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

            <Box display="flex" flexDirection="row">
              <FormControl component="fieldset">
                <FormGroup>
                  <Box mr={3} mb={2} mt={2}>
                    <FormLabel component="legend">{CONSENT_TO_CALL}</FormLabel>
                    <FormControlLabel
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

              <FormControl component="fieldset">
                <FormGroup>
                  <Box ml={3} mt={2} mb={2}>
                    <FormLabel component="legend">{MEDICATION_HISTORY_AUTHORITY}</FormLabel>
                    <FormControlLabel
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
                    <FormLabel component="legend">{CONSENT_TO_MESSAGES}</FormLabel>
                    <FormControlLabel
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
        </>
      )}
    </CardComponent>
  )
}

export default PatientPrivacyCard