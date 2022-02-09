// packages block
import { Reducer, useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid } from "@material-ui/core";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
// components block
import Alert from "../../../common/Alert";
import Selector from "../../../common/Selector";
import PhoneField from '../../../common/PhoneInput';
import DatePicker from "../../../common/DatePicker";
import InputController from "../../../../controller";
import CardComponent from "../../../common/CardComponent";
import AppointmentDatePicker from "./AppointmentDatePicker";
import ViewDataLoader from "../../../common/ViewDataLoader";
// constants block
import history from "../../../../history";
import { FacilityContext } from '../../../../context';
import { externalAppointmentSchema } from "../../../../validationSchemas";
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointment";
import { ExtendedExternalAppointmentInputProps, ParamsType } from "../../../../interfacesTypes";
import { appointmentReducer, Action, initialState, State, ActionType } from "../../../../reducers/appointmentReducer";
import {
  formatValue, getStandardTime, getTimestamps, renderDoctors, renderServices, requiredMessage
} from "../../../../utils";
import {
  ContactType, Genderidentity, PaymentType, RelationshipType, SchedulePayload, SchedulesPayload,
  useCreateExternalAppointmentMutation, useGetDoctorScheduleLazyQuery, useGetFacilityLazyQuery
} from "../../../../generated/graphql";
import {
  APPOINTMENT_BOOKED_SUCCESSFULLY, APPOINTMENT_TYPE, CANCEL, DOB, EMAIL, EMPTY_OPTION,
  MAPPED_GENDER_IDENTITY, MAPPED_RELATIONSHIP_TYPE, PATIENT_DETAILS, PHONE, SELECT_SERVICES,
  SEX_AT_BIRTH, SLOT_CONFIRMATION, SELECT_PROVIDER, PAYMENT_TYPE, MAPPED_PAYMENT_METHOD,
  INSURANCE_COMPANY, MEMBERSHIP_ID, BOOK_APPOINTMENT, PATIENT_FIRST_NAME, PATIENT_LAST_NAME,
  RELATIONSHIP_WITH_PATIENT, YOUR_NAME, PROVIDER, FACILITY_NOT_FOUND,
} from "../../../../constants";

