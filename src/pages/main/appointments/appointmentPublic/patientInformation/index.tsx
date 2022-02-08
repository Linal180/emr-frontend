// packages block
import { FC, useState, useContext, Reducer, useReducer, useEffect } from 'react';
import { Box, Button, Card, Grid, Typography, Checkbox, FormControlLabel } from '@material-ui/core';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
// components
import Stepper from './components/stepper';
import { ListContext } from '../../../../../context';
import InputController from '../../../../../controller';
import Selector from '../../../../../components/common/Selector';
import CardComponent from '../../../../../components/common/CardComponent';
import ToggleButtonComponent from "../../../../../components/common/ToggleButtonComponent";
import Alert from "../../../../../components/common/Alert";
import { AttachmentType, Communicationtype, ContactType, Ethnicity, Holdstatement, Homebound, Race, useGetPatientLazyQuery, useUpdatePatientMutation } from "../../../../../generated/graphql";

// themes / constants / utils
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/patientReducer"
import { getDate, getTimestamps, renderDoctors, setRecord } from '../../../../../utils';
import { WHITE_TWO, GRAY_TWO, WHITE_SIX } from '../../../../../theme';
import { usePatientInformation } from '../../../../../styles/publicAppointment/patientInformation';
import {
  MAPPED_MARITAL_STATUS, MAPPED_RELATIONSHIP_TYPE, MAPPED_COMMUNICATION_METHOD,
  PATIENT_NOT_FOUND, ADDRESS, agreementPoints, AGREEMENT_HEADING, CONSENT_AGREEMENT_LABEL,
  EMERGENCY_CONTACT_NAME, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENT_UPDATED,
  ADDRESS_2, CITY, COUNTRY, EMPTY_OPTION, ETHNICITY, MAPPED_ETHNICITY, MAPPED_RACE, MARITAL_STATUS,
  EMERGENCY_CONTACT_PHONE, EMERGENCY_CONTACT_RELATIONSHIP_TO_PATIENT, PREFERRED_COMMUNICATION_METHOD,
  PREFERRED_LANGUAGE, PREFERRED_PHARMACY, RACE, SELECT_PROVIDER, SSN, STATE, STREET_ADDRESS, ZIP_CODE,
} from "../../../../../constants";
import { PatientInputProps } from "../../../../../interfacesTypes";
import MediaCards from '../../../../../components/common/AddMedia/MediaCards';

