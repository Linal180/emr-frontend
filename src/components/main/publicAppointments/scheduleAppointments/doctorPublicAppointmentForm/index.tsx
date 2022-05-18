// packages block
import { Reducer, useContext, useEffect, useState, useReducer, useCallback } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { Box, Button, Checkbox, colors, FormControlLabel, Grid, Typography } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import Selector from "../../../../common/Selector";
import DatePicker from "../../../../common/DatePicker";
import InputController from "../../../../../controller";
import CardComponent from "../../../../common/CardComponent";
import AppointmentDatePicker from "../AppointmentDatePicker";
import ViewDataLoader from "../../../../common/ViewDataLoader";
// constants block
import history from "../../../../../history";
import { EMRLogo } from "../../../../../assets/svgs";
import { FacilityContext } from '../../../../../context';
import { WHITE, GREY } from "../../../../../theme";
import { externalAppointmentSchema } from "../../../../../validationSchemas";
import { usePublicAppointmentStyles } from "../../../../../styles/publicAppointmentStyles";
import { ExtendedExternalAppointmentInputProps, ParamsType } from "../../../../../interfacesTypes";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from "../../../../../reducers/appointmentReducer";
import { getCurrentTimestamps, getStandardTime, getTimestampsForDob } from "../../../../../utils";
import {
  ContactType, Genderidentity, PaymentType, Slots, useCreateExternalAppointmentMutation,
  useGetSlotsLazyQuery, BillingStatus, useGetDoctorLazyQuery, DoctorPayload
} from "../../../../../generated/graphql";
import {
  MAPPED_GENDER_IDENTITY, PATIENT_DETAILS, SELECT_SERVICES, BOOK_APPOINTMENT, DOCTOR_NOT_FOUND,
  APPOINTMENT_TYPE, EMAIL, EMPTY_OPTION, SEX, DOB_TEXT, AGREEMENT_TEXT, FIRST_NAME, LAST_NAME,
  AVAILABLE_SLOTS, PATIENT_APPOINTMENT_FAIL, APPOINTMENT_SLOT_ERROR_MESSAGE, AGREEMENT_HEADING,
  NO_SLOT_AVAILABLE, BOOK_YOUR_APPOINTMENT, APPOINTMENT_PAYMENT, DAYS,
} from "../../../../../constants";
import ServiceSelector from "../../../../common/Selector/ServiceSelector";

const DoctorPublicAppointmentForm = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const { id: doctorId } = useParams<ParamsType>();
  const { fetchAllServicesList } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { availableSlots, currentDate, offset, agreed, doctor, facilityId } = state;
  const [date, setDate] = useState(new Date() as MaterialUiPickersDate);
  const methods = useForm<ExtendedExternalAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(externalAppointmentSchema)
  });
  const { reset, setValue, handleSubmit, watch } = methods;
  const {
    serviceId: { id: selectedService } = {},
    providerId: { id: selectedProvider } = {},
  } = watch();

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

  const [getSlots, { loading: getSlotsLoading }] = useGetSlotsLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] })
    },

    onCompleted(data) {
      const { getSlots } = data || {}

      if (getSlots) {
        const { slots } = getSlots;

        slots ?
          dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: slots })
          :
          dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] });
      }
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

  useEffect(() => {
    if (selectedService && date) {
      setValue('scheduleEndDateTime', '')
      setValue('scheduleStartDateTime', '')
      const days = [DAYS.Sunday, DAYS.Monday, DAYS.Tuesday, DAYS.Wednesday, DAYS.Thursday, DAYS.Friday, DAYS.Saturday];
      const currentDay = new Date(date).getDay()

      getSlots({
        variables: {
          getSlots: {
            providerId: doctorId, offset, currentDate: date.toString(),
            serviceId: selectedService, day: days[currentDay]
          }
        }
      })
    }
  }, [date, doctorId, getSlots, offset, selectedProvider, selectedService, currentDate, setValue])

  const onSubmit: SubmitHandler<ExtendedExternalAppointmentInputProps> = async (inputs) => {
    const { firstName, lastName, dob, email, serviceId, sexAtBirth, scheduleStartDateTime, scheduleEndDateTime } = inputs;

    if (!scheduleStartDateTime || !scheduleEndDateTime) {
      Alert.error(APPOINTMENT_SLOT_ERROR_MESSAGE)
    } else {
      if (doctor) {
        const { facilityId, practiceId } = doctor
        const { id: selectedService } = serviceId || {};
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
                usualProviderId: doctorId, sexAtBirth: selectedSexAtBirth as Genderidentity, practiceId: practiceId || ''
              },
            }
          }
        })
      } else
        Alert.error(DOCTOR_NOT_FOUND)
    }
  }

  const handleSlot = (slot: Slots) => {
    if (slot) {
      const { startTime, endTime } = slot;
      startTime && setValue('scheduleStartDateTime', startTime)
      endTime && setValue('scheduleEndDateTime', endTime)
    }
  };

  return (
    <Box bgcolor={GREY} minHeight="100vh" padding="30px 30px 30px 60px">
      <EMRLogo />

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
                        addEmpty
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
                  <CardComponent cardTitle="Available Slots">
                    <AppointmentDatePicker date={date} setDate={setDate} />

                    <Box pb={2} mb={2} borderBottom={`1px solid ${colors.grey[300]}`}>
                      <Typography variant="h4">{AVAILABLE_SLOTS}</Typography>
                    </Box>

                    {getSlotsLoading ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> : (
                      <ul className={classes.timeSlots}>
                        {!!availableSlots?.length ? availableSlots.map((slot: Slots, index: number) => {
                          const { startTime, endTime } = slot || {}

                          return (
                            <li key={index} onClick={() => handleSlot(slot)}>
                              <input type="radio" name="scheduleStartDateTime" id={`timeSlot-${index}`} />

                              <label htmlFor={`timeSlot-${index}`}>
                                {getStandardTime(new Date(startTime || '').getTime().toString())} -
                                {getStandardTime(new Date(endTime || '').getTime().toString())}
                              </label>
                            </li>
                          )
                        }) : (
                          <Typography>{NO_SLOT_AVAILABLE}</Typography>
                        )}
                      </ul>
                    )}
                  </CardComponent>
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
