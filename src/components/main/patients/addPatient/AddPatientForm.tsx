// packages block
import { FC, useState, useContext, ChangeEvent } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm, SubmitHandler } from "react-hook-form";
import {
  CircularProgress, Box, Button, FormControl, Grid, InputLabel, FormControlLabel, FormLabel, FormGroup, Checkbox, Radio, RadioGroup
} from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import DatePicker from "../../../common/DatePicker";
import AddPatientController from "./AddPatientController";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { renderDoctors, renderFacilities } from '../../../../utils';
import { AuthContext } from '../../../../context';
import { ListContext } from '../../../../context/listContext';
import { patientsSchema } from '../../../../validationSchemas';
import { PatientInputProps } from '../../../../interfacesTypes';
import {
  ContactType, Ethnicity, Genderidentity, Holdstatement, Homebound, Maritialstatus, PrimaryDepartment,
  Pronouns, Race, RegDepartment, RelationshipType, Sexualorientation, useCreatePatientMutation, UserRole
} from "../../../../generated/graphql";
import {
  FIRST_NAME, LAST_NAME, CITY, STATE, COUNTRY, CONTACT_INFORMATION, IDENTIFICATION, DOB, EMAIL, PHONE,
  ADD_PATIENT, DEMOGRAPHICS, GUARANTOR, PRIVACY, REGISTRATION_DATES, EMERGENCY_CONTACT, NEXT_OF_KIN, EMPLOYMENT,
  GUARDIAN, SUFFIX, MIDDLE_NAME, FIRST_NAME_USED, PREFERRED_NAME, PREVIOUS_FIRST_NAME, PREVIOUS_LAST_NAME,
  MOTHERS_MAIDEN_NAME, SSN, ZIP_CODE, ADDRESS, ADDRESS_2, REGISTRATION_DATE, NOTICE_ON_FILE, CONSENT_TO_CALL,
  MEDICATION_HISTORY_AUTHORITY, NAME, HOME_PHONE, MOBILE_PHONE, EMPLOYER_NAME, EMPLOYER, DECREASED_DATE,
  EMPLOYER_PHONE, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENT_CREATED, PATIENTS_ROUTE,
  LANGUAGE_SPOKEN, MAPPED_RACE, MAPPED_ETHNICITY, MAPPED_SEXUAL_ORIENTATION, MAPPED_PRONOUNS, MAPPED_HOMEBOUND,
  MAPPED_RELATIONSHIP_TYPE, MAPPED_REG_DEPARTMENT, MAPPED_MARITAL_STATUS, ETHNICITY,
  SEXUAL_ORIENTATION, PRONOUNS, HOMEBOUND, RELATIONSHIP, USUAL_PROVIDER_ID, REGISTRATION_DEPARTMENT,
  PRIMARY_DEPARTMENT, USUAL_OCCUPATION, USUAL_INDUSTRY, GENDER_IDENTITY, MAPPED_GENDER_IDENTITY, SEX_AT_BIRTH,
  ISSUE_DATE, EXPIRATION_DATE, FAILED_TO_CREATE_PATIENT, RACE, MARITAL_STATUS, MAPPED_GENDER, LEGAL_SEX, 
  GUARANTOR_RELATION, GUARANTOR_NOTE, FACILITY,
} from "../../../../constants";

