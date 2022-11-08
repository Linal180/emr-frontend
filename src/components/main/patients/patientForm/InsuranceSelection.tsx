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
  INSURANCE_DISCLAIMER, INSURANCE_SELECTION, SAVE_AND_NEXT, INSURANCE_RADIO_BUTTON_MAPPED
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

  const handleCheck = async (name: string) => {
    setSelection && setSelection(name)
    await updateAppointment({
      variables: {
        updateAppointmentInput: {
          id: appointmentId || '', insuranceStatus: name
        }
      }
    })
  }

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
    <CardComponent saveBtnText={SAVE_AND_NEXT} cardTitle={INSURANCE_SELECTION} saveBtn state={state} onSubmitClick={() => handleAppointmentUpdate()} disableSubmit={updateAppointmentLoading}>
      <Grid item md={12} sm={12} xs={12}>
        <FormControl component="fieldset">
          <FormLabel className={classes.privacyLabelHeader} component="li">{INSURANCE_DISCLAIMER}</FormLabel>
          <Box display="flex" flexWrap="wrap" pb={2}>
            
            {INSURANCE_RADIO_BUTTON_MAPPED?.map(({ title, type }, index) =>
              <FormGroup className={classes.privacyFormGroup} key={`${index}-${type}-${title}`}>
                <FormControlLabel
                  className={classes.privacyLabelDescription}
                  control={
                    <RadioButton
                      disabled={shouldDisableEdit}
                      color="primary"
                      checked={selection === type}
                      onChange={() => handleCheck(type)}
                    />
                  }
                  label={title}
                />
              </FormGroup>
            )}

          </Box>
        </FormControl>
      </Grid>
    </CardComponent>
  )
}

export default InsuranceSelectionCard
