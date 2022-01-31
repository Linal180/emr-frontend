// packages block
import { FC, useEffect, useState, useContext } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import FacilityController from '../controllers';
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// utils, interfaces and graphql block
import history from "../../../../history";
import { setRecord } from '../../../../utils';
import { ListContext } from '../../../../context/listContext';
import { facilitySchema } from '../../../../validationSchemas';
import { CustomFacilityInputProps, GeneralFormProps } from '../../../../interfacesTypes';
import {
  FacilityPayload, PracticeType, ServiceCode, useCreateFacilityMutation, useGetFacilityLazyQuery,
  useUpdateFacilityMutation
} from "../../../../generated/graphql";
import {
  ADDRESS_2, BILLING_ADDRESS, FACILITY_CONTACT, FACILITY_IDS, FEDERAL_TAX_ID,
  CLIA_ID_NUMBER, CODE, FACILITIES_ROUTE, MAPPED_SERVICE_CODES, FACILITY_INFO,
  TAXONOMY_CODE, UPDATE_FACILITY, CITY, COUNTRY, EMAIL, FAX, PHONE, STATE, ADDRESS,
  FACILITY_UPDATED, INSURANCE_PLAN_TYPE, MAPPED_PRACTICE_TYPES, NAME, NPI, REVENUE_CODE,
  MAMMOGRAPHY_CERTIFICATION_NUMBER, PRACTICE_TYPE, ZIP, SERVICE_CODE, FACILITY_NOT_FOUND,
  TIME_ZONE_TEXT, MAPPED_TIME_ZONES, CREATE_FACILITY, EMPTY_OPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, FACILITY_CREATED, FORBIDDEN_EXCEPTION
} from "../../../../constants";

const FacilityForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { fetchAllFacilityList } = useContext(ListContext)
  const methods = useForm<CustomFacilityInputProps>({
    mode: "all",
    resolver: yupResolver(facilitySchema)
  });
  const { reset, handleSubmit, setValue, formState: { errors } } = methods;
  const [facility, setFacility] = useState<FacilityPayload['facility']>()

  const [getFacility, { loading: getFacilityLoading }] = useGetFacilityLazyQuery({
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
            npi, code, tamxonomyCode, revenueCode, practiceType, serviceCode, timeZone,
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
          timeZone && setValue('timeZone', setRecord(timeZone, timeZone))
          insurancePlanType && setValue('insurancePlanType', insurancePlanType)
          serviceCode && setValue('serviceCode', setRecord(serviceCode, serviceCode))
          practiceType && setValue('practiceType', setRecord(practiceType, practiceType))
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

  const [createFacility, { loading: createFacilityLoading }] = useCreateFacilityMutation({
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
          reset()
          Alert.success(FACILITY_CREATED);
          fetchAllFacilityList()
          history.push(FACILITIES_ROUTE)
        }
      }
    }
  });

  const [updateFacility, { loading: updateFacilityLoading }] = useUpdateFacilityMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateFacility: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          reset()
          Alert.success(FACILITY_UPDATED);
          fetchAllFacilityList();
          history.push(FACILITIES_ROUTE)
        }
      }
    }
  });

  useEffect(() => {
    if (isEdit) {
      if (id) {
        getFacility({
          variables: {
            getFacility: { id }
          }
        })
      } else {
        Alert.error(FACILITY_NOT_FOUND)
      }
    }
  }, [getFacility, isEdit, id])

  const onSubmit: SubmitHandler<CustomFacilityInputProps> = async (inputs) => {
    const {
      name, cliaIdNumber, federalTaxId, insurancePlanType, npi, code, tamxonomyCode,
      mammographyCertificationNumber, revenueCode, practiceType, serviceCode,
      phone, email, fax, city, state, country, address2, address, zipCode,
      billingPhone, billingEmail, billingFax, billingCity, billingState, billingCountry, billingAddress2,
      billingAddress, billingZipCode, timeZone
    } = inputs;

    const { name: timeZoneName } = timeZone
    const { id: selectedServiceCode } = serviceCode;
    const { id: selectedPracticeType } = practiceType;

    if (isEdit) {
      const { contacts, billingAddress: billing } = facility || {};

      if (id && contacts && billing) {
        const { id: contactId } = contacts[0]
        const { id: billingId } = billing[0]

        await updateFacility({
          variables: {
            updateFacilityInput: {
              updateFacilityItemInput: {
                id, name: name || '', cliaIdNumber: cliaIdNumber || '', federalTaxId: federalTaxId || '',
                insurancePlanType: insurancePlanType || '', npi: npi || '', code: code || '',
                timeZone: timeZoneName || '', tamxonomyCode: tamxonomyCode || '',
                practiceType: selectedPracticeType as PracticeType || PracticeType.Hospital,
                serviceCode: selectedServiceCode as ServiceCode || ServiceCode.Ambulance_24,
                mammographyCertificationNumber: mammographyCertificationNumber || '',
                revenueCode: revenueCode || '',
              },

              updateContactInput: {
                id: contactId, phone: phone || '', email: email || '', fax: fax || '',
                city: city || '', state: state || '', country: country || '', zipCode: zipCode || '',
                address: address || '', address2: address2 || ''
              },

              updateBillingAddressInput: {
                id: billingId, phone: billingPhone || '', email: billingEmail || '', fax: billingFax || '',
                state: billingState || '', country: billingCountry || '', zipCode: billingZipCode || '',
                city: billingCity || '', address: billingAddress || '', address2: billingAddress2 || ''
              },
            }
          }
        })
      }
    } else {
      await createFacility({
        variables: {
          createFacilityInput: {
            createFacilityItemInput: {
              name: name || '', cliaIdNumber: cliaIdNumber || '', federalTaxId: federalTaxId || '',
              insurancePlanType: insurancePlanType || '', npi: npi || '', code: code || '',
              timeZone: timeZoneName || '', tamxonomyCode: tamxonomyCode || '', revenueCode: revenueCode || '',
              practiceType: selectedPracticeType as PracticeType || PracticeType.Hospital,
              serviceCode: selectedServiceCode as ServiceCode || ServiceCode.Ambulance_24,
              mammographyCertificationNumber: mammographyCertificationNumber || '',
            },

            createContactInput: {
              phone: phone || '', email: email || '', fax: fax || '', city: city || '',
              state: state || '', country: country || '', zipCode: zipCode || '', address: address || '',
              address2: address2 || ''
            },

            createBillingAddressInput: {
              phone: billingPhone || '', email: billingEmail || '', fax: billingFax || '', city: billingCity || '',
              state: billingState || '', country: billingCountry || '', zipCode: billingZipCode || '',
              address: billingAddress || '', address2: billingAddress2 || ''
            },
          }
        }
      })
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
    timeZone: { id: timeZoneError } = {},
    country: { message: countryError } = {},
    zipCode: { message: zipCodeError } = {},
    address: { message: addressError } = {},
    address2: { message: address2Error } = {},
    serviceCode: { id: serviceCodeError } = {},
    practiceType: { id: practiceTypeError } = {},
    billingFax: { message: billingFaxError } = {},
    revenueCode: { message: revenueCodeError } = {},
    billingCity: { message: billingCityError } = {},
    cliaIdNumber: { message: cliaIdNumberError } = {},
    federalTaxId: { message: federalTaxIdError } = {},
    billingPhone: { message: billingPhoneError } = {},
    billingEmail: { message: billingEmailError } = {},
    billingState: { message: billingStateError } = {},
    tamxonomyCode: { message: tamxonomyCodeError } = {},
    billingCountry: { message: billingCountryError } = {},
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
                {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <FacilityController
                      isRequired
                      fieldType="text"
                      controllerName="name"
                      controllerLabel={NAME}
                      error={nameError}
                    />

                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={PRACTICE_TYPE}
                          name="practiceType"
                          error={practiceTypeError?.message}
                          options={MAPPED_PRACTICE_TYPES}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <FacilityController
                          isRequired
                          fieldType="text"
                          controllerName="code"
                          controllerLabel={CODE}
                          error={codeError}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={TIME_ZONE_TEXT}
                          name="timeZone"
                          error={timeZoneError?.message}
                          options={MAPPED_TIME_ZONES}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={FACILITY_IDS} isEdit={true}>
                {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <FacilityController
                          fieldType="text"
                          controllerName="cliaIdNumber"
                          controllerLabel={CLIA_ID_NUMBER}
                          error={cliaIdNumberError}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <FacilityController
                          fieldType="text"
                          controllerName="federalTaxId"
                          controllerLabel={FEDERAL_TAX_ID}
                          error={federalTaxIdError}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <FacilityController
                          fieldType="text"
                          controllerName="tamxonomyCode"
                          controllerLabel={TAXONOMY_CODE}
                          error={tamxonomyCodeError}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <FacilityController
                          fieldType="text"
                          controllerName="revenueCode"
                          controllerLabel={REVENUE_CODE}
                          error={revenueCodeError}
                        />
                      </Grid>
                    </Grid>

                    <FacilityController
                      fieldType="text"
                      controllerName="insurancePlanType"
                      controllerLabel={INSURANCE_PLAN_TYPE}
                      error={insurancePlanTypeError}
                    />

                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <FacilityController
                          fieldType="text"
                          controllerName="mammographyCertificationNumber"
                          controllerLabel={MAMMOGRAPHY_CERTIFICATION_NUMBER}
                          error={mammographyCertificationNumberError}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <FacilityController
                          fieldType="text"
                          controllerName="npi"
                          controllerLabel={NPI}
                          error={npiError}
                        />
                      </Grid>
                    </Grid>

                    <Selector
                      isRequired
                      value={EMPTY_OPTION}
                      label={SERVICE_CODE}
                      name="serviceCode"
                      error={serviceCodeError?.message}
                      options={MAPPED_SERVICE_CODES}
                    />
                  </>
                )}
              </CardComponent>
            </Grid>

            <Grid item md={6}>
              <CardComponent cardTitle={BILLING_ADDRESS} isEdit={true}>
                {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={8}>
                        <FacilityController
                          fieldType="text"
                          controllerName="billingEmail"
                          controllerLabel={EMAIL}
                          error={billingEmailError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <FacilityController
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

                    <FacilityController
                      fieldType="text"
                      controllerName="billingAddress"
                      controllerLabel={ADDRESS}
                      error={billingAddressError}
                    />

                    <FacilityController
                      fieldType="text"
                      controllerName="billingAddress2"
                      controllerLabel={ADDRESS_2}
                      error={billingAddress2Error}
                    />

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <FacilityController
                          fieldType="text"
                          controllerName="billingCity"
                          controllerLabel={CITY}
                          error={billingCityError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <FacilityController
                          fieldType="text"
                          controllerName="billingState"
                          controllerLabel={STATE}
                          error={billingStateError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <FacilityController
                          fieldType="text"
                          controllerName="billingCountry"
                          controllerLabel={COUNTRY}
                          error={billingCountryError}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={FACILITY_CONTACT} isEdit={true}>
                {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={8}>
                        <FacilityController
                          isRequired
                          fieldType="text"
                          controllerName="email"
                          controllerLabel={EMAIL}
                          error={emailError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <FacilityController
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

                    <FacilityController
                      fieldType="text"
                      controllerName="address"
                      controllerLabel={ADDRESS}
                      error={addressError}
                    />

                    <FacilityController
                      fieldType="text"
                      controllerName="address2"
                      controllerLabel={ADDRESS_2}
                      error={address2Error}
                    />

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <FacilityController
                          fieldType="text"
                          controllerName="city"
                          controllerLabel={CITY}
                          error={cityError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <FacilityController
                          fieldType="text"
                          controllerName="state"
                          controllerLabel={STATE}
                          error={stateError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <FacilityController
                          fieldType="text"
                          controllerName="country"
                          controllerLabel={COUNTRY}
                          error={countryError}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary"
            disabled={createFacilityLoading || updateFacilityLoading}
          >
            {isEdit ? UPDATE_FACILITY : CREATE_FACILITY}

            {(createFacilityLoading || updateFacilityLoading) &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default FacilityForm;
