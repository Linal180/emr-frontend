// packages block
import { FC, useEffect, useContext, Reducer, useReducer } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// utils, interfaces and graphql block
import history from "../../../../history";
import { renderStates, setRecord } from '../../../../utils';
import { ListContext } from '../../../../context/listContext';
import { facilitySchema } from '../../../../validationSchemas';
import { CustomFacilityInputProps, GeneralFormProps } from '../../../../interfacesTypes';
import {
  facilityReducer, Action, initialState, State, ActionType
} from "../../../../reducers/facilityReducer";
import {
  PracticeType, ServiceCode, useCreateFacilityMutation, useGetFacilityLazyQuery, useUpdateFacilityMutation
} from "../../../../generated/graphql";
import {
  ADDRESS_2, BILLING_ADDRESS, FACILITY_CONTACT, FACILITY_IDS, FEDERAL_TAX_ID, CLIA_ID_NUMBER, CODE,
  TIME_ZONE_TEXT, MAPPED_TIME_ZONES, CREATE_FACILITY, EMPTY_OPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  FACILITIES_ROUTE, MAPPED_SERVICE_CODES, FACILITY_INFO, TAXONOMY_CODE, UPDATE_FACILITY, CITY, COUNTRY,
  EMAIL, FAX, PHONE, STATE, ADDRESS, FACILITY_UPDATED, INSURANCE_PLAN_TYPE, MAPPED_PRACTICE_TYPES, NAME,
  NPI, REVENUE_CODE, MAMMOGRAPHY_CERTIFICATION_NUMBER, PRACTICE_TYPE, ZIP, SERVICE_CODE, FACILITY_NOT_FOUND,
  FACILITY_CREATED, FORBIDDEN_EXCEPTION, NOT_FOUND_EXCEPTION,
} from "../../../../constants";

const FacilityForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { fetchAllFacilityList } = useContext(ListContext)
  const methods = useForm<CustomFacilityInputProps>({
    mode: "all",
    resolver: yupResolver(facilitySchema)
  });
  const { reset, handleSubmit, setValue } = methods;
  const [{ facility }, dispatch] = useReducer<Reducer<State, Action>>(facilityReducer, initialState)

  const [getFacility, { loading: getFacilityLoading }] = useGetFacilityLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(FACILITIES_ROUTE)
    },

    onCompleted(data) {
      const { getFacility } = data || {};

      if (getFacility) {
        const { response, facility } = getFacility

        if (response) {
          const { status } = response

          if (facility && status && status === 200) {
            const {
              name, cliaIdNumber, federalTaxId, insurancePlanType, mammographyCertificationNumber,
              npi, code, tamxonomyCode, revenueCode, practiceType, serviceCode, timeZone,
              contacts, billingAddress,
            } = facility

            dispatch({ type: ActionType.SET_FACILITY, facility })

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
              const primaryContact = contacts.filter(item => item.primaryContact)[0]
              const { email, phone, zipCode, mobile, fax, address, address2, city, state, country } = primaryContact || {}

              fax && setValue('fax', fax)
              city && setValue('city', city)
              email && setValue('email', email)
              phone && setValue('phone', phone)
              mobile && setValue('mobile', mobile)
              zipCode && setValue('zipCode', zipCode)
              address && setValue('address', address)
              country && setValue('country', country)
              address2 && setValue('address2', address2)
              state && setValue('state', setRecord(state, state))
            }

            if (billingAddress) {
              const { email, zipCode, fax, address, address2, phone, city, state, country } = billingAddress[0]

              fax && setValue('billingFax', fax)
              city && setValue('billingCity', city)
              email && setValue('billingEmail', email)
              phone && setValue('billingPhone', phone)
              address && setValue('billingAddress', address)
              country && setValue('billingCountry', country)
              zipCode && setValue('billingZipCode', zipCode)
              address2 && setValue('billingAddress2', address2)
              state && setValue('billingState', setRecord(state, state))
            }
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
      id ?
        getFacility({ variables: { getFacility: { id } } })
        :
        Alert.error(FACILITY_NOT_FOUND)
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
    const { id: selectedState } = state;
    const { id: selectedBillingState } = billingState;
    const { id: selectedPracticeType } = practiceType;

    const facilityInput = {
      name: name || '', cliaIdNumber: cliaIdNumber || '', federalTaxId: federalTaxId || '',
      insurancePlanType: insurancePlanType || '', npi: npi || '', code: code || '',
      timeZone: timeZoneName || '', tamxonomyCode: tamxonomyCode || '',
      practiceType: selectedPracticeType as PracticeType || PracticeType.Hospital,
      serviceCode: selectedServiceCode as ServiceCode || ServiceCode.Ambulance_24,
      mammographyCertificationNumber: mammographyCertificationNumber || '',
      revenueCode: revenueCode || '',
    }

    const contactInput = {
      phone: phone || '', email: email || '', fax: fax || '', city: city || '',
      state: selectedState || '', country: country || '', zipCode: zipCode || '', address: address || '',
      address2: address2 || '', primaryContact: true
    }

    const billingAddressInput = {
      phone: billingPhone || '', email: billingEmail || '', fax: billingFax || '',
      state: selectedBillingState || '', country: billingCountry || '', zipCode: billingZipCode || '',
      city: billingCity || '', address: billingAddress || '', address2: billingAddress2 || ''
    }

    if (isEdit) {
      const { contacts, billingAddress: billing } = facility || {};

      if (id && contacts && billing) {
        const { id: contactId } = contacts.filter(item => item.primaryContact)[0] || contacts[0]
        const { id: billingId } = billing[0]

        await updateFacility({
          variables: {
            updateFacilityInput: {
              updateFacilityItemInput: { id, ...facilityInput },
              updateContactInput: { id: contactId, ...contactInput },
              updateBillingAddressInput: { id: billingId, ...billingAddressInput },
            }
          }
        })
      }
    } else {
      await createFacility({
        variables: {
          createFacilityInput: {
            createFacilityItemInput: { ...facilityInput },
            createContactInput: { ...contactInput },
            createBillingAddressInput: { ...billingAddressInput },
          }
        }
      })
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={FACILITY_INFO} isEdit={true}>
                {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <InputController
                      isRequired
                      fieldType="text"
                      controllerName="name"
                      controllerLabel={NAME}
                    />

                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={PRACTICE_TYPE}
                          name="practiceType"
                          options={MAPPED_PRACTICE_TYPES}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="code"
                          controllerLabel={CODE}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={TIME_ZONE_TEXT}
                          name="timeZone"
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
                        <InputController
                          fieldType="text"
                          controllerName="cliaIdNumber"
                          controllerLabel={CLIA_ID_NUMBER}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <InputController
                          fieldType="text"
                          controllerName="federalTaxId"
                          controllerLabel={FEDERAL_TAX_ID}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <InputController
                          fieldType="text"
                          controllerName="tamxonomyCode"
                          controllerLabel={TAXONOMY_CODE}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <InputController
                          fieldType="text"
                          controllerName="revenueCode"
                          controllerLabel={REVENUE_CODE}
                        />
                      </Grid>
                    </Grid>

                    <InputController
                      fieldType="text"
                      controllerName="insurancePlanType"
                      controllerLabel={INSURANCE_PLAN_TYPE}
                    />

                    <Grid container spacing={3}>
                      <Grid item md={6}>
                        <InputController
                          fieldType="text"
                          controllerName="mammographyCertificationNumber"
                          controllerLabel={MAMMOGRAPHY_CERTIFICATION_NUMBER}
                        />
                      </Grid>

                      <Grid item md={6}>
                        <InputController
                          fieldType="text"
                          controllerName="npi"
                          controllerLabel={NPI}
                        />
                      </Grid>
                    </Grid>

                    <Selector
                      isRequired
                      value={EMPTY_OPTION}
                      label={SERVICE_CODE}
                      name="serviceCode"
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
                        <InputController
                          fieldType="text"
                          controllerName="billingEmail"
                          controllerLabel={EMAIL}
                        />
                      </Grid>

                      <Grid item md={4}>
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
                          options={renderStates()}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <InputController
                          fieldType="text"
                          controllerName="billingCountry"
                          controllerLabel={COUNTRY}
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
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="email"
                          controllerLabel={EMAIL}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <InputController
                          fieldType="text"
                          controllerName="zipCode"
                          controllerLabel={ZIP}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="phone" label={PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="fax" label={FAX} />
                      </Grid>
                    </Grid>

                    <InputController
                      fieldType="text"
                      controllerName="address"
                      controllerLabel={ADDRESS}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="address2"
                      controllerLabel={ADDRESS_2}
                    />

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <InputController
                          fieldType="text"
                          controllerName="city"
                          controllerLabel={CITY}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          value={EMPTY_OPTION}
                          label={STATE}
                          name="state"
                          options={renderStates()}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <InputController
                          fieldType="text"
                          controllerName="country"
                          controllerLabel={COUNTRY}
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
