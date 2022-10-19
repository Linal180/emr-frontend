// packages import
import { ChangeEvent, FC, useMemo } from "react"
import { Box, FormControl, Grid, InputLabel } from "@material-ui/core"
import { Controller, useFormContext } from "react-hook-form"
// components import
import Selector from "../../../common/Selector"
import CardComponent from "../../../common/CardComponent"
// interfaces, styles, constants block
import { GREY_SEVEN, WHITE } from "../../../../theme"
import { PatientCardsProps, PatientInputProps } from "../../../../interfacesTypes"
import { ActionType } from "../../../../reducers/patientReducer"
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles"
import { AntSwitch } from "../../../../styles/publicAppointmentStyles/externalPatientStyles"
import {
  DEMOGRAPHICS, ETHNICITY, GENDER_IDENTITY, HOMEBOUND, LANGUAGE_SPOKEN, LANGUAGE_SPOKEN_OPTIONS, LEGAL_SEX, MAPPED_ETHNICITY,
  MAPPED_GENDER_IDENTITY, MAPPED_MARITAL_STATUS, MAPPED_RACE, MAPPED_SEXUAL_ORIENTATION, MARITAL_STATUS,
  RACE, SEXUAL_ORIENTATION
} from "../../../../constants"

const DemographicsCard: FC<PatientCardsProps> = ({
  getPatientLoading, state, dispatch, shouldDisableEdit, disableSubmit, isEdit
}) => {
  const { control, setValue, watch } = useFormContext<PatientInputProps>()
  const { language } = watch()
  const { id: languageId } = language || {}
  const classes = usePublicAppointmentStyles();
  const { isChecked } = state || {}

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    dispatch && dispatch({ type: ActionType.SET_IS_CHECKED, isChecked: checked })
    setValue('homeBound', checked)
  };

  const transformedLanguageOptions = useMemo(() => {
    if (languageId) {
      return [...LANGUAGE_SPOKEN_OPTIONS, language]
    }

    return LANGUAGE_SPOKEN_OPTIONS
  }, [language, languageId])

  return (
    <CardComponent
      saveBtn={!shouldDisableEdit}
      state={state}
      isEdit={isEdit}
      cardTitle={DEMOGRAPHICS}
      disableSubmit={disableSubmit}
    >
      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          {/* <InputController
            fieldType="text"
            controllerName="language"
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
            controllerLabel={LANGUAGE_SPOKEN}
          /> */}
          <Selector
            freeSolo
            name="language"
            label={LANGUAGE_SPOKEN}
            options={transformedLanguageOptions}
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
          />
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Selector
            name="race"
            label={RACE}
            options={MAPPED_RACE}
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
          />
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Selector
            name="ethnicity"
            label={ETHNICITY}
            options={MAPPED_ETHNICITY}
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
          />
        </Grid>

        <Grid item md={3} sm={12} xs={12}>
          <Selector
            name="maritialStatus"
            label={MARITAL_STATUS}
            disabled={shouldDisableEdit}
            loading={getPatientLoading}
            options={MAPPED_MARITAL_STATUS}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>

      </Grid>

      <Grid container spacing={3}>
        <Grid item md={3} sm={12} xs={12}>
          <Selector
            name="sexualOrientation"
            label={SEXUAL_ORIENTATION}
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
            options={MAPPED_SEXUAL_ORIENTATION}
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
                  <AntSwitch checked={isChecked}
                    onChange={(event) => { toggleHandleChange(event) }} name='homeBound'
                  />
                  <Box color={isChecked ? GREY_SEVEN : WHITE}>No</Box>
                </label>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </CardComponent>
  )
}

export default DemographicsCard;
