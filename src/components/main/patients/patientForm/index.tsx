// packages block
import { FC, useState, useContext, ChangeEvent, useEffect, Reducer, useReducer, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { usStreet } from 'smartystreets-javascript-sdk';
import { FormProvider, useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  CircularProgress, Box, Button, FormControl, Grid, FormControlLabel, FormLabel, FormGroup, Checkbox, InputLabel, Typography,
} from "@material-ui/core";
import { CheckBox as CheckBoxIcon } from '@material-ui/icons'
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import DatePicker from "../../../common/DatePicker";
import PhoneField from '../../../common/PhoneInput';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { GREY_SEVEN, WHITE } from '../../../../theme';
import { extendedEditPatientSchema, extendedPatientSchema } from '../../../../validationSchemas';
import { AuthContext, ListContext, FacilityContext } from '../../../../context';
import { GeneralFormProps, PatientInputProps, SmartyUserData } from '../../../../interfacesTypes';
import { usePublicAppointmentStyles } from '../../../../styles/publicAppointmentStyles';
import { AntSwitch } from '../../../../styles/publicAppointmentStyles/externalPatientStyles';
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../reducers/patientReducer";
import { getDate, getTimestamps, getTimestampsForDob, renderDoctors, renderFacilities, renderItem, setRecord } from '../../../../utils';
import {
  ContactType, Ethnicity, Genderidentity, Holdstatement, Homebound, Maritialstatus,
  Pronouns, Race, RelationshipType, Sexualorientation, useGetPatientLazyQuery,
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
  MAPPED_RELATIONSHIP_TYPE, MAPPED_MARITAL_STATUS, ETHNICITY, EMPTY_OPTION, GENDER_IDENTITY,
  SEXUAL_ORIENTATION, PRONOUNS, HOMEBOUND, RELATIONSHIP, USUAL_PROVIDER_ID, USUAL_OCCUPATION, USUAL_INDUSTRY,
  ISSUE_DATE, EXPIRATION_DATE, RACE, MARITAL_STATUS, LEGAL_SEX, SEX_AT_BIRTH, NOT_FOUND_EXCEPTION,
  GUARANTOR_RELATION, GUARANTOR_NOTE, FACILITY, PATIENT_UPDATED, FAILED_TO_UPDATE_PATIENT, UPDATE_PATIENT,
  PATIENT_NOT_FOUND, CONSENT_TO_CALL, PATIENT_CREATED, FAILED_TO_CREATE_PATIENT, CREATE_PATIENT, MAPPED_STATES,
  MAPPED_COUNTRIES, MAPPED_GENDER_IDENTITY, ZIP_CODE_AND_CITY, ZIP_CODE_ENTER, VERIFY_ADDRESS, VERIFIED, SAME_AS_PATIENT, SSN_FORMAT,
} from "../../../../constants";
import { getAddressByZipcode, verifyAddress } from '../../../common/smartyAddress';
import SmartyModal from '../../../common/SmartyModal'

const PatientForm: FC<GeneralFormProps> = ({ id, isEdit }): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const { doctorList, fetchAllDoctorList } = useContext(FacilityContext)
  const [{
    basicContactId, emergencyContactId, kinContactId, guardianContactId, guarantorContactId, employerId, sameAddress, facilityName
  }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const [state, setState] = useState({
    privacyNotice: false,
    releaseOfInfoBill: false,
    callToConsent: false,
    medicationHistoryAuthority: false,
  })

  const [isChecked, setIsChecked] = useState(false);
  const [isVerified, setIsVerified] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false);
  const [data, setData] = useState<usStreet.Candidate[]>([])
  const [userData, setUserData] = useState<SmartyUserData>({ street: '', address: '' })
  const classes = usePublicAppointmentStyles();
  const methods = useForm<PatientInputProps>({
    mode: "all",
    resolver: yupResolver(isEdit ? extendedEditPatientSchema : extendedPatientSchema)
  });
  const { handleSubmit, setValue, watch, control } = methods;
  const {
    facilityId: { id: selectedFacility, name: selectedFacilityName } = {},
    basicZipCode, basicCity, basicState, basicAddress, basicAddress2, basicCountry, basicEmail,
  } = watch();

  const toggleHandleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked } } = event
    setIsChecked(checked);
    setValue('homeBound', checked)
  };

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
          const {
            suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName, email,
            previouslastName, motherMaidenName, ssn, dob, gender, deceasedDate, privacyNotice,
            releaseOfInfoBill, callToConsent, patientNote, language, race, ethnicity, maritialStatus, employer,
            sexualOrientation, genderIdentity, sexAtBirth, pronouns, homeBound, holdStatement, contacts,
            statementDelivereOnline, statementNote, statementNoteDateFrom, statementNoteDateTo, facility,
            medicationHistoryAuthority, doctorPatients, registrationDate
          } = patient;

          if (facility) {
            const { id: facilityId, name } = facility;

            if (facilityId) {
              fetchAllDoctorList(facilityId)
              name && setValue("facilityId", setRecord(facilityId, name))
              dispatch({ type: ActionType.SET_FACILITY_NAME, facilityName: name })
            }
          }

          if (doctorPatients) {
            const currentDoctor = doctorPatients.map(doctorPatient => {
              const { currentProvider, doctor } = doctorPatient

              return currentProvider ? doctor : null
            })[0];

            if (currentDoctor) {
              const { id: usualProviderId, firstName, lastName } = currentDoctor || {};
              usualProviderId &&
                setValue("usualProviderId", setRecord(usualProviderId, `${firstName} ${lastName}`))
            }
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
          prefferedName && setValue("prefferedName", prefferedName)
          holdStatement && setValue("holdStatement", holdStatement)
          statementNote && setValue("statementNote", statementNote)
          registrationDate && setValue("registrationDate", registrationDate)
          motherMaidenName && setValue("motherMaidenName", motherMaidenName)
          previouslastName && setValue("previouslastName", previouslastName)
          previousFirstName && setValue("previousFirstName", previousFirstName)
          homeBound && setIsChecked(homeBound === Homebound.Yes ? true : false)
          homeBound && setValue("homeBound", homeBound === Homebound.Yes ? true : false)
          statementNoteDateTo && setValue("statementNoteDateTo", getDate(statementNoteDateTo))
          statementDelivereOnline && setValue("statementDelivereOnline", statementDelivereOnline)
          statementNoteDateFrom && setValue("statementNoteDateFrom", getDate(statementNoteDateFrom))
          race && setValue("race", setRecord(race, race))
          gender && setValue("gender", setRecord(gender, gender))
          pronouns && setValue("pronouns", setRecord(pronouns, pronouns))
          ethnicity && setValue("ethnicity", setRecord(ethnicity, ethnicity))
          sexAtBirth && setValue("sexAtBirth", setRecord(sexAtBirth, sexAtBirth))
          maritialStatus && setValue("maritialStatus", setRecord(maritialStatus, maritialStatus))
          genderIdentity && setValue("genderIdentity", setRecord(genderIdentity, genderIdentity))
          sexualOrientation && setValue("sexualOrientation", setRecord(sexualOrientation, sexualOrientation))
          setState({
            ...state, callToConsent: callToConsent || false,
            privacyNotice: privacyNotice || false,
            releaseOfInfoBill: releaseOfInfoBill || false,
            medicationHistoryAuthority: medicationHistoryAuthority || false,
          })

          if (contacts) {
            const emergencyContact = contacts.filter(contact => contact.contactType === ContactType.Emergency)[0]

            if (emergencyContact) {
              const { id: emergencyContactId, name, relationship, phone, mobile } = emergencyContact;

              dispatch({ type: ActionType.SET_EMERGENCY_CONTACT_ID, emergencyContactId })
              name && setValue("emergencyName", name)
              phone && setValue("emergencyPhone", phone)
              mobile && setValue("emergencyMobile", mobile)
              relationship && setValue("emergencyRelationship", setRecord(relationship, relationship))
            }

            const basicContact = contacts.filter(contact => contact.primaryContact)[0]

            if (basicContact) {
              const { id: basicContactId, email: contactEmail, address, address2, zipCode, city, state,
                country, phone, mobile
              } = basicContact;

              dispatch({ type: ActionType.SET_BASIC_CONTACT_ID, basicContactId })
              city && setValue("basicCity", city)
              phone && setValue("basicPhone", phone)
              mobile && setValue("basicMobile", mobile)
              address && setValue("basicAddress", address)
              zipCode && setValue("basicZipCode", zipCode)
              address2 && setValue("basicAddress2", address2)
              state && setValue("basicState", setRecord(state, state))
              country && setValue("basicCountry", setRecord(country, country))
              setValue("basicEmail", (contactEmail ? contactEmail : email) || '')
            }

            const kinContact = contacts.filter(contact => contact.contactType === ContactType.NextOfKin)[0]

            if (kinContact) {
              const { id: kinContactId, name, relationship, phone, mobile } = kinContact;

              dispatch({ type: ActionType.SET_KIN_CONTACT_ID, kinContactId })
              name && setValue("kinName", name)
              phone && setValue("kinPhone", phone)
              mobile && setValue("kinMobile", mobile)
              relationship && setValue("kinRelationship", setRecord(relationship, relationship))
            }

            const guarantorContact = contacts.filter(contact => contact.contactType === ContactType.Guarandor)[0]

            if (guarantorContact) {
              const { id: guarantorContactId, suffix, firstName, lastName, middleName, phone, zipCode, address,
                address2, city, state, country, ssn, email, employerName
              } = guarantorContact;

              dispatch({ type: ActionType.SET_GUARANTOR_CONTACT_ID, guarantorContactId })
              ssn && setValue("guarantorSsn", ssn)
              city && setValue("guarantorCity", city)
              phone && setValue("guarantorPhone", phone)
              email && setValue("guarantorEmail", email)
              suffix && setValue("guarantorSuffix", suffix)
              zipCode && setValue("guarantorZipCode", zipCode)
              address && setValue("guarantorAddress", address)
              address2 && setValue("guarantorAddress2", address2)
              lastName && setValue("guarantorLastName", lastName)
              firstName && setValue("guarantorFirstName", firstName)
              middleName && setValue("guarantorMiddleName", middleName)
              state && setValue("guarantorState", setRecord(state, state))
              employerName && setValue("guarantorEmployerName", employerName)
              country && setValue("guarantorCountry", setRecord(country, country))
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

          if (employer) {
            const { id: employerId, name, email, phone, industry, usualOccupation } = employer;

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
      previouslastName, motherMaidenName, ssn, dob, gender, registrationDate, deceasedDate,
      patientNote, language, race, ethnicity, facilityId, usualProviderId, sexAtBirth, basicCountry,
      maritialStatus, sexualOrientation, genderIdentity, pronouns, homeBound, holdStatement,
      statementDelivereOnline, statementNote, statementNoteDateFrom, statementNoteDateTo,
      basicEmail, basicPhone, basicMobile, basicAddress, basicAddress2, basicZipCode, basicCity, basicState,
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
      const { id: selectedRace } = race;
      const { id: selectedGender } = gender;
      const { id: selectedPronouns } = pronouns;
      const { id: selectedFacility } = facilityId;
      const { id: selectedEthnicity } = ethnicity;
      const { id: selectedCountry } = basicCountry;
      const { id: selectedSexAtBirth } = sexAtBirth;
      const { id: selectedBasicState } = basicState;
      const { id: selectedMaritalStatus } = maritialStatus;
      const { id: selectedGenderIdentity } = genderIdentity;
      const { id: selectedGuarantorState } = guarantorState;
      const { id: selectedUsualProvider } = usualProviderId;
      const { id: selectedKinRelationship } = kinRelationship;
      const { id: selectedGuarantorCountry } = guarantorCountry;
      const { id: selectedSexualOrientation } = sexualOrientation;
      const { id: selectedGuarantorRelationship } = guarantorRelationship;
      const { id: selectedEmergencyRelationship } = emergencyRelationship;
      const { privacyNotice, callToConsent, medicationHistoryAuthority, releaseOfInfoBill } = state

      let practiceId = '';
      if (selectedFacility) {
        const facility = facilityList?.filter(f => f?.id === selectedFacility)[0];
        const { practiceId: pId } = facility || {};

        practiceId = pId || ''
      }

      const patientItemInput = {
        suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName,
        previouslastName, motherMaidenName, ssn: ssn || SSN_FORMAT, statementNote, language, patientNote, email: basicEmail,
        facilityId: selectedFacility, callToConsent, privacyNotice, releaseOfInfoBill, practiceId,
        medicationHistoryAuthority, ethnicity: selectedEthnicity as Ethnicity || Ethnicity.None,
        homeBound: homeBound ? Homebound.Yes : Homebound.No, holdStatement: holdStatement || Holdstatement.None,
        pronouns: selectedPronouns as Pronouns || Pronouns.None, race: selectedRace as Race || Race.White,
        gender: selectedGender as Genderidentity || Genderidentity.None,
        sexAtBirth: selectedSexAtBirth as Genderidentity || Genderidentity.None,
        genderIdentity: selectedGenderIdentity as Genderidentity || Genderidentity.None,
        maritialStatus: selectedMaritalStatus as Maritialstatus || Maritialstatus.Single,
        sexualOrientation: selectedSexualOrientation as Sexualorientation || Sexualorientation.None,
        statementDelivereOnline: statementDelivereOnline || false, dob: dob ? getTimestampsForDob(dob) : '',
        deceasedDate: deceasedDate ? getTimestamps(deceasedDate) : '',
        registrationDate: registrationDate ? getTimestamps(registrationDate) : '',
        statementNoteDateTo: statementNoteDateTo ? getTimestamps(statementNoteDateTo) : '',
        statementNoteDateFrom: statementNoteDateFrom ? getTimestamps(statementNoteDateFrom) : '',
      };

      const contactInput = {
        contactType: ContactType.Self, country: selectedCountry, primaryContact: true,
        email: basicEmail, city: basicCity, zipCode: basicZipCode,
        state: selectedBasicState, facilityId: selectedFacility, phone: basicPhone,
        mobile: basicMobile, address2: basicAddress2, address: basicAddress,
      };

      const emergencyContactInput = {
        contactType: ContactType.Emergency, name: emergencyName,
        phone: emergencyPhone, mobile: emergencyMobile, primaryContact: false,
        relationship: selectedEmergencyRelationship as RelationshipType || RelationshipType.Other,
      };

      const guarantorContactInput = {
        firstName: guarantorFirstName, middleName: guarantorMiddleName,
        lastName: guarantorLastName, email: guarantorEmail, contactType: ContactType.Guarandor,
        relationship: selectedGuarantorRelationship as RelationshipType || RelationshipType.Other,
        employerName: guarantorEmployerName, address2: guarantorAddress2,
        zipCode: guarantorZipCode, city: guarantorCity, state: selectedGuarantorState,
        phone: guarantorPhone, suffix: guarantorSuffix, country: selectedGuarantorCountry,
        userId: userId, ssn: guarantorSsn || SSN_FORMAT, primaryContact: false, address: guarantorAddress,
      };

      const guardianContactInput = {
        firstName: guardianFirstName, middleName: guardianMiddleName, userId: userId, primaryContact: false,
        lastName: guardianLastName, contactType: ContactType.Guardian, suffix: guardianSuffix,
      };

      const nextOfKinContactInput = {
        contactType: ContactType.NextOfKin, name: kinName, phone: kinPhone,
        relationship: selectedKinRelationship as RelationshipType || RelationshipType.Other,
        mobile: kinMobile, primaryContact: false,
      };

      const employerInput = {
        name: employerName, email: employerEmail, phone: employerPhone,
        usualOccupation: employerUsualOccupation, industry: employerIndustry,
      };

      if (isEdit && id) {
        const employerIdInput = employerId ? { id: employerId, ...employerInput } : { ...employerInput }
        const contactIdInput = basicContactId ?
          { id: basicContactId, ...contactInput } : { ...contactInput }
        const kinContactIdInput = kinContactId ?
          { id: kinContactId, ...nextOfKinContactInput } : { ...nextOfKinContactInput }
        const guardianIdInput = guardianContactId ?
          { id: guardianContactId, ...guardianContactInput } : { ...guardianContactInput }
        const emergencyIdInput = emergencyContactId ?
          { id: emergencyContactId, ...emergencyContactInput } : { ...emergencyContactInput }
        const guarantorIdInput = guarantorContactId ?
          { id: guarantorContactId, ...guarantorContactInput } : { ...guarantorContactInput }

        await updatePatient({
          variables: {
            updatePatientInput: {
              updatePatientItemInput: { id, ...patientItemInput },
              updateContactInput: { ...contactIdInput },
              updateEmployerInput: { ...employerIdInput },
              updateGuardianContactInput: { ...guardianIdInput },
              updateEmergencyContactInput: { ...emergencyIdInput },
              updateGuarantorContactInput: { ...guarantorIdInput },
              updateNextOfKinContactInput: { ...kinContactIdInput },
            }
          }
        })
      } else {
        const optionalInputs = {
          usualProviderId: selectedUsualProvider || '', adminId: userId || '',
        }

        await createPatient({
          variables: {
            createPatientInput: {
              createPatientItemInput: { ...patientItemInput, ...optionalInputs },
              createContactInput: { ...contactInput },
              createEmployerInput: { ...employerInput },
              createGuardianContactInput: { ...guardianContactInput },
              createEmergencyContactInput: { ...emergencyContactInput },
              createGuarantorContactInput: { ...guarantorContactInput },
              createNextOfKinContactInput: { ...nextOfKinContactInput },
            }
          }
        })
      }
    } else
      Alert.error(isEdit ? FAILED_TO_UPDATE_PATIENT : FAILED_TO_CREATE_PATIENT)
  };

  useEffect(() => {
    if (isEdit) {
      id ?
        getPatient({ variables: { getPatient: { id } } }) : Alert.error(PATIENT_NOT_FOUND)
    }
  }, [getPatient, id, isEdit])

  const fetchList = useCallback((id: string, name: string) => {
    setValue('usualProviderId', EMPTY_OPTION)

    id && fetchAllDoctorList(id);
  }, [fetchAllDoctorList, setValue]);

  useEffect(() => {
    selectedFacility && selectedFacilityName && fetchList(selectedFacility, selectedFacilityName);
  }, [fetchList, selectedFacility, selectedFacilityName, watch])

  const disableSubmit = getPatientLoading || createPatientLoading || updatePatientLoading;

  const getAddressHandler = useCallback(async () => {

    if (basicZipCode) {
      const data = await getAddressByZipcode(basicZipCode);
      const { zipCode: responseData, status } = data || {}
      const { defaultCity, state, stateAbbreviation } = responseData || {}
      if (status) {
        setValue('basicCity', defaultCity)
        setValue('basicState', { id: state, name: `${state} - ${stateAbbreviation}` })
      }
    } else {
      Alert.error(ZIP_CODE_ENTER)
    }
  }, [basicZipCode, setValue])

  const verifyAddressHandler = async () => {
    if (basicZipCode && basicCity) {
      const { id } = basicState
      const data = await verifyAddress(basicZipCode, basicCity, id, basicAddress, basicAddress2);
      setUserData((prev) =>
        ({ ...prev, address: `${basicCity}, ${id} ${basicZipCode}`, street: `${basicAddress} ${basicAddress2}` }))
      const { status, options } = data || {}

      if (status) {
        setData(options)
        setAddressOpen(true)
      }
      else {
        setData([])
        setAddressOpen(true)
      }
    }
    else {
      Alert.error(ZIP_CODE_AND_CITY)
    }
  }

  const copyAddress = () => {
    basicAddress && setValue("guarantorAddress", basicAddress)
    basicAddress2 && setValue("guarantorAddress2", basicAddress2)
    basicZipCode && setValue("guarantorZipCode", basicZipCode)
    basicCity && setValue("guarantorCity", basicCity)
    basicState && setValue("guarantorState", basicState)
    basicCountry && setValue("guarantorCountry", basicCountry)
    basicEmail && setValue("guarantorEmail", basicEmail)
  };

  const resetAddress = () => {
    setValue("guarantorAddress", '')
    setValue("guarantorAddress2", '')
    setValue("guarantorZipCode", '')
    setValue("guarantorCity", '')
    setValue("guarantorState", setRecord('', ''))
    setValue("guarantorCountry", setRecord('', ''))
    setValue("guarantorEmail", '')
  };

  const setAddressValues = (checked: boolean) => checked ? copyAddress() : resetAddress()

  const handleSameAddress = (checked: boolean) => {
    dispatch({ type: ActionType.SET_SAME_ADDRESS, sameAddress: checked })

    setAddressValues(checked);
  }

  useEffect(() => {
    basicZipCode?.length === 5 && getAddressHandler()
  }, [basicZipCode, getAddressHandler]);

  const verifiedAddressHandler = (
    deliveryLine1: string, zipCode: string, plus4Code: string, cityName: string
  ) => {
    deliveryLine1 && setValue('basicAddress', deliveryLine1);
    zipCode && plus4Code && setValue('basicZipCode', `${zipCode}-${plus4Code}`);
    cityName && setValue('basicCity', cityName);
    setTimeout(() => { setIsVerified(true) }, 0);
  }

  useEffect(() => {
    setIsVerified(false)
  }, [basicZipCode, basicCity, basicState, basicAddress, basicAddress2, watch])

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
                        <InputController
                          fieldType="text"
                          controllerName="suffix"
                          controllerLabel={SUFFIX}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="firstName"
                          controllerLabel={FIRST_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="middleName"
                          controllerLabel={MIDDLE_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="lastName"
                          controllerLabel={LAST_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="firstNameUsed"
                          controllerLabel={FIRST_NAME_USED}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="prefferedName"
                          controllerLabel={PREFERRED_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="previousFirstName"
                          controllerLabel={PREVIOUS_FIRST_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="previouslastName"
                          controllerLabel={PREVIOUS_LAST_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="motherMaidenName"
                          controllerLabel={MOTHERS_MAIDEN_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="ssn"
                          controllerLabel={SSN}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          name="gender"
                          label={LEGAL_SEX}
                          value={EMPTY_OPTION}
                          options={MAPPED_GENDER_IDENTITY}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker isRequired name="dob" label={DOB} />
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
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="basicAddress"
                        controllerLabel={ADDRESS}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="basicAddress2"
                        controllerLabel={ADDRESS_2}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <Grid container spacing={1} alignItems={'center'}>
                        <Grid item md={10} sm={10} xs={10}>
                          <InputController
                            isRequired
                            fieldType="text"
                            controllerName="basicZipCode"
                            controllerLabel={ZIP_CODE}
                          />
                        </Grid>

                        <Grid item md={2}>
                          {!isVerified ? <Box>
                            <Button onClick={verifyAddressHandler} disabled={!Boolean(basicCity && basicAddress)}>
                              <Typography color={!Boolean(basicCity && basicAddress) ? "initial" : 'primary'}>
                                {VERIFY_ADDRESS}
                              </Typography>
                            </Button>
                          </Box> :
                            <Box display={'flex'} alignItems={'center'}>
                              <CheckBoxIcon color='primary' />
                              <Box ml={0.2}>
                                <Typography>{VERIFIED}</Typography>
                              </Box>
                            </Box>
                          }
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="basicCity"
                          controllerLabel={CITY}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          isRequired
                          name="basicState"
                          label={STATE}
                          value={EMPTY_OPTION}
                          options={MAPPED_STATES}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          isRequired
                          name="basicCountry"
                          label={COUNTRY}
                          value={EMPTY_OPTION}
                          options={MAPPED_COUNTRIES}
                        />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="basicEmail"
                        controllerLabel={EMAIL}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField isRequired name="basicPhone" label={HOME_PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="basicMobile" label={MOBILE_PHONE} />
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
                        <InputController
                          fieldType="text"
                          controllerName="emergencyName"
                          controllerLabel={NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="emergencyRelationship"
                          label={RELATIONSHIP}
                          value={EMPTY_OPTION}
                          options={MAPPED_RELATIONSHIP_TYPE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="emergencyPhone" label={HOME_PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="emergencyMobile" label={MOBILE_PHONE} />
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
                        <InputController
                          fieldType="text"
                          controllerName="kinName"
                          controllerLabel={NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="kinRelationship"
                          label={RELATIONSHIP}
                          value={EMPTY_OPTION}
                          options={MAPPED_RELATIONSHIP_TYPE}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="kinPhone" label={HOME_PHONE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="kinMobile" label={MOBILE_PHONE} />
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
                        <InputController
                          fieldType="text"
                          controllerName="guardianFirstName"
                          controllerLabel={FIRST_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="guardianMiddleName"
                          controllerLabel={MIDDLE_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="guardianLastName"
                          controllerLabel={LAST_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="guardianSuffix"
                          controllerLabel={SUFFIX}
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
                        <InputController
                          fieldType="text"
                          controllerName="language"
                          controllerLabel={LANGUAGE_SPOKEN}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="race"
                          label={RACE}
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
                          value={EMPTY_OPTION}
                          options={MAPPED_ETHNICITY}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="maritialStatus"
                          label={MARITAL_STATUS}
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
                          value={EMPTY_OPTION}
                          options={MAPPED_SEXUAL_ORIENTATION}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="genderIdentity"
                          label={GENDER_IDENTITY}
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
                          value={EMPTY_OPTION}
                          options={MAPPED_GENDER_IDENTITY}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          name="pronouns"
                          label={PRONOUNS}
                          value={EMPTY_OPTION}
                          options={MAPPED_PRONOUNS}
                        />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Controller
                        name='homeBound'
                        control={control}
                        render={() => (
                          <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
                            <InputLabel shrink>{HOMEBOUND}</InputLabel>

                            <label className="toggle-main">
                              <Box color={isChecked ? WHITE : GREY_SEVEN}>Yes</Box>
                              <AntSwitch checked={isChecked} onChange={(event) => { toggleHandleChange(event) }} name='homeBound' />
                              <Box color={isChecked ? GREY_SEVEN : WHITE}>No</Box>
                            </label>
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>

            <Grid md={6} item>
              <CardComponent cardTitle={REGISTRATION_DATES}>
                {getPatientLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    {isEdit ? renderItem(FACILITY, facilityName)
                      : <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <Selector
                            addEmpty
                            isRequired
                            value={EMPTY_OPTION}
                            label={FACILITY}
                            name="facilityId"
                            options={renderFacilities(facilityList)}
                          />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <Selector
                            addEmpty
                            isRequired
                            value={EMPTY_OPTION}
                            label={USUAL_PROVIDER_ID}
                            name="usualProviderId"
                            options={renderDoctors(doctorList)}
                          />
                        </Grid>
                      </Grid>}

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="registrationDate" label={REGISTRATION_DATE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="deceasedDate" label={DECREASED_DATE} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="statementNoteDateFrom" label={ISSUE_DATE} />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <DatePicker name="statementNoteDateTo" label={EXPIRATION_DATE} />
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
                                checked={state.privacyNotice}
                                onChange={handleChangeForCheckBox("privacyNotice")}
                              />
                            }
                            label="Privacy Notice"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox color="primary" checked={state.releaseOfInfoBill} onChange={handleChangeForCheckBox("releaseOfInfoBill")} />
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
                                  <Checkbox color="primary" checked={state.callToConsent} onChange={handleChangeForCheckBox("callToConsent")} />
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
                                    checked={state.medicationHistoryAuthority}
                                    onChange={handleChangeForCheckBox("medicationHistoryAuthority")}
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
                        <InputController
                          fieldType="text"
                          controllerName="employerName"
                          controllerLabel={EMPLOYER_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField name="employerPhone" label={EMPLOYER_PHONE} />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="employerUsualOccupation"
                          controllerLabel={USUAL_OCCUPATION}

                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="employerIndustry"
                          controllerLabel={USUAL_INDUSTRY}
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
                    <FormControl component="fieldset">
                      <FormGroup>
                        <Box mr={3} mb={2} mt={2}>
                          <FormControlLabel
                            label={SAME_AS_PATIENT}
                            control={
                              <Checkbox color="primary" checked={sameAddress}
                                onChange={({ target: { checked } }) => handleSameAddress(checked)}
                              />
                            }
                          />
                        </Box>
                      </FormGroup>
                    </FormControl>

                    <Grid item md={12} sm={12} xs={12}>
                      <Selector
                        isRequired
                        name="guarantorRelationship"
                        label={GUARANTOR_RELATION}
                        value={EMPTY_OPTION}
                        options={MAPPED_RELATIONSHIP_TYPE}
                      />
                    </Grid>

                    <Box pb={2}>
                      <FormLabel component="legend">{GUARANTOR_NOTE}</FormLabel>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="guarantorSuffix"
                          controllerLabel={SUFFIX}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="guarantorFirstName"
                          controllerLabel={FIRST_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          fieldType="text"
                          controllerName="guarantorMiddleName"
                          controllerLabel={MIDDLE_NAME}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="guarantorLastName"
                          controllerLabel={LAST_NAME}
                        />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="guarantorZipCode"
                        controllerLabel={ZIP_CODE}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="text"
                        controllerName="guarantorAddress"
                        controllerLabel={ADDRESS}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="guarantorAddress2"
                        controllerLabel={ADDRESS_2}
                      />
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={4}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="guarantorCity"
                          controllerLabel={CITY}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          isRequired
                          name="guarantorState"
                          label={STATE}
                          value={EMPTY_OPTION}
                          options={MAPPED_STATES}
                        />
                      </Grid>

                      <Grid item md={4}>
                        <Selector
                          name="guarantorCountry"
                          label={COUNTRY}
                          value={EMPTY_OPTION}
                          options={MAPPED_COUNTRIES}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="guarantorSsn"
                          controllerLabel={SSN}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <PhoneField isRequired name="guarantorPhone" label={PHONE} />
                      </Grid>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        isRequired
                        fieldType="email"
                        controllerName="guarantorEmail"
                        controllerLabel={EMAIL}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="guarantorEmployerName"
                        controllerLabel={EMPLOYER}
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
      <SmartyModal isOpen={addressOpen} setOpen={setAddressOpen} data={data} userData={userData} verifiedAddressHandler={verifiedAddressHandler} />
    </FormProvider>
  );
};

export default PatientForm;

