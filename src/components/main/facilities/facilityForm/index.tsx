// packages block
import { FC, useEffect, useContext, Reducer, useReducer } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddCircleOutline } from '@material-ui/icons';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Box, Button, Checkbox, CircularProgress, Collapse, FormControl, FormControlLabel, FormGroup, Grid, Typography
} from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// utils, interfaces and graphql block
import history from "../../../../history";
import { AuthContext } from '../../../../context';
import { ListContext } from '../../../../context/listContext';
import { isSuperAdmin, renderPractices, setRecord } from '../../../../utils';
import { CustomFacilityInputProps, GeneralFormProps } from '../../../../interfacesTypes';
import { facilitySchema, facilitySchemaWithPractice } from '../../../../validationSchemas';
import {
  facilityReducer, Action, initialState, State, ActionType
} from "../../../../reducers/facilityReducer";
import {
  FacilityPayload,
  PracticeType, ServiceCode, useCreateFacilityMutation, useGetFacilityLazyQuery, useUpdateFacilityMutation
} from "../../../../generated/graphql";
import {
  ADDRESS_2, FEDERAL_TAX_ID, CLIA_ID_NUMBER, TIME_ZONE_TEXT, MAPPED_TIME_ZONES, ADD_FACILITY_BILLING,
  CREATE_FACILITY, EMPTY_OPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, FACILITIES_ROUTE, MAPPED_SERVICE_CODES,
  FACILITY_INFO, TAXONOMY_CODE, UPDATE_FACILITY, CITY, COUNTRY, EMAIL, FAX, PHONE, STATE, ADDRESS, FACILITY_UPDATED,
  MAPPED_PRACTICE_TYPES, NAME, NPI, MAMMOGRAPHY_CERTIFICATION_NUMBER, PRACTICE_TYPE, ZIP, SERVICE_CODE, CANCEL,
  FACILITY_NOT_FOUND, FACILITY_CREATED, FORBIDDEN_EXCEPTION, NOT_FOUND_EXCEPTION, MAPPED_STATES, FACILITY_LOCATION,
  MAPPED_COUNTRIES, BILLING_PROFILE, SAME_AS_FACILITY_LOCATION, PAYABLE_ADDRESS, BILLING_IDENTIFIER, PRACTICE,
  CLIA_ID_NUMBER_INFO, TAXONOMY_CODE_INFO, NPI_INFO, MAMOGRAPHY_CERTIFICATION_NUMBER_INFO, FEDERAL_TAX_ID_INFO, 
} from "../../../../constants";

const FacilityForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { facility, roles } = user || {};
  const { practiceId } = facility || {};
  const isSuper = isSuperAdmin(roles);
  const { fetchAllFacilityList, practiceList } = useContext(ListContext)
  const methods = useForm<CustomFacilityInputProps>({
    mode: "all",
    resolver: yupResolver(isSuper ? facilitySchemaWithPractice : facilitySchema)
  });
  const { reset, handleSubmit, setValue, watch } = methods;
  const { email, zipCode, phone, fax, address, address2, city, state, country } = watch()
  const [{ sameAddress, addBilling, billingId, contactId }, dispatch] =
    useReducer<Reducer<State, Action>>(facilityReducer, initialState)

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
              name, cliaIdNumber, federalTaxId, mammographyCertificationNumber, practiceId, npi,
              tamxonomyCode, practiceType, serviceCode, timeZone, billingAddress, contacts, practice,
            } = facility;
            const { name: practiceName } = practice || {};

            dispatch({ type: ActionType.SET_FACILITY, facility: facility as FacilityPayload['facility'] })

            npi && setValue('npi', npi)
            name && setValue('name', name)
            cliaIdNumber && setValue('cliaIdNumber', cliaIdNumber)
            federalTaxId && setValue('federalTaxId', federalTaxId)
            tamxonomyCode && setValue('tamxonomyCode', tamxonomyCode)
            timeZone && setValue('timeZone', setRecord(timeZone, timeZone))
            serviceCode && setValue('serviceCode', setRecord(serviceCode, serviceCode))
            practiceType && setValue('practiceType', setRecord(practiceType, practiceType))
            practiceId && practiceName && setValue('practice', setRecord(practiceId, practiceName))
            mammographyCertificationNumber && setValue('mammographyCertificationNumber', mammographyCertificationNumber)

            if (contacts && contacts.length > 0) {
              const primaryContact = contacts.filter(item => item.primaryContact)[0]
              const { id, email, phone, zipCode, mobile, fax, address, address2, city, state, country } = primaryContact || {}
              dispatch({ type: ActionType.SET_CONTACT_ID, contactId: id })

              fax && setValue('fax', fax)
              city && setValue('city', city)
              email && setValue('email', email)
              phone && setValue('phone', phone)
              mobile && setValue('mobile', mobile)
              zipCode && setValue('zipCode', zipCode)
              address && setValue('address', address)
              address2 && setValue('address2', address2)
              state && setValue('state', setRecord(state, state))
              country && setValue('country', setRecord(country, country))
            }

            if (billingAddress && billingAddress.length > 0) {
              const { id, email, zipCode, fax, address, address2, phone, city, state, country } = billingAddress[0]
              dispatch({ type: ActionType.SET_BILLING_ID, billingId: id })

              fax && setValue('billingFax', fax)
              city && setValue('billingCity', city)
              email && setValue('billingEmail', email)
              phone && setValue('billingPhone', phone)
              address && setValue('billingAddress', address)
              zipCode && setValue('billingZipCode', zipCode)
              address2 && setValue('billingAddress2', address2)
              state && setValue('billingState', setRecord(state, state))
              country && setValue('billingCountry', setRecord(country, country))
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
        getFacility({ variables: { getFacility: { id } } }) : Alert.error(FACILITY_NOT_FOUND)
    }
  }, [getFacility, isEdit, id])

  const onSubmit: SubmitHandler<CustomFacilityInputProps> = async (inputs) => {
    const {
      name, cliaIdNumber, federalTaxId, npi, tamxonomyCode, practice,
      mammographyCertificationNumber, practiceType, serviceCode,
      phone, email, fax, city, state, country, address2, address, zipCode,
      billingPhone, billingEmail, billingFax, billingCity, billingState, billingCountry, billingAddress2,
      billingAddress, billingZipCode, timeZone
    } = inputs;

    const { id: selectedState } = state;
    const { name: timeZoneName } = timeZone;
    const { id: selectedCountry } = country;
    const { id: selectedPractice } = practice;
    const { id: selectedServiceCode } = serviceCode;
    const { id: selectedPracticeType } = practiceType;
    const { id: selectedBillingState } = billingState;
    const { id: selectedBillingCountry } = billingCountry;
    const facilityPractice = isSuper ? selectedPractice : practiceId

    const facilityInput = {
      name: name || '', cliaIdNumber: cliaIdNumber || '', federalTaxId: federalTaxId || '', npi: npi || '',
      timeZone: timeZoneName || '', tamxonomyCode: tamxonomyCode || '', practiceId: facilityPractice || '',
      practiceType: selectedPracticeType as PracticeType || PracticeType.Hospital,
      serviceCode: selectedServiceCode as ServiceCode || ServiceCode.Pharmacy_01,
      mammographyCertificationNumber: mammographyCertificationNumber || '',
    }

    const contactInput = {
      phone: phone || '', email: email || '', fax: fax || '', city: city || '',
      state: selectedState || '', country: selectedCountry || '', zipCode: zipCode || '', address: address || '',
      address2: address2 || '', primaryContact: true
    }

    const billingAddressInput = {
      phone: billingPhone || '', email: billingEmail || '', fax: billingFax || '',
      state: selectedBillingState || '', country: selectedBillingCountry || '', zipCode: billingZipCode || '',
      city: billingCity || '', address: billingAddress || '', address2: billingAddress2 || ''
    }

    if (isEdit && id) {
      const contactIdInput = contactId ? { id: contactId, ...contactInput } : { ...contactInput }
      const billingIdInput = billingId ? { id: billingId, ...billingAddressInput } : { ...billingAddressInput }

      await updateFacility({
        variables: {
          updateFacilityInput: {
            updateFacilityItemInput: { id, ...facilityInput },
            updateContactInput: { ...contactIdInput },
            updateBillingAddressInput: { ...billingIdInput },
          }
        }
      })
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

  const copyAddress = () => {
    fax && setValue("billingFax", fax)
    city && setValue("billingCity", city)
    phone && setValue("billingPhone", phone)
    email && setValue("billingEmail", email)
    state && setValue("billingState", state)
    zipCode && setValue("billingZipCode", zipCode)
    address && setValue("billingAddress", address)
    country && setValue("billingCountry", country)
    address2 && setValue("billingAddress2", address2)
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

  const setBillingValues = (checked: boolean) => checked ? copyAddress() : resetBillingAddress()

  const cancelBilling = () => {
    dispatch({ type: ActionType.SET_SAME_ADDRESS, sameAddress: false })
    dispatch({ type: ActionType.SET_ADD_BILLING, addBilling: !addBilling })

    resetBillingAddress()
  };

  const handleSameAddress = (checked: boolean) => {
    dispatch({ type: ActionType.SET_SAME_ADDRESS, sameAddress: checked })

    setBillingValues(checked);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={FACILITY_INFO} isEdit={true}>
                {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={isSuper ? 6 : 12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="name"
                          controllerLabel={NAME}
                        />
                      </Grid>

                      {isSuper &&
                        <Grid item md={6}>
                          <Selector
                            isRequired
                            value={EMPTY_OPTION}
                            label={PRACTICE}
                            name="practice"
                            options={renderPractices(practiceList)}
                          />
                        </Grid>
                      }
                    </Grid>

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
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={SERVICE_CODE}
                          name="serviceCode"
                          options={MAPPED_SERVICE_CODES}
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

              <CardComponent cardTitle={BILLING_PROFILE} isEdit={true}>
                {getFacilityLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Collapse in={!addBilling} mountOnEnter unmountOnExit>
                      <Box pb={3}
                        onClick={() => dispatch({ type: ActionType.SET_ADD_BILLING, addBilling: !addBilling })}
                        className="billing-box" display="flex" alignItems="center"
                      >
                        <AddCircleOutline color='inherit' />

                        <Typography>{ADD_FACILITY_BILLING}</Typography>
                      </Box>
                    </Collapse>

                    <Collapse in={addBilling} mountOnEnter unmountOnExit>
                      <Box display="flex" alignItems="center" justifyContent="space-between" onClick={cancelBilling}>
                        <Typography component="p" variant='h5'>{PAYABLE_ADDRESS}</Typography>
                        <Button color='secondary' variant='contained' className='blue-button'>{CANCEL}</Button>
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
            </Grid>

            <Grid item md={6}>
              <CardComponent cardTitle={FACILITY_LOCATION} isEdit={true}>
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
                          options={MAPPED_STATES}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          name="country"
                          label={COUNTRY}
                          value={EMPTY_OPTION}
                          options={MAPPED_COUNTRIES}
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
