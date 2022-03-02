// packages block
import { FC, useContext, Reducer, useReducer, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import { Box, Button, Card, Grid, Typography, Checkbox, FormControlLabel, CircularProgress, FormControl, InputLabel } from '@material-ui/core';
// components
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import PhoneField from '../../../../common/PhoneInput';
import InputController from "../../../../../controller";
import CardComponent from "../../../../common/CardComponent";
import PatientStepper from '../../../../common/PatientStepper';
import MediaCards from "../../../../common/AddMedia/MediaCards";
//context, graphql and utils block
import { FacilityContext } from "../../../../../context";
import ViewDataLoader from '../../../../common/ViewDataLoader';
import { WHITE_TWO, GRAY_TWO, WHITE_SIX, WHITE } from "../../../../../theme";
import { externalPatientSchema } from '../../../../../validationSchemas';
import { getTimestamps, renderDoctors, setRecord } from "../../../../../utils";
import { ParamsType, ExternalPatientInputProps } from "../../../../../interfacesTypes";
import { AntSwitch, useExternalPatientStyles } from "../../../../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/patientReducer"
import {
  AttachmentType, Communicationtype, ContactType, Ethnicity, Holdstatement, Homebound, Race,
  RelationshipType, useGetPatientLazyQuery, useUpdatePatientMutation
} from "../../../../../generated/graphql";
import {
  MAPPED_MARITAL_STATUS, MAPPED_RELATIONSHIP_TYPE, MAPPED_COMMUNICATION_METHOD, STATE, STREET_ADDRESS, ZIP_CODE,
  PATIENT_NOT_FOUND, ADDRESS, agreementPoints, AGREEMENT_HEADING, CONSENT_AGREEMENT_LABEL, SELECT_PROVIDER,
  EMERGENCY_CONTACT_NAME, FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENT_UPDATED, RACE, SSN,
  ADDRESS_2, CITY, COUNTRY, EMPTY_OPTION, ETHNICITY, MAPPED_ETHNICITY, MAPPED_RACE, MARITAL_STATUS, PREFERRED_PHARMACY,
  EMERGENCY_CONTACT_PHONE, EMERGENCY_CONTACT_RELATIONSHIP_TO_PATIENT, PREFERRED_COMMUNICATION_METHOD,
  PREFERRED_LANGUAGE, RELEASE_BILLING_INFO_PERMISSIONS, VOICE_MAIL_PERMISSIONS, APPOINTMENT_CONFIRMATION_PERMISSIONS,
  DOCUMENT_VERIFICATION, CONTACT_METHOD, FRONT_SIDE, BACK_SIDE, PATIENT_INFORMATION_TEXT, PATIENT_APPOINTMENT_SUCCESS,
  MAPPED_STATES,
  MAPPED_COUNTRIES,
  USA,
  NEXT,
  FINISH,
} from "../../../../../constants";
import history from '../../../../../history';
import { usePublicAppointmentStyles } from '../../../../../styles/publicAppointmentStyles';

const PatientFormComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = useExternalPatientStyles();
  const toggleButtonClass = usePublicAppointmentStyles();
  const { doctorList, fetchAllDoctorList } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const {
    basicContactId, emergencyContactId, kinContactId, guardianContactId, guarantorContactId, employerId, activeStep,
    consentAgreed, isAppointment, isBilling, isVoice
  } = state
  const methods = useForm<ExternalPatientInputProps>({
    mode: "all",
    resolver: yupResolver(externalPatientSchema)
  });
  const { handleSubmit, setValue, control } = methods;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked, name } } = event
    switch (name) {
      case 'releaseOfInfoBill':
        dispatch({ type: ActionType.SET_IS_BILLING, isBilling: checked })
        setValue('releaseOfInfoBill', checked)
        return;

      case 'voiceCallPermission':
        dispatch({ type: ActionType.SET_IS_VOICE, isVoice: checked })
        setValue('voiceCallPermission', checked)
        return;

      case 'phonePermission':
        dispatch({ type: ActionType.SET_IS_APPOINTMENT, isAppointment: checked })
        setValue('phonePermission', checked)
        return;
    }
  };


  const [getPatient, { loading: getPatientLoading }] = useGetPatientLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      if (data) {
        const { getPatient } = data

        if (getPatient) {
          const { getPatient: { patient } } = data

          if (patient) {
            const { ssn, dob, callToConsent, language, race, ethnicity, maritialStatus, genderIdentity, contacts,
              doctorPatients, facility, phonePermission, pharmacy, voiceCallPermission, preferredCommunicationMethod,
              releaseOfInfoBill
            } = patient;

            if (facility) {
              const { id: facilityId } = facility

              facilityId && await fetchAllDoctorList(facilityId)
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
            pharmacy && setValue("pharmacy", pharmacy)
            language && setValue("language", language)
            race && setValue("race", setRecord(race, race))
            callToConsent && setValue("callToConsent", callToConsent)
            phonePermission && setValue("phonePermission", phonePermission)
            ethnicity && setValue("ethnicity", setRecord(ethnicity, ethnicity))
            releaseOfInfoBill && setValue('releaseOfInfoBill', releaseOfInfoBill)
            voiceCallPermission && setValue("voiceCallPermission", voiceCallPermission)
            maritialStatus && setValue("maritialStatus", setRecord(maritialStatus, maritialStatus))
            genderIdentity && setValue("genderIdentity", setRecord(genderIdentity, genderIdentity))

            preferredCommunicationMethod &&
              setValue("preferredCommunicationMethod", setRecord(preferredCommunicationMethod, preferredCommunicationMethod))
            dispatch({ type: ActionType.SET_IS_VOICE, isVoice: voiceCallPermission as boolean })
            dispatch({ type: ActionType.SET_IS_BILLING, isBilling: releaseOfInfoBill as boolean })
            dispatch({ type: ActionType.SET_IS_APPOINTMENT, isAppointment: phonePermission as boolean })

            if (contacts) {
              const emergencyContact = contacts.filter(contact => contact.contactType === ContactType.Emergency)[0]

              if (emergencyContact) {
                const {
                  id: emergencyContactId, name, relationship, address2, address, phone, city, state, country, zipCode
                } = emergencyContact;

                dispatch({ type: ActionType.SET_EMERGENCY_CONTACT_ID, emergencyContactId })
                name && setValue("emergencyName", name)
                city && setValue("emergencyCity", city)
                phone && setValue("emergencyPhone", phone)
                zipCode && setValue("emergencyZipCode", zipCode)
                address && setValue("emergencyAddress", address)
                address2 && setValue("emergencyAddress2", address2)
                state && setValue("emergencyState", setRecord(state, state))
                country && setValue("emergencyCountry", setRecord(country, country))
                relationship && setValue("emergencyRelationship", setRecord(relationship, relationship))
              }

              const basicContact = contacts.filter(contact => contact.primaryContact)[0]

              if (basicContact) {
                const { id: basicContactId, address, address2, city, state, country, zipCode } = basicContact;

                dispatch({ type: ActionType.SET_BASIC_CONTACT_ID, basicContactId })
                city && setValue("city", city)
                zipCode && setValue("zipCode", zipCode)
                address && setValue("address", address)
                address2 && setValue("address2", address2)
                state && setValue("state", setRecord(state, state))
                country && setValue("country", setRecord(country, country))
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
      ssn, dob, callToConsent, language, race, ethnicity, pharmacy,
      preferredCommunicationMethod, voiceCallPermission, phonePermission, emergencyName, emergencyPhone,
      emergencyState, emergencyCity, emergencyAddress, emergencyAddress2, emergencyCountry, emergencyZipCode,
      emergencyRelationship, address, address2, state, city, country, zipCode
    } = inputs;
    const { id: selectedRace } = race
    const { id: selectedState } = state
    const { id: selectedCountry } = country
    const { id: selectedEthnicity } = ethnicity
    const { id: selectedRelation } = emergencyRelationship
    const { id: selectedEmergencyCountry } = emergencyCountry
    const { id: selectedEmergencyState } = emergencyState || {}
    const { id: selectedCommunicationMethod } = preferredCommunicationMethod

    const patientItemInput = {
      suffix: '', firstNameUsed: '', prefferedName: '', previousFirstName: '', previouslastName: '', 
      registrationDate: getTimestamps(''), language: language || '', motherMaidenName: '', ssn: ssn || '', 
      dob: getTimestamps(dob || ''), privacyNotice: false, releaseOfInfoBill: false, deceasedDate: getTimestamps(''), 
      callToConsent: callToConsent || false, patientNote: '', statementNoteDateTo: getTimestamps(''), 
      medicationHistoryAuthority: false, phonePermission: phonePermission || false, homeBound: Homebound.No, 
      holdStatement: Holdstatement.None, statementNoteDateFrom: getTimestamps(''), email: '', pharmacy: pharmacy || '',
      ethnicity: selectedEthnicity as Ethnicity || Ethnicity.None, voiceCallPermission: voiceCallPermission || false,
      statementDelivereOnline: false, statementNote: '', race: selectedRace as Race || Race.White,
      preferredCommunicationMethod: selectedCommunicationMethod as Communicationtype || Communicationtype.Email,
    };

    const contactInput = {
      contactType: ContactType.Self, country: selectedCountry || '', email: '', city: city || '', mobile: '',
      zipCode: zipCode || '', state: selectedState || '', phone: '', address: address || '', address2: address2 || '',
    };

    const emergencyContactInput = {
      contactType: ContactType.Emergency, name: emergencyName || '', phone: emergencyPhone || '',
      mobile: '', primaryContact: false, relationship: selectedRelation as RelationshipType || RelationshipType.Ward,
      city: emergencyCity, state: selectedEmergencyState, country: selectedEmergencyCountry, zipCode: emergencyZipCode || '',
      address: emergencyAddress, address2: emergencyAddress2,
    };

    const guarantorContactInput = {
      firstName: '', middleName: '', lastName: '', email: '', contactType: ContactType.Guarandor,
      employerName: '', address2: '', zipCode: '', city: '', state: '', phone: '', suffix: '',
      country: USA, ssn: '', address: '', primaryContact: false,
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
    id ?
      getPatient({ variables: { getPatient: { id } } })
      :
      Alert.error(PATIENT_NOT_FOUND)
  }, [getPatient, id])

  const handleNextStep = () => {
    activeStep !== 0 && dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep + 1 })
  };

  const handleBackStep = () =>
    dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep - 1 });

  const handleConsent = (checked: boolean) => {
    dispatch({ type: ActionType.SET_CONSENT_AGREED, consentAgreed: checked })
  };

  const handleFinish = (e: any) => {
    history.push(PATIENT_APPOINTMENT_SUCCESS)
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
                    <CardComponent cardTitle={PATIENT_INFORMATION_TEXT}>
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
                            <Selector
                              isRequired
                              value={EMPTY_OPTION}
                              label={STATE}
                              name="state"
                              options={MAPPED_STATES}
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
                            <Selector
                              isRequired
                              value={EMPTY_OPTION}
                              label={COUNTRY}
                              name="country"
                              options={MAPPED_COUNTRIES}
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
                              controllerName="pharmacy"
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
                    <CardComponent cardTitle={EMERGENCY_CONTACT_NAME}>
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
                            <PhoneField label={EMERGENCY_CONTACT_PHONE} name='emergencyPhone' />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <Controller
                              name='releaseOfInfoBill'
                              control={control}
                              render={() => (
                                <FormControl fullWidth margin="normal" className={toggleButtonClass.toggleContainer}>
                                  <InputLabel shrink>{RELEASE_BILLING_INFO_PERMISSIONS}</InputLabel>

                                  <label className="toggle-main">
                                    <Box color={isBilling ? WHITE : GRAY_TWO}>Yes</Box>
                                    <AntSwitch checked={isBilling} onChange={(event) => { handleChange(event) }} name='releaseOfInfoBill' />
                                    <Box color={isBilling ? GRAY_TWO : WHITE}>No</Box>
                                  </label>
                                </FormControl>
                              )}
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
                            <Selector
                              value={EMPTY_OPTION}
                              label={STATE}
                              name="emergencyState"
                              options={MAPPED_STATES}
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
                            <Selector
                              value={EMPTY_OPTION}
                              label={COUNTRY}
                              name="emergencyCountry"
                              options={MAPPED_COUNTRIES}
                            />
                          </Grid>
                        </Grid>
                      </>
                      }
                    </CardComponent>
                  </Box>

                  <Box mr={2}>
                    <CardComponent cardTitle={CONTACT_METHOD}>
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
                            <Controller
                              name='voiceCallPermission'
                              control={control}
                              render={() => (
                                <FormControl fullWidth margin="normal" className={toggleButtonClass.toggleContainer}>
                                  <InputLabel shrink>{VOICE_MAIL_PERMISSIONS}</InputLabel>

                                  <label className="toggle-main">
                                    <Box color={isVoice ? WHITE : GRAY_TWO}>Yes</Box>
                                    <AntSwitch checked={isVoice} onChange={(event) => { handleChange(event) }} name='voiceCallPermission' />
                                    <Box color={isVoice ? GRAY_TWO : WHITE}>No</Box>
                                  </label>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <Controller
                              name='phonePermission'
                              control={control}
                              render={() => (
                                <FormControl fullWidth margin="normal" className={toggleButtonClass.toggleContainer}>
                                  <InputLabel shrink>{APPOINTMENT_CONFIRMATION_PERMISSIONS}</InputLabel>

                                  <label className="toggle-main">
                                    <Box color={isAppointment ? WHITE : GRAY_TWO}>Yes</Box>
                                    <AntSwitch checked={isAppointment} onChange={(event) => { handleChange(event) }} name='phonePermission' />
                                    <Box color={isAppointment ? GRAY_TWO : WHITE}>No</Box>
                                  </label>
                                </FormControl>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </>
                      }
                    </CardComponent>
                  </Box>
                </Box>
              ) : activeStep === 5 ? ( // not reachable for now
                <Box>
                  <CardComponent cardTitle={DOCUMENT_VERIFICATION}>
                    <Box py={2}>
                      <Typography component="h4" variant="h4">Driving License</Typography>
                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <MediaCards moduleType={AttachmentType.Patient} itemId={id} imageSide={FRONT_SIDE} />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <MediaCards moduleType={AttachmentType.Patient} itemId={id} imageSide={BACK_SIDE} />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box py={2}>
                      <Typography component="h4" variant="h4">Insurance Card</Typography>
                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <MediaCards moduleType={AttachmentType.Patient} itemId={id} imageSide={FRONT_SIDE} />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <MediaCards moduleType={AttachmentType.Patient} itemId={id} imageSide={BACK_SIDE} />
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
                            <MediaCards moduleType={AttachmentType.Patient} itemId={id} imageSide={FRONT_SIDE} />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <MediaCards moduleType={AttachmentType.Patient} itemId={id} imageSide={BACK_SIDE} />
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </CardComponent>
                </Box>
              ) : activeStep === 1 && (
                <CardComponent cardTitle={DOCUMENT_VERIFICATION}>
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
                        control={<Checkbox color="primary" onChange={({ target: { checked } }) => handleConsent(checked)} />}
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

            {activeStep < 1 ?
              <Button
                variant="contained"
                type={activeStep === 0 ? 'submit' : 'button'}
                className="blue-button" disabled={updatePatientLoading}
                onClick={handleNextStep}
              >
                {NEXT}

                {updatePatientLoading && <CircularProgress size={20} color="inherit" />}
              </Button>
              :
              <Button
                variant="contained" type="button"
                className={consentAgreed ? "blue-button" : ''}
                onClick={handleFinish}
                disabled={!consentAgreed}
              >
                {FINISH}
              </Button>
            }
          </Box>
        </Box>
      </form>
    </FormProvider>
  );
};

export default PatientFormComponent;
