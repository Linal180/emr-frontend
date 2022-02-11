// packages block
import { useContext, Reducer, useReducer, useEffect } from "react";
import { Box, Grid } from '@material-ui/core';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
// Components block
import { ListContext } from '../../../../../../context';
import InputController from '../../../../../../controller';
import Selector from '../../../../../../components/common/Selector';
import CardComponent from '../../../../../../components/common/CardComponent';
// themes / constants / utils
import { getDate, getTimestamps, renderDoctors, setRecord } from '../../../../../../utils';

import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../../../reducers/patientReducer"
import { usePatientInformation } from "../../../../../../styles/publicAppointment/patientInformation";
import {
  EMERGENCY_CONTACT_PHONE, EMERGENCY_CONTACT_RELATIONSHIP_TO_PATIENT, PREFERRED_COMMUNICATION_METHOD,
  ADDRESS_2, CITY, COUNTRY, EMPTY_OPTION, ETHNICITY, MAPPED_ETHNICITY, MAPPED_RACE, MARITAL_STATUS, PREFERRED_LANGUAGE, PREFERRED_PHARMACY, RACE, SELECT_PROVIDER, SSN, STATE, STREET_ADDRESS, ZIP_CODE, EMERGENCY_CONTACT_NAME, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENT_UPDATED, PATIENT_NOT_FOUND, ADDRESS
} from "../../../../../../constants";
import ToggleButtonComponent from "../../../../../../components/common/ToggleButtonComponent";
import { Communicationtype, ContactType, Ethnicity, Genderidentity, Holdstatement, Homebound, Maritialstatus, PrimaryDepartment, Pronouns, Race, RegDepartment, RelationshipType, Sexualorientation, useGetPatientLazyQuery, useUpdatePatientMutation } from "../../../../../../generated/graphql";
import Alert from "../../../../../../components/common/Alert";
import { PatientInputProps } from "../../../../../../interfacesTypes";

