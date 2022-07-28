// packages block
import { FC, useContext, useEffect, Reducer, useReducer } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import DatePicker from "../../../common/DatePicker";
import PageHeader from '../../../common/PageHeader';
import BackButton from '../../../common/BackButton';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import CountryController from '../../../../controller/CountryController';
import FacilitySelector from '../../../common/Selector/FacilitySelector';
// interfaces, graphql, styles, constants block
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { doctorSchema } from '../../../../validationSchemas';
import { DoctorInputProps, GeneralFormProps } from "../../../../interfacesTypes";
import { dateValidation, formatEmail, getDate, getTimestamps, getTimestampsForDob, setRecord } from "../../../../utils";
import {
  doctorReducer, State, Action, initialState, ActionType
} from '../../../../reducers/doctorReducer';
import {
  DoctorPayload, Speciality, useCreateDoctorMutation, useGetDoctorLazyQuery,
  useUpdateDoctorMutation
} from "../../../../generated/graphql";
import {
  FACILITY, FIRST_NAME, LAST_NAME, CITY, STATE, NOT_FOUND_EXCEPTION, ADDRESS_TWO,
  CONTACT_INFORMATION, TAX_ID_DETAILS, IDENTIFICATION, MIDDLE_NAME, UPDATE_DOCTOR,
  DEGREE_CREDENTIALS, DOB, SOCIAL_SECURITY_NUMBER, CONFLICT_EXCEPTION, EMPTY_OPTION,
  DEA_NUMBER, DEA_ACTIVE_DATE, DEA_TERM_DATE, EMAIL, PHONE, FAX, ZIP_CODE, ADDRESS_ONE,
  MOBILE, PAGER, TAX_ID, NPI, UPIN, EMC_PROVIDER_ID, MEDICARE_GRP_NUMBER, MEDICAID_GRP_NUMBER,
  MAMMOGRAPHY_CERT_NUMBER, CHAMPUS_GRP_NUMBER, BLUE_SHIED_NUMBER, TAX_ID_STUFF, SPECIALTY_LICENSE,
  ANESTHESIA_LICENSE, CTP_NUMBER, STATE_LICENSE, LICENSE_ACTIVE_DATE, LICENSE_TERM_DATE, TAXONOMY_CODE,
  PRESCRIPTIVE_AUTH_NUMBER, DOCTORS_ROUTE, MAPPED_SPECIALTIES, FORBIDDEN_EXCEPTION, CREATE_DOCTOR,
  LANGUAGE_SPOKEN, SPECIALTY, DOCTOR_UPDATED, ADDITIONAL_INFO, BILLING_ADDRESS, DOCTOR_NOT_FOUND,
  FAILED_TO_UPDATED_DOCTOR, FAILED_TO_CREATE_DOCTOR, DOCTOR_CREATED, EMAIL_OR_USERNAME_ALREADY_EXISTS,
  MAPPED_STATES, NPI_INFO, MAMOGRAPHY_CERTIFICATION_NUMBER_INFO, UPIN_INFO, TAX_ID_INFO, USA,
  SYSTEM_PASSWORD, ADD_DOCTOR, DASHBOARD_BREAD, DOCTORS_BREAD, DOCTOR_NEW_BREAD, DOCTOR_EDIT_BREAD,
  SYSTEM_ROLES, SETTINGS_ROUTE, EDIT_DOCTOR, INVALID_DEA_DATE_ERROR_MESSAGE, INVALID_LICENSE_DATE_ERROR_MESSAGE
} from "../../../../constants";

const DoctorForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { user, userRoles } = useContext(AuthContext)
  const [{ contactId, billingId }, dispatch] =
    useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const isDoctor = userRoles.includes(SYSTEM_ROLES.Doctor)

  const methods = useForm<DoctorInputProps>({
    mode: "all",
    resolver: yupResolver(doctorSchema)
  });
  const { reset, handleSubmit, setValue, watch, setError, clearErrors } = methods;
  const { deaActiveDate, deaTermDate, licenseActiveDate, licenseTermDate } = watch()

  useEffect(() => {
    dateValidation(deaTermDate || '', deaActiveDate || '') || !!!deaTermDate ?
    clearErrors("deaTermDate")
    : setError("deaTermDate", { message: INVALID_DEA_DATE_ERROR_MESSAGE })
  }, [clearErrors, deaActiveDate, deaTermDate, setError])

  useEffect(() => {
    dateValidation(licenseTermDate || '', licenseActiveDate || '') || !!!licenseTermDate ?
    clearErrors("licenseTermDate")
    : setError("licenseTermDate", { message: INVALID_LICENSE_DATE_ERROR_MESSAGE })
  }, [clearErrors, licenseActiveDate, licenseTermDate, setError])
  
  const [getDoctor, { loading: getDoctorLoading }] = useGetDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(DOCTORS_ROUTE)
    },

    onCompleted(data) {
      const { getDoctor } = data || {};

      if (getDoctor) {
        const { response, doctor } = getDoctor

        if (response) {
          const { status } = response

          if (doctor && status && status === 200) {
            const { dob, ssn, prefix, suffix, lastName, firstName, speciality, middleName, providerIntials,
              degreeCredentials, languagesSpoken, taxonomyCode, deaNumber, deaActiveDate, deaTermDate, taxId, npi,
              upin, emcProviderId, medicareGrpNumber, medicaidGrpNumber, meammographyCertNumber, campusGrpNumber,
              blueShildNumber, taxIdStuff, facility, contacts, billingAddress, specialityLicense, anesthesiaLicense,
              dpsCtpNumber, stateLicense, licenseActiveDate, licenseTermDate, prescriptiveAuthNumber, email
            } = doctor
            const { id: facilityId, name } = facility || {}

            dob && setValue('dob', dob)
            npi && setValue('npi', npi)
            ssn && setValue('ssn', ssn)
            upin && setValue('upin', upin)
            taxId && setValue('taxId', taxId)
            email && setValue('email', email)
            prefix && setValue('prefix', prefix)
            suffix && setValue('suffix', suffix)
            lastName && setValue('lastName', lastName)
            deaNumber && setValue('deaNumber', deaNumber)
            firstName && setValue('firstName', firstName)
            middleName && setValue('middleName', middleName)
            taxIdStuff && setValue('taxIdStuff', taxIdStuff)
            taxonomyCode && setValue('taxonomyCode', taxonomyCode)
            dpsCtpNumber && setValue('dpsCtpNumber', dpsCtpNumber)
            stateLicense && setValue('stateLicense', stateLicense)
            emcProviderId && setValue('emcProviderId', emcProviderId)
            deaTermDate && setValue('deaTermDate', getDate(deaTermDate))
            blueShildNumber && setValue('blueShildNumber', blueShildNumber)
            campusGrpNumber && setValue('campusGrpNumber', campusGrpNumber)
            providerIntials && setValue('providerIntials', providerIntials)
            languagesSpoken && setValue('languagesSpoken', languagesSpoken)
            deaActiveDate && setValue('deaActiveDate', getDate(deaActiveDate))
            specialityLicense && setValue('specialityLicense', specialityLicense)
            anesthesiaLicense && setValue('anesthesiaLicense', anesthesiaLicense)
            medicareGrpNumber && setValue('medicareGrpNumber', medicareGrpNumber)
            medicaidGrpNumber && setValue('medicaidGrpNumber', medicaidGrpNumber)
            degreeCredentials && setValue('degreeCredentials', degreeCredentials)
            speciality && setValue('speciality', setRecord(speciality, speciality))
            licenseTermDate && setValue('licenseTermDate', getDate(licenseTermDate))
            facilityId && name && setValue('facilityId', setRecord(facilityId, name, false))
            licenseActiveDate && setValue('licenseActiveDate', getDate(licenseActiveDate))
            meammographyCertNumber && setValue('meammographyCertNumber', meammographyCertNumber)
            prescriptiveAuthNumber && setValue('prescriptiveAuthNumber', prescriptiveAuthNumber)

            doctor && dispatch({ type: ActionType.SET_DOCTOR, doctor: doctor as DoctorPayload['doctor'] })

            if (contacts && contacts.length > 0) {
              const primaryContact = contacts.filter(contact => contact.primaryContact)[0]

              if (primaryContact) {
                const {
                  id, phone, zipCode, mobile, fax, address, address2, city, state, country, pager
                } = primaryContact

                dispatch({ type: ActionType.SET_CONTACT_ID, contactId: id })
                fax && setValue('fax', fax)
                city && setValue('city', city)
                phone && setValue('phone', phone)
                pager && setValue('pager', pager)
                setValue('country', country || USA)
                mobile && setValue('mobile', mobile)
                zipCode && setValue('zipCode', zipCode)
                address && setValue('address', address)
                address2 && setValue('address2', address2)
                state && setValue('state', setRecord(state, state))
              }
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
          }
        }
      }
    }
  });

  const [createDoctor, { loading: createDoctorLoading }] = useCreateDoctorMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION || message === CONFLICT_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else Alert.error(message)
    },

    onCompleted(data) {
      const { createDoctor: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(DOCTOR_CREATED);
          reset()
          history.push(DOCTORS_ROUTE)
        }
      }
    }
  });

  const [updateDoctor, { loading: updateDoctorLoading }] = useUpdateDoctorMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION || message === CONFLICT_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else Alert.error(message)
    },

    onCompleted(data) {
      const { updateDoctor: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(DOCTOR_UPDATED);
          reset()

          isDoctor ? history.push(SETTINGS_ROUTE)
            : history.push(DOCTORS_ROUTE)
        }
      }
    }
  });

  useEffect(() => { }, [user])

  useEffect(() => {
    if (isEdit) {
      id ? getDoctor({ variables: { getDoctor: { id } } })
        : Alert.error(DOCTOR_NOT_FOUND)
    }
  }, [getDoctor, id, isEdit])

  const onSubmit: SubmitHandler<DoctorInputProps> = async (inputs) => {
    const {
      email, pager, phone, mobile, fax, address, address2, zipCode, city, state, country, facilityId,
      billingEmail, billingPhone, billingFax, billingAddress: billingAddress1, blueShildNumber, taxIdStuff,
      billingAddress2, billingZipCode, billingCity, billingState, billingCountry, billingUserId, taxId,
      dob, ssn, prefix, suffix, lastName, firstName, speciality, middleName, campusGrpNumber,
      providerIntials, degreeCredentials, languagesSpoken, taxonomyCode, deaNumber, deaActiveDate, npi,
      deaTermDate, emcProviderId, medicareGrpNumber, medicaidGrpNumber, prescriptiveAuthNumber,
      specialityLicense, anesthesiaLicense, dpsCtpNumber, stateLicense, licenseActiveDate, upin,
      meammographyCertNumber, licenseTermDate,
    } = inputs;

    if (user) {
      const { id: userId } = user;
      const { id: selectedState } = state;
      const { id: selectedFacility } = facilityId;
      const { id: selectedSpecialty } = speciality;
      const { id: selectedBillingState } = billingState;

      const doctorItemInput = {
        firstName, middleName, lastName, prefix: prefix || '', suffix: suffix || '',
        facilityId: selectedFacility, degreeCredentials, ssn, languagesSpoken, taxonomyCode, deaNumber, taxId,
        npi, upin, emcProviderId, medicareGrpNumber, medicaidGrpNumber, meammographyCertNumber, campusGrpNumber,
        blueShildNumber, taxIdStuff, specialityLicense, anesthesiaLicense, stateLicense, dpsCtpNumber,
        providerIntials: providerIntials || '', prescriptiveAuthNumber, adminId: userId,
        dob: dob ? getTimestampsForDob(dob) : '', deaTermDate: deaTermDate ? getTimestamps(deaTermDate) : '',
        licenseTermDate: licenseTermDate ? getTimestamps(licenseTermDate) : '', password: SYSTEM_PASSWORD,
        licenseActiveDate: licenseActiveDate ? getTimestamps(licenseActiveDate) : '',
        speciality: selectedSpecialty as Speciality || Speciality.Gastroenterology_10,
        deaActiveDate: deaActiveDate ? getTimestamps(deaActiveDate) : '',
      };

      const contactInput = {
        email: formatEmail(email || ''), pager: pager || "", phone: phone || "",
        mobile: mobile || "", fax: fax || "", address: address || "", address2: address2 || "",
        zipCode: zipCode || "", city: city || "", state: selectedState || "", country: country || USA,
        facilityId: selectedFacility || ""
      };

      const billingAddressInput = {
        email: formatEmail(billingEmail || ''), phone: billingPhone || "",
        fax: billingFax || "", address: billingAddress1 || "", address2: billingAddress2 || "",
        zipCode: billingZipCode || "", city: billingCity || "", state: selectedBillingState || "",
        country: billingCountry || USA, userId: billingUserId || "", facilityId: selectedFacility || ""
      };

      if (isEdit) {
        if (id) {
          const contactIdInput = contactId ? { id: contactId, ...contactInput } : { ...contactInput }
          const billingIdInput = billingId ? { id: billingId, ...billingAddressInput } : { ...billingAddressInput }

          await updateDoctor({
            variables: {
              updateDoctorInput: {
                updateDoctorItemInput: { id, ...doctorItemInput },
                updateContactInput: { ...contactIdInput },
                updateBillingAddressInput: { ...billingIdInput }
              }
            }
          })
        } else Alert.error(FAILED_TO_UPDATED_DOCTOR)
      } else {
        await createDoctor({
          variables: {
            createDoctorInput: {
              createDoctorItemInput: { ...doctorItemInput, },
              createContactInput: { ...contactInput },
              createBillingAddressInput: { ...billingAddressInput }
            }
          }
        })
      }
    } else {
      Alert.error(isEdit ? FAILED_TO_UPDATED_DOCTOR : FAILED_TO_CREATE_DOCTOR)
    }
  };

  const customizePath = isDoctor
    ? [DASHBOARD_BREAD, isEdit ? DOCTOR_EDIT_BREAD : DOCTOR_NEW_BREAD]
    : [DASHBOARD_BREAD, DOCTORS_BREAD, isEdit ? DOCTOR_EDIT_BREAD : DOCTOR_NEW_BREAD]

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display='flex'>
            <BackButton to={isDoctor ? SETTINGS_ROUTE : `${DOCTORS_ROUTE}`} />

            <Box ml={2} />

            <PageHeader
              title={isEdit ? EDIT_DOCTOR : ADD_DOCTOR}
              path={customizePath}
            />
          </Box>

          <Button type="submit" variant="contained" color="primary"
            disabled={createDoctorLoading || updateDoctorLoading}
          >
            {isEdit ? UPDATE_DOCTOR : CREATE_DOCTOR}

            {(createDoctorLoading || updateDoctorLoading) &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>

        <Box maxHeight="calc(100vh - 190px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <FacilitySelector
                      addEmpty
                      isRequired
                      label={FACILITY}
                      name="facilityId"
                      loading={getDoctorLoading}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <Selector
                      isRequired
                      name="speciality"
                      label={SPECIALTY}
                      value={EMPTY_OPTION}
                      loading={getDoctorLoading}
                      options={MAPPED_SPECIALTIES}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      isRequired
                      fieldType="text"
                      controllerName="firstName"
                      loading={getDoctorLoading}
                      controllerLabel={FIRST_NAME}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      isRequired
                      fieldType="text"
                      controllerName="lastName"
                      loading={getDoctorLoading}
                      controllerLabel={LAST_NAME}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="middleName"
                      loading={getDoctorLoading}
                      controllerLabel={MIDDLE_NAME}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <DatePicker isRequired name="dob" label={DOB} loading={getDoctorLoading} />
                  </Grid>

                  <Grid item md={4} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="degreeCredentials"
                      controllerLabel={DEGREE_CREDENTIALS}
                    />
                  </Grid>

                  {/* <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="prefix"
                      controllerLabel={PREFIX}
                      loading={getDoctorLoading}
                    />
                  </Grid> */}
                </Grid >

                {/* <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="suffix"
                      controllerLabel={SUFFIX}
                      loading={getDoctorLoading}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="providerIntials"
                      controllerLabel={PROVIDER_INITIALS}
                      loading={getDoctorLoading}
                    />
                  </Grid>
                </Grid> */}
              </CardComponent >

              <Box pb={3} />

              <CardComponent cardTitle={ADDITIONAL_INFO}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="ssn"
                      loading={getDoctorLoading}
                      controllerLabel={SOCIAL_SECURITY_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      controllerName="deaNumber"
                      loading={getDoctorLoading}
                      controllerLabel={DEA_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="deaActiveDate" label={DEA_ACTIVE_DATE} loading={getDoctorLoading} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="deaTermDate" label={DEA_TERM_DATE} loading={getDoctorLoading} />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="taxonomyCode"
                      controllerLabel={TAXONOMY_CODE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="languagesSpoken"
                      controllerLabel={LANGUAGE_SPOKEN}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={BILLING_ADDRESS}>
                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    fieldType="email"
                    controllerLabel={EMAIL}
                    loading={getDoctorLoading}
                    controllerName="billingEmail"
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="billingPhone" label={PHONE} loading={getDoctorLoading} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="billingFax" label={FAX} loading={getDoctorLoading} />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerLabel={ZIP_CODE}
                    loading={getDoctorLoading}
                    controllerName="billingZipCode"
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    loading={getDoctorLoading}
                    controllerLabel={ADDRESS_ONE}
                    controllerName="billingAddress"
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    loading={getDoctorLoading}
                    controllerLabel={ADDRESS_TWO}
                    controllerName="billingAddress2"
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <InputController
                      fieldType="text"
                      controllerLabel={CITY}
                      loading={getDoctorLoading}
                      controllerName="billingCity"
                    />
                  </Grid>

                  <Grid item md={4}>
                    <Selector
                      label={STATE}
                      name="billingState"
                      value={EMPTY_OPTION}
                      options={MAPPED_STATES}
                      loading={getDoctorLoading}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <CountryController loading={getDoctorLoading} controllerName="billingCountry" />
                  </Grid>
                </Grid>
              </CardComponent>
            </Grid >

            <Grid md={6} item>
              <CardComponent cardTitle={CONTACT_INFORMATION}>
                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    isRequired
                    fieldType="email"
                    controllerName="email"
                    controllerLabel={EMAIL}
                    loading={getDoctorLoading}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="phone" label={MOBILE} loading={getDoctorLoading} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="mobile" label={PHONE} loading={getDoctorLoading} />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="pager" label={PAGER} loading={getDoctorLoading} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <PhoneField name="fax" label={FAX} loading={getDoctorLoading} />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="zipCode"
                    controllerLabel={ZIP_CODE}
                    loading={getDoctorLoading}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="address"
                    loading={getDoctorLoading}
                    controllerLabel={ADDRESS_ONE}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="address2"
                    loading={getDoctorLoading}
                    controllerLabel={ADDRESS_TWO}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <InputController
                      fieldType="text"
                      controllerName="city"
                      controllerLabel={CITY}
                      loading={getDoctorLoading}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <Selector
                      name="state"
                      label={STATE}
                      value={EMPTY_OPTION}
                      options={MAPPED_STATES}
                      loading={getDoctorLoading}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <CountryController loading={getDoctorLoading} controllerName="country" />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={TAX_ID_DETAILS}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      info={TAX_ID_INFO}
                      controllerName="taxId"
                      controllerLabel={TAX_ID}
                      loading={getDoctorLoading}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      info={NPI_INFO}
                      fieldType="text"
                      controllerName="npi"
                      controllerLabel={NPI}
                      loading={getDoctorLoading}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      info={UPIN_INFO}
                      fieldType="text"
                      controllerName="upin"
                      controllerLabel={UPIN}
                      loading={getDoctorLoading}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="emcProviderId"
                      controllerLabel={EMC_PROVIDER_ID}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="medicareGrpNumber"
                      controllerLabel={MEDICARE_GRP_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="medicaidGrpNumber"
                      controllerLabel={MEDICAID_GRP_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="meammographyCertNumber"
                      controllerLabel={MAMMOGRAPHY_CERT_NUMBER}
                      info={MAMOGRAPHY_CERTIFICATION_NUMBER_INFO}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="campusGrpNumber"
                      controllerLabel={CHAMPUS_GRP_NUMBER}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="blueShildNumber"
                      controllerLabel={BLUE_SHIED_NUMBER}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="taxIdStuff"
                      controllerLabel={TAX_ID_STUFF}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="specialityLicense"
                      controllerLabel={SPECIALTY_LICENSE}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="anesthesiaLicense"
                      controllerLabel={ANESTHESIA_LICENSE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerLabel={CTP_NUMBER}
                      controllerName="dpsCtpNumber"
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <InputController
                      fieldType="text"
                      loading={getDoctorLoading}
                      controllerName="stateLicense"
                      controllerLabel={STATE_LICENSE}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="licenseActiveDate" label={LICENSE_ACTIVE_DATE} loading={getDoctorLoading} />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="licenseTermDate" label={LICENSE_TERM_DATE} loading={getDoctorLoading} />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    loading={getDoctorLoading}
                    controllerName="prescriptiveAuthNumber"
                    controllerLabel={PRESCRIPTIVE_AUTH_NUMBER}
                  />
                </Grid>
              </CardComponent>
            </Grid>
          </Grid >
        </Box >
      </form >
    </FormProvider >
  );
};

export default DoctorForm;
