// packages block
import {
  FC, useEffect, useContext, Reducer, useReducer, ChangeEvent, useCallback
} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid, Tab } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import RegisterFormComponent from './RegisterForm';
import BackButton from '../../../common/BackButton';
import ScheduleListing from '../../../common/scheduling/Listing';
import { getAddressByZipcode } from '../../../common/smartyAddress';
// utils, interfaces and graphql block
import history from "../../../../history";
import { AuthContext } from '../../../../context';
import { ListContext } from '../../../../context/listContext';
import { facilitySchema } from '../../../../validationSchemas';
import { CustomFacilityInputProps, GeneralFormProps } from '../../../../interfacesTypes';
import {
  formatEmail, formatEnumMember, getTimeString, isSuperAdmin, setRecord, setTime, timeValidation
} from '../../../../utils';
import {
  facilityReducer, Action, initialState, State, ActionType
} from "../../../../reducers/facilityReducer";
import {
  FacilityPayload, ServiceCode, useCreateFacilityMutation, useGetFacilityLazyQuery,
  useUpdateFacilityMutation
} from "../../../../generated/graphql";
import {
  FACILITY_SCHEDULE, ZIP_CODE_ENTER, SYSTEM_ROLES, SETTINGS_ROUTE, FACILITY_CREATED, USA,
  EMAIL_OR_USERNAME_ALREADY_EXISTS, FACILITIES_ROUTE, FACILITY_UPDATED, FACILITY_NOT_FOUND,
  FORBIDDEN_EXCEPTION, NOT_FOUND_EXCEPTION, UPDATE_FACILITY, FACILITY_REGISTRATION, CREATE_FACILITY,
  INVALID_END_TIME, 
} from "../../../../constants";

const FacilityForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { user, userRoles } = useContext(AuthContext);
  const { facility, roles } = user || {};

  const { practiceId } = facility || {};
  const isSuper = isSuperAdmin(roles);
  const { addFacilityList, updateFacilityList } = useContext(ListContext)

  const methods = useForm<CustomFacilityInputProps>({
    mode: "all",
    resolver: yupResolver(facilitySchema(isSuper))
  });
  const { reset, handleSubmit, setValue, watch, setError, clearErrors } = methods;

  const { zipCode, startTime, endTime } = watch()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(facilityReducer, initialState)
  const { billingId, contactId, tabValue } = state
  const isFacilityAdmin = userRoles.includes(SYSTEM_ROLES.FacilityAdmin)

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
              tamxonomyCode, serviceCode, timeZone, billingAddress, contacts, practice, startTime, endTime
            } = facility;
            const { name: practiceName } = practice || {};

            dispatch({ type: ActionType.SET_FACILITY, facility: facility as FacilityPayload['facility'] })

            npi && setValue('npi', npi)
            name && setValue('name', name)
            endTime && setValue('endTime', getTimeString(endTime))
            cliaIdNumber && setValue('cliaIdNumber', cliaIdNumber)
            federalTaxId && setValue('federalTaxId', federalTaxId)
            tamxonomyCode && setValue('tamxonomyCode', tamxonomyCode)
            startTime && setValue('startTime', getTimeString(startTime))
            timeZone && setValue('timeZone', setRecord(timeZone, timeZone))
            serviceCode && setValue('serviceCode', setRecord(serviceCode, formatEnumMember(serviceCode)))
            mammographyCertificationNumber && setValue('mammographyCertificationNumber', mammographyCertificationNumber)

            if (contacts && contacts.length > 0) {
              const primaryContact = contacts.filter(item => item.primaryContact)[0]
              const {
                id, email, phone, zipCode, mobile, fax, address, address2, city, state, country
              } = primaryContact || {}

              dispatch({ type: ActionType.SET_CONTACT_ID, contactId: id })
              fax && setValue('fax', fax)
              city && setValue('city', city)
              email && setValue('email', email)
              phone && setValue('phone', phone)
              mobile && setValue('mobile', mobile)
              zipCode && setValue('zipCode', zipCode)
              address && setValue('address', address)
              address2 && setValue('address2', address2)
              country && setValue('country', country || USA)
              state && setValue('state', setRecord(state, state))
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
              country && setValue('billingCountry', country || USA)
              state && setValue('billingState', setRecord(state, state))
            }

            if (practiceId && practiceName) {
              setValue('practice', setRecord(practiceId, practiceName, false))
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
      const { createFacility: { response, facility } } = data;

      if (response && facility) {
        const { status } = response
        const { id } = facility

        if (id && status && status === 200) {
          reset()
          Alert.success(FACILITY_CREATED);
          addFacilityList(facility)
          history.push(`${FACILITIES_ROUTE}/${id}`)
        }
      }
    }
  });

  const [updateFacility, { loading: updateFacilityLoading }] = useUpdateFacilityMutation({
    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateFacility: { response, facility } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          reset()
          Alert.success(FACILITY_UPDATED);
          updateFacilityList(facility)
          if (isFacilityAdmin) {
            history.push(SETTINGS_ROUTE)
          } else {
            history.push(FACILITIES_ROUTE)
          }
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

  useEffect(() => {
    if (startTime) {
      timeValidation(endTime || '', startTime)
        ? clearErrors('endTime') : setError('endTime', { message: INVALID_END_TIME })
    }
  }, [clearErrors, endTime, setError, startTime])

  const onSubmit: SubmitHandler<CustomFacilityInputProps> = async (inputs) => {
    const {
      name, cliaIdNumber, federalTaxId, npi, tamxonomyCode, practice,
      mammographyCertificationNumber, serviceCode,
      phone, email, fax, city, state, country, address2, address, zipCode,
      billingPhone, billingEmail, billingFax, billingCity, billingState, billingCountry, billingAddress2,
      billingAddress, billingZipCode, timeZone, startTime, endTime
    } = inputs;

    const { id: selectedState } = state;
    const { name: timeZoneName } = timeZone;
    const { id: selectedPractice } = practice || {};
    const { id: selectedServiceCode } = serviceCode;
    const { id: selectedBillingState } = billingState;
    const facilityPractice = isSuper ? selectedPractice : practiceId

    const facilityInput = {
      name: name || '', cliaIdNumber, federalTaxId, npi, timeZone: timeZoneName, tamxonomyCode,
      practiceId: facilityPractice, mammographyCertificationNumber, endTime: endTime && setTime(endTime),
      serviceCode: selectedServiceCode as ServiceCode || ServiceCode.Pharmacy_01,
      startTime: startTime && setTime(startTime),
    }

    const contactInput = {
      phone, email, fax, city, state: selectedState, country: country || USA, zipCode, address,
      address2, primaryContact: true
    }

    const billingAddressInput = {
      phone: billingPhone || '', email: formatEmail(billingEmail) || '', fax: billingFax || '', state: selectedBillingState || '',
      city: billingCity || '', address: billingAddress || '', address2: billingAddress2 || '',
      country: billingCountry || USA, zipCode: billingZipCode || '',
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

  const handleChange = (_: ChangeEvent<{}>, newValue: string) => dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const getAddressHandler = useCallback(async () => {
    if (zipCode) {
      const data = await getAddressByZipcode(zipCode);
      const { zipCode: responseData, status } = data || {}
      const { defaultCity, state, stateAbbreviation } = responseData || {}

      if (status) {
        setValue('city', defaultCity)
        setValue('state', { id: state, name: `${state} - ${stateAbbreviation}` })
      }
    } else Alert.error(ZIP_CODE_ENTER)
  }, [zipCode, setValue])

  useEffect(() => {
    zipCode?.length === 5 && getAddressHandler()
  }, [zipCode, getAddressHandler]);

  return (
    <TabContext value={tabValue}>
      <Box display="flex">
        <BackButton to={isFacilityAdmin ? SETTINGS_ROUTE : `${FACILITIES_ROUTE}`} />

        <Box ml={2}>
          <TabList onChange={handleChange} aria-label="Profile top tabs">
            <Tab key='1' label={FACILITY_REGISTRATION} value="1" />
            <Tab key='2' label={FACILITY_SCHEDULE} value="2" disabled={!id && true} />
          </TabList>
        </Box>
      </Box>

      <TabPanel value="1">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2} display="flex" justifyContent="flex-end" alignItems="flex-start">
              <Button type="submit" variant="contained" color="primary"
                disabled={createFacilityLoading || updateFacilityLoading}
              >
                {isEdit ? UPDATE_FACILITY : CREATE_FACILITY}

                {(createFacilityLoading || updateFacilityLoading) &&
                  <CircularProgress size={20} color="inherit" />
                }
              </Button>
            </Box>

            <RegisterFormComponent
              state={state}
              isSuper={isSuper}
              dispatch={dispatch}
              getFacilityLoading={getFacilityLoading}
            />
          </form>
        </FormProvider>
      </TabPanel>

      <TabPanel value='2'>
        <Grid spacing={3}>
          <Grid md={6} sm={12} xs={12}>
            <ScheduleListing />
          </Grid>
        </Grid>
      </TabPanel>
    </TabContext>
  );
};

export default FacilityForm;
