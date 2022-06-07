// packages block
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { AddCircleOutline } from "@material-ui/icons"
import { Box, Button, Checkbox, Collapse, FormControl, FormControlLabel, FormGroup, Grid, Typography } from "@material-ui/core"
// components block
import Selector from "../../../common/Selector"
import PhoneField from "../../../common/PhoneInput"
import CardComponent from "../../../common/CardComponent"
import ViewDataLoader from "../../../common/ViewDataLoader"
// constants, interface block
import { setRecord } from "../../../../utils"
import InputController from "../../../../controller"
import { ActionType } from "../../../../reducers/facilityReducer"
import { CustomFacilityInputProps, FacilityCardsProps } from "../../../../interfacesTypes"
import {
  SAME_AS_FACILITY_LOCATION, STATE, TAXONOMY_CODE, TAXONOMY_CODE_INFO, ZIP,
  ADDRESS, ADDRESS_2, ADD_FACILITY_BILLING, BILLING_IDENTIFIER, BILLING_PROFILE, CANCEL, CITY, CLIA_ID_NUMBER,
  MAMOGRAPHY_CERTIFICATION_NUMBER_INFO, MAPPED_COUNTRIES, MAPPED_STATES, NPI, NPI_INFO, PAYABLE_ADDRESS, PHONE,
  CLIA_ID_NUMBER_INFO, COUNTRY, EMAIL, EMPTY_OPTION, FAX, FEDERAL_TAX_ID, FEDERAL_TAX_ID_INFO, MAMMOGRAPHY_CERTIFICATION_NUMBER
} from "../../../../constants"

const BillingProfileCard: FC<FacilityCardsProps> = ({ getFacilityLoading, state, dispatch }) => {
  const { addBilling } = state || {}
  const methods = useFormContext<CustomFacilityInputProps>()
  const { sameAddress } = state || {}
  const { watch, setValue } = methods
  const { email, zipCode, phone, fax, address, address2, city, state: inputState, country } = watch()


  const cancelBilling = () => {
    dispatch && dispatch({ type: ActionType.SET_SAME_ADDRESS, sameAddress: false })
    dispatch && dispatch({ type: ActionType.SET_ADD_BILLING, addBilling: !addBilling })

    resetBillingAddress()
  };

  const resetBillingAddress = () => {
    setValue("billingFax", '')
    setValue("billingCity", '')
    setValue("billingPhone", '')
    setValue("billingEmail", '')
    setValue("billingAddress", '')
    setValue("billingZipCode", '')
    setValue("billingAddress2", '')
    setValue("billingState", setRecord('', ''))
    setValue("billingCountry", setRecord('', ''))
  };

  const copyAddress = () => {
    fax && setValue("billingFax", fax)
    city && setValue("billingCity", city)
    phone && setValue("billingPhone", phone)
    email && setValue("billingEmail", email)
    inputState && setValue("billingState", inputState)
    zipCode && setValue("billingZipCode", zipCode)
    address && setValue("billingAddress", address)
    country && setValue("billingCountry", country)
    address2 && setValue("billingAddress2", address2)
  };

  const handleSameAddress = (checked: boolean) => {
    dispatch && dispatch({ type: ActionType.SET_SAME_ADDRESS, sameAddress: checked })

    setBillingValues(checked);
  }

  const setBillingValues = (checked: boolean) => checked ? copyAddress() : resetBillingAddress()


  return (

    <CardComponent cardTitle={BILLING_PROFILE}>
      {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
        <>
          <Collapse in={!addBilling} mountOnEnter unmountOnExit>
            <Box pb={3}
              onClick={() => dispatch && dispatch({ type: ActionType.SET_ADD_BILLING, addBilling: !addBilling })}
              className="billing-box" display="flex" alignItems="center"
            >
              <AddCircleOutline color='inherit' />

              <Typography>{ADD_FACILITY_BILLING}</Typography>
            </Box>
          </Collapse>

          <Collapse in={addBilling} mountOnEnter unmountOnExit>
            <Box display="flex" alignItems="center" justifyContent="space-between" onClick={cancelBilling}>
              <Typography component="p" variant='h5'>{PAYABLE_ADDRESS}</Typography>
              <Button color='secondary' variant='contained'>{CANCEL}</Button>
            </Box>

            <FormControl component="fieldset">
              <FormGroup>
                <Box mr={3} mb={2} mt={2}>
                  <FormControlLabel
                    label={SAME_AS_FACILITY_LOCATION}
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
              <Grid item xs={12} sm={12} md={8}>
                <InputController
                  fieldType="text"
                  controllerName="billingEmail"
                  controllerLabel={EMAIL}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4}>
                <InputController
                  fieldType="text"
                  controllerName="billingZipCode"
                  controllerLabel={ZIP}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6} sm={12} xs={12}>
                <PhoneField name="billingPhone" label={PHONE} />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <PhoneField name="billingFax" label={FAX} />
              </Grid>
            </Grid>

            <InputController
              fieldType="text"
              controllerName="billingAddress"
              controllerLabel={ADDRESS}
            />

            <InputController
              fieldType="text"
              controllerName="billingAddress2"
              controllerLabel={ADDRESS_2}
            />

            <Grid container spacing={3}>
              <Grid item md={4}>
                <InputController
                  fieldType="text"
                  controllerName="billingCity"
                  controllerLabel={CITY}
                />
              </Grid>

              <Grid item md={4}>
                <Selector
                  value={EMPTY_OPTION}
                  label={STATE}
                  name="billingState"
                  options={MAPPED_STATES}
                />
              </Grid>

              <Grid item md={4}>
                <Selector
                  label={COUNTRY}
                  value={EMPTY_OPTION}
                  name="billingCountry"
                  options={MAPPED_COUNTRIES}
                />
              </Grid>
            </Grid>

            <Box py={2}>
              <Typography component="p" variant='h5'>{BILLING_IDENTIFIER}</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item md={6}>
                <InputController
                  info={CLIA_ID_NUMBER_INFO}
                  fieldType="text"
                  controllerName="cliaIdNumber"
                  controllerLabel={CLIA_ID_NUMBER}
                />
              </Grid>

              <Grid item md={6}>
                <InputController
                  info={FEDERAL_TAX_ID_INFO}
                  fieldType="text"
                  controllerName="federalTaxId"
                  controllerLabel={FEDERAL_TAX_ID}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6}>
                <InputController
                  info={TAXONOMY_CODE_INFO}
                  fieldType="text"
                  controllerName="tamxonomyCode"
                  controllerLabel={TAXONOMY_CODE}
                />
              </Grid>

              <Grid item md={6}>
                <InputController
                  info={NPI_INFO}
                  fieldType="text"
                  controllerName="npi"
                  controllerLabel={NPI}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item md={6}>
                <InputController
                  info={MAMOGRAPHY_CERTIFICATION_NUMBER_INFO}
                  fieldType="text"
                  controllerName="mammographyCertificationNumber"
                  controllerLabel={MAMMOGRAPHY_CERTIFICATION_NUMBER}
                />
              </Grid>
            </Grid>
          </Collapse>
        </>
      )}
    </CardComponent>
  )
};

export default BillingProfileCard;
