// packages block
import axios from "axios";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Reducer, useContext, useEffect, useReducer, useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import Signature from "../../../../common/signature";
import DatePicker from "../../../../common/DatePicker";
import InputController from "../../../../../controller";
import CardComponent from "../../../../common/CardComponent";
import AppointmentSlots from "../../../../common/AppointmentSlots";
import ServiceSelector from "../../../../common/Selector/ServiceSelector";
// constants block
import history from "../../../../../history";
import { WHITE, GREY } from "../../../../../theme";
import { AIMEDLOGO, } from "../../../../../assets/svgs";
import { FacilityContext } from '../../../../../context';
import { usePublicAppointmentStyles } from "../../../../../styles/publicAppointmentStyles";
import { ExtendedExternalAppointmentInputProps, ParamsType } from "../../../../../interfacesTypes";
import { externalAppointmentSchema, externalSignatureAppointmentSchema } from "../../../../../validationSchemas";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/appointmentReducer";
import { getCurrentTimestamps, getTimestampsForDob } from "../../../../../utils";
import {
  ContactType, Genderidentity, PaymentType, useCreateExternalAppointmentMutation,
  useGetFacilityLazyQuery, FacilityPayload, BillingStatus, useCreatePatientConsentMutation,
  useFetchAllAgreementsLazyQuery, AgreementsPayload
} from "../../../../../generated/graphql";
import {
  APPOINTMENT_TYPE, EMAIL, EMPTY_OPTION, SEX, DOB_TEXT, AGREEMENT_TEXT, FIRST_NAME, LAST_NAME,
  MAPPED_GENDER_IDENTITY, PATIENT_DETAILS, SELECT_SERVICES, BOOK_APPOINTMENT, APPOINTMENT_PAYMENT,
  FACILITY_NOT_FOUND, PATIENT_APPOINTMENT_FAIL, APPOINTMENT_SLOT_ERROR_MESSAGE, AGREEMENT_HEADING,
  BOOK_YOUR_APPOINTMENT, ATTACHMENT_TITLES, PUBLIC_AGREEMENTS_PAGE_LIMIT,
} from "../../../../../constants";