const Index: FC = (): JSX.Element => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const classes = usePatientInformation();
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
      suffix, firstName, middleName, lastName, firstNameUsed, prefferedName, previousFirstName, previouslastName, motherMaidenName, ssn, dob,
      registrationDate, deceasedDate, privacyNotice, releaseOfInfoBill, callToConsent, patientNote, language, race, ethnicity,
      homeBound, holdStatement, statementDelivereOnline, statementNote, statementNoteDateFrom,
      statementNoteDateTo, medicationHistoryAuthority, preferredCommunicationMethod, voiceCallPermission, phonePermission,

      basicEmail, basicPhone, basicMobile, basicAddress, basicAddress2, basicZipCode, basicCity, basicState, basicCountry,

      emergencyName, emergencyPhone, emergencyMobile,

      guardianFirstName, guardianMiddleName, guardianLastName, guardianSuffix,
    } = inputs;

    const { id: selectedRace } = race
    const { id: selectedEthnicity } = ethnicity

    const patientItemInput = {
      suffix: suffix || '', firstName: firstName || '', middleName: middleName || '',
      lastName: lastName || '', firstNameUsed: firstNameUsed || '', prefferedName: prefferedName || '',
      previousFirstName: previousFirstName || '', previouslastName: previouslastName || '',
      motherMaidenName: motherMaidenName || '', ssn: ssn || '', dob: getTimestamps(dob || ''),
      registrationDate: getTimestamps(registrationDate || ''),
      deceasedDate: getTimestamps(deceasedDate || ''),
      privacyNotice: privacyNotice || false, releaseOfInfoBill: releaseOfInfoBill || false,
      callToConsent: callToConsent || false,
      medicationHistoryAuthority: medicationHistoryAuthority || false,
      patientNote: patientNote || '', language: language || '',
      statementNoteDateTo: getTimestamps(statementNoteDateTo || ''),
      homeBound: homeBound ? Homebound.Yes : Homebound.No, holdStatement: holdStatement || Holdstatement.None,
      statementNoteDateFrom: getTimestamps(statementNoteDateFrom || ''),
      ethnicity: selectedEthnicity as Ethnicity || Ethnicity.None,
      statementDelivereOnline: statementDelivereOnline || false, statementNote: statementNote || '',
      race: selectedRace as Race || Race.White, email: basicEmail || '', voiceCallPermission: voiceCallPermission || false,
      preferredCommunicationMethod: preferredCommunicationMethod as Communicationtype || Communicationtype.Email, phonePermission: phonePermission || false,
    };

    const contactInput = {
      contactType: ContactType.Self, country: basicCountry || '',
      email: basicEmail || '', city: basicCity || '', zipCode: basicZipCode || '',
      state: basicState || '',
      phone: basicPhone || '',
      mobile: basicMobile || '', address2: basicAddress2 || '', address: basicAddress || '',
    };

    const emergencyContactInput = {
      contactType: ContactType.Emergency, name: emergencyName || '',
      phone: emergencyPhone || '', mobile: emergencyMobile || '', primaryContact: false,
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

  const handleNextStep = () => {
    setActiveStep(activeStep + 1)
  };

  const handleBackStep = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}>
          <Box display="flex" flexWrap="wrap" gridGap={20}>
            <Box className={classes.stepperGrid}>
              <Card className={classes.stepperContainer}>
                <Stepper activeStep={activeStep} />
              </Card>
            </Box>

            <Box flex={1}>
              {activeStep === 0 ? (
                <Box className={classes.mainGridContainer}>
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
                          <InputController
                            fieldType="text"
                            controllerName="language"
                            controllerLabel={PREFERRED_LANGUAGE}
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
                            name="maritialStatus"
                            label={MARITAL_STATUS}
                            value={EMPTY_OPTION}
                            options={MAPPED_MARITAL_STATUS}
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
                            options={MAPPED_RELATIONSHIP_TYPE}
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
                            options={MAPPED_COMMUNICATION_METHOD}
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
                </Box>
              ) : activeStep === 1 ? (
                <Box>
                  <CardComponent cardTitle="Document Verification">
                    <Box py={2}>
                      <Typography component="h4" variant="h4">Driving License</Typography>
                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <MediaCards moduleType={AttachmentType.Patient} itemId={patientId} imageSide="Front Side" />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <MediaCards moduleType={AttachmentType.Patient} itemId={patientId} imageSide="Back Side" />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box py={2}>
                      <Typography component="h4" variant="h4">Insurance Card</Typography>
                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <MediaCards moduleType={AttachmentType.Patient} itemId={patientId} imageSide="Front Side" />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <MediaCards moduleType={AttachmentType.Patient} itemId={patientId} imageSide="Back Side" />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box py={2}>
                      <Typography component="h4" variant="h4">Insurance Card <Box display="inline" color={GRAY_TWO}>(Secondary)</Box></Typography>
                      <Box pb={6}>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <MediaCards moduleType={AttachmentType.Patient} itemId={patientId} imageSide="Front Side" />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <MediaCards moduleType={AttachmentType.Patient} itemId={patientId} imageSide="Back Side" />
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </CardComponent>
                </Box>
              ) : activeStep === 2 ? (
                <CardComponent cardTitle="Document Verification">
                  <Box className={classes.agreementContainer}>
                    <Typography component="h3" variant="h3">{AGREEMENT_HEADING}</Typography>

                    <Box bgcolor={WHITE_SIX} my={2} p={3.75} className={classes.agreementPointsContainer}>
                      <ul>
                        {agreementPoints.map((point) => (
                          <li>
                            <Typography variant="h6" component="p">{point}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>

                    <Box pb={2}>
                      <FormControlLabel control={<Checkbox color="primary" defaultChecked />} label={CONSENT_AGREEMENT_LABEL} />
                    </Box>
                  </Box>
                </CardComponent>
              ) : (<></>)}
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" gridGap={20} mt={3}>
            <Button variant="contained" disabled={activeStep === 0} onClick={handleBackStep}>
              Back
            </Button>

            {activeStep < 2 ?
              <Button variant="contained" className="blue-button" onClick={handleNextStep}>
                Next
              </Button>
              :
              <Button variant="contained" className="blue-button" type="submit">Finish</Button>
            }
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default Index;
