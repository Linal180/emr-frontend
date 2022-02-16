// packages block
import { FC, useState, useContext, Reducer, useReducer, useEffect } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Box, Button, Card, Grid, Typography, Checkbox, FormControlLabel, CircularProgress } from '@material-ui/core';
// components
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import InputController from "../../../../../controller";
import CardComponent from "../../../../common/CardComponent";
import PatientStepper from '../../../../common/PatientStepper';
import MediaCards from "../../../../common/AddMedia/MediaCards";
import ToggleButtonComponent from "../../../../common/ToggleButtonComponent";
//context, graphql and utils block
import { FacilityContext } from "../../../../../context";
import ViewDataLoader from '../../../../common/ViewDataLoader';
import { WHITE_TWO, GRAY_TWO, WHITE_SIX } from "../../../../../theme";
import { externalPatientSchema } from '../../../../../validationSchemas';
import { getTimestamps, renderDoctors, setRecord } from "../../../../../utils";
import { ParamsType, ExternalPatientInputProps } from "../../../../../interfacesTypes";
import { useExternalPatientStyles } from "../../../../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/patientReducer"
import {
  AttachmentType, Communicationtype, ContactType, Ethnicity, Holdstatement, Homebound, Race,
  RelationshipType, useGetPatientLazyQuery, useUpdatePatientMutation
} from "../../../../../generated/graphql";
import {
  MAPPED_MARITAL_STATUS, MAPPED_RELATIONSHIP_TYPE, MAPPED_COMMUNICATION_METHOD,
  PATIENT_NOT_FOUND, ADDRESS, agreementPoints, AGREEMENT_HEADING, CONSENT_AGREEMENT_LABEL,
  EMERGENCY_CONTACT_NAME, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENT_UPDATED,
  ADDRESS_2, CITY, COUNTRY, EMPTY_OPTION, ETHNICITY, MAPPED_ETHNICITY, MAPPED_RACE, MARITAL_STATUS,
  EMERGENCY_CONTACT_PHONE, EMERGENCY_CONTACT_RELATIONSHIP_TO_PATIENT, PREFERRED_COMMUNICATION_METHOD,
  PREFERRED_LANGUAGE, PREFERRED_PHARMACY, RACE, SELECT_PROVIDER, SSN, STATE, STREET_ADDRESS, ZIP_CODE,
} from "../../../../../constants";

const PatientFormComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = useExternalPatientStyles();
  const { doctorList, fetchAllDoctorList } = useContext(FacilityContext)

  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const {
    basicContactId, emergencyContactId, kinContactId, guardianContactId, patientId, guarantorContactId, employerId,
    activeStep
  } = state
  const methods = useForm<ExternalPatientInputProps>({
    mode: "all",
    resolver: yupResolver(externalPatientSchema)
  });
  const { handleSubmit, setValue } = methods;

  const [getPatient, { loading: getPatientLoading }] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      if (data) {
        const { getPatient } = data

        if (getPatient) {
          const { getPatient: { patient } } = data

          if (patient) {
            const { suffix, firstName, middleName, lastName, ssn, dob, callToConsent, language, race, ethnicity,
              maritialStatus, genderIdentity, contacts, doctorPatients, facility
            } = patient;

            if (facility) {
              const { id: facilityId } = facility
              facilityId && fetchAllDoctorList(facilityId)
            }

            if (doctorPatients) {
              const currentDoctor = doctorPatients.map(doctorPatient => {
                if (doctorPatient.currentProvider) {
                  return doctorPatient.doctor
                }

                return null
              })[0];

              if (currentDoctor) {
                const { id: usualProviderId, firstName, lastName } = currentDoctor || {};
                usualProviderId && setValue("providerId", setRecord(usualProviderId,
                  `${firstName} ${lastName}` || ''))
              }
            }

            dob && setValue("dob", dob)
            ssn && setValue("ssn", ssn)
            suffix && setValue("suffix", suffix)
            lastName && setValue("lastName", lastName)
            language && setValue("language", language)
            firstName && setValue("firstName", firstName)
            middleName && setValue("middleName", middleName)
            callToConsent && setValue("callToConsent", callToConsent)

            race && setValue("race", setRecord(race || '', race || ''))
            ethnicity && setValue("ethnicity", setRecord(ethnicity || '', ethnicity || ''))
            maritialStatus && setValue("maritialStatus", setRecord(maritialStatus || '', maritialStatus || ''))
            genderIdentity && setValue("genderIdentity", setRecord(genderIdentity || '', genderIdentity || ''))

            if (contacts) {
              const emergencyContact = contacts.filter(contact => contact.contactType === ContactType.Emergency)[0]

              if (emergencyContact) {
                const {
                  id: emergencyContactId, name, relationship, phone, city, state, country, zipCode
                } = emergencyContact;

                dispatch({ type: ActionType.SET_EMERGENCY_CONTACT_ID, emergencyContactId })
                name && setValue("emergencyName", name)
                city && setValue("emergencyCity", city)
                state && setValue("emergencyState", state)
                phone && setValue("emergencyPhone", phone)
                country && setValue("emergencyCountry", country)
                zipCode && setValue("emergencyZipCode", zipCode)
                relationship && setValue("emergencyRelationship", setRecord(relationship || '', relationship || ''))
              }

              const basicContact = contacts.filter(contact => contact.primaryContact)[0]

              if (basicContact) {
                const { id: basicContactId, address, address2, city, state, country } = basicContact;

                dispatch({ type: ActionType.SET_BASIC_CONTACT_ID, basicContactId })
                city && setValue("city", city)
                state && setValue("state", state)
                address && setValue("address", address)
                country && setValue("country", country)
                address2 && setValue("address2", address2)
              }
            }
          }
        }
      }
    },
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
          dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep + 1 })
        }
      }
    }
  });

  const onSubmit: SubmitHandler<ExternalPatientInputProps> = async (inputs) => {
    const {
      suffix, firstName, middleName, lastName, ssn, dob, callToConsent, language, race, ethnicity,
      preferredCommunicationMethod, voiceCallPermission, phonePermission, emergencyName, emergencyPhone,
      emergencyState, emergencyCity, emergencyAddress, emergencyAddress2, emergencyCountry, emergencyZipCode,
      email, emergencyRelationship, address, address2, state, city, country, zipCode
    } = inputs;

    const { id: selectedRace } = race
    const { id: selectedEthnicity } = ethnicity
    const { id: selectedRelation } = emergencyRelationship
    const { id: selectedCommunicationMethod } = preferredCommunicationMethod

    const patientItemInput = {
      suffix, firstName: firstName || '', middleName: middleName || '', lastName: lastName || '', firstNameUsed: '',
      prefferedName: '', previousFirstName: '', previouslastName: '', registrationDate: getTimestamps(''), language: language || '',
      motherMaidenName: '', ssn: ssn || '', dob: getTimestamps(dob || ''), privacyNotice: false,
      releaseOfInfoBill: false, deceasedDate: getTimestamps(''), callToConsent: callToConsent || false, patientNote: '',
      statementNoteDateTo: getTimestamps(''), medicationHistoryAuthority: false, phonePermission: phonePermission || false,
      homeBound: Homebound.No, holdStatement: Holdstatement.None, statementNoteDateFrom: getTimestamps(''), email: email || '',
      ethnicity: selectedEthnicity as Ethnicity || Ethnicity.None, voiceCallPermission: voiceCallPermission || false,
      statementDelivereOnline: false, statementNote: '', race: selectedRace as Race || Race.White,
      preferredCommunicationMethod: selectedCommunicationMethod as Communicationtype || Communicationtype.Email,
    };

    const contactInput = {
      contactType: ContactType.Self, country: country || '', email: email || '', city: city || '', mobile: '',
      zipCode: zipCode || '', state: state || '', phone: '', address: address || '', address2: address2 || '',
    };

    const emergencyContactInput = {
      contactType: ContactType.Emergency, name: emergencyName || '', phone: emergencyPhone || '',
      mobile: '', primaryContact: false, relationship: selectedRelation as RelationshipType || RelationshipType.Ward,
      city: emergencyCity, state: emergencyState, country: emergencyCountry, zipCode: emergencyZipCode || '',
      address: emergencyAddress, address2: emergencyAddress2,
    };

    const guarantorContactInput = {
      firstName: '', middleName: '', lastName: '', email: '', contactType: ContactType.Guarandor,
      employerName: '', address2: '', zipCode: '', city: '', state: '', phone: '', suffix: '',
      country: '', ssn: '', address: '', primaryContact: false,
    };

    const guardianContactInput = {
      firstName: '', middleName: '', primaryContact: false, lastName: '',
      contactType: ContactType.Guardian, suffix: '',
    };

    const nextOfKinContactInput = {
      name: '', phone: '', mobile: '', primaryContact: false,
    };

    const employerInput = {
      name: '', email: '', phone: '', usualOccupation: '', industry: '',
    };

    const employerIdInput = employerId ? { id: employerId, ...employerInput } : { ...employerInput }
    const contactIdInput = basicContactId ? { id: basicContactId, ...contactInput } : { ...contactInput }
    const kinContactIdInput = kinContactId ? { id: kinContactId, ...nextOfKinContactInput } : { ...nextOfKinContactInput }
    const guardianIdInput = guardianContactId ? { id: guardianContactId, ...guardianContactInput } : { ...guardianContactInput }
    const emergencyIdInput = emergencyContactId ? { id: emergencyContactId, ...emergencyContactInput } : { ...emergencyContactInput }
    const guarantorIdInput = guarantorContactId ? { id: guarantorContactId, ...guarantorContactInput } : { ...guarantorContactInput }

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
  };

  useEffect(() => {
    if (id) {
      getPatient({
        variables: { getPatient: { id } }
      })
    } else Alert.error(PATIENT_NOT_FOUND)
  }, [getPatient, id])

  const handleNextStep = () => {
    activeStep !== 0 && dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep + 1 })
  };

  const handleBackStep = () => {
    dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep - 1 })
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}>
          <Box display="flex" flexWrap="wrap" gridGap={20}>
            <Box className={classes.stepperGrid}>
              <Card className={classes.stepperContainer}>
                <PatientStepper activeStep={activeStep} />
              </Card>
            </Box>

            <Box flex={1}>
              {activeStep === 0 ? (
                <Box className={classes.mainGridContainer}>
                  <Box mb={2} mr={2}>
                    <CardComponent cardTitle="Patient Information">
                      {getPatientLoading ? <ViewDataLoader columns={6} rows={7} hasMedia={false} /> : <>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              isRequired
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
                              isRequired
                              fieldType="text"
                              controllerName="city"
                              controllerLabel={CITY}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <InputController
                              isRequired
                              fieldType="text"
                              controllerName="state"
                              controllerLabel={STATE}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <InputController
                              isRequired
                              fieldType="text"
                              controllerName="zipCode"
                              controllerLabel={ZIP_CODE}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <InputController
                              isRequired
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
                      </>
                      }
                    </CardComponent>
                  </Box>

                  <Box mb={2} mr={2}>
                    <CardComponent cardTitle="Emergency Contact">
                      {getPatientLoading ? <ViewDataLoader columns={6} rows={7} hasMedia={false} /> : <>
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
                            <ToggleButtonComponent
                              name="billingInfo"
                              label="Can we release medical and billing information to this contact?"
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="emergencyAddress"
                              controllerLabel={ADDRESS}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="emergencyAddress2"
                              controllerLabel={ADDRESS_2}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={3} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="emergencyCity"
                              controllerLabel={CITY}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="emergencyState"
                              controllerLabel={STATE}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="emergencyZipCode"
                              controllerLabel={ZIP_CODE}
                            />
                          </Grid>

                          <Grid item md={3} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="emergencyCountry"
                              controllerLabel={COUNTRY}
                            />
                          </Grid>
                        </Grid>
                      </>
                      }
                    </CardComponent>
                  </Box>

                  <Box mr={2}>
                    <CardComponent cardTitle="How we can contact you?">
                      {getPatientLoading ? <ViewDataLoader columns={6} rows={2} hasMedia={false} /> : <>
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
                            <ToggleButtonComponent
                              name="confirmAppointment"
                              label="May we phone, email, or send a text to you to confirm appointments?"
                            />
                          </Grid>
                        </Grid>
                      </>
                      }
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
                      <Typography component="h4" variant="h4">
                        Insurance Card

                        <Box display="inline" color={GRAY_TWO}>(Secondary)</Box>
                      </Typography>

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
              ) : activeStep === 2 && (
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
                      <FormControlLabel
                        control={<Checkbox color="primary" defaultChecked />}
                        label={CONSENT_AGREEMENT_LABEL}
                      />
                    </Box>
                  </Box>
                </CardComponent>
              )}
            </Box>
          </Box>

          <Box display="flex" justifyContent="center" gridGap={20} mt={3}>
            <Button variant="contained" disabled={activeStep === 0} onClick={handleBackStep}>
              Back
            </Button>

            {activeStep < 2 ?
              <Button
                variant="contained"
                type={activeStep === 0 ? 'submit' : 'button'}
                className="blue-button" disabled={updatePatientLoading}
                onClick={handleNextStep}
              >
                Next

                {updatePatientLoading && <CircularProgress size={20} color="inherit" />}
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

export default PatientFormComponent;
