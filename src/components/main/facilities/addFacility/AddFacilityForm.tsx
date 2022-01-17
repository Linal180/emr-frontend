// packages block
import { FC, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, FormHelperText } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import CardComponent from "../../../common/CardComponent";
import AddFacilityController from "./AddFacilityController";
// utils, interfaces and graphql block
import history from "../../../../history";
import { facilitySchema } from '../../../../validationSchemas';
import { ListContext } from '../../../../context/listContext';
import { CustomUpdateFacilityInputProps } from '../../../../interfacesTypes';
import { PracticeType, ServiceCode, useCreateFacilityMutation } from "../../../../generated/graphql";
import {
  CITY, CLIA_ID_NUMBER, CODE, COUNTRY, FACILITY_IDS, CREATE_FACILITY, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  BILLING_ADDRESS, EMAIL, FACILITIES_ROUTE, FACILITY_INFO, FACILITY_CREATED, FAX, FORBIDDEN_EXCEPTION,
  INSURANCE_PLAN_TYPE, MAPPED_PRACTICE_TYPES, NAME, NPI, PHONE, REVENUE_CODE, STATE, TAMXONOMY_CODE,
  FACILITY_CONTACT, ZIP, ADDRESS, ADDRESS_2, PRACTICE_TYPE, FEDERAL_TAX_ID,
  MAMMOGRAPHY_CERTIFICATION_NUMBER, POS, MAPPED_SERVICE_CODES
} from "../../../../constants";

