// packages block
import { FC, useState, useContext, ChangeEvent, useEffect, Reducer, useReducer } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import {
  CircularProgress, Box, Button, FormControl, Grid, FormControlLabel, FormLabel,
  FormGroup, Checkbox,
} from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import PatientController from "../controllers";
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import DatePicker from "../../../common/DatePicker";
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
import ToggleButtonComponent from '../../../common/ToggleButtonComponent';
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { ListContext } from '../../../../context/listContext';
import { extendedPatientSchema } from '../../../../validationSchemas';
import { GeneralFormProps, PatientInputProps } from '../../../../interfacesTypes';
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../reducers/patientReducer";
import { getDate, getTimestamps, renderDoctors, renderFacilities, setRecord } from '../../../../utils';
import {
  ContactType, Ethnicity, Genderidentity, Holdstatement, Homebound, Maritialstatus, PrimaryDepartment,
  Pronouns, Race, RegDepartment, RelationshipType, Sexualorientation, useGetPatientLazyQuery,
  useUpdatePatientMutation, useCreatePatientMutation
} from "../../../../generated/graphql";
import {
  FIRST_NAME, LAST_NAME, CITY, STATE, COUNTRY, CONTACT_INFORMATION, IDENTIFICATION, DOB, EMAIL,
  DEMOGRAPHICS, GUARANTOR, PRIVACY, REGISTRATION_DATES, EMERGENCY_CONTACT, NEXT_OF_KIN, EMPLOYMENT,
  GUARDIAN, SUFFIX, MIDDLE_NAME, FIRST_NAME_USED, PREFERRED_NAME, PREVIOUS_FIRST_NAME, PREVIOUS_LAST_NAME,
  MOTHERS_MAIDEN_NAME, SSN, ZIP_CODE, ADDRESS, ADDRESS_2, REGISTRATION_DATE, NOTICE_ON_FILE, PHONE,
  MEDICATION_HISTORY_AUTHORITY, NAME, HOME_PHONE, MOBILE_PHONE, EMPLOYER_NAME, EMPLOYER, DECREASED_DATE,
  EMPLOYER_PHONE, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENTS_ROUTE,
  LANGUAGE_SPOKEN, MAPPED_RACE, MAPPED_ETHNICITY, MAPPED_SEXUAL_ORIENTATION, MAPPED_PRONOUNS,
  MAPPED_RELATIONSHIP_TYPE, MAPPED_REG_DEPARTMENT, MAPPED_MARITAL_STATUS, ETHNICITY,
  SEXUAL_ORIENTATION, PRONOUNS, HOMEBOUND, RELATIONSHIP, USUAL_PROVIDER_ID, REGISTRATION_DEPARTMENT,
  PRIMARY_DEPARTMENT, USUAL_OCCUPATION, USUAL_INDUSTRY, GENDER_IDENTITY, MAPPED_GENDER_IDENTITY,
  ISSUE_DATE, EXPIRATION_DATE, RACE, MARITAL_STATUS, LEGAL_SEX, SEX_AT_BIRTH,
  GUARANTOR_RELATION, GUARANTOR_NOTE, FACILITY, PATIENT_UPDATED, FAILED_TO_UPDATE_PATIENT, UPDATE_PATIENT,
  PATIENT_NOT_FOUND, CONSENT_TO_CALL, PATIENT_CREATED, FAILED_TO_CREATE_PATIENT,
  CREATE_PATIENT, EMPTY_OPTION, NOT_FOUND_EXCEPTION,
} from "../../../../constants";

const PatientForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { doctorList, facilityList, fetchAllPatientList } = useContext(ListContext)
  const [{
    basicContactId, emergencyContactId, kinContactId, guardianContactId,
    guarantorContactId, employerId
  }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const [state, setState] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false
  })
  const methods = useForm<PatientInputProps>({
    mode: "all",
    resolver: yupResolver(extendedPatientSchema)
  });
  const { handleSubmit, setValue, formState: { errors } } = methods;

  const [getPatient, { loading: getPatientLoading }] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      message !== NOT_FOUND_EXCEPTION && Alert.error(message)
      history.push(PATIENTS_ROUTE)
    },

    onCompleted(data) {
      const { getPatient } = data || {}

      if (getPatient) {
        const { patient } = getPatient

        if (patient) {
          const { suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName,
            previouslastName, motherMaidenName, ssn, dob, gender, registrationDepartment, primaryDepartment,
            registrationDate, deceasedDate, privacyNotice, releaseOfInfoBill, callToConsent,
            patientNote, language, race, ethnicity, maritialStatus, sexualOrientation, genderIdentity, sexAtBirth,
            pronouns, homeBound, holdStatement, statementDelivereOnline, statementNote, statementNoteDateFrom,
            statementNoteDateTo, facility, contacts, employer, medicationHistoryAuthority, doctorPatients
          } = patient;

          if (doctorPatients) {
            const currentDoctor = doctorPatients.map(doctorPatient => {
              if (doctorPatient.currentProvider) {
                return doctorPatient.doctor
              }

              return null
            })[0];

            if (currentDoctor) {
              const { id: usualProviderId, firstName, lastName } = currentDoctor || {};
              usualProviderId && setValue("usualProviderId", setRecord(usualProviderId,
                `${firstName} ${lastName}` || ''))
            }
          }

          if (facility) {
            const { id: facilityId, name } = facility;
            facilityId && setValue("facilityId", setRecord(facilityId, name || ''))
          }

          dob && setValue("dob", dob)
          ssn && setValue("ssn", ssn)
          suffix && setValue("suffix", suffix)
          lastName && setValue("lastName", lastName)
          language && setValue("language", language)
          firstName && setValue("firstName", firstName)
          middleName && setValue("middleName", middleName)
          patientNote && setValue("patientNote", patientNote)
          deceasedDate && setValue("deceasedDate", deceasedDate)
          firstNameUsed && setValue("firstNameUsed", firstNameUsed)
          privacyNotice && setValue("privacyNotice", privacyNotice)
          callToConsent && setValue("callToConsent", callToConsent)
          prefferedName && setValue("prefferedName", prefferedName)
          holdStatement && setValue("holdStatement", holdStatement)
          statementNote && setValue("statementNote", statementNote)
          registrationDate && setValue("registrationDate", registrationDate)
          motherMaidenName && setValue("motherMaidenName", motherMaidenName)
          previouslastName && setValue("previouslastName", previouslastName)
          previousFirstName && setValue("previousFirstName", previousFirstName)
          releaseOfInfoBill && setValue("releaseOfInfoBill", releaseOfInfoBill)
          homeBound && setValue("homeBound", homeBound === Homebound.Yes ? true : false)
          statementNoteDateTo && setValue("statementNoteDateTo", getDate(statementNoteDateTo))
          statementDelivereOnline && setValue("statementDelivereOnline", statementDelivereOnline)
          statementNoteDateFrom && setValue("statementNoteDateFrom", getDate(statementNoteDateFrom))
          medicationHistoryAuthority && setValue("medicationHistoryAuthority", medicationHistoryAuthority)

          race && setValue("race", setRecord(race || '', race || ''))
          gender && setValue("gender", setRecord(gender || '', gender || ''))
          pronouns && setValue("pronouns", setRecord(pronouns || '', pronouns || ''))
          ethnicity && setValue("ethnicity", setRecord(ethnicity || '', ethnicity || ''))
          sexAtBirth && setValue("sexAtBirth", setRecord(sexAtBirth || '', sexAtBirth || ''))
          maritialStatus && setValue("maritialStatus", setRecord(maritialStatus || '', maritialStatus || ''))
          genderIdentity && setValue("genderIdentity", setRecord(genderIdentity || '', genderIdentity || ''))
          sexualOrientation && setValue("sexualOrientation", setRecord(sexualOrientation || '',
            sexualOrientation || ''))
          primaryDepartment && setValue("primaryDepartment", setRecord(primaryDepartment || '',
            primaryDepartment || ''))
          registrationDepartment && setValue("registrationDepartment",
            setRecord(registrationDepartment || '', registrationDepartment || ''))

          if (contacts) {
            const emergencyContact = contacts.filter(contact => contact.contactType === ContactType.Emergency)[0]

            if (emergencyContact) {
              const { id: emergencyContactId, name, relationship, phone, mobile } = emergencyContact;

              dispatch({ type: ActionType.SET_EMERGENCY_CONTACT_ID, emergencyContactId })
              name && setValue("emergencyName", name)
              phone && setValue("emergencyPhone", phone)
              mobile && setValue("emergencyMobile", mobile)
              relationship && setValue("emergencyRelationship", setRecord(relationship || '', relationship || ''))
            }

            const basicContact = contacts.filter(contact => contact.contactType === ContactType.Self)[0]

            if (basicContact) {
              const { id: basicContactId, email, address, address2, zipCode, city, state,
                country, phone, mobile
              } = basicContact;

              dispatch({ type: ActionType.SET_BASIC_CONTACT_ID, basicContactId })
              city && setValue("basicCity", city)
              state && setValue("basicState", state)
              email && setValue("basicEmail", email)
              phone && setValue("basicPhone", phone)
              mobile && setValue("basicMobile", mobile)
              address && setValue("basicAddress", address)
              zipCode && setValue("basicZipCode", zipCode)
              country && setValue("basicCountry", country)
              address2 && setValue("basicAddress2", address2)
            }

            const kinContact = contacts.filter(contact => contact.contactType === ContactType.NextOfKin)[0]

            if (kinContact) {
              const { id: kinContactId, name, relationship, phone, mobile } = kinContact;

              dispatch({ type: ActionType.SET_KIN_CONTACT_ID, kinContactId })
              name && setValue("kinName", name)
              phone && setValue("kinPhone", phone)
              mobile && setValue("kinMobile", mobile)
              relationship && setValue("kinRelationship", setRecord(relationship || '', relationship || ''))
            }

            const guarantorContact = contacts.filter(contact => contact.contactType === ContactType.Guarandor)[0]

            if (guarantorContact) {
              const { id: guarantorContactId, suffix, firstName, lastName, middleName, phone, zipCode, address, address2,
                city, state, country, ssn, email, employerName
              } = guarantorContact;

              dispatch({ type: ActionType.SET_GUARANTOR_CONTACT_ID, guarantorContactId })
              ssn && setValue("guarantorSsn", ssn)
              city && setValue("guarantorCity", city)
              state && setValue("guarantorState", state)
              phone && setValue("guarantorPhone", phone)
              email && setValue("guarantorEmail", email)
              suffix && setValue("guarantorSuffix", suffix)
              zipCode && setValue("guarantorZipCode", zipCode)
              address && setValue("guarantorAddress", address)
              address2 && setValue("guarantorAddress2", address2)
              country && setValue("guarantorCountry", country)
              lastName && setValue("guarantorLastName", lastName)
              firstName && setValue("guarantorFirstName", firstName)
              middleName && setValue("guarantorMiddleName", middleName)
              employerName && setValue("guarantorEmployerName", employerName)
            }

            const guardianContact = contacts.filter(contact => contact.contactType === ContactType.Guardian)[0]

            if (guardianContact) {
              const { id: guardianContactId, suffix, firstName, lastName, middleName } = guardianContact;

              dispatch({ type: ActionType.SET_GUARDIAN_CONTACT_ID, guardianContactId })
              suffix && setValue("guardianSuffix", suffix)
              lastName && setValue("guardianLastName", lastName)
              firstName && setValue("guardianFirstName", firstName)
              middleName && setValue("guardianMiddleName", middleName)
            }
          }

          if (employer && employer.length) {
            const { id: employerId, name, email, phone, industry, usualOccupation } = employer[0];

            dispatch({ type: ActionType.SET_EMPLOYER_ID, employerId })
            name && setValue('employerName', name)
            email && setValue('employerEmail', email)
            phone && setValue('employerPhone', phone)
            industry && setValue('employerIndustry', industry)
            usualOccupation && setValue('employerUsualOccupation', usualOccupation)
          }
        }
      }
    }
  });

  const [createPatient, { loading: createPatientLoading }] = useCreatePatientMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { createPatient: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetchAllPatientList();
          Alert.success(PATIENT_CREATED);
          history.push(PATIENTS_ROUTE)
        }
      }
    }
  });

  const [updatePatient, { loading: updatePatientLoading }] = useUpdatePatientMutation({
    onError({ message }) {
      if (message === FORBIDDEN_EXCEPTION) {
        Alert.error(EMAIL_OR_USERNAME_ALREADY_EXISTS)
      } else
        Alert.error(message)
    },

    onCompleted(data) {
      const { updatePatient: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          fetchAllPatientList();
          Alert.success(PATIENT_UPDATED);
          history.push(PATIENTS_ROUTE)
        }
      }
    }
  });

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const onSubmit: SubmitHandler<PatientInputProps> = async (inputs) => {
    const {
      suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName,
      previouslastName, motherMaidenName, ssn, dob, gender, registrationDepartment, primaryDepartment,
      registrationDate, deceasedDate, privacyNotice, releaseOfInfoBill, callToConsent,
      patientNote, language, race, ethnicity, maritialStatus, sexualOrientation, genderIdentity,
      pronouns, homeBound, holdStatement, statementDelivereOnline, statementNote, statementNoteDateFrom,
      statementNoteDateTo, facilityId, usualProviderId, medicationHistoryAuthority, sexAtBirth,

      basicEmail, basicPhone, basicMobile, basicAddress, basicAddress2, basicZipCode, basicCity,
      basicState, basicCountry,

      emergencyName, emergencyRelationship, emergencyPhone, emergencyMobile,

      kinName, kinRelationship, kinMobile, kinPhone,

      guardianFirstName, guardianMiddleName, guardianLastName, guardianSuffix,

      guarantorFirstName, guarantorMiddleName, guarantorLastName, guarantorEmail, guarantorRelationship,
      guarantorPhone, guarantorSuffix, guarantorAddress, guarantorAddress2, guarantorZipCode, guarantorCity,
      guarantorState, guarantorCountry, guarantorEmployerName, guarantorSsn,

      employerName, employerEmail, employerPhone, employerIndustry, employerUsualOccupation,
    } = inputs;

    if (user) {
      const { id: userId } = user;
      const { id: selectedRace } = race
      const { id: selectedGender } = gender
      const { id: selectedPronouns } = pronouns
      const { id: selectedFacility } = facilityId
      const { id: selectedEthnicity } = ethnicity
      const { id: selectedSexAtBirth } = sexAtBirth
      const { id: selectedMaritalStatus } = maritialStatus
      const { id: selectedGenderIdentity } = genderIdentity
      const { id: selectedUsualProvider } = usualProviderId
      const { id: selectedKinRelationship } = kinRelationship
      const { id: selectedPrimaryDepartment } = primaryDepartment
      const { id: selectedSexualOrientation } = sexualOrientation
      const { id: selectedGuarantorRelationship } = guarantorRelationship
      const { id: selectedEmergencyRelationship } = emergencyRelationship
      const { id: selectedRegistrationDepartment } = registrationDepartment

      const patientItemInput = {
        suffix: suffix || '', firstName: firstName || '', middleName: middleName || '',
        lastName: lastName || '', firstNameUsed: firstNameUsed || '', prefferedName: prefferedName || '',
        previousFirstName: previousFirstName || '', previouslastName: previouslastName || '',
        motherMaidenName: motherMaidenName || '', ssn: ssn || '', dob: getTimestamps(dob || ''),
        registrationDate: getTimestamps(registrationDate || ''), language: language || '',
        deceasedDate: getTimestamps(deceasedDate || ''), adminId: userId || '',
        privacyNotice: privacyNotice || false, releaseOfInfoBill: releaseOfInfoBill || false,
        callToConsent: callToConsent || false, usualProviderId: selectedUsualProvider || '',
        medicationHistoryAuthority: medicationHistoryAuthority || false, patientNote: patientNote || '',
        statementNoteDateTo: getTimestamps(statementNoteDateTo || ''), email: basicEmail || '',
        homeBound: homeBound ? Homebound.Yes : Homebound.No, holdStatement: holdStatement || Holdstatement.None,
        statementNoteDateFrom: getTimestamps(statementNoteDateFrom || ''),
        pronouns: selectedPronouns as Pronouns || Pronouns.None,
        ethnicity: selectedEthnicity as Ethnicity || Ethnicity.None, facilityId: selectedFacility || '',
        gender: selectedGender as Genderidentity || Genderidentity.None,
        sexAtBirth: selectedSexAtBirth as Genderidentity || Genderidentity.None,
        genderIdentity: selectedGenderIdentity as Genderidentity || Genderidentity.None,
        maritialStatus: selectedMaritalStatus as Maritialstatus || Maritialstatus.Single,
        sexualOrientation: selectedSexualOrientation as Sexualorientation || Sexualorientation.None,
        statementDelivereOnline: statementDelivereOnline || false, statementNote: statementNote || '',
        primaryDepartment: selectedPrimaryDepartment as PrimaryDepartment || PrimaryDepartment.Hospital,
        registrationDepartment: selectedRegistrationDepartment as RegDepartment || RegDepartment.Hospital,
        race: selectedRace as Race || Race.White,
      };

      const contactInput = {
        contactType: ContactType.Self, country: basicCountry || '',
        email: basicEmail || '', city: basicCity || '', zipCode: basicZipCode || '',
        state: basicState || '', facilityId: selectedFacility || '', phone: basicPhone || '',
        mobile: basicMobile || '', address2: basicAddress2 || '', address: basicAddress || '',
      };

      const emergencyContactInput = {
        contactType: ContactType.Emergency, name: emergencyName || '',
        phone: emergencyPhone || '', mobile: emergencyMobile || '', primaryContact: false,
        relationship: selectedEmergencyRelationship as RelationshipType || RelationshipType.Other,
      };

      const guarantorContactInput = {
        firstName: guarantorFirstName || '', middleName: guarantorMiddleName || '',
        lastName: guarantorLastName || '', email: guarantorEmail || '', contactType: ContactType.Guarandor,
        relationship: selectedGuarantorRelationship as RelationshipType || RelationshipType.Other,
        employerName: guarantorEmployerName || '', address2: guarantorAddress2 || '',
        zipCode: guarantorZipCode || '', city: guarantorCity || '', state: guarantorState || '',
        phone: guarantorPhone || '', suffix: guarantorSuffix || '', country: guarantorCountry || '',
        userId: userId || '', ssn: guarantorSsn || '', primaryContact: false,
        address: guarantorAddress || '',
      };

      const guardianContactInput = {
        firstName: guardianFirstName || '', middleName: guardianMiddleName || '',
        lastName: guardianLastName || '', contactType: ContactType.Guardian, suffix: guardianSuffix || '',
        userId: userId || '', primaryContact: false,
      };

      const nextOfKinContactInput = {
        contactType: ContactType.NextOfKin, name: kinName || '', phone: kinPhone || '',
        mobile: kinMobile || '', primaryContact: false,
        relationship: selectedKinRelationship as RelationshipType || RelationshipType.Other,
      };

      const employerInput = {
        name: employerName || '', email: employerEmail || '', phone: employerPhone || '',
        usualOccupation: employerUsualOccupation || '', industry: employerIndustry || '',
      };

      if (isEdit && id) {
        await updatePatient({
          variables: {
            updatePatientInput: {
              updatePatientItemInput: { id, ...patientItemInput },
              updateContactInput: { id: basicContactId, ...contactInput },
              updateEmergencyContactInput: { id: emergencyContactId, ...emergencyContactInput },
              updateGuarantorContactInput: { id: guarantorContactId, ...guarantorContactInput },
              updateGuardianContactInput: { id: guardianContactId, ...guardianContactInput },
              updateNextOfKinContactInput: { id: kinContactId, ...nextOfKinContactInput },
              updateEmployerInput: { id: employerId, ...employerInput },
            }
          }
        })
      } else {
        await createPatient({
          variables: {
            createPatientInput: {
              createPatientItemInput: { ...patientItemInput },
              createContactInput: { ...contactInput },
              createEmergencyContactInput: { ...emergencyContactInput },
              createGuarantorContactInput: { ...guarantorContactInput },
              createGuardianContactInput: { ...guardianContactInput },
              createNextOfKinContactInput: { ...nextOfKinContactInput },
              createEmployerInput: { ...employerInput },
            }
          }
        })
      }
    } else
      Alert.error(isEdit ? FAILED_TO_UPDATE_PATIENT : FAILED_TO_CREATE_PATIENT)
  };

  useEffect(() => {
    if (isEdit) {
      if (id) {
        getPatient({
          variables: {
            getPatient: { id }
          },
        })
      } else Alert.error(PATIENT_NOT_FOUND)
    }
  }, [getPatient, id, isEdit])

  const disableSubmit = getPatientLoading || createPatientLoading || updatePatientLoading;

  const {
    race: { id: raceError } = {},
    ssn: { message: ssnError } = {},
    dob: { message: dobError } = {},
    gender: { id: genderError } = {},
    pronouns: { id: pronounsError } = {},
    suffix: { message: suffixError } = {},
    ethnicity: { id: ethnicityError } = {},
    sexAtBirth: { id: sexAtBirthError } = {},
    language: { message: languageError } = {},
    lastName: { message: lastNameError } = {},
    firstName: { message: firstNameError } = {},
    middleName: { message: middleNameError } = {},
    maritialStatus: { id: maritalStatusError } = {},
    genderIdentity: { id: genderIdentityError } = {},
    deceasedDate: { message: deceasedDateError } = {},
    prefferedName: { message: preferredNameError } = {},
    firstNameUsed: { message: firstNameUsedError } = {},
    sexualOrientation: { id: sexualOrientationError } = {},
    primaryDepartment: { id: primaryDepartmentError } = {},
    previouslastName: { message: previousLastNameError } = {},
    registrationDate: { message: registrationDateError } = {},
    motherMaidenName: { message: motherMaidenNameError } = {},
    previousFirstName: { message: previousFirstNameError } = {},
    guarantorRelationship: { id: guarantorRelationshipError } = {},
    statementNoteDateTo: { message: statementNoteDateToError } = {},
    registrationDepartment: { id: registrationDepartmentError } = {},
    statementNoteDateFrom: { message: statementNoteDateFromError } = {},

    basicCity: { message: basicCityError } = {},
    basicState: { message: basicStateError } = {},
    basicEmail: { message: basicEmailError } = {},
    basicPhone: { message: basicPhoneError } = {},
    basicMobile: { message: basicMobileError } = {},
    basicZipCode: { message: basicZipCodeError } = {},
    basicCountry: { message: basicCountryError } = {},
    basicAddress: { message: basicAddressError } = {},
    basicAddress2: { message: basicAddress2Error } = {},

    guarantorSsn: { message: guarantorSsnError } = {},
    guarantorCity: { message: guarantorCityError } = {},
    guarantorState: { message: guarantorStateError } = {},
    guarantorPhone: { message: guarantorPhoneError } = {},
    guarantorEmail: { message: guarantorEmailError } = {},
    guarantorSuffix: { message: guarantorSuffixError } = {},
    guarantorZipCode: { message: guarantorZipCodeError } = {},
    guarantorAddress: { message: guarantorAddressError } = {},
    guarantorCountry: { message: guarantorCountryError } = {},
    guarantorLastName: { message: guarantorLastNameError } = {},
    guarantorAddress2: { message: guarantorAddress2Error } = {},
    guarantorFirstName: { message: guarantorFirstNameError } = {},
    guarantorMiddleName: { message: guarantorMiddleNameError } = {},
    guarantorEmployerName: { message: guarantorEmployerNameError } = {},

    emergencyName: { message: emergencyNameError } = {},
    emergencyPhone: { message: emergencyPhoneError } = {},
    emergencyMobile: { message: emergencyMobileError } = {},
    emergencyRelationship: { id: emergencyRelationshipError } = {},

    kinName: { message: kinNameError } = {},
    kinPhone: { message: kinPhoneError } = {},
    kinMobile: { message: kinMobileError } = {},
    kinRelationship: { id: kinRelationshipError } = {},

    employerName: { message: employerNameError } = {},
    employerPhone: { message: employerPhoneError } = {},
    employerIndustry: { message: employerIndustryError } = {},
    employerUsualOccupation: { message: employerUsualOccupationError } = {},

    guardianSuffix: { message: guardianSuffixError } = {},
    guardianLastName: { message: guardianLastNameError } = {},
    guardianFirstName: { message: guardianFirstNameError } = {},
    guardianMiddleName: { message: guardianMiddleNameError } = {},
  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="suffix"
                          controllerLabel={SUFFIX}
                          error={suffixError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          isRequired
                          fieldType="text"
                          controllerName="firstName"
                          controllerLabel={FIRST_NAME}
                          error={firstNameError}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="middleName"
                          controllerLabel={MIDDLE_NAME}
                          error={middleNameError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          isRequired
                          fieldType="text"
                          controllerName="lastName"
                          controllerLabel={LAST_NAME}
                          error={lastNameError}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="firstNameUsed"
                          controllerLabel={FIRST_NAME_USED}
                          error={firstNameUsedError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="prefferedName"
                          controllerLabel={PREFERRED_NAME}
                          error={preferredNameError}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="previousFirstName"
                          controllerLabel={PREVIOUS_FIRST_NAME}
                          error={previousFirstNameError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="previouslastName"
                          controllerLabel={PREVIOUS_LAST_NAME}
                          error={previousLastNameError}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="motherMaidenName"
                          controllerLabel={MOTHERS_MAIDEN_NAME}
                          error={motherMaidenNameError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="ssn"
                          controllerLabel={SSN}
                          error={ssnError}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          name="gender"
                          error={genderError?.message || ""}
                          label={LEGAL_SEX}
                          value={EMPTY_OPTION}
                          options={MAPPED_GENDER_IDENTITY}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker isRequired name="dob" label={DOB} error={dobError || ''} />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={CONTACT_INFORMATION}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid item md={12} sm={12} xs={12}>
                      <PatientController
                        isRequired
                        fieldType="text"
                        controllerName="basicZipCode"
                        controllerLabel={ZIP_CODE}
                        error={basicZipCodeError}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <PatientController
                        isRequired
                        fieldType="text"
                        controllerName="basicAddress"
                        controllerLabel={ADDRESS}
                        error={basicAddressError}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <PatientController
                        fieldType="text"
                        controllerName="basicAddress2"
                        controllerLabel={ADDRESS_2}
                        error={basicAddress2Error}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <PatientController
                          isRequired
                          fieldType="text"
                          controllerName="basicCity"
                          controllerLabel={CITY}
                          error={basicCityError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <PatientController
                          isRequired
                          fieldType="text"
                          controllerName="basicState"
                          controllerLabel={STATE}
                          error={basicStateError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <PatientController
                          isRequired
                          fieldType="text"
                          controllerName="basicCountry"
                          controllerLabel={COUNTRY}
                          error={basicCountryError}
                        />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <PatientController
                        isRequired
                        fieldType="text"
                        controllerName="basicEmail"
                        controllerLabel={EMAIL}
                        error={basicEmailError}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField isRequired name="basicPhone" error={basicPhoneError} label={HOME_PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="basicMobile" error={basicMobileError} label={MOBILE_PHONE} />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={EMERGENCY_CONTACT}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="emergencyName"
                          controllerLabel={NAME}
                          error={emergencyNameError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="emergencyRelationship"
                          label={RELATIONSHIP}
                          error={emergencyRelationshipError?.message || ""}
                          value={EMPTY_OPTION}
                          options={MAPPED_RELATIONSHIP_TYPE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="emergencyPhone" error={emergencyPhoneError} label={HOME_PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="emergencyMobile" error={emergencyMobileError} label={MOBILE_PHONE} />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={NEXT_OF_KIN}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="kinName"
                          controllerLabel={NAME}
                          error={kinNameError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="kinRelationship"
                          label={RELATIONSHIP}
                          error={kinRelationshipError?.message || ""}
                          value={EMPTY_OPTION}
                          options={MAPPED_RELATIONSHIP_TYPE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="kinPhone" error={kinPhoneError} label={HOME_PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="kinMobile" error={kinMobileError} label={MOBILE_PHONE} />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={GUARDIAN}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="guardianFirstName"
                          controllerLabel={FIRST_NAME}
                          error={guardianFirstNameError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="guardianMiddleName"
                          controllerLabel={MIDDLE_NAME}
                          error={guardianMiddleNameError}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="guardianLastName"
                          controllerLabel={LAST_NAME}
                          error={guardianLastNameError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="guardianSuffix"
                          controllerLabel={SUFFIX}
                          error={guardianSuffixError}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={DEMOGRAPHICS}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="language"
                          controllerLabel={LANGUAGE_SPOKEN}
                          error={languageError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="race"
                          label={RACE}
                          error={raceError?.message || ""}
                          value={EMPTY_OPTION}
                          options={MAPPED_RACE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="ethnicity"
                          label={ETHNICITY}
                          error={ethnicityError?.message || ""}
                          value={EMPTY_OPTION}
                          options={MAPPED_ETHNICITY}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="maritialStatus"
                          label={MARITAL_STATUS}
                          error={maritalStatusError?.message || ""}
                          value={EMPTY_OPTION}
                          options={MAPPED_MARITAL_STATUS}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="sexualOrientation"
                          label={SEXUAL_ORIENTATION}
                          error={sexualOrientationError?.message || ""}
                          value={EMPTY_OPTION}
                          options={MAPPED_SEXUAL_ORIENTATION}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="genderIdentity"
                          label={GENDER_IDENTITY}
                          error={genderIdentityError?.message || ""}
                          value={EMPTY_OPTION}
                          options={MAPPED_GENDER_IDENTITY}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="sexAtBirth"
                          label={SEX_AT_BIRTH}
                          error={sexAtBirthError?.message || ""}
                          value={EMPTY_OPTION}
                          options={MAPPED_GENDER_IDENTITY}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="pronouns"
                          label={PRONOUNS}
                          error={pronounsError?.message || ""}
                          value={EMPTY_OPTION}
                          options={MAPPED_PRONOUNS}
                        />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <ToggleButtonComponent name="homeBound" label={HOMEBOUND} />
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={REGISTRATION_DATES}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          disabled={isEdit}
                          value={EMPTY_OPTION}
                          label={FACILITY}
                          name="facilityId"
                          options={renderFacilities(facilityList)}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          disabled={isEdit}
                          value={EMPTY_OPTION}
                          label={USUAL_PROVIDER_ID}
                          name="usualProviderId"
                          options={renderDoctors(doctorList)}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          name="registrationDepartment"
                          value={EMPTY_OPTION}
                          label={REGISTRATION_DEPARTMENT}
                          error={registrationDepartmentError?.message || ""}
                          options={MAPPED_REG_DEPARTMENT}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          name="primaryDepartment"
                          value={EMPTY_OPTION}
                          label={PRIMARY_DEPARTMENT}
                          error={primaryDepartmentError?.message || ""}
                          options={MAPPED_REG_DEPARTMENT}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="registrationDate" label={REGISTRATION_DATE} error={registrationDateError || ''} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="deceasedDate" label={DECREASED_DATE} error={deceasedDateError || ''} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="statementNoteDateFrom" label={ISSUE_DATE} error={statementNoteDateFromError || ''} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="statementNoteDateTo" label={EXPIRATION_DATE} error={statementNoteDateToError || ''} />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={PRIVACY}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid item md={12} sm={12} xs={12}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend">{NOTICE_ON_FILE}</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                color="primary"
                                checked={state.one}
                                onChange={handleChangeForCheckBox("one")}
                              />
                            }
                            label="Privacy Notice"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox color="primary" checked={state.two} onChange={handleChangeForCheckBox("two")} />
                            }
                            label="Release of Billing Information and Assignment of Benefits"
                          />
                        </FormGroup>
                      </FormControl>

                      <Box display="flex" flexDirection="row">
                        <FormControl component="fieldset">
                          <FormGroup>
                            <Box mr={3} mb={2} mt={2}>
                              <FormLabel component="legend">{CONSENT_TO_CALL}</FormLabel>
                              <FormControlLabel
                                control={
                                  <Checkbox color="primary" checked={state.three} onChange={handleChangeForCheckBox("three")} />
                                }
                                label="Granted"
                              />
                            </Box>
                          </FormGroup>
                        </FormControl>

                        <FormControl component="fieldset">
                          <FormGroup>
                            <Box ml={3} mt={2} mb={2}>
                              <FormLabel component="legend">{MEDICATION_HISTORY_AUTHORITY}</FormLabel>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="primary"
                                    checked={state.four}
                                    onChange={handleChangeForCheckBox("four")}
                                  />
                                }
                                label="Granted"
                              />
                            </Box>
                          </FormGroup>
                        </FormControl>
                      </Box>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={EMPLOYMENT}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="employerName"
                          controllerLabel={EMPLOYER_NAME}
                          error={employerNameError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="employerPhone" error={employerPhoneError} label={EMPLOYER_PHONE} />
                      </Grid>
                    </Grid>


                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="employerUsualOccupation"
                          controllerLabel={USUAL_OCCUPATION}
                          error={employerUsualOccupationError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="employerIndustry"
                          controllerLabel={USUAL_INDUSTRY}
                          error={employerIndustryError}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={GUARANTOR}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        isRequired
                        name="guarantorRelationship"
                        label={GUARANTOR_RELATION}
                        error={guarantorRelationshipError?.message || ""}
                        value={EMPTY_OPTION}
                        options={MAPPED_RELATIONSHIP_TYPE}
                      />
                    </Grid>

                    <Box pb={2}>
                      <FormLabel component="legend">{GUARANTOR_NOTE}</FormLabel>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="guarantorSuffix"
                          controllerLabel={SUFFIX}
                          error={guarantorSuffixError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          isRequired
                          fieldType="text"
                          controllerName="guarantorFirstName"
                          controllerLabel={FIRST_NAME}
                          error={guarantorFirstNameError}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="guarantorMiddleName"
                          controllerLabel={MIDDLE_NAME}
                          error={guarantorMiddleNameError}
                        />
                      </Grid>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          isRequired
                          fieldType="text"
                          controllerName="guarantorLastName"
                          controllerLabel={LAST_NAME}
                          error={guarantorLastNameError}
                        />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <PatientController
                        isRequired
                        fieldType="text"
                        controllerName="guarantorZipCode"
                        controllerLabel={ZIP_CODE}
                        error={guarantorZipCodeError}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <PatientController
                        isRequired
                        fieldType="text"
                        controllerName="guarantorAddress"
                        controllerLabel={ADDRESS}
                        error={guarantorAddressError}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <PatientController
                        fieldType="text"
                        controllerName="guarantorAddress2"
                        controllerLabel={ADDRESS_2}
                        error={guarantorAddress2Error}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <PatientController
                          isRequired
                          fieldType="text"
                          controllerName="guarantorCity"
                          controllerLabel={CITY}
                          error={guarantorCityError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <PatientController
                          isRequired
                          fieldType="text"
                          controllerName="guarantorState"
                          controllerLabel={STATE}
                          error={guarantorStateError}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <PatientController
                          fieldType="text"
                          controllerName="guarantorCountry"
                          controllerLabel={COUNTRY}
                          error={guarantorCountryError}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PatientController
                          fieldType="text"
                          controllerName="guarantorSsn"
                          controllerLabel={SSN}
                          error={guarantorSsnError}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField isRequired name="guarantorPhone" error={guarantorPhoneError} label={PHONE} />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <PatientController
                        isRequired
                        fieldType="email"
                        controllerName="guarantorEmail"
                        controllerLabel={EMAIL}
                        error={guarantorEmailError}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <PatientController
                        fieldType="text"
                        controllerName="guarantorEmployerName"
                        controllerLabel={EMPLOYER}
                        error={guarantorEmployerNameError}
                      />
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={disableSubmit}>
            {isEdit ? UPDATE_PATIENT : CREATE_PATIENT}

            {disableSubmit && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>

      </form>
    </FormProvider>
  );
};

export default PatientForm;
