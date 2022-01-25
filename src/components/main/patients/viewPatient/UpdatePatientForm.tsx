// packages block
import { FC, useState, useContext, ChangeEvent, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm, SubmitHandler } from "react-hook-form";
import {
  CircularProgress, Box, Button, FormControl, Grid, InputLabel, FormControlLabel, FormLabel, FormGroup, Checkbox, Radio, RadioGroup
} from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import PatientController from "../controllers";
import Selector from '../../../common/Selector';
import PhoneField from '../../../common/PhoneInput';
import DatePicker from "../../../common/DatePicker";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { getDate, renderDoctors, renderFacilities, setRecord } from '../../../../utils';
import { AuthContext } from '../../../../context';
import { ListContext } from '../../../../context/listContext';
import { patientsSchema } from '../../../../validationSchemas';
import { ParamsType, PatientInputProps } from '../../../../interfacesTypes';
import {
  ContactType, Ethnicity, Genderidentity, Holdstatement, Homebound, Maritialstatus, PrimaryDepartment,
  Pronouns, Race, RegDepartment, RelationshipType, Sexualorientation, useGetPatientLazyQuery, useUpdatePatientMutation
} from "../../../../generated/graphql";
import {
  FIRST_NAME, LAST_NAME, CITY, STATE, COUNTRY, CONTACT_INFORMATION, IDENTIFICATION, DOB, EMAIL, PHONE,
  DEMOGRAPHICS, GUARANTOR, PRIVACY, REGISTRATION_DATES, EMERGENCY_CONTACT, NEXT_OF_KIN, EMPLOYMENT,
  GUARDIAN, SUFFIX, MIDDLE_NAME, FIRST_NAME_USED, PREFERRED_NAME, PREVIOUS_FIRST_NAME, PREVIOUS_LAST_NAME,
  MOTHERS_MAIDEN_NAME, SSN, ZIP_CODE, ADDRESS, ADDRESS_2, REGISTRATION_DATE, NOTICE_ON_FILE, CONSENT_TO_CALL,
  MEDICATION_HISTORY_AUTHORITY, NAME, HOME_PHONE, MOBILE_PHONE, EMPLOYER_NAME, EMPLOYER, DECREASED_DATE,
  EMPLOYER_PHONE, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENTS_ROUTE,
  LANGUAGE_SPOKEN, MAPPED_RACE, MAPPED_ETHNICITY, MAPPED_SEXUAL_ORIENTATION, MAPPED_PRONOUNS, MAPPED_HOMEBOUND,
  MAPPED_RELATIONSHIP_TYPE, MAPPED_REG_DEPARTMENT, MAPPED_MARITAL_STATUS, ETHNICITY,
  SEXUAL_ORIENTATION, PRONOUNS, HOMEBOUND, RELATIONSHIP, USUAL_PROVIDER_ID, REGISTRATION_DEPARTMENT,
  PRIMARY_DEPARTMENT, USUAL_OCCUPATION, USUAL_INDUSTRY, GENDER_IDENTITY, MAPPED_GENDER_IDENTITY, SEX_AT_BIRTH,
  ISSUE_DATE, EXPIRATION_DATE, RACE, MARITAL_STATUS, MAPPED_GENDER, LEGAL_SEX,
  GUARANTOR_RELATION, GUARANTOR_NOTE, FACILITY, PATIENT_UPDATED, FAILED_TO_UPDATE_PATIENT, UPDATE_PATIENT, PATIENT_NOT_FOUND,
} from "../../../../constants";
import { useParams } from 'react-router-dom';
import BackdropLoader from '../../../common/Backdrop';