const ScheduleAppointmentsPublic = (): JSX.Element => {
  const classes = usePublicAppointmentStyles()
  const { id: facilityId } = useParams<ParamsType>();
  const { serviceList, doctorList, fetchAllDoctorList, fetchAllServicesList } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { facility, isInsurance, availableSchedules } = state;
  const methods = useForm<ExtendedExternalAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(externalAppointmentSchema)
  });
  const { reset, setValue, handleSubmit, watch, formState: { errors } } = methods;
  const { paymentType, providerId } = watch();

  const [getFacility, { loading: getFacilityLoading }] = useGetFacilityLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getFacility: { response, facility } } = data;
      if (response) {
        const { status } = response

        if (facility && status && status === 200) {
          dispatch({ type: ActionType.SET_FACILITY, facility })
          fetchAllDoctorList(facilityId);
          fetchAllServicesList(facilityId)
        }
      }
    }
  });

  const [getDoctorSchedules, { loading: getSchedulesLoading }] = useGetDoctorScheduleLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError() {
      dispatch({ type: ActionType.SET_AVAILABLE_SCHEDULES, availableSchedules: [] })
    },

    onCompleted(data) {
      const { getDoctorSchedules: { schedules } } = data || {};

      schedules && dispatch({
        type: ActionType.SET_AVAILABLE_SCHEDULES, availableSchedules: schedules as SchedulesPayload['schedules']
      });
    }
  });

  const [createExternalAppointment, { loading: createExternalAppointmentLoading }] = useCreateExternalAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { createExternalAppointment: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY);
          reset()
          history.push(SLOT_CONFIRMATION)
        }
      }
    }
  });

  useEffect(() => {
    if (facilityId) {
      getFacility({
        variables: { getFacility: { id: facilityId } }
      })
    }
  }, [facilityId, getFacility])

  useEffect(() => {
    if (paymentType) {
      const { name } = paymentType

      dispatch({ type: ActionType.SET_IS_INSURANCE, isInsurance: name === formatValue(PaymentType.Insurance) })
    }
  }, [paymentType, watch])

  useEffect(() => {
    const { id: selectedProvider } = providerId || {}
    if (selectedProvider) {
      getDoctorSchedules({
        variables: { getDoctorSchedule: { id: selectedProvider } }
      })
    }
  }, [watch, providerId, getDoctorSchedules])

  const onSubmit: SubmitHandler<ExtendedExternalAppointmentInputProps> = async (inputs) => {
    const {
      patientId, providerId, serviceId, dob, email, firstName, lastName, sexAtBirth,
      scheduleStartDateTime, scheduleEndDateTime, membershipID, paymentType, guardianName, guardianRelationship
    } = inputs;

    if (facility) {
      const { id: facilityId } = facility
      const { id: selectedService } = serviceId || {};
      const { id: selectedProvider } = providerId || {};
      const { id: selectedSexAtBirth } = sexAtBirth || {};
      const { id: selectedPaymentType } = paymentType || {};
      const { id: selectedGuardianRelationship } = guardianRelationship || {};

      await createExternalAppointment({
        variables: {
          createExternalAppointmentInput: {
            createExternalAppointmentItemInput: {
              serviceId: selectedService || '', providerId: selectedProvider, facilityId, membershipID, 
              paymentType: selectedPaymentType as PaymentType || PaymentType.Self, patientId,
              scheduleStartDateTime: getTimestamps(new Date(parseInt(scheduleStartDateTime)).toString()), 
              scheduleEndDateTime: getTimestamps(new Date(parseInt(scheduleEndDateTime)).toString())
            },

            createPatientItemInput: {
              firstName: firstName || "", lastName: lastName || "", facilityId, dob,
              sexAtBirth: selectedSexAtBirth as Genderidentity || Genderidentity.None, email: email || ""
            },

            createGuardianContactInput: {
              name: guardianName, contactType: ContactType.Guardian,
              relationship: selectedGuardianRelationship as RelationshipType || RelationshipType.Other,
            }
          }
        }
      })
    } else
      Alert.error(FACILITY_NOT_FOUND)
  }

  const setSchedule = (schedule: SchedulePayload['schedule']) => {
    if (schedule) {
      const { startAt, endAt } = schedule;
      startAt && setValue('scheduleStartDateTime', startAt)
      endAt && setValue('scheduleEndDateTime', endAt)
    }
  };

  const disableSubmit = createExternalAppointmentLoading || getSchedulesLoading || getFacilityLoading
  const {
    dob: { message: dobError } = {},
    email: { message: emailError } = {},
    serviceId: { id: serviceError } = {},
    providerId: { id: providerError } = {},
    lastName: { message: lastNameError } = {},
    firstName: { message: firstNameError } = {},
  } = errors;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid lg={9} md={8} sm={6} xs={12} item>
            <CardComponent cardTitle={SELECT_SERVICES}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    value={EMPTY_OPTION}
                    label={APPOINTMENT_TYPE}
                    name="serviceId"
                    error={(serviceError?.message && requiredMessage(APPOINTMENT_TYPE)) || ''}
                    options={renderServices(serviceList)}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    isRequired
                    value={EMPTY_OPTION}
                    label={SELECT_PROVIDER}
                    name="providerId"
                    error={(providerError?.message && requiredMessage(PROVIDER)) || ''}
                    options={renderDoctors(doctorList)}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    name="paymentType"
                    label={PAYMENT_TYPE}
                    value={EMPTY_OPTION}
                    options={MAPPED_PAYMENT_METHOD}
                  />
                </Grid>

                {isInsurance && (
                  <>
                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="insuranceCompany"
                        controllerLabel={INSURANCE_COMPANY}
                      />
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <InputController
                        fieldType="text"
                        controllerName="membershipId"
                        controllerLabel={MEMBERSHIP_ID}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardComponent>

            <Box pt={3} />

            <CardComponent cardTitle={PATIENT_DETAILS}>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    isRequired
                    fieldType="text"
                    controllerName="firstName"
                    error={firstNameError}
                    controllerLabel={PATIENT_FIRST_NAME}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    isRequired
                    fieldType="text"
                    controllerName="lastName"
                    error={lastNameError}
                    controllerLabel={PATIENT_LAST_NAME}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={3} sm={12} xs={12}>
                  <Selector
                    name="sexAtBirth"
                    label={SEX_AT_BIRTH}
                    value={EMPTY_OPTION}
                    options={MAPPED_GENDER_IDENTITY}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <DatePicker isRequired name="dob" label={DOB} error={(dobError && requiredMessage(DOB)) || ''} />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <InputController
                    isRequired
                    fieldType="text"
                    controllerName="email"
                    error={emailError}
                    controllerLabel={EMAIL}
                  />
                </Grid>

                <Grid item md={3} sm={12} xs={12}>
                  <PhoneField name="phone" label={PHONE} />
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                  <Selector
                    name="guardianRelationship"
                    label={RELATIONSHIP_WITH_PATIENT}
                    value={EMPTY_OPTION}
                    options={MAPPED_RELATIONSHIP_TYPE}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <InputController
                    fieldType="text"
                    controllerName="guardianName"
                    controllerLabel={YOUR_NAME}
                  />
                </Grid>
              </Grid>
            </CardComponent>
          </Grid>

          <Grid item lg={3} md={4} sm={6} xs={12} className="custom-calendar">
            <CardComponent cardTitle="Available Slots">
              <AppointmentDatePicker />

              {getSchedulesLoading ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> : (
                <ul className={classes.timeSlots}>
                  {!!availableSchedules?.length && availableSchedules.map((schedule, index) => {
                    const { startAt, endAt } = schedule || {}

                    return (
                      <li onClick={() => setSchedule(schedule)}>
                        <div>
                          <input type="radio" name="scheduleStartDateTime" id={`timeSlot-${index}`} />

                          <label htmlFor={`timeSlot-${index}`}>
                            {getStandardTime(startAt || '')} - {getStandardTime(endAt || '')}
                          </label>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardComponent>
          </Grid>

          <Grid item md={12}>
            <Box pt={4} display="flex" justifyContent="center" gridGap={20}>
              <Button type="submit" variant="contained">
                {CANCEL}
              </Button>

              <Button type="submit" variant="contained" className={disableSubmit ? '' : 'blue-button'}
                disabled={disableSubmit}
              >
                {BOOK_APPOINTMENT}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default ScheduleAppointmentsPublic;
