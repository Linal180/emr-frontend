// packages block
import { FC, useContext, Reducer, useReducer, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { Close as CloseIcon } from '@material-ui/icons';
import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon';
import { useForm, FormProvider, SubmitHandler, Controller } from 'react-hook-form';
import {
  Box, Button, Card, Grid, Typography, CircularProgress, FormControl, InputLabel,
  IconButton
} from '@material-ui/core';
// components
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import PhoneField from '../../../../common/PhoneInput';
import InputController from "../../../../../controller";
import CardComponent from "../../../../common/CardComponent";
import PatientStepper from '../../../../common/PatientStepper';
import ViewDataLoader from '../../../../common/ViewDataLoader';
import MediaCards from "../../../../common/AddMedia/MediaCards";
//context, graphql and utils block
import history from '../../../../../history';
import { EMRLogo } from '../../../../../assets/svgs';
import { FacilityContext } from "../../../../../context";
import { externalPatientSchema } from '../../../../../validationSchemas';
import { useDropzoneStyles } from '../../../../../styles/dropzoneStyles';
import { GRAY_TWO, WHITE, GREEN, WHITE_SEVEN } from "../../../../../theme";
import { ParamsType, ExternalPatientInputProps } from "../../../../../interfacesTypes";
import { usePublicAppointmentStyles } from '../../../../../styles/publicAppointmentStyles';
import { getDocumentByType, getTimestamps, renderDoctors, setRecord } from "../../../../../utils";
import {
  AntSwitch, useExternalPatientStyles
} from "../../../../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  patientReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/patientReducer"
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../../reducers/mediaReducer";
import {
  AttachmentType, Communicationtype, ContactType, Ethnicity, Holdstatement, Homebound, Race, AttachmentsPayload,
  RelationshipType, useGetAttachmentsLazyQuery, useGetPatientLazyQuery, useRemoveAttachmentDataMutation,
  useUpdatePatientMutation, Attachment,
} from "../../../../../generated/graphql";
import {
  MAPPED_RELATIONSHIP_TYPE, MAPPED_COMMUNICATION_METHOD, STATE, STREET_ADDRESS, ZIP_CODE,
  FORBIDDEN_EXCEPTION, EMAIL_OR_USERNAME_ALREADY_EXISTS, PATIENT_UPDATED, SSN,
  CITY, COUNTRY, EMPTY_OPTION, PREFERRED_PHARMACY, APPOINTMENT_CONFIRMATION_PERMISSIONS,
  PREFERRED_COMMUNICATION_METHOD, SELECT_PROVIDER, RELEASE_BILLING_INFO_PERMISSIONS, VOICE_MAIL_PERMISSIONS,
  DOCUMENT_VERIFICATION, CONTACT_METHOD, FRONT_SIDE, BACK_SIDE, PATIENT_APPOINTMENT_SUCCESS,
  MAPPED_STATES, MAPPED_COUNTRIES, USA, NEXT, FINISH, ATTACHMENT_TITLES, MORE_INFO, CANCEL_APPOINTMENT_TEXT,
  PATIENT_NOT_FOUND, CANCEL_APPOINTMENT, DEMOGRAPHICS, APARTMENT_SUITE_OTHER, EMERGENCY_CONTACT, FIRST_NAME,
  LAST_NAME, RELATIONSHIP_TO_PATIENT, PHONE, DRIVING_LICENSE, INSURANCE_CARD,
} from "../../../../../constants";

const PatientFormComponent: FC = (): JSX.Element => {
  const { id } = useParams<ParamsType>();
  const classes = useExternalPatientStyles();
  const dropzoneClasses = useDropzoneStyles()
  const toggleButtonClass = usePublicAppointmentStyles();
  const { doctorList, fetchAllDoctorList } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(patientReducer, initialState)
  const {
    basicContactId, emergencyContactId, kinContactId, guardianContactId, guarantorContactId, employerId, activeStep,
    isAppointment, isBilling, isVoice
  } = state
  const [{ drivingLicense1, drivingLicense2, insuranceCard1, insuranceCard2 }, mediaDispatch] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)
  const methods = useForm<ExternalPatientInputProps>({
    mode: "all",
    resolver: yupResolver(externalPatientSchema)
  });
  const { handleSubmit, setValue, control } = methods;

  const [getAttachments] = useGetAttachmentsLazyQuery({
    onError({ message }) {
      Alert.error(message);
    },

    onCompleted(data) {
      if (data) {
        const { getAttachments } = data;

        if (getAttachments) {
          const { attachments } = getAttachments

          const { drivingLicense1, drivingLicense2, insuranceCard1, insuranceCard2 } =
            getDocumentByType(attachments as AttachmentsPayload['attachments'])

          mediaDispatch({ type: mediaActionType.SET_INSURANCE_CARD_1, insuranceCard1: insuranceCard1 || undefined })
          mediaDispatch({ type: mediaActionType.SET_INSURANCE_CARD_2, insuranceCard2: insuranceCard2 || undefined })
          mediaDispatch({ type: mediaActionType.SET_DRIVING_LICENSE_1, drivingLicense1: drivingLicense1 || undefined })
          mediaDispatch({ type: mediaActionType.SET_DRIVING_LICENSE_2, drivingLicense2: drivingLicense2 || undefined })
        }
      }
    }
  })

  const fetchDocuments = async () => {
    try {
      id && await getAttachments({
        variables: {
          getAttachment: { typeId: id }
        }
      })
    } catch (error) { }
  };

  const [removeAttachment, { loading: removeAttachmentLoading }] = useRemoveAttachmentDataMutation({
    onError({ message }) {
      Alert.error(message);
    },

    async onCompleted() {
      Alert.success('Attachment deleted successfully!');
      await fetchDocuments();
    }
  })

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
              releaseOfInfoBill, attachments
            } = patient;

            const { drivingLicense1, drivingLicense2, insuranceCard1, insuranceCard2 } = getDocumentByType(attachments)

            mediaDispatch({ type: mediaActionType.SET_INSURANCE_CARD_1, insuranceCard1: insuranceCard1 || undefined })
            mediaDispatch({ type: mediaActionType.SET_INSURANCE_CARD_2, insuranceCard2: insuranceCard2 || undefined })
            mediaDispatch({ type: mediaActionType.SET_DRIVING_LICENSE_1, drivingLicense1: drivingLicense1 || undefined })
            mediaDispatch({ type: mediaActionType.SET_DRIVING_LICENSE_2, drivingLicense2: drivingLicense2 || undefined })

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
              setValue("preferredCommunicationMethod",
                setRecord(preferredCommunicationMethod, preferredCommunicationMethod))
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
    if (activeStep === 0) {
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
    }
  };

  useEffect(() => {
    id ?
      getPatient({ variables: { getPatient: { id } } })
      :
      Alert.error(PATIENT_NOT_FOUND)
  }, [getPatient, id])

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

  const handleNextStep = () => {
    activeStep !== 0 && dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: activeStep + 1 })
  };

  const handleFinish = (e: any) => {
    history.push(PATIENT_APPOINTMENT_SUCCESS)
  };

  const handleRemoveAttachment = async (id: string) => {
    dispatch({ type: ActionType.SET_ATTACHMENT_ID, attachmentId: id })

    await removeAttachment({
      variables: {
        removeAttachment: {
          id,
        }
      }
    })
  }

  const renderDocument = (title: string, attachment: Attachment | undefined) => {
    const { id: attachmentId, url } = attachment || {}
    const fileName = url?.split(/_(.+)/)[1].replaceAll(/%\d./g, "") || '';
    const filteredFileName = fileName.length > 40 ? `${fileName.substr(0, 40)}....` : fileName
    const fileExtension: DefaultExtensionType = url?.split(/\.(?=[^.]+$)/)[1] as DefaultExtensionType

    if (attachment) {
      return (
        <Box display="flex" alignItems="center" key={attachmentId} sx={{ p: 4, border: `1px solid ${GREEN}` }}>
          <Box minWidth={40} className={dropzoneClasses.fileIcon}>
            <FileIcon extension={fileExtension} {...defaultStyles[fileExtension]} />
          </Box>

          <Box flex={1} className={dropzoneClasses.documentNameContainer}>
            <Typography variant='body2' color='secondary' noWrap className={dropzoneClasses.fileName}>
              {filteredFileName.length > 35 ? `${filteredFileName.slice(0, 35)}...` : filteredFileName}
            </Typography>
          </Box>

          <IconButton onClick={() => handleRemoveAttachment(attachmentId || '')} disabled={removeAttachmentLoading}>
            <CloseIcon color={removeAttachmentLoading ? 'disabled' : 'secondary'} />
          </IconButton>
        </Box>
      )
    } else return (
      <MediaCards
        title={title}
        reload={() => fetchDocuments()}
        moduleType={AttachmentType.Patient}
        itemId={id || ''}
        imageSide={title.includes("1") ? FRONT_SIDE : BACK_SIDE}
        attachmentData={undefined}
      />
    )
  }

  return (
    <Box bgcolor={WHITE_SEVEN} minHeight="100vh" padding="0px 30px 0px 60px">
      <Box pt={3}>
        <EMRLogo />
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Typography variant="h4">{MORE_INFO}</Typography>

            <Box display="flex" justifyContent="flex-end" flexWrap="wrap">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => history.push(`${CANCEL_APPOINTMENT}/${id}`)}
              >
                {CANCEL_APPOINTMENT_TEXT}
              </Button>

              <Box p={1} />

              {activeStep < 1 ?
                <Button
                  variant="contained"
                  color='primary'
                  type={activeStep === 0 ? 'submit' : 'button'}
                  disabled={updatePatientLoading}
                  onClick={handleNextStep}
                >
                  {NEXT}

                  {updatePatientLoading && <CircularProgress size={20} color="inherit" />}
                </Button>
                :
                <Button
                  variant="contained"
                  color='primary'
                  type="button"
                  onClick={handleFinish}
                  disabled={updatePatientLoading}
                >
                  {FINISH}
                </Button>
              }
            </Box>
          </Box>

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
                    <CardComponent cardTitle={DEMOGRAPHICS}>
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
                              controllerLabel={APARTMENT_SUITE_OTHER}
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
                          <Grid item md={4} sm={12} xs={12}>
                            <Selector
                              isRequired
                              value={EMPTY_OPTION}
                              label={SELECT_PROVIDER}
                              name="providerId"
                              options={renderDoctors(doctorList)}
                            />
                          </Grid>

                          <Grid item md={4} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="pharmacy"
                              controllerLabel={PREFERRED_PHARMACY}
                            />
                          </Grid>

                          <Grid item md={4} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="ssn"
                              controllerLabel={SSN}
                            />
                          </Grid>
                        </Grid>
                      </>
                      }
                    </CardComponent>
                  </Box>

                  <Box mb={2} mr={2}>
                    <CardComponent cardTitle={EMERGENCY_CONTACT}>
                      {getPatientLoading ? <ViewDataLoader columns={6} rows={7} hasMedia={false} /> : <>
                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="emergencyName"
                              controllerLabel={FIRST_NAME}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="emergencyName"
                              controllerLabel={LAST_NAME}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={RELATIONSHIP_TO_PATIENT}
                              name="emergencyRelationship"
                              options={MAPPED_RELATIONSHIP_TYPE}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <PhoneField label={PHONE} name='emergencyPhone' />
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
                              controllerLabel={STREET_ADDRESS}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <InputController
                              fieldType="text"
                              controllerName="emergencyAddress2"
                              controllerLabel={APARTMENT_SUITE_OTHER}
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
              ) : activeStep === 1 && (
                <Box>
                  <CardComponent cardTitle={DOCUMENT_VERIFICATION}>
                    <Box py={2}>
                      <Typography component="h4" variant="h4">{DRIVING_LICENSE}</Typography>

                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          {renderDocument(ATTACHMENT_TITLES.DrivingLicense1, drivingLicense1)}
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          {renderDocument(ATTACHMENT_TITLES.DrivingLicense2, drivingLicense2)}
                        </Grid>
                      </Grid>
                    </Box>

                    <Box py={2}>
                      <Typography component="h4" variant="h4">{INSURANCE_CARD}</Typography>

                      <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          {renderDocument(ATTACHMENT_TITLES.InsuranceCard1, insuranceCard1)}
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          {renderDocument(ATTACHMENT_TITLES.InsuranceCard2, insuranceCard2)}
                        </Grid>
                      </Grid>
                    </Box>
                  </CardComponent>
                </Box>
              )}
            </Box>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default PatientFormComponent;