const AddFacilityForm: FC = (): JSX.Element => {
  const { fetchAllFacilityList } = useContext(ListContext)
  const methods = useForm<CustomUpdateFacilityInputProps>({
    mode: "all",
    resolver: yupResolver(facilitySchema)
  });

  const { reset, handleSubmit, formState: { errors } } = methods;

  const [createFacility, { loading }] = useCreateFacilityMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createFacility: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(FACILITY_CREATED);
          fetchAllFacilityList()
          reset()
          history.push(FACILITIES_ROUTE)
        }
      }
    }
  });

  const onSubmit: SubmitHandler<CustomUpdateFacilityInputProps> = async (inputs) => {
    const {
      name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode, mammographyCertificationNumber,
      revenueCode, practiceType, phone, email, fax, city, state, country, serviceCode, address, address2,
      zipCode,
    } = inputs;

    await createFacility({
      variables: {
        createFacilityInput: {
          createFacilityItemInput: {
            name: name || '', cliaIdNumber: cliaIdNumber || '', federalTaxId: federalTaxId || '', insurancePlanType: insurancePlanType || '', npi: npi || '', code: code || '', tamxonomyCode: tamxonomyCode || '', revenueCode: revenueCode || '', practiceType: practiceType || PracticeType.Hospital, serviceCode: serviceCode || ServiceCode.Ambulance_24, mammographyCertificationNumber: mammographyCertificationNumber || ''
          },

          createContactInput: { phone: phone || '', email: email || '', fax: fax || '', city: city || '', state: state || '', country: country || '', zipCode: zipCode || '', address: address || '', address2: address2 || '' },
          createBillingAddressInput: { phone: phone || '', email: email || '', fax: fax || '', city: city || '', state: state || '', country: country || '', zipCode: zipCode || '', address: address || '', address2: address2 || '' },
        }
      }
    })
  };

  const {
    npi: { message: npiError } = {},
    fax: { message: faxError } = {},
    name: { message: nameError } = {},
    code: { message: codeError } = {},
    city: { message: cityError } = {},
    state: { message: stateError } = {},
    email: { message: emailError } = {},
    phone: { message: phoneError } = {},
    country: { message: countryError } = {},
    zipCode: { message: zipCodeError } = {},
    address: { message: addressError } = {},
    address2: { message: address2Error } = {},
    billingFax: { message: billingFaxError } = {},
    billingCity: { message: billingCityError } = {},
    serviceCode: { message: serviceCodeError } = {},
    revenueCode: { message: revenueCodeError } = {},
    cliaIdNumber: { message: cliaIdNumberError } = {},
    federalTaxId: { message: federalTaxIdError } = {},
    practiceType: { message: practiceTypeError } = {},
    billingPhone: { message: billingPhoneError } = {},
    billingEmail: { message: billingEmailError } = {},
    billingState: { message: billingStateError } = {},
    tamxonomyCode: { message: tamxonomyCodeError } = {},
    billingAddress: { message: billingAddressError } = {},
    billingZipCode: { message: billingZipCodeError } = {},
    billingAddress2: { message: billingAddress2Error } = {},
    insurancePlanType: { message: insurancePlanTypeError } = {},
    mammographyCertificationNumber: { message: mammographyCertificationNumberError } = {},
  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={FACILITY_INFO} isEdit={true}>
                <AddFacilityController
                  fieldType="text"
                  controllerName="name"
                  controllerLabel={NAME}
                  error={nameError}
                />

                <Controller
                  name="practiceType"
                  defaultValue={PracticeType.Hospital}
                  render={({ field }) => (
                    <FormControl fullWidth margin='normal' error={Boolean(practiceTypeError)}>
                      <InputLabel id="practiceType" shrink>{PRACTICE_TYPE}</InputLabel>
                      <Select
                        labelId="practiceType"
                        id="practiceType-id"
                        variant="outlined"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {MAPPED_PRACTICE_TYPES.map((type, index: number) => {
                          const { label, value } = type;

                          return <MenuItem key={index} value={value}>{label}</MenuItem>;
                        })}
                      </Select>
                      <FormHelperText>{practiceTypeError && practiceTypeError}</FormHelperText>
                    </FormControl>
                  )}
                />

                <AddFacilityController
                  fieldType="text"
                  controllerName="code"
                  controllerLabel={CODE}
                  error={codeError}
                />
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={FACILITY_IDS} isEdit={true}>
                <Grid container spacing={3}>
                  <Grid item md={6}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="cliaIdNumber"
                      controllerLabel={CLIA_ID_NUMBER}
                      error={cliaIdNumberError}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="federalTaxId"
                      controllerLabel={FEDERAL_TAX_ID}
                      error={federalTaxIdError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="tamxonomyCode"
                      controllerLabel={TAMXONOMY_CODE}
                      error={tamxonomyCodeError}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="revenueCode"
                      controllerLabel={REVENUE_CODE}
                      error={revenueCodeError}
                    />
                  </Grid>
                </Grid>

                <AddFacilityController
                  fieldType="text"
                  controllerName="insurancePlanType"
                  controllerLabel={INSURANCE_PLAN_TYPE}
                  error={insurancePlanTypeError}
                />

                <Grid container spacing={3}>
                  <Grid item md={6}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="mammographyCertificationNumber"
                      controllerLabel={MAMMOGRAPHY_CERTIFICATION_NUMBER}
                      error={mammographyCertificationNumberError}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="npi"
                      controllerLabel={NPI}
                      error={npiError}
                    />
                  </Grid>
                </Grid>

                <Controller
                  name="serviceCode"
                  defaultValue={ServiceCode.Ambulance_24}
                  render={({ field }) => (
                    <FormControl fullWidth margin='normal' error={Boolean(serviceCodeError)}>
                      <InputLabel id="serviceCode" shrink>{POS}</InputLabel>
                      <Select
                        labelId="serviceCode"
                        id="serviceCode-id"
                        variant="outlined"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {MAPPED_SERVICE_CODES.map((code, index: number) => {
                          const { label, value } = code;

                          return <MenuItem key={index} value={value}>{label}</MenuItem>;
                        })}
                      </Select>

                      <FormHelperText>{practiceTypeError && practiceTypeError}</FormHelperText>
                    </FormControl>
                  )}
                />
              </CardComponent>
            </Grid>

            <Grid item md={6}>
              <CardComponent cardTitle={BILLING_ADDRESS} isEdit={true}>
                <AddFacilityController
                  fieldType="text"
                  controllerName="billingEmail"
                  controllerLabel={EMAIL}
                  error={billingEmailError}
                />

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="billingPhone"
                      controllerLabel={PHONE}
                      error={billingPhoneError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="billingFax"
                      controllerLabel={FAX}
                      error={billingFaxError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="billingZipCode"
                      controllerLabel={ZIP}
                      error={billingZipCodeError}
                    />
                  </Grid>
                </Grid>

                <AddFacilityController
                  fieldType="text"
                  controllerName="billingAddress"
                  controllerLabel={ADDRESS}
                  error={billingAddressError}
                />

                <AddFacilityController
                  fieldType="text"
                  controllerName="billingAddress2"
                  controllerLabel={ADDRESS_2}
                  error={billingAddress2Error}
                />

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="billingCity"
                      controllerLabel={CITY}
                      error={billingCityError}
                    />

                  </Grid>

                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="billingState"
                      controllerLabel={STATE}
                      error={billingStateError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="billingCountry"
                      controllerLabel={COUNTRY}
                      error={billingStateError}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={FACILITY_CONTACT} isEdit={true}>
                <AddFacilityController
                  fieldType="text"
                  controllerName="email"
                  controllerLabel={EMAIL}
                  error={emailError}
                />

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="phone"
                      controllerLabel={PHONE}
                      error={phoneError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="fax"
                      controllerLabel={FAX}
                      error={faxError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="zipCode"
                      controllerLabel={ZIP}
                      error={zipCodeError}
                    />
                  </Grid>
                </Grid>

                <AddFacilityController
                  fieldType="text"
                  controllerName="address"
                  controllerLabel={ADDRESS}
                  error={addressError}
                />

                <AddFacilityController
                  fieldType="text"
                  controllerName="address2"
                  controllerLabel={ADDRESS_2}
                  error={address2Error}
                />

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                      error={cityError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="state"
                      controllerLabel={STATE}
                      error={stateError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="country"
                      controllerLabel={COUNTRY}
                      error={countryError}
                    />
                  </Grid>
                </Grid>
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {CREATE_FACILITY}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form >
    </FormProvider>
  );
};

export default AddFacilityForm;
