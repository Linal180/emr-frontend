//packages block
import { FC } from "react"
import { Box, Grid } from "@material-ui/core"
//components
import CheckboxController from "../CheckboxController"
//constants
import {
  CONSENT_TO_CALL, CONSENT_TO_MESSAGES, CONSENT_TO_MESSAGES_DESCRIPTION, GRANTED_TEXT, MEDICATION_HISTORY_AUTHORITY,
  NOTICE_ON_FILE, PRIVACY_NOTICE, RELEASE_OF_BILLING_INFO
} from "../../../constants"

const ConsentForm: FC = (): JSX.Element => {
  return <Box my={3}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box>{NOTICE_ON_FILE}</Box>
        <CheckboxController controllerName="privacyNotice" controllerLabel={PRIVACY_NOTICE} margin="none" />
        <CheckboxController controllerName="releaseOfInfoBill" controllerLabel={RELEASE_OF_BILLING_INFO} margin="none" />
      </Grid>
      <Grid item xs={3}>
        <CheckboxController controllerName="phonePermission" controllerLabel={GRANTED_TEXT} title={CONSENT_TO_CALL} />
      </Grid>
      <Grid item xs={4}>
        <CheckboxController controllerName="medicationHistoryAuthority" controllerLabel={GRANTED_TEXT}
          title={MEDICATION_HISTORY_AUTHORITY} />
      </Grid>

      <Grid item xs={12}>
        <CheckboxController controllerName="smsPermission" controllerLabel={CONSENT_TO_MESSAGES_DESCRIPTION}
          title={CONSENT_TO_MESSAGES} />
      </Grid>
    </Grid>
  </Box>
}

export default ConsentForm