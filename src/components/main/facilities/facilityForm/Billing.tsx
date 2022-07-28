// packages block
import {
  Box, Button, Checkbox, Collapse, FormControl, FormControlLabel, FormGroup, Grid, Typography
} from "@material-ui/core"
import { AddCircleOutline } from "@material-ui/icons"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
// components block
import CountryController from "../../../../controller/CountryController"
import CardComponent from "../../../common/CardComponent"
import PhoneField from "../../../common/PhoneInput"
import TaxonomySelector from "../../../common/Selector/TaxonomySelector"
import Selector from "../../../common/Selector"
// constants, interface block
import {
  ADDRESS_ONE, ADDRESS_TWO, ADD_FACILITY_BILLING, BILLING_IDENTIFIER, BILLING_PROFILE, CANCEL, CITY,
  CLIA_ID_NUMBER, CLIA_ID_NUMBER_INFO, EMAIL, EMPTY_OPTION, FAX, FEDERAL_TAX_ID, FEDERAL_TAX_ID_INFO, MAMMOGRAPHY_CERTIFICATION_NUMBER, MAMOGRAPHY_CERTIFICATION_NUMBER_INFO, MAPPED_STATES, NPI, NPI_INFO, PAYABLE_ADDRESS, PHONE, SAME_AS_FACILITY_LOCATION, STATE, TAXONOMY_CODE, USA, ZIP
} from "../../../../constants"
import InputController from "../../../../controller"
import { CustomFacilityInputProps, FacilityCardsProps } from "../../../../interfacesTypes"
import { ActionType } from "../../../../reducers/facilityReducer"
import { setRecord } from "../../../../utils"

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
    setValue("billingCountry", USA)
    setValue("billingState", setRecord('', ''))
  };

  const copyAddress = () => {
    fax && setValue("billingFax", fax)
    city && setValue("billingCity", city)
    phone && setValue("billingPhone", phone)
    email && setValue("billingEmail", email)
    zipCode && setValue("billingZipCode", zipCode)
    address && setValue("billingAddress", address)
    address2 && setValue("billingAddress2", address2)
    inputState && setValue("billingState", inputState)
    country && setValue("billingCountry", country || USA)
  };

  const handleSameAddress = (checked: boolean) => {
    dispatch && dispatch({ type: ActionType.SET_SAME_ADDRESS, sameAddress: checked })

    setBillingValues(checked);
  }

  const setBillingValues = (checked: boolean) => checked ? copyAddress() : resetBillingAddress()

  return (
    <CardComponent cardTitle={BILLING_PROFILE}>
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
                loading={getFacilityLoading}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
              <InputController
                fieldType="text"
                controllerName="billingZipCode"
                controllerLabel={ZIP}
                loading={getFacilityLoading}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6} sm={12} xs={12}>
              <PhoneField name="billingPhone" label={PHONE} loading={getFacilityLoading} />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <PhoneField name="billingFax" label={FAX} loading={getFacilityLoading} />
            </Grid>
          </Grid>

          <InputController
            fieldType="text"
            controllerName="billingAddress"
            controllerLabel={ADDRESS_ONE}
            loading={getFacilityLoading}
          />

          <InputController
            fieldType="text"
            controllerName="billingAddress2"
            controllerLabel={ADDRESS_TWO}
            loading={getFacilityLoading}
          />

          <Grid container spacing={3}>
            <Grid item md={4}>
              <InputController
                fieldType="text"
                controllerName="billingCity"
                controllerLabel={CITY}
                loading={getFacilityLoading}
              />
            </Grid>

            <Grid item md={4}>
              <Selector
                value={EMPTY_OPTION}
                label={STATE}
                name="billingState"
                options={MAPPED_STATES}
                loading={getFacilityLoading}
              />
            </Grid>

            <Grid item md={4}>
              <CountryController loading={getFacilityLoading} controllerName="billingCountry" />
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
                loading={getFacilityLoading}
              />
            </Grid>

            <Grid item md={6}>
              <InputController
                info={FEDERAL_TAX_ID_INFO}
                fieldType="text"
                controllerName="federalTaxId"
                controllerLabel={FEDERAL_TAX_ID}
                loading={getFacilityLoading}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={6}>
              <TaxonomySelector
                label={TAXONOMY_CODE}
                name="tamxonomyCode"
                loading={getFacilityLoading}
                addEmpty
              />
            </Grid>

            <Grid item md={6}>
              <InputController
                info={NPI_INFO}
                fieldType="text"
                controllerName="npi"
                controllerLabel={NPI}
                loading={getFacilityLoading}
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
                loading={getFacilityLoading}
              />
            </Grid>
          </Grid>
        </Collapse>
      </>
    </CardComponent>
  )
};

export default BillingProfileCard;
