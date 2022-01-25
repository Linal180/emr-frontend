// packages block
import { FC, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import CardComponent from "../../../common/CardComponent";
import AddFacilityController from "./AddFacilityController";
// utils, interfaces and graphql block
import history from "../../../../history";
import { facilitySchema } from '../../../../validationSchemas';
import { ListContext } from '../../../../context/listContext';
import { CustomFacilityInputProps } from '../../../../interfacesTypes';
import { PracticeType, ServiceCode, useCreateFacilityMutation } from "../../../../generated/graphql";
import {
  CITY, CLIA_ID_NUMBER, CODE, COUNTRY, FACILITY_IDS, CREATE_FACILITY, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  BILLING_ADDRESS, EMAIL, FACILITIES_ROUTE, FACILITY_INFO, FACILITY_CREATED, FAX, FORBIDDEN_EXCEPTION,
  INSURANCE_PLAN_TYPE, MAPPED_PRACTICE_TYPES, NAME, NPI, PHONE, REVENUE_CODE, STATE, TAMXONOMY_CODE,
  FACILITY_CONTACT, ZIP, ADDRESS, ADDRESS_2, PRACTICE_TYPE, FEDERAL_TAX_ID,
  MAMMOGRAPHY_CERTIFICATION_NUMBER, MAPPED_SERVICE_CODES, SERVICE_CODE
} from "../../../../constants";

const AddFacilityForm: FC = (): JSX.Element => {
  const { fetchAllFacilityList } = useContext(ListContext)
  const methods = useForm<CustomFacilityInputProps>({
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

  const onSubmit: SubmitHandler<CustomFacilityInputProps> = async (inputs) => {
    const {
      name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode, mammographyCertificationNumber,
      revenueCode, practiceType, serviceCode,
      phone, email, fax, city, state, country, address, address2, zipCode,
      billingPhone, billingEmail, billingFax, billingCity, billingState, billingCountry, billingAddress2,
      billingAddress, billingZipCode
    } = inputs;

    const { id: selectedPracticeType } = practiceType;
    const { id: selectedServiceCode } = serviceCode;

    await createFacility({
      variables: {
        createFacilityInput: {
          createFacilityItemInput: {
            name: name || '', cliaIdNumber: cliaIdNumber || '', federalTaxId: federalTaxId || '',
            insurancePlanType: insurancePlanType || '', npi: npi || '', code: code || '',
            tamxonomyCode: tamxonomyCode || '', revenueCode: revenueCode || '',
            practiceType: selectedPracticeType as PracticeType || PracticeType.Hospital, serviceCode:
              selectedServiceCode as ServiceCode || ServiceCode.Ambulance_24, mammographyCertificationNumber: mammographyCertificationNumber || ''
          },

          createContactInput: {
            phone: phone || '', email: email || '', fax: fax || '', city: city || '',
            state: state || '', country: country || '', zipCode: zipCode || '', address: address || '',
            address2: address2 || ''
          },
          createBillingAddressInput: {
            phone: billingPhone || '', email: billingEmail || '', fax: billingFax || '', city: billingCity || '',
            state: billingState || '', country: billingCountry || '', zipCode: billingZipCode || '', address: billingAddress || '',
            address2: billingAddress2 || ''
          },
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
    billingCountry: { message: billingCountryError } = {},
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

                <Grid container spacing={3}>
                  <Grid item md={6}>
                    <Selector
                      value={{ id: "", name: "" }}
                      label={PRACTICE_TYPE}
                      name="practiceType"
                      error={practiceTypeError}
                      options={MAPPED_PRACTICE_TYPES}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="code"
                      controllerLabel={CODE}
                      error={codeError}
                    />
                  </Grid>
                </Grid>
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

                <Selector
                  value={{ id: "", name: "" }}
                  label={SERVICE_CODE}
                  name="serviceCode"
                  error={serviceCodeError}
                  options={MAPPED_SERVICE_CODES}
                />

              </CardComponent>
            </Grid>

            <Grid item md={6}>
              <CardComponent cardTitle={BILLING_ADDRESS} isEdit={true}>
                <Grid container spacing={3}>
                  <Grid item md={8}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="billingEmail"
                      controllerLabel={EMAIL}
                      error={billingEmailError}
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

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="billingPhone" error={billingPhoneError} label={PHONE} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="billingFax" error={billingFaxError} label={FAX} />
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
                      error={billingCountryError}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={FACILITY_CONTACT} isEdit={true}>
                <Grid container spacing={3}>
                  <Grid item md={8}>
                    <AddFacilityController
                      fieldType="text"
                      controllerName="email"
                      controllerLabel={EMAIL}
                      error={emailError}
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

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="phone" error={phoneError} label={PHONE} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="fax" error={faxError} label={FAX} />
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
      </form>
    </FormProvider>
  );
};

export default AddFacilityForm;
