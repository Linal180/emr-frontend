// packages block
import { FC, useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import CardComponent from "../../../common/CardComponent";
import UpdateFacilityController from './UpdateFacilityController';
// utils, interfaces and graphql block
import history from "../../../../history";
import { setRecord } from '../../../../utils';
import { ListContext } from '../../../../context/listContext';
import { facilitySchema } from '../../../../validationSchemas';
import { CustomFacilityInputProps, ParamsType } from '../../../../interfacesTypes';
import { FacilityPayload, PracticeType, ServiceCode, useGetFacilityLazyQuery, useUpdateFacilityMutation } from "../../../../generated/graphql";
import { CLIA_ID_NUMBER, CODE, FACILITIES_ROUTE, MAPPED_SERVICE_CODES, FACILITY_INFO, FACILITY_UPDATED, INSURANCE_PLAN_TYPE, MAPPED_PRACTICE_TYPES, NAME, NPI, REVENUE_CODE, TAMXONOMY_CODE, UPDATE_FACILITY, CITY, COUNTRY, EMAIL, FAX, PHONE, STATE, ADDRESS, ADDRESS_2, BILLING_ADDRESS, FACILITY_CONTACT, FACILITY_IDS, FEDERAL_TAX_ID, MAMMOGRAPHY_CERTIFICATION_NUMBER, PRACTICE_TYPE, ZIP } from "../../../../constants";

const UpdateFacilityForm: FC = (): JSX.Element => {
  const { fetchAllFacilityList } = useContext(ListContext)
  const { id } = useParams<ParamsType>();
  const methods = useForm<CustomFacilityInputProps>({
    mode: "all",
    resolver: yupResolver(facilitySchema)
  });
  const { reset, handleSubmit, setValue, formState: { errors } } = methods;
  const [facility, setFacility] = useState<FacilityPayload['facility']>()

  const [getFacility] = useGetFacilityLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getFacility: { response, facility } } = data;

      if (response) {
        const { status } = response

        if (facility && status && status === 200) {
          const {
            name, cliaIdNumber, federalTaxId, insurancePlanType, mammographyCertificationNumber,
            npi, code, tamxonomyCode, revenueCode, practiceType, serviceCode,
            contacts, billingAddress,
          } = facility

          setFacility(facility)

          npi && setValue('npi', npi)
          name && setValue('name', name)
          code && setValue('code', code)
          revenueCode && setValue('revenueCode', revenueCode)
          cliaIdNumber && setValue('cliaIdNumber', cliaIdNumber)
          federalTaxId && setValue('federalTaxId', federalTaxId)
          tamxonomyCode && setValue('tamxonomyCode', tamxonomyCode)
          insurancePlanType && setValue('insurancePlanType', insurancePlanType)
          // serviceCode && setValue('serviceCode', setRecord(serviceCode, serviceCode))
          practiceType && setValue('practiceType', setRecord(practiceType, serviceCode))
          mammographyCertificationNumber && setValue('mammographyCertificationNumber', mammographyCertificationNumber)

          if (contacts) {
            const { email, phone, zipCode, mobile, fax, address, address2, city, state, country } = contacts[0]

            fax && setValue('fax', fax)
            city && setValue('city', city)
            email && setValue('email', email)
            state && setValue('state', state)
            phone && setValue('phone', phone)
            mobile && setValue('mobile', mobile)
            zipCode && setValue('zipCode', zipCode)
            address && setValue('address', address)
            country && setValue('country', country)
            address2 && setValue('address2', address2)
          }

          if (billingAddress) {
            const { email, zipCode, fax, address, address2, phone, city, state, country } = billingAddress[0]
            fax && setValue('billingFax', fax)
            city && setValue('billingCity', city)
            email && setValue('billingEmail', email)
            state && setValue('billingState', state)
            phone && setValue('billingPhone', phone)
            address && setValue('billingAddress', address)
            country && setValue('billingCountry', country)
            zipCode && setValue('billingZipCode', zipCode)
            address2 && setValue('billingAddress2', address2)
          }
        }
      }
    }
  });

  const [updateFacility, { loading }] = useUpdateFacilityMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateFacility: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(FACILITY_UPDATED);
          fetchAllFacilityList();
          reset()
          history.push(FACILITIES_ROUTE)
        }
      }
    }
  });

  useEffect(() => {
    if (id) {
      getFacility({
        variables: {
          getFacility: {
            id
          }
        }
      })
    } else {
      Alert.error('Facility not found!')
    }
  }, [getFacility, id])

  const onSubmit: SubmitHandler<CustomFacilityInputProps> = async (inputs) => {
    if (facility) {
      const {
        name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode, mammographyCertificationNumber,
        revenueCode, practiceType, serviceCode,
        phone, email, fax, city, state, country, address2, address, zipCode,
        billingPhone, billingEmail, billingFax, billingCity, billingState, billingCountry, billingAddress2,
        billingAddress, billingZipCode
      } = inputs;

      const { contacts, billingAddress: billing } = facility;

      if (id && contacts && billing) {
        const { id: contactId } = contacts[0]
        const { id: billingId } = billing[0]
        const { id: selectedPracticeType } = practiceType;
        const { id: selectedServiceCode } = serviceCode;

        await updateFacility({
          variables: {
            updateFacilityInput: {
              updateFacilityItemInput: {
                id, name: name || '', cliaIdNumber: cliaIdNumber || '', federalTaxId: federalTaxId || '',
                insurancePlanType: insurancePlanType || '', npi: npi || '', code: code || '',
                tamxonomyCode: tamxonomyCode || '', revenueCode: revenueCode || '',
                practiceType: selectedPracticeType as PracticeType || PracticeType.Hospital,
                serviceCode: selectedServiceCode as ServiceCode || ServiceCode.Ambulance_24,
                mammographyCertificationNumber: mammographyCertificationNumber || ''
              },

              updateContactInput: {
                id: contactId, phone: phone || '', email: email || '', fax: fax || '',
                city: city || '', state: state || '', country: country || '', zipCode: zipCode || '',
                address: address || '', address2: address2 || ''
              },

              updateBillingAddressInput: {
                id: billingId, phone: billingPhone || '', email: billingEmail || '', fax: billingFax || '', city: billingCity || '',
                state: billingState || '', country: billingCountry || '', zipCode: billingZipCode || '', address: billingAddress || '',
                address2: billingAddress2 || ''
              },
            }
          }
        })
      }
    }
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
    serviceCode: { message: serviceCodeError } = {},
    revenueCode: { message: revenueCodeError } = {},
    billingCity: { message: billingCityError } = {},
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
                <UpdateFacilityController
                  fieldType="text"
                  controllerName="name"
                  controllerLabel={NAME}
                  error={nameError}
                />

                <Selector
                  value={{ id: "", name: "" }}
                  label={PRACTICE_TYPE}
                  name="practiceType"
                  error={practiceTypeError}
                  options={MAPPED_PRACTICE_TYPES}
                />

                <UpdateFacilityController
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
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="cliaIdNumber"
                      controllerLabel={CLIA_ID_NUMBER}
                      error={cliaIdNumberError}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="federalTaxId"
                      controllerLabel={FEDERAL_TAX_ID}
                      error={federalTaxIdError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="tamxonomyCode"
                      controllerLabel={TAMXONOMY_CODE}
                      error={tamxonomyCodeError}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="revenueCode"
                      controllerLabel={REVENUE_CODE}
                      error={revenueCodeError}
                    />
                  </Grid>
                </Grid>

                <UpdateFacilityController
                  fieldType="text"
                  controllerName="insurancePlanType"
                  controllerLabel={INSURANCE_PLAN_TYPE}
                  error={insurancePlanTypeError}
                />

                <Grid container spacing={3}>
                  <Grid item md={6}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="mammographyCertificationNumber"
                      controllerLabel={MAMMOGRAPHY_CERTIFICATION_NUMBER}
                      error={mammographyCertificationNumberError}
                    />
                  </Grid>

                  <Grid item md={6}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="npi"
                      controllerLabel={NPI}
                      error={npiError}
                    />
                  </Grid>
                </Grid>

                <Selector
                  value={{ id: "", name: "" }}
                  label={PRACTICE_TYPE}
                  name="serviceCode"
                  error={serviceCodeError}
                  options={MAPPED_SERVICE_CODES}
                />
              </CardComponent>
            </Grid>

            <Grid item md={6}>
              <CardComponent cardTitle={BILLING_ADDRESS} isEdit={true}>
                <UpdateFacilityController
                  disabled
                  fieldType="text"
                  controllerName="billingEmail"
                  controllerLabel={EMAIL}
                  error={billingEmailError}
                />

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="billingPhone"
                      controllerLabel={PHONE}
                      error={billingPhoneError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="billingFax"
                      controllerLabel={FAX}
                      error={billingFaxError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="billingZipCode"
                      controllerLabel={ZIP}
                      error={billingZipCodeError}
                    />
                  </Grid>
                </Grid>

                <UpdateFacilityController
                  fieldType="text"
                  controllerName="billingAddress"
                  controllerLabel={ADDRESS}
                  error={billingAddressError}
                />

                <UpdateFacilityController
                  fieldType="text"
                  controllerName="billingAddress2"
                  controllerLabel={ADDRESS_2}
                  error={billingAddress2Error}
                />

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="billingCity"
                      controllerLabel={CITY}
                      error={billingCityError}
                    />

                  </Grid>

                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="billingState"
                      controllerLabel={STATE}
                      error={billingStateError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="billingCountry"
                      controllerLabel={COUNTRY}
                      error={billingCityError}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={FACILITY_CONTACT} isEdit={true}>
                <UpdateFacilityController
                  disabled
                  fieldType="text"
                  controllerName="email"
                  controllerLabel={EMAIL}
                  error={emailError}
                />

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="phone"
                      controllerLabel={PHONE}
                      error={phoneError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="fax"
                      controllerLabel={FAX}
                      error={faxError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="zipCode"
                      controllerLabel={ZIP}
                      error={zipCodeError}
                    />
                  </Grid>
                </Grid>

                <UpdateFacilityController
                  fieldType="text"
                  controllerName="address"
                  controllerLabel={ADDRESS}
                  error={addressError}
                />

                <UpdateFacilityController
                  fieldType="text"
                  controllerName="address2"
                  controllerLabel={ADDRESS_2}
                  error={address2Error}
                />

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                      error={cityError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <UpdateFacilityController
                      fieldType="text"
                      controllerName="state"
                      controllerLabel={STATE}
                      error={stateError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <UpdateFacilityController
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
            {UPDATE_FACILITY}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default UpdateFacilityForm;
