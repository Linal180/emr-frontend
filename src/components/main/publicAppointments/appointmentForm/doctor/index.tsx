// packages block
import { Reducer, useContext, useEffect, useReducer, useCallback } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import DatePicker from "../../../../common/DatePicker";
import InputController from "../../../../../controller";
import CardComponent from "../../../../common/CardComponent";
import AppointmentSlots from "../../../../common/AppointmentSlots";
import ServiceSelector from "../../../../common/Selector/ServiceSelector";
// constants block
import history from "../../../../../history";
import { WHITE, GREY } from "../../../../../theme";
import { AIMEDLOGO } from "../../../../../assets/svgs";
import { FacilityContext } from '../../../../../context';
import { externalAppointmentSchema } from "../../../../../validationSchemas";
import { getCurrentTimestamps, getTimestampsForDob } from "../../../../../utils";
import { usePublicAppointmentStyles } from "../../../../../styles/publicAppointmentStyles";
import { ExtendedExternalAppointmentInputProps, ParamsType } from "../../../../../interfacesTypes";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/appointmentReducer";
import {
  ContactType, Genderidentity, PaymentType, useCreateExternalAppointmentMutation, DoctorPayload,
  BillingStatus, useGetDoctorLazyQuery,
} from "../../../../../generated/graphql";
import {
  MAPPED_GENDER_IDENTITY, PATIENT_DETAILS, SELECT_SERVICES, BOOK_APPOINTMENT, DOCTOR_NOT_FOUND,
  APPOINTMENT_TYPE, EMAIL, EMPTY_OPTION, SEX, DOB_TEXT, AGREEMENT_TEXT, FIRST_NAME, LAST_NAME,
  PATIENT_APPOINTMENT_FAIL, APPOINTMENT_SLOT_ERROR_MESSAGE, AGREEMENT_HEADING, APPOINTMENT_PAYMENT,
  BOOK_YOUR_APPOINTMENT,
} from "../../../../../constants";

const DoctorPublicAppointmentForm = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const { id: doctorId } = useParams<ParamsType>();
  const { fetchAllServicesList } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { agreed, doctor, date, facilityId } = state;
  const methods = useForm<ExtendedExternalAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(externalAppointmentSchema)
  });
  const { reset, handleSubmit } = methods;

  const [getDoctor] = useGetDoctorLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      history.push(PATIENT_APPOINTMENT_FAIL)
    },

    onCompleted(data) {
      try {
        const { getDoctor: { response, doctor } } = data;

        if (response) {
          const { status } = response

          if (doctor && status && status === 200) {
            const { facilityId } = doctor
            fetchAllServicesList(facilityId)
            dispatch({ type: ActionType.SET_DOCTOR, doctor: doctor as DoctorPayload['doctor'] })
            dispatch({ type: ActionType.SET_FACILITY_ID, facilityId: facilityId ?? '' })
          }
        }
      } catch (error) { }
    }
  });

  const [createExternalAppointment] = useCreateExternalAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { createExternalAppointment: { response, appointment } } = data;

      if (response && appointment) {
        const { status } = response
        const { id } = appointment

        if (id && status && status === 200) {
          reset()
          history.push(`${APPOINTMENT_PAYMENT}/${id}`)
        }
      }
    }
  });

  const fetchDoctor = useCallback(async () => {
    try {
      doctorId ?
        await getDoctor({ variables: { getDoctor: { id: doctorId } } })
        :
        history.push(PATIENT_APPOINTMENT_FAIL)
    } catch (error) { }
  }, [doctorId, getDoctor])

  useEffect(() => {
    fetchDoctor()
  }, [doctorId, fetchDoctor])

  const onSubmit: SubmitHandler<ExtendedExternalAppointmentInputProps> = async (inputs) => {
    const {
      firstName, lastName, dob, email, serviceId, sexAtBirth, scheduleStartDateTime, scheduleEndDateTime
    } = inputs;

    if (!scheduleStartDateTime || !scheduleEndDateTime) {
      Alert.error(APPOINTMENT_SLOT_ERROR_MESSAGE)
    } else {
      if (doctor) {
        const { facilityId, practiceId } = doctor
        const { value: selectedService } = serviceId || {};
        const { id: selectedSexAtBirth } = sexAtBirth || {};

        await createExternalAppointment({
          variables: {
            createExternalAppointmentInput: {
              createGuardianContactInput: { contactType: ContactType.Guardian },
              createExternalAppointmentItemInput: {
                practiceId: practiceId,
                serviceId: selectedService, providerId: doctorId, paymentType: PaymentType.Self, facilityId: facilityId || '',
                scheduleStartDateTime: getCurrentTimestamps(scheduleStartDateTime, date), billingStatus: BillingStatus.Due,
                scheduleEndDateTime: getCurrentTimestamps(scheduleEndDateTime, date),
              },

              createPatientItemInput: {
                email, firstName, lastName, dob: dob ? getTimestampsForDob(dob) : '', facilityId: facilityId || '',
                sexAtBirth: selectedSexAtBirth ? selectedSexAtBirth as Genderidentity : Genderidentity.DeclineToSpecify,
                usualProviderId: doctorId, practiceId: practiceId || '',
              },
            }
          }
        })
      } else Alert.error(DOCTOR_NOT_FOUND)
    }
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

              <Button variant="contained" type="submit" color="primary" disabled={!agreed}>{BOOK_APPOINTMENT}</Button>
            </Box>

            <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto">
              <Grid container spacing={3}>
                <Grid lg={9} md={8} sm={6} xs={12} item>
                  <CardComponent cardTitle={SELECT_SERVICES}>
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
                    <Box maxHeight={400} pl={2} mb={3} overflow="auto">
                      <Typography variant="subtitle1" component="p">{`{{Terms of Service Content}}`}</Typography>
                    </Box>
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
                  <AppointmentSlots providerId={doctorId} dispatcher={dispatch} />
                </Grid>
              </Grid>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Box>
  )
}

export default DoctorPublicAppointmentForm;
