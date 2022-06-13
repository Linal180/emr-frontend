// packages block
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid } from "@material-ui/core";
// components block
import Selector from "../../../common/Selector";
import PhoneField from "../../../common/PhoneInput";
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from "../../../common/ViewDataLoader";
// interfaces, utils block
import { setRecord } from "../../../../utils";
import InputController from "../../../../controller";
import { ActionType } from "../../../../reducers/patientReducer";
import { PatientCardsProps, PatientInputProps } from "../../../../interfacesTypes";
import {
  ADDRESS, ADDRESS_2, CITY, COUNTRY, EMAIL, EMPLOYER, FIRST_NAME, GUARANTOR, GUARANTOR_NOTE, GUARANTOR_RELATION, LAST_NAME,
  MAPPED_COUNTRIES, MAPPED_RELATIONSHIP_TYPE, MAPPED_STATES,
  MIDDLE_NAME, PHONE, SAME_AS_PATIENT, SSN, STATE, SUFFIX, ZIP_CODE
} from "../../../../constants";

const GuarantorCard: FC<PatientCardsProps> = ({ getPatientLoading, state, dispatch, shouldDisableEdit }) => {
  const methods = useFormContext<PatientInputProps>()
  const { sameAddress } = state || {}
  const { watch, setValue } = methods
  const { basicAddress, basicAddress2, basicCity, basicCountry, basicEmail, basicState, basicZipCode } = watch()

  const copyAddress = () => {
    basicAddress && setValue("guarantorAddress", basicAddress)
    basicAddress2 && setValue("guarantorAddress2", basicAddress2)
    basicZipCode && setValue("guarantorZipCode", basicZipCode)
    basicCity && setValue("guarantorCity", basicCity)
    basicState && setValue("guarantorState", basicState)
    basicCountry && setValue("guarantorCountry", basicCountry)
    basicEmail && setValue("guarantorEmail", basicEmail)
  };

  const resetAddress = () => {
    setValue("guarantorAddress", '')
    setValue("guarantorAddress2", '')
    setValue("guarantorZipCode", '')
    setValue("guarantorCity", '')
    setValue("guarantorState", setRecord('', ''))
    setValue("guarantorCountry", setRecord('', ''))
    setValue("guarantorEmail", '')
  };

  const setAddressValues = (checked: boolean) => checked ? copyAddress() : resetAddress()

  const handleSameAddress = (checked: boolean) => {
    dispatch && dispatch({ type: ActionType.SET_SAME_ADDRESS, sameAddress: checked })

    setAddressValues(checked);
  }

  return (
    <CardComponent cardTitle={GUARANTOR}>
      {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Grid item md={12} sm={12} xs={12}>
            <Selector
              addEmpty
              disabled={shouldDisableEdit}
              name="guarantorRelationship"
              label={GUARANTOR_RELATION}
              options={MAPPED_RELATIONSHIP_TYPE}
            />
          </Grid>

          <Box pb={2}>
            <FormLabel component="legend">{GUARANTOR_NOTE}</FormLabel>
          </Box>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="guarantorSuffix"
                controllerLabel={SUFFIX}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="guarantorFirstName"
                controllerLabel={FIRST_NAME}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="guarantorMiddleName"
                controllerLabel={MIDDLE_NAME}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="guarantorLastName"
                controllerLabel={LAST_NAME}
              />
            </Grid>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="guarantorEmployerName"
              controllerLabel={EMPLOYER}
            />
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

          <Grid item md={12} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="guarantorZipCode"
              controllerLabel={ZIP_CODE}
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="guarantorAddress"
              controllerLabel={ADDRESS}
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="text"
              controllerName="guarantorAddress2"
              controllerLabel={ADDRESS_2}
            />
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={4}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="guarantorCity"
                controllerLabel={CITY}
              />
            </Grid>

            <Grid item md={4}>
              <Selector
                addEmpty
                disabled={shouldDisableEdit}
                name="guarantorState"
                label={STATE}
                options={MAPPED_STATES}
              />
            </Grid>

            <Grid item md={4}>
              <Selector
                addEmpty
                disabled={shouldDisableEdit}
                name="guarantorCountry"
                label={COUNTRY}
                options={MAPPED_COUNTRIES}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <InputController
                disabled={shouldDisableEdit}
                fieldType="text"
                controllerName="guarantorSsn"
                controllerLabel={SSN}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <PhoneField name="guarantorPhone" label={PHONE} disabled={shouldDisableEdit} />
            </Grid>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <InputController
              disabled={shouldDisableEdit}
              fieldType="email"
              controllerName="guarantorEmail"
              controllerLabel={EMAIL}
            />
          </Grid>
        </>
      )}
    </CardComponent>
  )
}

export default GuarantorCard;
