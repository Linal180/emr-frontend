// packages block
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress } from "@material-ui/core";
import { forwardRef, Reducer, useCallback, useContext, useEffect, useImperativeHandle, useReducer } from 'react';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ADD_PATIENT, CREATE_PATIENT, DASHBOARD_BREAD, EMAIL_OR_USERNAME_ALREADY_EXISTS, EMPTY_OPTION, FAILED_TO_CREATE_PATIENT, FAILED_TO_UPDATE_PATIENT, FORBIDDEN_EXCEPTION, NOT_FOUND_EXCEPTION, PATIENTS_BREAD, PATIENTS_ROUTE, PATIENT_CREATED, PATIENT_EDIT_BREAD, PATIENT_NEW_BREAD, PATIENT_NOT_FOUND, PATIENT_UPDATED, SSN_FORMAT, UPDATE_PATIENT, ZIP_CODE_ENTER } from "../../../../constants";
import { AuthContext, FacilityContext, ListContext } from '../../../../context';
import {
  ContactType, Ethnicity, Genderidentity, Holdstatement, Homebound, Maritialstatus,
  Pronouns, Race, RelationshipType, Sexualorientation, useCreatePatientMutation, useGetPatientLazyQuery,
  useUpdatePatientMutation
} from "../../../../generated/graphql";
// interfaces, graphql, constants block /styles
import history from '../../../../history';
import { FormForwardRef, PatientFormProps, PatientInputProps } from '../../../../interfacesTypes';
import { Action, ActionType, initialState, patientReducer, State } from "../../../../reducers/patientReducer";
import { getDate, getTimestamps, getTimestampsForDob, setRecord } from '../../../../utils';
import { extendedEditPatientSchema, extendedPatientSchema } from '../../../../validationSchemas';
// components block
import Alert from "../../../common/Alert";
import BackButton from '../../../common/BackButton';
import PageHeader from '../../../common/PageHeader';
import { getAddressByZipcode } from '../../../common/smartyAddress';
import PatientCard from './PatientCard';

const PatientForm= forwardRef<FormForwardRef | undefined,PatientFormProps>(({ id, isEdit, shouldShowBread= true },ref): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { facilityList } = useContext(ListContext)
  const { fetchAllDoctorList } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const {
    basicContactId, emergencyContactId, kinContactId, guardianContactId, guarantorContactId, employerId,
    privacyNotice, callToConsent, medicationHistoryAuthority, releaseOfInfoBill, smsPermission
  } = state
  const methods = useForm<PatientInputProps>({
    mode: "all",
    resolver: yupResolver(isEdit ? extendedEditPatientSchema : extendedPatientSchema)
  });
  const { handleSubmit, setValue, watch } = methods;
  const {
    facilityId: { id: selectedFacility, name: selectedFacilityName } = {},
    basicZipCode, basicCity, basicState, basicAddress, basicAddress2,
  } = watch();

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
            medicationHistoryAuthority, doctorPatients, registrationDate, smsPermission
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
              dispatch({ type: ActionType.SET_DOCTOR_NAME, doctorName: `${firstName} ${lastName}` })
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
          homeBound && setValue("homeBound", homeBound === Homebound.Yes ? true : false)
          homeBound && dispatch({ type: ActionType.SET_IS_CHECKED, isChecked: homeBound === Homebound.Yes ? true : false })

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

          dispatch({ type: ActionType.SET_CALL_TO_CONSENT, callToConsent: callToConsent || false })
          dispatch({ type: ActionType.SET_PRIVACY_NOTICE, privacyNotice: privacyNotice || false })
          dispatch({ type: ActionType.SET_RELEASE_OF_INFO_BILL, releaseOfInfoBill: releaseOfInfoBill || false })
          dispatch({ type: ActionType.SET_MEDICATION_HISTORY_AUTHORITY, medicationHistoryAuthority: medicationHistoryAuthority || false })
          dispatch({ type: ActionType.SET_SMS_PERMISSION, smsPermission: smsPermission || false })

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
                address2, city, state, country, ssn, email, employerName, relationship
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
              relationship && setValue("guarantorRelationship", setRecord(relationship, relationship))
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
          shouldShowBread && history.push(PATIENTS_ROUTE)
        }
      }
    }
  });

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

      let practiceId = '';
      if (selectedFacility) {
        const facility = facilityList?.filter(f => f?.id === selectedFacility)[0];
        const { practiceId: pId } = facility || {};

        practiceId = pId || ''
      }

      const patientItemInput = {
        suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName,
        previouslastName, motherMaidenName, ssn: ssn || SSN_FORMAT, statementNote, language, patientNote,
        email: basicEmail, facilityId: selectedFacility, callToConsent, privacyNotice, releaseOfInfoBill, smsPermission,
        practiceId, medicationHistoryAuthority, ethnicity: selectedEthnicity as Ethnicity || Ethnicity.None,
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

  useEffect(() => {
    basicZipCode?.length === 5 && getAddressHandler()
  }, [basicZipCode, getAddressHandler]);

  useEffect(() => {
    dispatch({ type: ActionType.SET_IS_VERIFIED, isVerified: false })
    setValue('ssn', SSN_FORMAT)
  }, [basicZipCode, basicCity, basicState, basicAddress, basicAddress2, setValue, watch])

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit(onSubmit)()
    }
  }));

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
      {shouldShowBread &&  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box display="flex">
            <BackButton to={`${PATIENTS_ROUTE}`} />

            <Box ml={2}>
              <PageHeader
                title={isEdit ? UPDATE_PATIENT : ADD_PATIENT}
                path={[DASHBOARD_BREAD, PATIENTS_BREAD, isEdit ? PATIENT_EDIT_BREAD : PATIENT_NEW_BREAD]}
              />
            </Box>
          </Box>

          <Button type="submit" variant="contained" color="primary" disabled={disableSubmit}>
            {isEdit ? UPDATE_PATIENT : CREATE_PATIENT}

            {disableSubmit && <CircularProgress size={20} color="inherit" />}
          </Button>
        </Box>}

        <PatientCard shouldShowBread={shouldShowBread} getPatientLoading={getPatientLoading} isEdit={isEdit} dispatch={dispatch} state={state}/>
      </form>
    </FormProvider>
  );
});

export default PatientForm;

