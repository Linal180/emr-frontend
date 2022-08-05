//packages import
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid } from "@material-ui/core"
import { FC } from "react"
//components import
import CardComponent from "../../../common/CardComponent"
//constants, interfaces, reducer imports
import {
  CONTRACT, INSURANCE, INSURANCE_DISCLAIMER, INSURANCE_SELECTION, INTERNATIONAL_TRAVELER, NO_INSURANCE
} from "../../../../constants"
import { InsuranceSelectionProps, ParamsType } from "../../../../interfacesTypes"
import { useExternalPatientStyles } from "../../../../styles/publicAppointmentStyles/externalPatientStyles"
import { useUpdateAppointmentMutation } from "../../../../generated/graphql"
import Alert from "../../../common/Alert"
import { useParams } from "react-router"

const InsuranceSelectionCard: FC<InsuranceSelectionProps> = ({
  shouldDisableEdit, selection, setSelection, state
}) => {
  const classes = useExternalPatientStyles()
  const { appointmentId } = useParams<ParamsType>()

  const handleCheck = (checked: boolean, name: string) => {
    checked ? setSelection && setSelection(name) : setSelection && setSelection('')
  }

  const [updateAppointment, { loading: updateAppointmentLoading }] = useUpdateAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },
  });

  const handleAppointmentUpdate = async () => {
    await updateAppointment({
      variables: {
        updateAppointmentInput: {
          id: appointmentId || '', insuranceStatus: selection
        }
      }
    })
  }

  return (
    <CardComponent cardTitle={INSURANCE_SELECTION} saveBtn state={state} onSubmitClick={() => handleAppointmentUpdate()} disableSubmit={updateAppointmentLoading}>
      <Grid item md={12} sm={12} xs={12}>
        <FormControl component="fieldset">
          <FormLabel className={classes.privacyLabelHeader} component="li">{INSURANCE_DISCLAIMER}</FormLabel>

          <Box display="flex" pb={2}>
            <FormGroup className={classes.privacyFormGroup}>
              <FormControlLabel
                className={classes.privacyLabelDescription}
                control={
                  <Checkbox
                    disabled={shouldDisableEdit}
                    color="primary"
                    checked={selection === 'insurance'}
                    onChange={({ target: { checked } }) => handleCheck(checked, 'insurance')}
                  />
                }
                label={INSURANCE}
              />
            </FormGroup>

            <FormGroup className={classes.privacyFormGroup}>
              <FormControlLabel
                className={classes.privacyLabelDescription}
                control={
                  <Checkbox
                    disabled={shouldDisableEdit}
                    color="primary"
                    checked={selection === 'noInsurance'}
                    onChange={({ target: { checked } }) => handleCheck(checked, 'noInsurance')}
                  />
                }
                label={NO_INSURANCE}
              />
            </FormGroup>

            <FormGroup className={classes.privacyFormGroup}>
              <FormControlLabel
                className={classes.privacyLabelDescription}
                control={
                  <Checkbox
                    disabled={shouldDisableEdit}
                    color="primary"
                    checked={selection === 'internationalTraveler'}
                    onChange={({ target: { checked } }) => handleCheck(checked, 'internationalTraveler')}
                  />
                }
                label={INTERNATIONAL_TRAVELER}
              />
            </FormGroup>

            <FormGroup className={classes.privacyFormGroup}>
              <FormControlLabel
                className={classes.privacyLabelDescription}
                control={
                  <Checkbox
                    disabled={shouldDisableEdit}
                    color="primary"
                    checked={selection === 'contract'}
                    onChange={({ target: { checked } }) => handleCheck(checked, 'contract')}
                  />
                }
                label={CONTRACT}
              />
            </FormGroup>
          </Box>
        </FormControl>
      </Grid>
    </CardComponent>
  )
}

export default InsuranceSelectionCard
