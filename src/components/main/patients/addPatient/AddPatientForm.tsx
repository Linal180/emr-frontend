// packages block
import { FC, useState, useContext, ChangeEvent } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, FormProvider, useForm, SubmitHandler } from "react-hook-form";
import {
  CircularProgress, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, FormControlLabel, FormLabel, FormGroup, Checkbox, Radio, RadioGroup
} from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import AddPatientController from "./AddPatientController";
import CardComponent from "../../../common/CardComponent";
import DatePicker from "../../../common/DatePicker";
import Selector from '../../../common/Selector';
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { AuthContext } from '../../../../context';
import { ContactType, Ethnicity, Genderidentity, Holdstatement, Homebound, Maritialstatus, PrimaryDepartment, Pronouns, Race, RegDepartment, RelationshipType, Sexualorientation, useCreatePatientMutation, UserRole } from "../../../../generated/graphql";
import {
  FIRST_NAME, LAST_NAME, CITY, STATE, COUNTRY, CONTACT_INFORMATION, IDENTIFICATION, DOB, EMAIL, PHONE, ADD_PATIENT, DEMOGRAPHICS,
  GUARANTOR, PRIVACY, REGISTRATION_DATES, EMERGENCY_CONTACT, NEXT_OF_KIN, EMPLOYMENT, GUARDIAN, SUFFIX,
  MIDDLE_NAME, FIRST_NAME_USED, PREFERRED_NAME, PREVIOUS_FIRST_NAME, PREVIOUS_LAST_NAME, MOTHERS_MAIDEN_NAME, SSN, ZIP_CODE, ADDRESS, ADDRESS_2,
  REGISTRATION_DATE, NOTICE_ON_FILE, CONSENT_TO_CALL, MEDICATION_HISTORY_AUTHORITY, NAME, HOME_PHONE, MOBILE_PHONE, EMPLOYER_NAME,
  EMPLOYER, DECREASED_DATE, EMPLOYER_PHONE, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENT_CREATED, PATIENTS_ROUTE, LANGUAGE_SPOKEN, MAPPED_RACE, MAPPED_ETHNICITY, MAPPED_SEXUALORIENTATION, MAPPED_PRONOUS, MAPPED_HOMEBOUND, MAPPED_RELATIONSHIPTYPE, MAPPED_REG_DEPARTMENT, MAPPED_PRIMARY_DEPARTMENT, MAPPED_MARITIAL_STATUS, ETHNICITY, SEXUAL_ORIENTATION, PRONOUS, HOMEBOUND, RELATIONSHIP, USUAL_PROVIDER_ID, REGISTRATION_DEPARTMENT, PRIMARY_DEPARTMENT, USUAL_OCCUPATION, USUAL_INDUSTRY, GENDER_IDENTITY, MAPPED_GENDER_IDENTITY, SEX_AT_BIRTH, ISSUE_DATE, EXPIRATION_DATE,
} from "../../../../constants";
import { PatientInputProps } from '../../../../interfacesTypes';
import { patientsSchema } from '../../../../validationSchemas';
import { renderDoctors } from '../../../../utils';
import { ListContext } from '../../../../context/listContext';