const FacilityPublicAppointmentForm = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const { fetchAllServicesList } = useContext(FacilityContext)
  const [loading, setLoading] = useState(false)
  const [{ facility, agreed, date, agreements, isSignature }, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const methods = useForm<ExtendedExternalAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(isSignature ? externalSignatureAppointmentSchema : externalAppointmentSchema),
    defaultValues: { signature: null }
  });
  const { reset, handleSubmit, setValue, watch } = methods;
  const { signature } = watch()

  const [getFacility] = useGetFacilityLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      history.push(PATIENT_APPOINTMENT_FAIL)
    },

    onCompleted(data) {
      try {
        const { getFacility: { response, facility } } = data;

        if (response) {
          const { status } = response

          if (facility && status && status === 200) {
            fetchAllServicesList(facilityId)
            fetchAllAgreements(facilityId)
            dispatch({ type: ActionType.SET_FACILITY, facility: facility as FacilityPayload['facility'] })
          }
        }
      } catch (error) { }
    }
  });

  const [getAllAgreements] = useFetchAllAgreementsLazyQuery({
    onCompleted: (data) => {
      if (data) {
        const { fetchAllAgreements } = data || {}
        const { agreements, response } = fetchAllAgreements || {}
        const { status } = response || {}
        if (status === 200) {
          if (agreements) {
            dispatch({ type: ActionType.SET_AGREEMENTS, agreements: agreements as AgreementsPayload['agreements'] })
            const signature = agreements?.some(({ signatureRequired }) => signatureRequired)
            dispatch({ type: ActionType.SET_SIGNATURE, isSignature: signature })
          }

        }
      }
    },
    onError: () => {

    }
  })

  const [createExternalAppointment] = useCreateExternalAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { createExternalAppointment: { response, appointment } } = data;

      if (response && appointment) {
        const { status } = response
        const { id, patientId } = appointment

        if (id && status && status === 200) {
          if (!isSignature) {
            history.push(`${APPOINTMENT_PAYMENT}/${id}`)
          } else {
            id && patientId && signatureUploadHandler(id, patientId)
          }
        }
      }
    }
  });

  const [createPatientConsent] = useCreatePatientConsentMutation({
    onCompleted: () => { },
    onError: () => { }
  })

  const fetchAllAgreements = async (facilityId: string) => {
    try {
      await getAllAgreements({
        variables: {
          agreementPaginationInput: {
            agreementFacilityId: facilityId,
            paginationOptions: { limit: PUBLIC_AGREEMENTS_PAGE_LIMIT, page: 1 }
          }
        }
      })
    } catch (error) {

    }
  }

  useEffect(() => {
    facilityId ?
      getFacility({ variables: { getFacility: { id: facilityId } } })
      :
      history.push(PATIENT_APPOINTMENT_FAIL)
  }, [facilityId, getFacility])

  const onSubmit: SubmitHandler<ExtendedExternalAppointmentInputProps> = async (inputs) => {
    const { firstName, lastName, dob, email, serviceId, sexAtBirth, scheduleStartDateTime, scheduleEndDateTime } = inputs;

    if (!scheduleStartDateTime || !scheduleEndDateTime) {
      Alert.error(APPOINTMENT_SLOT_ERROR_MESSAGE)
    } else {
      if (facility) {
        const { id: facilityId, practiceId } = facility
        const { value: selectedService } = serviceId || {};
        const { id: selectedSexAtBirth } = sexAtBirth || {};

        await createExternalAppointment({
          variables: {
            createExternalAppointmentInput: {
              createGuardianContactInput: { contactType: ContactType.Guardian },
              createExternalAppointmentItemInput: {
                serviceId: selectedService, facilityId, paymentType: PaymentType.Self,
                scheduleStartDateTime: getCurrentTimestamps(scheduleStartDateTime, date), billingStatus: BillingStatus.Due,
                scheduleEndDateTime: getCurrentTimestamps(scheduleEndDateTime, date), practiceId: practiceId || ''
              },

              createPatientItemInput: {
                email, firstName, lastName, dob: dob ? getTimestampsForDob(dob) : '', facilityId,
                sexAtBirth: selectedSexAtBirth ? selectedSexAtBirth as Genderidentity : Genderidentity.Male,
                practiceId: practiceId || ''
              },
            }
          }
        })
      } else
        Alert.error(FACILITY_NOT_FOUND)
    }
  }

  const onSignatureEnd = (file: File | null) => setValue('signature', file)

  const createPatientConsentHandler = async (patientId: string, id: string) => {
    try {
      const arr = agreements?.map(({ body, id }) => {
        return {
          id,
          body
        }
      })
      const body = JSON.stringify({ agreements: arr })
      await createPatientConsent({
        variables: {
          createPatientConsentInputs: {
            appointmentId: id,
            patientId,
            body
          }
        }
      })
    } catch (error) { }
  }

  const signatureUploadHandler = async (id: string, patientId: string) => {
    setLoading(true)

    const formData = new FormData();
    patientId && formData.append("typeId", patientId);
    formData.append("title", ATTACHMENT_TITLES.Signature);
    signature && formData.append("file", signature);

    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/patients/upload`,
      formData
    ).then((response) => {
      const { status } = response
      if (status !== 201) Alert.error("Something went wrong!");
      else {
        createPatientConsentHandler(patientId, id)
        reset()
        history.push(`${APPOINTMENT_PAYMENT}/${id}`)
      }
      setLoading(false)
    }).catch(error => {
      const { response: { data: { error: errorMessage } } } = error || {}
      Alert.error(errorMessage);
      setLoading(false)
    });
  }

  return (
    <Box bgcolor={GREY} minHeight="100vh" padding="30px 30px 30px 60px">
      <AIMEDLOGO />

      <Box mb={3} />

      <Box>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Typography variant="h4">{BOOK_YOUR_APPOINTMENT}</Typography>

              <Button variant="contained" type="submit" color="primary" disabled={!agreed || loading}>{BOOK_APPOINTMENT}</Button>
            </Box>

            <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto">
              <Grid container spacing={3}>
                <Grid lg={9} md={8} sm={6} xs={12} item>
                  <CardComponent cardTitle={SELECT_SERVICES} className={`overflow-visible`}>
                    <Grid item md={6} sm={12} xs={12}>
                      <ServiceSelector
                        isRequired
                        label={APPOINTMENT_TYPE}
                        name="serviceId"
                        facilityId={facilityId}
                      />
                    </Grid>
                  </CardComponent>

                  <Box pt={3} />

                  <CardComponent cardTitle={PATIENT_DETAILS}>
                    <Grid container spacing={3}>
                      <Grid item md={4} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="firstName"
                          controllerLabel={FIRST_NAME}
                        />
                      </Grid>

                      <Grid item md={4} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="lastName"
                          controllerLabel={LAST_NAME}
                        />
                      </Grid>

                      <Grid item md={4} sm={12} xs={12}>
                        <InputController
                          isRequired
                          fieldType="text"
                          controllerName="email"
                          controllerLabel={EMAIL}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={4} sm={12} xs={12}>
                        <Selector
                          name="sexAtBirth"
                          label={SEX}
                          value={EMPTY_OPTION}
                          options={MAPPED_GENDER_IDENTITY}
                        />
                      </Grid>

                      <Grid item md={4} sm={12} xs={12}>
                        <DatePicker
                          isRequired
                          name="dob"
                          label={DOB_TEXT}
                        />
                      </Grid>
                    </Grid>
                  </CardComponent>

                  <Box pt={3} />

                  <CardComponent cardTitle={AGREEMENT_HEADING}>
                    {agreements?.map((agreement) => {
                      const { body } = agreement || {}
                      return (<Box maxHeight={400} pl={2} mb={3} overflow="auto">
                        {body && <Typography variant="subtitle1" component="p" dangerouslySetInnerHTML={{ __html: body }} ></Typography>}
                      </Box>)
                    })}
                    {isSignature &&
                      <Box width="50%" pb={2}>
                        <Signature onSignatureEnd={onSignatureEnd} controllerName={'signature'} />
                      </Box>
                    }
                  </CardComponent>

                  <Box bgcolor={WHITE} mt={-1} p={3.75} className={classes.agreement_box}>
                    <FormControlLabel
                      control={
                        <Checkbox checked={agreed} onChange={() =>
                          dispatch({ type: ActionType.SET_AGREED, agreed: !agreed })
                        }
                        />
                      }
                      label={AGREEMENT_TEXT}
                      labelPlacement="end"
                    />
                  </Box>
                </Grid>

                <Grid item lg={3} md={4} sm={6} xs={12} className="custom-calendar">
                  <AppointmentSlots facilityId={facilityId} dispatcher={dispatch} />
                </Grid>
              </Grid>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  )
}

export default FacilityPublicAppointmentForm;
