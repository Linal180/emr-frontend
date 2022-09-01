// packages block
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import {
  Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid
} from "@material-ui/core";
// components block
import Selector from "../../../common/Selector";
import PhoneField from "../../../common/PhoneInput";
import CardComponent from "../../../common/CardComponent";
// interfaces, utils block
import { setRecord } from "../../../../utils";
import InputController from "../../../../controller";
import { ActionType } from "../../../../reducers/patientReducer";
import { PatientCardsProps, PatientInputProps } from "../../../../interfacesTypes";
import {
  ADDRESS_ONE, ADDRESS_TWO, CITY, EMAIL, EMPLOYER, FIRST_NAME, GUARANTOR, GUARANTOR_NOTE,
  GUARANTOR_RELATION, LAST_NAME, MAPPED_RELATIONSHIP_TYPE, MAPPED_STATES,
  MIDDLE_NAME, PHONE, SAME_AS_PATIENT, SSN, STATE, SUFFIX, USA, ZIP_CODE
} from "../../../../constants";
import SnnController from "../../../../controller/SnnController";
import CountryController from "../../../../controller/CountryController";

const GuarantorCard: FC<PatientCardsProps> = ({
  getPatientLoading, state, dispatch, shouldDisableEdit, isEdit
}) => {
  const methods = useFormContext<PatientInputProps>()
  const { sameAddress } = state || {}
  const { watch, setValue, trigger } = methods
  const {
    basicAddress, basicAddress2, basicCity, basicCountry, basicEmail, basicState, basicZipCode
  } = watch()

  const copyAddress = () => {
    basicCity && setValue("guarantorCity", basicCity)
    basicState && setValue("guarantorState", basicState)
    basicEmail && setValue("guarantorEmail", basicEmail)
    basicCountry && setValue("guarantorCountry", basicCountry)
    basicAddress && setValue("guarantorAddress", basicAddress)
    basicZipCode && setValue("guarantorZipCode", basicZipCode)
    basicAddress2 && setValue("guarantorAddress2", basicAddress2)
  };

  const resetAddress = () => {
    setValue("guarantorCity", '')
    setValue("guarantorEmail", '')
    setValue("guarantorAddress", '')
    setValue("guarantorZipCode", '')
    setValue("guarantorAddress2", '')
    setValue("guarantorCountry", USA)
    setValue("guarantorState", setRecord('', ''))
  };

  const setAddressValues = (checked: boolean) => checked ? copyAddress() : resetAddress()

  const handleSameAddress = (checked: boolean) => {
    dispatch && dispatch({ type: ActionType.SET_SAME_ADDRESS, sameAddress: checked })

    setAddressValues(checked);
    trigger()
  }

  return (
    <CardComponent cardTitle={GUARANTOR}>
      <Grid container spacing={3}>
        <Grid item md={4} sm={12} xs={12}>
          <InputController
            fieldType="text"
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
            controllerLabel={FIRST_NAME}
            controllerName="guarantorFirstName"
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <InputController
            fieldType="text"
            disabled={shouldDisableEdit}
            loading={getPatientLoading}
            controllerLabel={MIDDLE_NAME}
            controllerName="guarantorMiddleName"
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <InputController
            fieldType="text"
            controllerLabel={LAST_NAME}
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
            controllerName="guarantorLastName"
          />
        </Grid>
      </Grid>

      <Grid item md={12} sm={12} xs={12}>
        <Box pb={2}>
          <FormLabel component="legend">{GUARANTOR_NOTE}</FormLabel>
        </Box>

        <Grid container spacing={3}>
          <Grid item md={4} sm={12} xs={12}>
            <InputController
              fieldType="text"
              controllerLabel={SUFFIX}
              loading={getPatientLoading}
              disabled={shouldDisableEdit}
              controllerName="guarantorSuffix"
            />
          </Grid>

          <Grid item md={4} sm={12} xs={12}>
            <Selector
              addEmpty
              label={GUARANTOR_RELATION}
              disabled={shouldDisableEdit}
              name="guarantorRelationship"
              loading={getPatientLoading}
              options={MAPPED_RELATIONSHIP_TYPE}
            />
          </Grid>

          <Grid item md={4} sm={12} xs={12}>
            <InputController
              fieldType="text"
              controllerLabel={EMPLOYER}
              loading={getPatientLoading}
              disabled={shouldDisableEdit}
              controllerName="guarantorEmployerName"
            />
          </Grid>
        </Grid>
      </Grid>

      <FormControl component="fieldset" disabled={shouldDisableEdit}>
        <FormGroup>
          <Box mr={3} mb={2} mt={2}>
            <FormControlLabel
              label={SAME_AS_PATIENT}
              control={
                <Checkbox color="primary" checked={sameAddress}
                  onChange={({ target: { checked } }) => handleSameAddress(checked)}
                />
              }
            />
          </Box>
        </FormGroup>
      </FormControl>

      <Grid container spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <InputController
            fieldType="text"
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
            controllerLabel={ADDRESS_ONE}
            controllerName="guarantorAddress"
          />
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <InputController
            fieldType="text"
            disabled={shouldDisableEdit}
            loading={getPatientLoading}
            controllerLabel={ADDRESS_TWO}
            controllerName="guarantorAddress2"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item md={4} sm={12} xs={12}>
          <InputController
            fieldType="text"
            controllerLabel={ZIP_CODE}
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
            controllerName="guarantorZipCode"
          />
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          {isEdit ?
            <SnnController
              fieldType="text"
              controllerLabel={SSN}
              loading={getPatientLoading}
              disabled={shouldDisableEdit}
              controllerName="guarantorSsn"
            />
            :
            <InputController
              fieldType="text"
              controllerLabel={SSN}
              disabled={shouldDisableEdit}
              controllerName="guarantorSsn"
            />
          }
        </Grid>

        <Grid item md={4} sm={12} xs={12}>
          <PhoneField
            label={PHONE}
            name="guarantorPhone"
            disabled={shouldDisableEdit}
            loading={getPatientLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item lg={2} md={4} sm={12} xs={12}>
          <InputController
            fieldType="text"
            controllerLabel={CITY}
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
            controllerName="guarantorCity"
          />
        </Grid>

        <Grid item lg={2} md={4} sm={12} xs={12}>
          <Selector
            addEmpty
            label={STATE}
            name="guarantorState"
            options={MAPPED_STATES}
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
          />
        </Grid>

        <Grid item lg={2} md={4} sm={12} xs={12}>
          <CountryController loading={getPatientLoading} controllerName="guarantorCountry" />
        </Grid>

        <Grid item lg={6} md={12} sm={12} xs={12}>
          <InputController
            fieldType="email"
            controllerLabel={EMAIL}
            loading={getPatientLoading}
            disabled={shouldDisableEdit}
            controllerName="guarantorEmail"
          />
        </Grid>
      </Grid>
    </CardComponent>
  )
}

export default GuarantorCard;
