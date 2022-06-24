//packages import
import { Box, FormControl, Grid, InputLabel } from "@material-ui/core"
import { ChangeEvent, FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
//interfaces, styles, constants block
import InputController from "../../../../controller"
import { GREY_SEVEN, WHITE } from "../../../../theme"
import { PatientCardsProps } from "../../../../interfacesTypes"
import { ActionType } from "../../../../reducers/patientReducer"
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles"
import { AntSwitch } from "../../../../styles/publicAppointmentStyles/externalPatientStyles"
import {
  DEMOGRAPHICS, ETHNICITY, GENDER_IDENTITY, HOMEBOUND, LANGUAGE_SPOKEN, LEGAL_SEX, MAPPED_ETHNICITY, MAPPED_GENDER_IDENTITY,
  MAPPED_MARITAL_STATUS, MAPPED_RACE, MAPPED_SEXUAL_ORIENTATION, MARITAL_STATUS, RACE, SEXUAL_ORIENTATION
} from "../../../../constants"
//components import
import Selector from "../../../common/Selector"
import CardComponent from "../../../common/CardComponent"

const DemographicsCard: FC<PatientCardsProps> = ({ getPatientLoading, state, dispatch, shouldDisableEdit, disableSubmit, isEdit }) => {
  const { control, setValue } = useFormContext()
  const classes = usePublicAppointmentStyles();
  const { isChecked } = state || {}

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    dispatch && dispatch({ type: ActionType.SET_IS_CHECKED, isChecked: checked })
    setValue('homeBound', checked)
  };

  return (
    <CardComponent cardTitle={DEMOGRAPHICS} state={state} saveBtn disableSubmit={disableSubmit} isEdit={isEdit}>
      <>
        <Grid container spacing={3}>
          <Grid item md={3} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="language"
              controllerLabel={LANGUAGE_SPOKEN}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item md={3} sm={12} xs={12}>
            <Selector
              disabled={shouldDisableEdit}
              name="race"
              label={RACE}
              addEmpty
              options={MAPPED_RACE}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item md={3} sm={12} xs={12}>
            <Selector
              disabled={shouldDisableEdit}
              name="ethnicity"
              label={ETHNICITY}
              addEmpty
              options={MAPPED_ETHNICITY}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item md={3} sm={12} xs={12}>
            <Selector
              disabled={shouldDisableEdit}
              name="maritialStatus"
              label={MARITAL_STATUS}
              addEmpty
              options={MAPPED_MARITAL_STATUS}
              loading={getPatientLoading}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>

        </Grid>

        <Grid container spacing={3}>
          <Grid item md={3} sm={12} xs={12}>
            <Selector
              disabled={shouldDisableEdit}
              name="sexualOrientation"
              label={SEXUAL_ORIENTATION}
              options={MAPPED_SEXUAL_ORIENTATION}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item md={3} sm={12} xs={12}>
            <Selector
              disabled={shouldDisableEdit}
              name="genderIdentity"
              label={GENDER_IDENTITY}
              options={MAPPED_GENDER_IDENTITY}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item md={3} sm={12} xs={12}>
            <Selector
              disabled={shouldDisableEdit}
              name="gender"
              label={LEGAL_SEX}
              options={MAPPED_GENDER_IDENTITY}
              loading={getPatientLoading}
            />
          </Grid>

          <Grid item md={3} sm={12} xs={12}>
            <Controller
              name='homeBound'
              control={control}
              render={() => (
                <FormControl fullWidth margin="normal"
                  className={classes.toggleContainer} disabled={shouldDisableEdit}>
                  <InputLabel shrink>{HOMEBOUND}</InputLabel>

                  <label className="toggle-main">
                    <Box color={isChecked ? WHITE : GREY_SEVEN}>Yes</Box>
                    <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='homeBound' />
                    <Box color={isChecked ? GREY_SEVEN : WHITE}>No</Box>
                  </label>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>

        </Grid>
      </>
    </CardComponent>
  )
}

export default DemographicsCard;
