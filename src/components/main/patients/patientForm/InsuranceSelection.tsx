//packages import
import { Box, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, } from "@material-ui/core";
import { FC } from "react";
import { useParams } from "react-router";
//components import
import Alert from "../../../common/Alert";
import RadioButton from "../../../common/RadioButton";
import CardComponent from "../../../common/CardComponent";
//constants, interfaces, reducer imports
import {
  CONTRACT, INSURANCE, INSURANCE_DISCLAIMER, INSURANCE_SELECTION, INTERNATIONAL_TRAVELER, NO_INSURANCE
} from "../../../../constants";
import { useUpdateAppointmentMutation } from "../../../../generated/graphql";
import { InsuranceSelectionProps, ParamsType } from "../../../../interfacesTypes";
import { useExternalPatientStyles } from "../../../../styles/publicAppointmentStyles/externalPatientStyles";
import { ActionType } from "../../../../reducers/patientReducer";

const InsuranceSelectionCard: FC<InsuranceSelectionProps> = ({
  shouldDisableEdit, selection, setSelection, state, dispatch
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

    onCompleted(data) {
      if (data) {
        dispatch && dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: 1 })
      }
    }
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
          <Box display="flex" flexWrap="wrap" pb={2}>
            <FormGroup className={classes.privacyFormGroup}>
              <FormControlLabel
                className={classes.privacyLabelDescription}
                control={
                  <RadioButton
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
                  <RadioButton
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
                  <RadioButton
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
                  <RadioButton
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