const PatientInformation = () => {
  const classes = usePatientInformation()
  const { doctorList } = useContext(ListContext)
  const [{
    basicContactId, emergencyContactId, kinContactId, guardianContactId, patientId,
    guarantorContactId, employerId
  }, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const methods = useForm<PatientInputProps>({
    mode: "all",
  });
  const { handleSubmit, setValue } = methods;

  const [getPatient,] = useGetPatientLazyQuery({
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
            registrationDate, deceasedDate, privacyNotice, releaseOfInfoBill, callToConsent,
            patientNote, language, race, ethnicity, maritialStatus, sexualOrientation, genderIdentity, sexAtBirth,
            pronouns, homeBound, holdStatement, statementDelivereOnline, statementNote, statementNoteDateFrom,
            statementNoteDateTo, facility, contacts, medicationHistoryAuthority, doctorPatients
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
        }
      }
    },
  });

  const [updatePatient,] = useUpdatePatientMutation({
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
        }
      }
    }
  });

  const onSubmit: SubmitHandler<PatientInputProps> = async (inputs) => {
    const {
      suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName,
      previouslastName, motherMaidenName, ssn, dob, gender, registrationDepartment, primaryDepartment,
      registrationDate, deceasedDate, privacyNotice, releaseOfInfoBill, callToConsent,
      patientNote, language, race, ethnicity, maritialStatus, sexualOrientation, genderIdentity,
      pronouns, homeBound, holdStatement, statementDelivereOnline, statementNote, statementNoteDateFrom,
      statementNoteDateTo, facilityId, usualProviderId, medicationHistoryAuthority, sexAtBirth, preferredCommunicationMethod, voiceCallPermission, phonePermission,

      basicEmail, basicPhone, basicMobile, basicAddress, basicAddress2, basicZipCode, basicCity,
      basicState, basicCountry,

      emergencyName, emergencyRelationship, emergencyPhone, emergencyMobile,

      guardianFirstName, guardianMiddleName, guardianLastName, guardianSuffix,
    } = inputs;

    const { id: selectedRace } = race
    const { id: selectedGender } = gender
    const { id: selectedPronouns } = pronouns
    const { id: selectedFacility } = facilityId
    const { id: selectedEthnicity } = ethnicity
    const { id: selectedSexAtBirth } = sexAtBirth
    const { id: selectedMaritalStatus } = maritialStatus
    const { id: selectedGenderIdentity } = genderIdentity
    const { id: selectedUsualProvider } = usualProviderId
    const { id: selectedPrimaryDepartment } = primaryDepartment
    const { id: selectedSexualOrientation } = sexualOrientation
    const { id: selectedEmergencyRelationship } = emergencyRelationship
    const { id: selectedRegistrationDepartment } = registrationDepartment

    const patientItemInput = {
      suffix: suffix || '', firstName: firstName || '', middleName: middleName || '',
      lastName: lastName || '', firstNameUsed: firstNameUsed || '', prefferedName: prefferedName || '',
      previousFirstName: previousFirstName || '', previouslastName: previouslastName || '',
      motherMaidenName: motherMaidenName || '', ssn: ssn || '', dob: getTimestamps(dob || ''),
      registrationDate: getTimestamps(registrationDate || ''),
      deceasedDate: getTimestamps(deceasedDate || ''),
      privacyNotice: privacyNotice || false, releaseOfInfoBill: releaseOfInfoBill || false,
      callToConsent: callToConsent || false, usualProviderId: selectedUsualProvider || '',
      medicationHistoryAuthority: medicationHistoryAuthority || false,
      patientNote: patientNote || '', language: language || '',
      statementNoteDateTo: getTimestamps(statementNoteDateTo || ''),
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
      race: selectedRace as Race || Race.White, email: basicEmail || '', voiceCallPermission: voiceCallPermission || false,
      preferredCommunicationMethod: preferredCommunicationMethod as Communicationtype || Communicationtype.Email, phonePermission: phonePermission || false,
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
      firstName: '', middleName: '',
      lastName: '', email: '', contactType: ContactType.Guarandor,
      employerName: '', address2: '',
      zipCode: '', city: '', state: '',
      phone: '', suffix: '', country: '',
      ssn: '', primaryContact: false,
      address: '',
    };

    const guardianContactInput = {
      firstName: guardianFirstName || '', middleName: guardianMiddleName || '',
      lastName: guardianLastName || '', contactType: ContactType.Guardian, suffix: guardianSuffix || '',
      primaryContact: false,
    };

    const nextOfKinContactInput = {
      name: '', phone: '',
      mobile: '', primaryContact: false,
    };

    const employerInput = {
      name: '', email: '', phone: '',
      usualOccupation: '', industry: '',
    };
    await updatePatient({
      variables: {
        updatePatientInput: {
          updatePatientItemInput: { id: patientId, ...patientItemInput },
          updateContactInput: { id: basicContactId, ...contactInput },
          updateEmergencyContactInput: { id: emergencyContactId, ...emergencyContactInput },
          updateGuarantorContactInput: { id: guarantorContactId, ...guarantorContactInput },
          updateGuardianContactInput: { id: guardianContactId, ...guardianContactInput },
          updateNextOfKinContactInput: { id: kinContactId, ...nextOfKinContactInput },
          updateEmployerInput: { id: employerId, ...employerInput },
        }
      }
    })
  };

  useEffect(() => {
    if (patientId) {
      getPatient({
        variables: {
          getPatient: { id: patientId }
        },
      })
    } else Alert.error(PATIENT_NOT_FOUND)
  }, [getPatient, patientId])

  return (
    <Box className={classes.mainGridContainer}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2} mr={2}>
            <CardComponent cardTitle="Document Verification">
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="address"
                    controllerLabel={STREET_ADDRESS}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="address2"
                    controllerLabel={ADDRESS_2}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="city"
                    controllerLabel={CITY}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="state"
                    controllerLabel={STATE}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="zipCode"
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="country"
                    controllerLabel={COUNTRY}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="ssn"
                    controllerLabel={SSN}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    value={EMPTY_OPTION}
                    label={SELECT_PROVIDER}
                    name="providerId"
                    options={renderDoctors(doctorList)}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="preferredPharmacy"
                    controllerLabel={PREFERRED_PHARMACY}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    value={EMPTY_OPTION}
                    label={PREFERRED_LANGUAGE}
                    name="language"
                    options={renderDoctors(doctorList)}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    value={EMPTY_OPTION}
                    label={RACE}
                    name="race"
                    options={MAPPED_RACE}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    value={EMPTY_OPTION}
                    label={ETHNICITY}
                    name="ethnicity"
                    options={MAPPED_ETHNICITY}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    value={EMPTY_OPTION}
                    label={MARITAL_STATUS}
                    name="maritialStatus"
                    options={renderDoctors(doctorList)}
                  />
                </Grid>
              </Grid>
            </CardComponent>
          </Box>

          <Box mb={2} mr={2}>
            <CardComponent cardTitle="Emergency Contact">
              <Grid item md={6} sm={12} xs={12}>
                <InputController
                  fieldType="text"
                  controllerName="emergencyName"
                  controllerLabel={EMERGENCY_CONTACT_NAME}
                />
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    value={EMPTY_OPTION}
                    label={EMERGENCY_CONTACT_RELATIONSHIP_TO_PATIENT}
                    name="emergencyRelationship"
                    options={renderDoctors(doctorList)}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="emergencyPhone"
                    controllerLabel={EMERGENCY_CONTACT_PHONE}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <ToggleButtonComponent name="billingInfo" label="Can we release medical and billing information to this contact?" />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="basicAddress"
                    controllerLabel={ADDRESS}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="basicAddress2"
                    controllerLabel={ADDRESS_2}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="city"
                    controllerLabel={CITY}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="state"
                    controllerLabel={STATE}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="zipCode"
                    controllerLabel={ZIP_CODE}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="country"
                    controllerLabel={COUNTRY}
                  />
                </Grid>
              </Grid>
            </CardComponent>
          </Box>

          <Box mr={2}>
            <CardComponent cardTitle="How we can contact you?">
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    value={EMPTY_OPTION}
                    label={PREFERRED_COMMUNICATION_METHOD}
                    name="preferredCommunicationMethod"
                    options={renderDoctors(doctorList)}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <ToggleButtonComponent name="voiceMail" label="Is it okay for us to leave a voicemail?" />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <ToggleButtonComponent name="confirmAppointment" label="May we phone, email, or send a text to you to confirm appointments?" />
                </Grid>
              </Grid>
            </CardComponent>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default PatientInformation;