const AddPatientForm: FC = (): JSX.Element => {
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
  const { reset, handleSubmit, control, formState: { errors } } = methods;

  const [createPatient, { loading }] = useCreatePatientMutation({
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
          Alert.success(PATIENT_CREATED);
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
      guarantorState, guarantorCountry, guarantorEmployerName,

      employerName, employerEmail, employerPhone, employerIndustry, employerUsualOccupation,

      userFirstName, userLastName, userPassword, userEmail, userPhone, userZipCode,
    } = inputs;

    const { id: selectedFacility } = facilityId
    const { id: selectedUsualProvider } = usualProviderId
    const { id: selectedRegistrationDepartment } = registrationDepartment
    const { id: selectedPrimaryDepartment } = primaryDepartment
    const { id: selectedSexualOrientation } = sexualOrientation
    const { id: selectedPronouns } = pronouns
    const { id: selectedRace } = race
    const { id: selectedEthnicity } = ethnicity
    const { id: selectedMaritialStatus } = maritialStatus
    const { id: selectedGenderIdentity } = genderIdentity
    const { id: selectedGender } = gender
    const { id: selectedSexAtBirth } = sexAtBirth
    const { id: selectedGuarantorRelationship } = guarantorRelationship
    const { id: selectedEmergencyRelationship } = emergencyRelationship
    const { id: selectedKinRelationship } = kinRelationship

    if (user) {
      const { id: userId } = user

      await createPatient({
        variables: {
          createPatientInput: {
            createPatientItemInput: {
              suffix: suffix || '', firstName: firstName || '', middleName: middleName || '', lastName: lastName || '',
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
              maritialStatus: selectedMaritialStatus as Maritialstatus || Maritialstatus.Single,
              sexualOrientation: selectedSexualOrientation as Sexualorientation || Sexualorientation.None,
              statementDelivereOnline: statementDelivereOnline || false, statementNote: statementNote || '',
              primaryDepartment: selectedPrimaryDepartment as PrimaryDepartment || PrimaryDepartment.Hospital,
              registrationDepartment: selectedRegistrationDepartment as RegDepartment || RegDepartment.Hospital,
              race: selectedRace as Race || Race.White,
            },

            createContactInput: {
              contactType: ContactType.Self, country: basicCountry || '', email: basicEmail || '', state: basicState || '',
              facilityId: selectedFacility || '', phone: basicPhone || '', mobile: basicMobile || '',
              address2: basicAddress2 || '', address: basicAddress || '', zipCode: basicZipCode || '', city: basicCity || '',
            },

            createEmergencyContactInput: {
              contactType: ContactType.Emergency, name: emergencyName || '', phone: emergencyPhone || '', mobile: emergencyMobile || '',
              relationship: selectedEmergencyRelationship as RelationshipType || RelationshipType.Other,
            },

            createGuarantorContactInput: {
              firstName: guarantorFirstName || '', middleName: guarantorMiddleName || '',
              lastName: guarantorLastName || '', email: guarantorEmail || '', contactType: ContactType.Guarandor,
              relationship: selectedGuarantorRelationship as RelationshipType || RelationshipType.Other,
              employerName: guarantorEmployerName || '', address2: guarantorAddress2 || '', address: guarantorAddress || '',
              zipCode: guarantorZipCode || '', city: guarantorCity || '', state: guarantorState || '',
              phone: guarantorPhone || '', suffix: guarantorSuffix || '', country: guarantorCountry || '', userId: userId || '',
            },

            createGuardianContactInput: {
              firstName: guardianFirstName || '', middleName: guardianMiddleName || '', lastName: guardianLastName || '',
              contactType: ContactType.Guardian, suffix: guardianSuffix || '', userId: userId || '',
            },

            createNextOfKinContactInput: {
              contactType: ContactType.NextOfKin, name: kinName || '', phone: kinPhone || '', mobile: kinMobile || '',
              relationship: selectedKinRelationship as RelationshipType || RelationshipType.Other,
            },

            createEmployerInput: {
              name: employerName || '', email: employerEmail || '', phone: employerPhone || '',
              usualOccupation: employerUsualOccupation || '', industry: employerIndustry || '',
            },

            registerUserInput: {
              firstName: userFirstName || '', lastName: userLastName || '', email: userEmail || '',
              facilityId: selectedFacility, phone: userPhone || '', zipCode: userZipCode || '',
              password: userPassword || '', adminId: userId || '', roleType: UserRole.Patient
            }
          }
        }
      })
    } else {
      Alert.error(FAILED_TO_CREATE_PATIENT)
    }

  };

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
      {JSON.stringify(errors)}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="suffix"
                      controllerLabel={SUFFIX}
                      error={suffixError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="firstName"
                      controllerLabel={FIRST_NAME}
                      error={firstNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="middleName"
                      controllerLabel={MIDDLE_NAME}
                      error={middleNameError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="lastName"
                      controllerLabel={LAST_NAME}
                      error={lastNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="firstNameUsed"
                      controllerLabel={FIRST_NAME_USED}
                      error={firstNameUsedError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="prefferedName"
                      controllerLabel={PREFERRED_NAME}
                      error={preferredNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="previousFirstName"
                      controllerLabel={PREVIOUS_FIRST_NAME}
                      error={previousFirstNameError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="previouslastName"
                      controllerLabel={PREVIOUS_LAST_NAME}
                      error={previousLastNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="motherMaidenName"
                      controllerLabel={MOTHERS_MAIDEN_NAME}
                      error={motherMaidenNameError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
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
                  <AddPatientController
                    fieldType="text"
                    controllerName="basicZipCode"
                    controllerLabel={ZIP_CODE}
                    error={basicZipCodeError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="basicAddress"
                    controllerLabel={ADDRESS}
                    error={basicAddressError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="basicAddress2"
                    controllerLabel={ADDRESS_2}
                    error={basicAddress2Error}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="basicCity"
                      controllerLabel={CITY}
                      error={basicCityError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="basicState"
                      controllerLabel={STATE}
                      error={basicStateError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="basicCountry"
                      controllerLabel={COUNTRY}
                      error={basicCountryError}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="basicEmail"
                    controllerLabel={EMAIL}
                    error={basicEmailError}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="basicPhone"
                      controllerLabel={HOME_PHONE}
                      error={basicPhoneError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="basicMobile"
                      controllerLabel={MOBILE_PHONE}
                      error={basicMobileError}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={EMERGENCY_CONTACT}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="emergencyName"
                      control={control}
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
                    <AddPatientController
                      fieldType="text"
                      controllerName="emergencyPhone"
                      control={control}
                      controllerLabel={HOME_PHONE}
                      error={emergencyPhoneError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="emergencyMobile"
                      control={control}
                      controllerLabel={MOBILE_PHONE}
                      error={emergencyMobileError}
                    />
                  </Grid>
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={NEXT_OF_KIN}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="kinName"
                      control={control}
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
                    <AddPatientController
                      fieldType="text"
                      controllerName="kinPhone"
                      controllerLabel={HOME_PHONE}
                      error={kinPhoneError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="kinMobile"
                      controllerLabel={MOBILE_PHONE}
                      error={kinMobileError}
                    />
                  </Grid>
                </Grid>

              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={GUARDIAN}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guardianFirstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                      error={guardianFirstNameError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guardianMiddleName"
                      control={control}
                      controllerLabel={MIDDLE_NAME}
                      error={guardianMiddleNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guardianLastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                      error={guardianLastNameError}
                    />
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guardianSuffix"
                      control={control}
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
                    <AddPatientController
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
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="employerName"
                    control={control}
                    controllerLabel={EMPLOYER_NAME}
                    error={employerNameError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="employerPhone"
                    control={control}
                    controllerLabel={EMPLOYER_PHONE}
                    error={employerPhoneError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="employerUsualOccupation"
                    control={control}
                    controllerLabel={USUAL_OCCUPATION}
                    error={employerUsualOccupationError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="employerIndustry"
                    controllerLabel={USUAL_INDUSTRY}
                    error={employerIndustryError}
                  />
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
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorSuffix"
                      controllerLabel={SUFFIX}
                      error={guarantorSuffixError}
                    />
                  </Grid>

                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorFirstName"
                      controllerLabel={FIRST_NAME}
                      error={guarantorFirstNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorMiddleName"
                      controllerLabel={MIDDLE_NAME}
                      error={guarantorMiddleNameError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorLastName"
                      controllerLabel={LAST_NAME}
                      error={guarantorLastNameError}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guarantorZipCode"
                    controllerLabel={ZIP_CODE}
                    error={guarantorZipCodeError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guarantorAddress"
                    controllerLabel={ADDRESS}
                    error={guarantorAddressError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guarantorAddress2"
                    controllerLabel={ADDRESS_2}
                    error={guarantorAddress2Error}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorCity"
                      controllerLabel={CITY}
                      error={guarantorCityError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorState"
                      controllerLabel={STATE}
                      error={guarantorStateError}
                    />
                  </Grid>

                  <Grid item md={4}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorCountry"
                      controllerLabel={COUNTRY}
                      error={guarantorCountryError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorSsn"
                      controllerLabel={SSN}
                      error={guarantorSsnError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorPhone"
                      controllerLabel={PHONE}
                      error={guarantorPhoneError}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guarantorEmail"
                    controllerLabel={EMAIL}
                    error={guarantorEmailError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
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
            {ADD_PATIENT}
            {loading && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>

      </form>
    </FormProvider>
  );
};

export default AddPatientForm;
