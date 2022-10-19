//packages import
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid } from "@material-ui/core"
import { FC } from "react"
//components import
import CardComponent from "../../../common/CardComponent"
//constants, interfaces, reducer imports
import {
  CELL_PHONE_PERMISSION,
  CONSENTS, IMMUNIZATION_CONSENT,
  MEDICAL_PERMISSION, MEDICATION_HISTORY_CONSENT, PERMISSIONS_TEXT, PHONE_EMAIL_PERMISSION, PRIVACY, RESULT_CONSENT
} from "../../../../constants"
import { PatientCardsProps } from "../../../../interfacesTypes"
import { ActionType } from "../../../../reducers/patientReducer"
import { useExternalPatientStyles } from "../../../../styles/publicAppointmentStyles/externalPatientStyles"

const PatientPrivacyCard: FC<PatientCardsProps> = ({
  state, dispatch, shouldDisableEdit, disableSubmit, isEdit
}) => {
  const { medicalPermission, cellPhonePermission, phoneEmailPermission, resultConsent, immunizationConsent, medicationHistoryConsent } = state || {}
  const classes = useExternalPatientStyles()

  return (
    <CardComponent cardTitle={PRIVACY} state={state} saveBtn={!shouldDisableEdit}
      disableSubmit={disableSubmit} isEdit={isEdit}>
      <Grid container spacing={2}>
        <Grid item md={6} sm={12} xs={12}>
          <Box>
            <FormControl component="fieldset">
              <FormGroup>
                <Box mb={2}>
                  <FormLabel className={classes.privacyLabelHeader} component="li">{PERMISSIONS_TEXT}</FormLabel>

                  <Box p={0.5} />

                  <FormControlLabel
                    className={classes.privacyLabelNewDescription}
                    control={
                      <Checkbox
                        className='privacyCheckBox'
                        disabled={shouldDisableEdit}
                        color="primary"
                        checked={phoneEmailPermission}
                        onChange={(event) => dispatch && dispatch({ type: ActionType.SET_PHONE_EMAIL_PERMISSION, phoneEmailPermission: event.target.checked })}
                      />
                    }
                    label={PHONE_EMAIL_PERMISSION}
                  />

                  <FormControlLabel
                    className={classes.privacyLabelNewDescription}
                    control={
                      <Checkbox
                        className='privacyCheckBox'
                        disabled={shouldDisableEdit}
                        color="primary"
                        checked={cellPhonePermission}
                        onChange={(event) => dispatch && dispatch({ type: ActionType.SET_CELL_PHONE_PERMISSION, cellPhonePermission: event.target.checked })}
                      />
                    }
                    label={CELL_PHONE_PERMISSION}
                  />

                  <FormControlLabel
                    className={classes.privacyLabelNewDescription}
                    control={
                      <Checkbox
                        className='privacyCheckBox'
                        disabled={shouldDisableEdit}
                        color="primary"
                        checked={medicalPermission}
                        onChange={(event) => dispatch && dispatch({ type: ActionType.SET_MEDICAL_PERMISSION, medicalPermission: event.target.checked })}
                      />
                    }
                    label={MEDICAL_PERMISSION}
                  />
                </Box>
              </FormGroup>
            </FormControl>
          </Box>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Box>
            <FormControl component="fieldset">
              <FormGroup>
                <Box mb={2}>
                  <FormLabel className={classes.privacyLabelHeader} component="li">{CONSENTS}</FormLabel>

                  <Box p={0.5} />

                  <FormControlLabel
                    className={classes.privacyLabelNewDescription}
                    control={
                      <Checkbox
                        className='privacyCheckBox'
                        disabled={shouldDisableEdit}
                        color="primary"
                        checked={resultConsent}
                        onChange={(event) => dispatch && dispatch({ type: ActionType.SET_RESULT_CONSENT, resultConsent: event.target.checked })}
                      />
                    }
                    label={RESULT_CONSENT}
                  />

                  <FormControlLabel
                    className={classes.privacyLabelNewDescription}
                    control={
                      <Checkbox
                        className='privacyCheckBox'
                        disabled={shouldDisableEdit}
                        color="primary"
                        checked={immunizationConsent}
                        onChange={(event) => dispatch && dispatch({ type: ActionType.SET_IMMUNIZATION_CONSENT, immunizationConsent: event.target.checked })}
                      />
                    }
                    label={IMMUNIZATION_CONSENT}
                  />

                  <FormControlLabel
                    className={classes.privacyLabelNewDescription}
                    control={
                      <Checkbox
                        className='privacyCheckBox'
                        disabled={shouldDisableEdit}
                        color="primary"
                        checked={medicationHistoryConsent}
                        onChange={(event) => dispatch && dispatch({ type: ActionType.SET_MEDICATION_HISTORY_CONSENT, medicationHistoryConsent: event.target.checked })}
                      />
                    }
                    label={MEDICATION_HISTORY_CONSENT}
                  />
                </Box>
              </FormGroup>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </CardComponent>
  )
}

export default PatientPrivacyCard
