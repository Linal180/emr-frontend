//packages import
import { Box, FormControl, Grid, InputLabel } from "@material-ui/core"
import { ChangeEvent, FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
//components import
import CardComponent from "../../../common/CardComponent"
import Selector from "../../../common/Selector"
import ViewDataLoader from "../../../common/ViewDataLoader"
import InputController from "../../../../controller"
//interfaces, styles, constants block
import { PatientCardsProps } from "../../../../interfacesTypes"
import { ActionType } from "../../../../reducers/patientReducer"
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles"
import { AntSwitch } from "../../../../styles/publicAppointmentStyles/externalPatientStyles"
import { GREY_SEVEN, WHITE } from "../../../../theme"
import {
  DEMOGRAPHICS, EMPTY_OPTION, ETHNICITY, GENDER_IDENTITY,
  HOMEBOUND, LANGUAGE_SPOKEN, MAPPED_ETHNICITY, MAPPED_GENDER_IDENTITY,
  MAPPED_MARITAL_STATUS, MAPPED_PRONOUNS, MAPPED_RACE, MAPPED_SEXUAL_ORIENTATION,
  MARITAL_STATUS, PRONOUNS, RACE, SEXUAL_ORIENTATION, SEX_AT_BIRTH
} from "../../../../constants"

const PatientDemographicsCard: FC<PatientCardsProps> = ({ getPatientLoading, state, dispatch }) => {
  const { control, setValue } = useFormContext()
  const classes = usePublicAppointmentStyles();
  const { isChecked } = state || {}

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    dispatch && dispatch({ type: ActionType.SET_IS_CHECKED, isChecked: checked })
    setValue('homeBound', checked)
  };

  return (
    <CardComponent cardTitle={DEMOGRAPHICS}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                fieldType="text"
                controllerName="language"
                controllerLabel={LANGUAGE_SPOKEN}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Selector
                name="race"
                label={RACE}
                value={EMPTY_OPTION}
                options={MAPPED_RACE}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Selector
                name="ethnicity"
                label={ETHNICITY}
                value={EMPTY_OPTION}
                options={MAPPED_ETHNICITY}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Selector
                name="maritialStatus"
                label={MARITAL_STATUS}
                value={EMPTY_OPTION}
                options={MAPPED_MARITAL_STATUS}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Selector
                name="sexualOrientation"
                label={SEXUAL_ORIENTATION}
                value={EMPTY_OPTION}
                options={MAPPED_SEXUAL_ORIENTATION}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Selector
                name="genderIdentity"
                label={GENDER_IDENTITY}
                value={EMPTY_OPTION}
                options={MAPPED_GENDER_IDENTITY}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <Selector
                name="sexAtBirth"
                label={SEX_AT_BIRTH}
                value={EMPTY_OPTION}
                options={MAPPED_GENDER_IDENTITY}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Selector
                name="pronouns"
                label={PRONOUNS}
                value={EMPTY_OPTION}
                options={MAPPED_PRONOUNS}
              />
            </Grid>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Controller
              name='homeBound'
              control={control}
              render={() => (
                <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
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
        </>
      )}
    </CardComponent>
  )
}

export default PatientDemographicsCard