const UpdatePatientForm: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const { user } = useContext(AuthContext)
  const { doctorList, facilityList } = useContext(ListContext)
  const [state, setState] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false
  })
  const [selection, setSelection] = useState({ value: "1", });
  const methods = useForm<PatientInputProps>({ mode: "all", resolver: yupResolver(patientsSchema) });
  const { reset, handleSubmit, setValue, control, formState: { errors } } = methods;
  const [basicContactId, setBasicContactId] = useState<string>('')
  const [emergencyContactId, setEmergencyContactId] = useState<string>('')
  const [kinContactId, setKinContactId] = useState<string>('')
  const [guardianContactId, setGuardianContactId] = useState<string>('')
  const [guarantorContactId, setGuarantorContactId] = useState<string>('')
  const [employerId, setEmployerId] = useState<string>('')

  const [getPatient, { loading: getPatientLoading }] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { getPatient: { patient } } = data

        if (patient) {
          const { suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName,
            previouslastName, motherMaidenName, ssn, dob, gender, registrationDepartment, primaryDepartment,
            registrationDate, deceasedDate, privacyNotice, releaseOfInfoBill, callToConsent, medicationHistoryAuthority,
            patientNote, language, race, ethnicity, maritialStatus, sexualOrientation, genderIdentity, sexAtBirth,
            pronouns, homeBound, holdStatement, statementDelivereOnline, statementNote, statementNoteDateFrom,
            statementNoteDateTo, usualProvider, facility, contacts, employer
          } = patient;

          if (usualProvider) {
            const { id: usualProviderId, firstName, lastName } = usualProvider[0] || {};
            usualProviderId && setValue("usualProviderId", setRecord(usualProviderId, `${firstName} ${lastName}` || ''))
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
          homeBound && setValue("homeBound", homeBound)
          firstName && setValue("firstName", firstName)
          middleName && setValue("middleName", middleName)
          patientNote && setValue("patientNote", patientNote)
          firstNameUsed && setValue("firstNameUsed", firstNameUsed)
          privacyNotice && setValue("privacyNotice", privacyNotice)
          callToConsent && setValue("callToConsent", callToConsent)
          prefferedName && setValue("prefferedName", prefferedName)
          holdStatement && setValue("holdStatement", holdStatement)
          statementNote && setValue("statementNote", statementNote)
          motherMaidenName && setValue("motherMaidenName", motherMaidenName)
          previouslastName && setValue("previouslastName", previouslastName)
          previousFirstName && setValue("previousFirstName", previousFirstName)
          statementDelivereOnline && setValue("statementDelivereOnline", statementDelivereOnline)
          medicationHistoryAuthority && setValue("medicationHistoryAuthority", medicationHistoryAuthority)

          deceasedDate && setValue("deceasedDate", deceasedDate)
          registrationDate && setValue("registrationDate", registrationDate)
          releaseOfInfoBill && setValue("releaseOfInfoBill", releaseOfInfoBill)
          statementNoteDateTo && setValue("statementNoteDateTo", getDate(statementNoteDateTo))
          statementNoteDateFrom && setValue("statementNoteDateFrom", getDate(statementNoteDateFrom))

          race && setValue("race", setRecord(race || '', race || ''))
          gender && setValue("gender", setRecord(gender || '', gender || ''))
          pronouns && setValue("pronouns", setRecord(pronouns || '', pronouns || ''))
          ethnicity && setValue("ethnicity", setRecord(ethnicity || '', ethnicity || ''))
          sexAtBirth && setValue("sexAtBirth", setRecord(sexAtBirth || '', sexAtBirth || ''))
          maritialStatus && setValue("maritialStatus", setRecord(maritialStatus || '', maritialStatus || ''))
          genderIdentity && setValue("genderIdentity", setRecord(genderIdentity || '', genderIdentity || ''))
          sexualOrientation && setValue("sexualOrientation", setRecord(sexualOrientation || '', sexualOrientation || ''))
          primaryDepartment && setValue("primaryDepartment", setRecord(primaryDepartment || '', primaryDepartment || ''))
          registrationDepartment && setValue("registrationDepartment", setRecord(registrationDepartment || '', registrationDepartment || ''))

          if (contacts) {
            const emergencyContact = contacts.filter(contact => contact.contactType === ContactType.Emergency)[0]

            if (emergencyContact) {
              const { id, name, relationship, phone, mobile } = emergencyContact;

              setEmergencyContactId(id);
              name && setValue("emergencyName", name)
              phone && setValue("emergencyPhone", phone)
              mobile && setValue("emergencyMobile", mobile)
              relationship && setValue("emergencyRelationship", setRecord(relationship || '', relationship || ''))
            }

            const basicContact = contacts.filter(contact => contact.contactType === ContactType.Self)[0]

            if (basicContact) {
              const { email, address, address2, zipCode, city, state, country, phone, mobile } = basicContact;

              setBasicContactId(id);
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
              const { id, name, relationship, phone, mobile } = kinContact;

              setKinContactId(id);
              name && setValue("kinName", name)
              phone && setValue("kinPhone", phone)
              mobile && setValue("kinMobile", mobile)
              relationship && setValue("kinRelationship", setRecord(relationship || '', relationship || ''))
            }

            const guarantorContact = contacts.filter(contact => contact.contactType === ContactType.Guarandor)[0]

            if (guarantorContact) {
              const { id, suffix, firstName, lastName, middleName, phone, zipCode, address, address2, city, state, country,
                ssn, email, employerName
              } = guarantorContact;

              setGuarantorContactId(id);
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
              lastName && setValue("guarantorFirstName", lastName)
              firstName && setValue("guarantorLastName", firstName)
              middleName && setValue("guarantorMiddleName", middleName)
              employerName && setValue("guarantorEmployerName", employerName)

            }

            const guardianContact = contacts.filter(contact => contact.contactType === ContactType.Guardian)[0]

            if (guardianContact) {
              const { id, suffix, firstName, lastName, middleName } = guardianContact;

              setGuardianContactId(id);
              suffix && setValue("guardianSuffix", suffix)
              lastName && setValue("guardianLastName", lastName)
              firstName && setValue("guardianFirstName", firstName)
              middleName && setValue("guardianMiddleName", middleName)

            }
          }

          if (employer) {
            const { id, name, email, phone, industry, usualOccupation } = employer[0];

            setEmployerId(id)
            name && setValue('employerName', name)
            email && setValue('employerEmail', email)
            phone && setValue('employerPhone', phone)
            industry && setValue('employerIndustry', industry)
            usualOccupation && setValue('employerUsualOccupation', usualOccupation)
          }
        }
      }
    },
  });

  const [updatePatient, { loading }] = useUpdatePatientMutation({
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
          Alert.success(PATIENT_UPDATED);
          reset()
          history.push(PATIENTS_ROUTE)
        }
      }
    }
  });


  const updateSelection = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    event.persist();
    const name = event.target.name;
    setSelection({ ...selection, [name]: value });
  };

  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const onSubmit: SubmitHandler<PatientInputProps> = async (inputs) => {
    const {
      suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName, usualProviderId,
      previouslastName, motherMaidenName, ssn, dob, gender, registrationDepartment, primaryDepartment,
      registrationDate, deceasedDate, privacyNotice, releaseOfInfoBill, callToConsent, medicationHistoryAuthority,
      patientNote, language, race, ethnicity, maritialStatus, sexualOrientation, genderIdentity, sexAtBirth,
      pronouns, homeBound, holdStatement, statementDelivereOnline, statementNote, statementNoteDateFrom,
      statementNoteDateTo, facilityId,

      basicEmail, basicPhone, basicMobile, basicAddress, basicAddress2, basicZipCode, basicCity, basicState, basicCountry,

      emergencyName, emergencyRelationship, emergencyPhone, emergencyMobile,

      kinName, kinRelationship, kinMobile, kinPhone,

      guardianFirstName, guardianMiddleName, guardianLastName, guardianSuffix,

      guarantorFirstName, guarantorMiddleName, guarantorLastName, guarantorEmail, guarantorRelationship,
      guarantorPhone, guarantorSuffix, guarantorAddress, guarantorAddress2, guarantorZipCode, guarantorCity,
      guarantorState, guarantorCountry, guarantorEmployerName, guarantorSsn,

      employerName, employerEmail, employerPhone, employerIndustry, employerUsualOccupation,
    } = inputs;

    const { id: selectedFacility } = facilityId
    const { id: selectedUsualProvider } = usualProviderId
    const { id: selectedRegistrationDepartment } = registrationDepartment
    const { id: selectedPrimaryDepartment } = primaryDepartment
    const { id: selectedSexualOrientation } = sexualOrientation
    const { id: selectedPronouns } = pronouns
    const { id: selectedRace } = race
    const { id: selectedEthnicity } = ethnicity
    const { id: selectedMaritalStatus } = maritialStatus
    const { id: selectedGenderIdentity } = genderIdentity
    const { id: selectedGender } = gender
    const { id: selectedSexAtBirth } = sexAtBirth
    const { id: selectedGuarantorRelationship } = guarantorRelationship
    const { id: selectedEmergencyRelationship } = emergencyRelationship
    const { id: selectedKinRelationship } = kinRelationship

    if (user) {
      const { id: userId } = user

      await updatePatient({
        variables: {
          updatePatientInput: {
            updatePatientItemInput: {
              id, suffix: suffix || '', firstName: firstName || '', middleName: middleName || '', lastName: lastName || '',
              firstNameUsed: firstNameUsed || '', prefferedName: prefferedName || '', previousFirstName: previousFirstName || '',
              previouslastName: previouslastName || '', motherMaidenName: motherMaidenName || '', ssn: ssn || '',
              dob: dob || '', registrationDate: registrationDate || '', deceasedDate: deceasedDate || '',
              privacyNotice: privacyNotice || false, releaseOfInfoBill: releaseOfInfoBill || false, adminId: userId || '',
              callToConsent: callToConsent || false, medicationHistoryAuthority: medicationHistoryAuthority || false,
              patientNote: patientNote || '', language: language || '', statementNoteDateTo: statementNoteDateTo || '',
              homeBound: homeBound || Homebound.No, holdStatement: holdStatement || Holdstatement.None,
              statementNoteDateFrom: statementNoteDateFrom || '', pronouns: selectedPronouns as Pronouns || Pronouns.None,
              ethnicity: selectedEthnicity as Ethnicity || Ethnicity.None, facilityId: selectedFacility || '',
              gender: selectedGender as Genderidentity || Genderidentity.None, usualProviderId: selectedUsualProvider || '',
              sexAtBirth: selectedSexAtBirth as Genderidentity || Genderidentity.None,
              genderIdentity: selectedGenderIdentity as Genderidentity || Genderidentity.None,
              maritialStatus: selectedMaritalStatus as Maritialstatus || Maritialstatus.Single,
              sexualOrientation: selectedSexualOrientation as Sexualorientation || Sexualorientation.None,
              statementDelivereOnline: statementDelivereOnline || false, statementNote: statementNote || '',
              primaryDepartment: selectedPrimaryDepartment as PrimaryDepartment || PrimaryDepartment.Hospital,
              registrationDepartment: selectedRegistrationDepartment as RegDepartment || RegDepartment.Hospital,
              race: selectedRace as Race || Race.White,
            },

            updateContactInput: {
              id: basicContactId, contactType: ContactType.Self, country: basicCountry || '', email: basicEmail || '',
              state: basicState || '', facilityId: selectedFacility || '', phone: basicPhone || '',
              mobile: basicMobile || '', address2: basicAddress2 || '', address: basicAddress || '',
              zipCode: basicZipCode || '', city: basicCity || ''

            },

            updateEmergencyContactInput: {
              id: emergencyContactId, contactType: ContactType.Emergency, name: emergencyName || '',
              phone: emergencyPhone || '', mobile: emergencyMobile || '', primaryContact: false,
              relationship: selectedEmergencyRelationship as RelationshipType || RelationshipType.Other,
            },

            updateGuarantorContactInput: {
              id: guarantorContactId, firstName: guarantorFirstName || '', middleName: guarantorMiddleName || '',
              lastName: guarantorLastName || '', email: guarantorEmail || '', contactType: ContactType.Guarandor,
              relationship: selectedGuarantorRelationship as RelationshipType || RelationshipType.Other,
              employerName: guarantorEmployerName || '', address2: guarantorAddress2 || '', address: guarantorAddress || '',
              zipCode: guarantorZipCode || '', city: guarantorCity || '', state: guarantorState || '',
              phone: guarantorPhone || '', suffix: guarantorSuffix || '', country: guarantorCountry || '',
              userId: userId || '', ssn: guarantorSsn || '', primaryContact: false,
            },

            updateGuardianContactInput: {
              id: guardianContactId, firstName: guardianFirstName || '', middleName: guardianMiddleName || '',
              lastName: guardianLastName || '', contactType: ContactType.Guardian, suffix: guardianSuffix || '',
              userId: userId || '', primaryContact: false,
            },

            updateNextOfKinContactInput: {
              id: kinContactId, contactType: ContactType.NextOfKin, name: kinName || '', phone: kinPhone || '',
              mobile: kinMobile || '', primaryContact: false,
              relationship: selectedKinRelationship as RelationshipType || RelationshipType.Other,
            },

            updateEmployerInput: {
              id: employerId, name: employerName || '', email: employerEmail || '', phone: employerPhone || '',
              usualOccupation: employerUsualOccupation || '', industry: employerIndustry || '',
            },
          }
        }
      })
    } else {
      Alert.error(FAILED_TO_UPDATE_PATIENT)
    }
  };

  useEffect(() => {
    if (id) {
      getPatient({
        variables: {
          getPatient: {
            id
          }
        },
      })
    } else Alert.error(PATIENT_NOT_FOUND)
  }, [getPatient, id])

  const {
    ssn: { message: ssnError } = {},
    dob: { message: dobError } = {},
    race: { message: raceError } = {},
    suffix: { message: suffixError } = {},
    gender: { message: genderError } = {},
    pronouns: { message: pronounsError } = {},
    language: { message: languageError } = {},
    lastName: { message: lastNameError } = {},
    facilityId: { message: facilityError } = {},
    ethnicity: { message: ethnicityError } = {},
    firstName: { message: firstNameError } = {},
    sexAtBirth: { message: sexAtBirthError } = {},
    middleName: { message: middleNameError } = {},
    deceasedDate: { message: deceasedDateError } = {},
    firstNameUsed: { message: firstNameUsedError } = {},
    prefferedName: { message: preferredNameError } = {},
    maritialStatus: { message: maritalStatusError } = {},
    genderIdentity: { message: genderIdentityError } = {},
    previouslastName: { message: previousLastNameError } = {},
    motherMaidenName: { message: motherMaidenNameError } = {},
    primaryDepartment: { message: primaryDepartmentError } = {},
    previousFirstName: { message: previousFirstNameError } = {},
    sexualOrientation: { message: sexualOrientationError } = {},
    registrationDate: { message: registrationDateError } = {},
    statementNoteDateTo: { message: statementNoteDateToError } = {},
    guarantorRelationship: { message: guarantorRelationshipError } = {},
    statementNoteDateFrom: { message: statementNoteDateFromError } = {},
    registrationDepartment: { message: registrationDepartmentError } = {},

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
    emergencyRelationship: { message: emergencyRelationshipError } = {},

    kinName: { message: kinNameError } = {},
    kinPhone: { message: kinPhoneError } = {},
    kinMobile: { message: kinMobileError } = {},
    kinRelationship: { message: kinRelationshipError } = {},


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
      {getPatientLoading ? <BackdropLoader loading={getPatientLoading} /> :
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
            <Grid container spacing={3}>
              <Grid md={6} item>
                <CardComponent cardTitle={IDENTIFICATION}>
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
                        name="gender"
                        error={genderError}
                        label={LEGAL_SEX}
                        value={{ id: '', name: '' }}
                        options={MAPPED_GENDER}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <DatePicker name="dob" label={DOB} error={dobError || ''} />
                    </Grid>
                  </Grid>
                </CardComponent>

                <Box pb={3} />

                <CardComponent cardTitle={CONTACT_INFORMATION}>
                  <Grid item md={12} sm={12} xs={12}>
                    <PatientController
                      fieldType="text"
                      controllerName="basicZipCode"
                      controllerLabel={ZIP_CODE}
                      error={basicZipCodeError}
                    />
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <PatientController
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
                        fieldType="text"
                        controllerName="basicCity"
                        controllerLabel={CITY}
                        error={basicCityError}
                      />
                    </Grid>

                    <Grid item md={4}>
                      <PatientController
                        fieldType="text"
                        controllerName="basicState"
                        controllerLabel={STATE}
                        error={basicStateError}
                      />
                    </Grid>

                    <Grid item md={4}>
                      <PatientController
                        fieldType="text"
                        controllerName="basicCountry"
                        controllerLabel={COUNTRY}
                        error={basicCountryError}
                      />
                    </Grid>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <PatientController
                      fieldType="text"
                      controllerName="basicEmail"
                      controllerLabel={EMAIL}
                      error={basicEmailError}
                    />
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <PhoneField name="basicPhone" error={basicPhoneError} label={HOME_PHONE} />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <PhoneField name="basicMobile" error={basicMobileError} label={MOBILE_PHONE} />
                    </Grid>
                  </Grid>
                </CardComponent>

                <Box pb={3} />

                <CardComponent cardTitle={EMERGENCY_CONTACT}>
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
                        error={emergencyRelationshipError}
                        value={{ id: '', name: '' }}
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
                </CardComponent>

                <Box pb={3} />

                <CardComponent cardTitle={NEXT_OF_KIN}>
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
                        error={kinRelationshipError}
                        value={{ id: '', name: '' }}
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
                </CardComponent>

                <Box pb={3} />

                <CardComponent cardTitle={GUARDIAN}>
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
                </CardComponent>

                <Box pb={3} />

                <CardComponent cardTitle={DEMOGRAPHICS}>
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
                        error={raceError}
                        value={{ id: '', name: '' }}
                        options={MAPPED_RACE}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        name="ethnicity"
                        label={ETHNICITY}
                        error={ethnicityError}
                        value={{ id: '', name: '' }}
                        options={MAPPED_ETHNICITY}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        name="maritialStatus"
                        label={MARITAL_STATUS}
                        error={maritalStatusError}
                        value={{ id: '', name: '' }}
                        options={MAPPED_MARITAL_STATUS}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        name="sexualOrientation"
                        label={SEXUAL_ORIENTATION}
                        error={sexualOrientationError}
                        value={{ id: '', name: '' }}
                        options={MAPPED_SEXUAL_ORIENTATION}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        name="genderIdentity"
                        label={GENDER_IDENTITY}
                        error={genderIdentityError}
                        value={{ id: '', name: '' }}
                        options={MAPPED_GENDER_IDENTITY}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        name="sexAtBirth"
                        label={SEX_AT_BIRTH}
                        error={sexAtBirthError}
                        value={{ id: '', name: '' }}
                        options={MAPPED_GENDER_IDENTITY}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        name="pronouns"
                        label={PRONOUNS}
                        error={pronounsError}
                        value={{ id: '', name: '' }}
                        options={MAPPED_PRONOUNS}
                      />
                    </Grid>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <Controller
                      name="homeBound"
                      control={control}
                      render={() => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>{HOMEBOUND}</InputLabel>
                            <RadioGroup
                              name="value"
                              value={selection.value}
                              onChange={updateSelection}
                            >
                              {MAPPED_HOMEBOUND.map(homeBound => (
                                <FormControlLabel
                                  label={homeBound.name}
                                  key={homeBound.id}
                                  value={homeBound.name}
                                  control={<Radio color="primary" />}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </CardComponent>
              </Grid>

              <Grid md={6} item>
                <CardComponent cardTitle={REGISTRATION_DATES}>
                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        value={{ id: '', name: '' }}
                        label={FACILITY}
                        name="facilityId"
                        error={facilityError}
                        options={renderFacilities(facilityList)}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        value={{ id: '', name: '' }}
                        label={USUAL_PROVIDER_ID}
                        name="usualProviderId"
                        options={renderDoctors(doctorList)}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        name="registrationDepartment"
                        value={{ id: '', name: '' }}
                        label={REGISTRATION_DEPARTMENT}
                        error={registrationDepartmentError}
                        options={MAPPED_REG_DEPARTMENT}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        name="primaryDepartment"
                        value={{ id: '', name: '' }}
                        label={PRIMARY_DEPARTMENT}
                        error={primaryDepartmentError}
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
                </CardComponent>

                <Box pb={3} />

                <CardComponent cardTitle={PRIVACY}>
                  <Grid item md={12} sm={12} xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{NOTICE_ON_FILE}</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={state.one}
                              onChange={handleChangeForCheckBox("one")}
                            />
                          }
                          label="Privacy Notice"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox checked={state.two} onChange={handleChangeForCheckBox("two")} />
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
                                <Checkbox checked={state.three} onChange={handleChangeForCheckBox("three")} />
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
                </CardComponent>

                <Box pb={3} />

                <CardComponent cardTitle={EMPLOYMENT}>
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
                </CardComponent>

                <Box pb={3} />

                <CardComponent cardTitle={GUARANTOR}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Selector
                      name="guarantorRelationship"
                      label={GUARANTOR_RELATION}
                      error={guarantorRelationshipError}
                      value={{ id: '', name: '' }}
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
                        fieldType="text"
                        controllerName="guarantorLastName"
                        controllerLabel={LAST_NAME}
                        error={guarantorLastNameError}
                      />
                    </Grid>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <PatientController
                      fieldType="text"
                      controllerName="guarantorZipCode"
                      controllerLabel={ZIP_CODE}
                      error={guarantorZipCodeError}
                    />
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <PatientController
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
                        fieldType="text"
                        controllerName="guarantorCity"
                        controllerLabel={CITY}
                        error={guarantorCityError}
                      />
                    </Grid>

                    <Grid item md={4}>
                      <PatientController
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
                      <PhoneField name="guarantorPhone" error={guarantorPhoneError} label={PHONE} />
                    </Grid>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <PatientController
                      disabled
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
                </CardComponent>
              </Grid>
            </Grid>
          </Box>

          <Box display="flex" justifyContent="flex-end" pt={2}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {UPDATE_PATIENT}
              {loading && <CircularProgress size={20} color="inherit" />}
            </Button>
          </Box>

        </form>
      }
    </FormProvider>

  );
};

export default UpdatePatientForm;