const AddPatientForm: FC = (): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { doctorList } = useContext(ListContext)
  const [state, setState] = useState({
    one: false,
    two: false,
    three: false,
    four: false,
    five: false
  })
  const [selection, setSelection] = useState({
    value: "1",
  });

  const updateSelection = (event: ChangeEvent<HTMLInputElement>, value: string) => {
    event.persist();
    const name = event.target.name;
    setSelection({ ...selection, [name]: value });
  };
  const methods = useForm<PatientInputProps>({
    mode: "all",
    resolver: yupResolver(patientsSchema)
  });
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


  const handleChangeForCheckBox = (name: string) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [name]: event.target.checked });
  };

  const onSubmit: SubmitHandler<PatientInputProps> = async (inputs) => {
    const {
      basicAddress, basicAddress2, basicCity, basicContactType, basicCountry, basicDoctorId, basicEmail, basicEmployerName, basicFacilityId, basicFax, basicFirstName, basicLastName, basicSuffix,
      basicMiddleName, basicMobile, basicName, basicPager, basicPhone, basicRelationship, basicSsn, basicState, basicZipCode,
      emergencyAddress2, emergencyCity, emergencyContactType, emergencyCountry, emergencyDoctorId, emergencyEmail, emergencyEmployerName, emergencyFacilityId, emergencyFax, emergencyFirstName, emergencySuffix,
      emergencyLastName, emergencyMiddleName, emergencyMobile, emergencyName, emergencyPager, emergencyPhone, emergencyRelationship, emergencySsn, emergencyState,
      emergencyZipCode, employerEmail, employerIndustry, employerMobile, employerName, employerPhone, employerUsualOccupation, guarantorAddress, guarantorAddress2,
      guarantorCity, guarantorContactType, guarantorCountry, guarantorDoctorId, guarantorEmail, guarantorEmployerName, guarantorFacilityId, guarantorFax, guarantorFirstName, guarantorLastName, guarantorSuffix,
      guarantorMiddleName, guarantorMobile, guarantorName, guarantorPager, guarantorPhone, guarantorRelationship, guarantorSsn, guarantorState, guarantorZipCode,
      guardianAddress, guardianAddress2, guardianCity, guardianContactType, guardianCountry, guardianDoctorId, guardianEmail, guardianEmployerName, guardianFacilityId, guardianFax, guardianFirstName, guardianSuffix,
      guardianLastName, guardianMiddleName, guardianMobile, guardianName, guardianPager, guardianPhone, guardianRelationship, guardianSsn, guardianState,
      guardianZipCode, kinAddress, kinAddress2, kinCity, kinContactType, kinCountry, kinDoctorId, kinEmail, kinEmployerName, kinFacilityId, kinFax, kinFirstName, kinLastName, kinMiddleName, kinSuffix,
      kinMobile, kinName, kinPager, kinPhone, kinRelationship, kinSsn, kinState, kinZipCode, facilityId, firstName, lastName, phone, zipCode,
      patientdeceasedDate, patientDob, patientEthnicity, patientFacilityId, patientFirstName, patientFirstNameUsed, patientGender, patientGenderIdentity, patientHoldStatement, patientHomeBound,
      patientLanguage, patientLastName, patientMiddleName, patientMotherMaidenName, patientUsualProviderId,
      patientPrefferedName, patientPreviousFirstName, patientPreviouslastName, patientPrimaryDepartment, patientPrivacyNotice, patientPronouns, patientRace, patientRegistrationDate, patientRegistrationDepartment,
      patientSexAtBirth, patientSexualOrientation, patientSsn, patientStatementDelivereOnline, patientStatementNote, patientStatementNoteDateFrom, patientStatementNoteDateTo, patientSuffix, patientMaritialStatus
    } = inputs;

    const { id: selectedPatientUsualProviderId } = patientUsualProviderId;

    if (user && selectedPatientUsualProviderId) {
      const { id: userId } = user

      await createPatient({
        variables: {
          createPatientInput: {
            createPatientItemInput: {
              suffix: patientSuffix || "", firstName: patientFirstName || "", middleName: patientMiddleName || "", lastName: patientLastName || "", firstNameUsed: patientFirstNameUsed || "", prefferedName: patientPrefferedName || "",
              previousFirstName: patientPreviousFirstName || "", usualProviderId: selectedPatientUsualProviderId || "", previouslastName: patientPreviouslastName || "", motherMaidenName: patientMotherMaidenName || "",
              ssn: patientSsn || "", dob: patientDob || "", gender: patientGender as Genderidentity || Genderidentity.Female, registrationDepartment: patientRegistrationDepartment as RegDepartment || RegDepartment.Clinic, primaryDepartment: patientPrimaryDepartment as PrimaryDepartment || PrimaryDepartment.Clinic,
              registrationDate: patientRegistrationDate || "", deceasedDate: patientdeceasedDate || "", privacyNotice: patientPrivacyNotice || false, language: patientLanguage || "", race: patientRace as Race || Race.AmericanIndianAlaskaNative,
              ethnicity: patientEthnicity as Ethnicity || Ethnicity.CenteralAmerican, sexualOrientation: patientSexualOrientation as Sexualorientation || Sexualorientation.Bisexual, genderIdentity: patientGenderIdentity as Genderidentity, sexAtBirth: patientSexAtBirth as Genderidentity, pronouns: patientPronouns as Pronouns || Pronouns.He,
              homeBound: patientHomeBound as Homebound || Homebound.No, holdStatement: patientHoldStatement as Holdstatement || Holdstatement.AccountTooLong, statementDelivereOnline: patientStatementDelivereOnline || false, statementNote: patientStatementNote || "",
              statementNoteDateFrom: patientStatementNoteDateFrom || "", statementNoteDateTo: patientStatementNoteDateTo || "", facilityId: "f13d1f1d-8d79-4db2-b415-0aae3b9a98a2", maritialStatus: patientMaritialStatus as Maritialstatus || Maritialstatus.Divorced,
            },
            createContactInput: {
              name: basicName || "", firstName: basicFirstName || "", middleName: basicMiddleName || "", lastName: basicLastName || "", email: basicEmail || "", contactType: basicContactType as ContactType || ContactType.Self,
              relationship: basicRelationship as RelationshipType || RelationshipType.CadaverDonor, pager: basicPager || "", phone: basicPhone || "", suffix: basicSuffix || "", mobile: basicMobile || "", fax: basicFax || "",
              ssn: basicSsn || "", address2: basicAddress2 || "", address: basicAddress || "", zipCode: basicZipCode || "", city: basicCity || "", state: basicState || "",
              country: basicCountry || "", userId: userId || "", doctorId: basicDoctorId || "", facilityId: "f13d1f1d-8d79-4db2-b415-0aae3b9a98a2", employerName: basicEmployerName || ""
            },
            createEmergencyContactInput: {
              name: emergencyName || "", firstName: emergencyFirstName || "", middleName: emergencyMiddleName || "", lastName: emergencyLastName || "", email: emergencyEmail || "", contactType: emergencyContactType as ContactType || ContactType.Emergency,
              relationship: emergencyRelationship as RelationshipType || RelationshipType.CadaverDonor, pager: emergencyPager || "", phone: emergencyPhone || "", suffix: emergencySuffix || "", mobile: emergencyMobile || "", fax: emergencyFax || "",
              ssn: emergencySsn || "", address2: emergencyAddress2 || "", address: emergencyAddress2 || "", zipCode: emergencyZipCode || "", city: emergencyCity || "", state: emergencyState || "",
              country: emergencyCountry || "", userId: userId || "", doctorId: emergencyDoctorId || "", facilityId: "f13d1f1d-8d79-4db2-b415-0aae3b9a98a2", employerName: emergencyEmployerName || ""
            },
            createGuarantorContactInput: {
              name: guarantorName || "", firstName: guarantorFirstName || "", middleName: guarantorMiddleName || "", lastName: guarantorLastName || "", email: guarantorEmail || "", contactType: guarantorContactType as ContactType || ContactType.Guarandor,
              relationship: guarantorRelationship as RelationshipType || RelationshipType.Employee, pager: guarantorPager || "", phone: guarantorPhone || "", suffix: guarantorSuffix || "", mobile: guarantorMobile || "", fax: guarantorFax || "",
              ssn: guarantorSsn || "", address2: guarantorAddress2 || "", address: guarantorAddress || "", zipCode: guarantorZipCode || "", city: guarantorCity || "", state: guarantorState || "",
              country: guarantorCountry || "", userId: userId || "", doctorId: guarantorDoctorId || "", facilityId: "f13d1f1d-8d79-4db2-b415-0aae3b9a98a2", employerName: guarantorEmployerName || ""
            },
            createGuardianContactInput: {
              name: guardianName || "", firstName: guardianFirstName || "", middleName: guardianMiddleName || "", lastName: guardianLastName || "", email: guardianEmail || "", contactType: guardianContactType as ContactType || ContactType.Guardian,
              relationship: guardianRelationship as RelationshipType || RelationshipType.Grandparent, pager: guardianPager || "", phone: guardianPhone || "", suffix: guardianSuffix || "", mobile: guardianMobile || "", fax: guardianFax || "",
              ssn: guardianSsn || "", address2: guardianAddress2 || "", address: guardianAddress || "", zipCode: guardianZipCode || "", city: guardianCity || "", state: guardianState || "",
              country: guardianCountry || "", userId: userId || "", doctorId: guardianDoctorId || "", facilityId: "f13d1f1d-8d79-4db2-b415-0aae3b9a98a2", employerName: guardianEmployerName || ""
            },
            createNextOfKinContactInput: {
              name: kinName || "", firstName: kinFirstName || "", middleName: kinMiddleName || "", lastName: kinLastName || "", email: kinEmail || "", contactType: kinContactType as ContactType || ContactType.NextOfKin,
              relationship: kinRelationship as RelationshipType || RelationshipType.NephewNiece, pager: kinPager || "", phone: kinPhone || "", suffix: kinSuffix || "", mobile: kinMobile || "", fax: kinFax || "",
              ssn: kinSsn || "", address2: kinAddress2 || "", address: kinAddress || "", zipCode: kinZipCode || "", city: kinCity || "", state: kinState || "",
              country: kinCountry || "", userId: userId || "", doctorId: kinDoctorId || "", facilityId: "f13d1f1d-8d79-4db2-b415-0aae3b9a98a2", employerName: kinEmployerName || ""
            },
            createEmployerInput: {
              name: employerName || "", email: employerEmail || "", phone: employerPhone || "", mobile: employerMobile || "", usualOccupation: employerUsualOccupation || "", industry: employerIndustry || "",
            },
            registerUserInput: {
              firstName: firstName || "", lastName: lastName || "", email: basicEmail || "", facilityId: "f13d1f1d-8d79-4db2-b415-0aae3b9a98a2", phone: phone || "", zipCode: zipCode || "", password: "user123" || "", adminId: userId || "", roleType: UserRole.Patient
            }
          }
        }
      })
    } else {
      Alert.error("Failed to create patient!")
    }

  };

  const {
    patientSuffix: { message: patientSuffixError } = {},
    patientFirstName: { message: patientFirstNameError } = {},
    patientMiddleName: { message: patientMiddleNameError } = {},
    patientLastName: { message: patientLastNameError } = {},
    patientFirstNameUsed: { message: patientFirstNameUsedError } = {},
    patientPrefferedName: { message: patientPrefferedNameError } = {},
    patientPreviousFirstName: { message: patientPreviousFirstNameError } = {},
    patientPreviouslastName: { message: patientPreviouslastNameError } = {},
    patientMotherMaidenName: { message: patientMotherMaidenNameError } = {},
    patientSsn: { message: patientSsnError } = {},
    patientDob: { message: patientDobError } = {},
    patientLanguage: { message: patientLanguageError } = {},
    patientRegistrationDate: { message: patientRegistrationDateError } = {},
    patientdeceasedDate: { message: patientdeceasedDateError } = {},
    patientStatementNoteDateFrom: { message: patientStatementNoteDateFromError } = {},
    patientStatementNoteDateTo: { message: patientStatementNoteDateToError } = {},

    basicZipCode: { message: basicZipCodeError } = {},
    basicAddress: { message: basicAddressError } = {},
    basicAddress2: { message: basicAddress2Error } = {},
    basicCity: { message: basicCityError } = {},
    basicState: { message: basicStateError } = {},
    basicCountry: { message: basicCountryError } = {},
    basicEmail: { message: basicEmailError } = {},
    basicPhone: { message: basicPhoneError } = {},
    basicMobile: { message: basicMobileError } = {},

    guarantorSuffix: { message: guarantorSuffixError } = {},
    guarantorFirstName: { message: guarantorFirstNameError } = {},
    guarantorMiddleName: { message: guarantorMiddleNameError } = {},
    guarantorLastName: { message: guarantorLastNameError } = {},
    guarantorZipCode: { message: guarantorZipCodeError } = {},
    guarantorAddress: { message: guarantorAddressError } = {},
    guarantorAddress2: { message: guarantorAddress2Error } = {},
    guarantorCity: { message: guarantorCityError } = {},
    guarantorState: { message: guarantorStateError } = {},
    guarantorCountry: { message: guarantorCountryError } = {},
    guarantorSsn: { message: guarantorSsnError } = {},
    guarantorPhone: { message: guarantorPhoneError } = {},
    guarantorEmail: { message: guarantorEmailError } = {},
    guarantorEmployerName: { message: guarantorEmployerNameError } = {},

    emergencyName: { message: emergencyNameError } = {},
    emergencyPhone: { message: emergencyPhoneError } = {},
    emergencyMobile: { message: emergencyMobileError } = {},

    kinName: { message: kinNameError } = {},
    kinPhone: { message: kinPhoneError } = {},

    employerName: { message: employerNameError } = {},
    employerPhone: { message: employerPhoneError } = {},
    employerUsualOccupation: { message: employerUsualOccupationError } = {},
    employerIndustry: { message: employerIndustryError } = {},

    guardianFirstName: { message: guardianFirstNameError } = {},
    guardianMiddleName: { message: guardianMiddleNameError } = {},
    guardianLastName: { message: guardianLastNameError } = {},
    guardianSuffix: { message: guardianSuffixError } = {},

  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={IDENTIFICATION}>
                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientSuffix"
                      control={control}
                      controllerLabel={SUFFIX}
                      error={patientSuffixError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientFirstName"
                      control={control}
                      controllerLabel={FIRST_NAME}
                      error={patientFirstNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientMiddleName"
                      control={control}
                      controllerLabel={MIDDLE_NAME}
                      error={patientMiddleNameError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientLastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                      error={patientLastNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientFirstNameUsed"
                      control={control}
                      controllerLabel={FIRST_NAME_USED}
                      error={patientFirstNameUsedError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientPrefferedName"
                      control={control}
                      controllerLabel={PREFERRED_NAME}
                      error={patientPrefferedNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientPreviousFirstName"
                      control={control}
                      controllerLabel={PREVIOUS_FIRST_NAME}
                      error={patientPreviousFirstNameError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientPreviouslastName"
                      control={control}
                      controllerLabel={PREVIOUS_LAST_NAME}
                      error={patientPreviouslastNameError}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientMotherMaidenName"
                      control={control}
                      controllerLabel={MOTHERS_MAIDEN_NAME}
                      error={patientMotherMaidenNameError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="patientSsn"
                      control={control}
                      controllerLabel={SSN}
                      error={patientSsnError}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="patientGender"
                    defaultValue={Genderidentity.Male}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>{GENDER_IDENTITY}</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_GENDER_IDENTITY.map((genderidentity) => {
                              const { label, value } = genderidentity || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12}>
                  <DatePicker name="patientDob" label={DOB} error={patientDobError || ''} />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={CONTACT_INFORMATION}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="basicZipCode"
                    control={control}
                    controllerLabel={ZIP_CODE}
                    error={basicZipCodeError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="basicAddress"
                    control={control}
                    controllerLabel={ADDRESS}
                    error={basicAddressError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="basicAddress2"
                    control={control}
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
                    control={control}
                    controllerLabel={EMAIL}
                    error={basicEmailError}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="basicPhone"
                      control={control}
                      controllerLabel={HOME_PHONE}
                      error={basicPhoneError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="basicMobile"
                      control={control}
                      controllerLabel={MOBILE_PHONE}
                      error={basicMobileError}
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
                      controllerName="patientLanguage"
                      control={control}
                      controllerLabel={LANGUAGE_SPOKEN}
                      error={patientLanguageError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="patientRace"
                      defaultValue={Race.AmericanIndianAlaskaNative}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Race</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_RACE.map((race) => {
                                const { label, value } = race || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="patientEthnicity"
                      defaultValue={Ethnicity.CenteralAmerican}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>{ETHNICITY}</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_ETHNICITY.map((ethnicity) => {
                                const { label, value } = ethnicity || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="patientMaritialStatus"
                      defaultValue={Maritialstatus.Divorced}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>Maritial Status</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_MARITIAL_STATUS.map((maritialStatus) => {
                                const { label, value } = maritialStatus || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="patientSexualOrientation"
                      defaultValue={Sexualorientation.Bisexual}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>{SEXUAL_ORIENTATION}</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_SEXUALORIENTATION.map((sexualOrientation) => {
                                const { label, value } = sexualOrientation || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="patientGenderIdentity"
                      defaultValue={Genderidentity.Female}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>{GENDER_IDENTITY}</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_IDENTITY.map((genderidentity) => {
                                const { label, value } = genderidentity || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="patientSexAtBirth"
                      defaultValue={Genderidentity.Female}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>{SEX_AT_BIRTH}</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_GENDER_IDENTITY.map((patientSexAtBirth) => {
                                const { label, value } = patientSexAtBirth || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <Controller
                      name="patientPronouns"
                      defaultValue={Pronouns.He}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl fullWidth margin='normal'>
                            <InputLabel id="demo-customized-select-label-gender" shrink>{PRONOUS}</InputLabel>
                            <Select
                              labelId="demo-customized-select-label-gender"
                              id="demo-customized-select-1"
                              variant="outlined"
                              value={field.value}
                              onChange={field.onChange}
                            >
                              {MAPPED_PRONOUS.map((pronouns) => {
                                const { label, value } = pronouns || {};

                                return <MenuItem key={value} value={value}>{label}</MenuItem>;
                              })}
                            </Select>
                          </FormControl>
                        )
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="patientHomeBound"
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
                                label={homeBound.label}
                                key={homeBound.value}
                                value={homeBound.value}
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

              <Box pb={3} />

              <CardComponent cardTitle={GUARANTOR}>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="guarantorRelationship"
                    defaultValue={RelationshipType.Employee}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>{RELATIONSHIP}</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_RELATIONSHIPTYPE.map((relationship) => {
                              const { label, value } = relationship || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorSuffix"
                      control={control}
                      controllerLabel={SUFFIX}
                      error={guarantorSuffixError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorFirstName"
                      control={control}
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
                      control={control}
                      controllerLabel={MIDDLE_NAME}
                      error={guarantorMiddleNameError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorLastName"
                      control={control}
                      controllerLabel={LAST_NAME}
                      error={guarantorLastNameError}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guarantorZipCode"
                    control={control}
                    controllerLabel={ZIP_CODE}
                    error={guarantorZipCodeError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guarantorAddress"
                    control={control}
                    controllerLabel={ADDRESS}
                    error={guarantorAddressError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guarantorAddress2"
                    control={control}
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
                      control={control}
                      controllerLabel={SSN}
                      error={guarantorSsnError}
                    />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <AddPatientController
                      fieldType="text"
                      controllerName="guarantorPhone"
                      control={control}
                      controllerLabel={PHONE}
                      error={guarantorPhoneError}
                    />
                  </Grid>
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guarantorEmail"
                    control={control}
                    controllerLabel={EMAIL}
                    error={guarantorEmailError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guarantorEmployerName"
                    control={control}
                    controllerLabel={EMPLOYER}
                    error={guarantorEmployerNameError}
                  />
                </Grid>
              </CardComponent>
            </Grid>
            <Grid md={6} item>
              <CardComponent cardTitle={REGISTRATION_DATES}>
                <Grid item md={12} sm={12} xs={12}>
                  <Selector
                    value={{ id: "", name: "" }}
                    label={USUAL_PROVIDER_ID}
                    name="patientUsualProviderId"
                    options={renderDoctors(doctorList)}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="patientRegistrationDepartment"
                    defaultValue={RegDepartment.Clinic}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>{REGISTRATION_DEPARTMENT}</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_REG_DEPARTMENT.map((registrationDepartment) => {
                              const { label, value } = registrationDepartment || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="patientPrimaryDepartment"
                    defaultValue={PrimaryDepartment.Clinic}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>{PRIMARY_DEPARTMENT}</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_PRIMARY_DEPARTMENT.map((primaryDepartment) => {
                              const { label, value } = primaryDepartment || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="patientRegistrationDate" label={REGISTRATION_DATE} error={patientRegistrationDateError || ''} />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="patientdeceasedDate" label={DECREASED_DATE} error={patientdeceasedDateError || ''} />
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="patientStatementNoteDateFrom" label={ISSUE_DATE} error={patientStatementNoteDateFromError || ''} />
                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <DatePicker name="patientStatementNoteDateTo" label={EXPIRATION_DATE} error={patientStatementNoteDateToError || ''} />
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

              <CardComponent cardTitle={EMERGENCY_CONTACT}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="emergencyName"
                    control={control}
                    controllerLabel={NAME}
                    error={emergencyNameError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="emergencyRelationship"
                    defaultValue={RelationshipType.CadaverDonor}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>{RELATIONSHIP}</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_RELATIONSHIPTYPE.map((relationship) => {
                              const { label, value } = relationship || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="emergencyPhone"
                    control={control}
                    controllerLabel={HOME_PHONE}
                    error={emergencyPhoneError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="emergencyMobile"
                    control={control}
                    controllerLabel={MOBILE_PHONE}
                    error={emergencyMobileError}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={NEXT_OF_KIN}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="kinName"
                    control={control}
                    controllerLabel={NAME}
                    error={kinNameError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name="kinRelationship"
                    defaultValue={RelationshipType.NephewNiece}
                    control={control}
                    render={({ field }) => {
                      return (
                        <FormControl fullWidth margin='normal'>
                          <InputLabel id="demo-customized-select-label-gender" shrink>{RELATIONSHIP}</InputLabel>
                          <Select
                            labelId="demo-customized-select-label-gender"
                            id="demo-customized-select-1"
                            variant="outlined"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            {MAPPED_RELATIONSHIPTYPE.map((relationship) => {
                              const { label, value } = relationship || {};

                              return <MenuItem key={value} value={value}>{label}</MenuItem>;
                            })}
                          </Select>
                        </FormControl>
                      )
                    }}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="kinPhone"
                    control={control}
                    controllerLabel={HOME_PHONE}
                    error={kinPhoneError}
                  />
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
                    control={control}
                    controllerLabel={USUAL_INDUSTRY}
                    error={employerIndustryError}
                  />
                </Grid>
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={GUARDIAN}>
                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guardianFirstName"
                    control={control}
                    controllerLabel={FIRST_NAME}
                    error={guardianFirstNameError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <AddPatientController
                    fieldType="text"
                    controllerName="guardianMiddleName"
                    control={control}
                    controllerLabel={MIDDLE_NAME}
                    error={guardianMiddleNameError}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
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
    </FormProvider >
  );
};

export default AddPatientForm;
