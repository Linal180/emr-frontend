// packages block
import { useEffect, FC, useContext, useState, Reducer, useReducer, useCallback, ChangeEvent } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, Typography } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
// interfaces, graphql, constants block
import history from "../../../../history";
import { GRAY_TWO, WHITE } from '../../../../theme';
import { appointmentSchema } from '../../../../validationSchemas';
import { FacilityContext, ListContext } from '../../../../context';
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles";
import { AntSwitch } from '../../../../styles/publicAppointmentStyles/externalPatientStyles';
import { ExtendedAppointmentInputProps, GeneralFormProps } from "../../../../interfacesTypes";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from '../../../../reducers/appointmentReducer';
import {
  getTimestamps, renderDoctors, renderFacilities, renderPatient, renderServices, getTimeFromTimestamps,
  setRecord, getStandardTime,
} from "../../../../utils";
import {
  DoctorSlotsPayload,
  PaymentType, Slots, useCreateAppointmentMutation, useGetAppointmentLazyQuery, useUpdateAppointmentMutation,
  useGetDoctorSlotsLazyQuery,
} from "../../../../generated/graphql";
import {
  FACILITY, PROVIDER, EMPTY_OPTION, UPDATE_APPOINTMENT, CREATE_APPOINTMENT, CANT_BOOK_APPOINTMENT,
  APPOINTMENT_BOOKED_SUCCESSFULLY, APPOINTMENT_UPDATED_SUCCESSFULLY, SLOT_ALREADY_BOOKED, NO_SLOT_AVAILABLE,
  APPOINTMENT_NOT_FOUND, CANT_UPDATE_APPOINTMENT, APPOINTMENT, APPOINTMENT_TYPE, INFORMATION,
  PATIENT, REASON, NOTES, PRIMARY_INSURANCE, SECONDARY_INSURANCE, PATIENT_CONDITION, EMPLOYMENT,
  AUTO_ACCIDENT, OTHER_ACCIDENT, VIEW_APPOINTMENTS_ROUTE, APPOINTMENT_SLOT_ERROR_MESSAGE, CONFLICT_EXCEPTION,
} from "../../../../constants";

const AppointmentForm: FC<GeneralFormProps> = ({ isEdit, id }) => {
  const classes = usePublicAppointmentStyles();
  const { facilityList } = useContext(ListContext)
  const [date, setDate] = useState(new Date() as MaterialUiPickersDate);
  const {
    serviceList, doctorList, patientList, fetchAllDoctorList, fetchAllServicesList, fetchAllPatientList
  } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const { availableSlots, serviceId, offset, currentDate, isEmployment, isAutoAccident, isOtherAccident } = state
  const methods = useForm<ExtendedAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(appointmentSchema)
  });
  const { reset, setValue, handleSubmit, watch, control } = methods;
  const {
    serviceId: { id: selectedService } = {},
    providerId: { id: selectedProvider } = {},
    facilityId: { id: selectedFacility, name: selectedFacilityName } = {},
  } = watch();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { checked, name } } = event

    switch (name) {
      case 'employment':
        setValue('employment', checked)
        dispatch({ type: ActionType.SET_IS_EMPLOYMENT, isEmployment: checked })
        return;

      case 'autoAccident':
        dispatch({ type: ActionType.SET_IS_AUTO_ACCIDENT, isAutoAccident: checked })
        setValue('autoAccident', checked)
        return;

      case 'otherAccident':
        dispatch({ type: ActionType.SET_IS_OTHER_ACCIDENT, isOtherAccident: checked })
        setValue('otherAccident', checked)
        return;
    }
  };

  const [getAppointment, { loading: getAppointmentLoading }] = useGetAppointmentLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getAppointment: { response, appointment } } = data;

      if (response) {
        const { status } = response

        if (appointment && status && status === 200) {
          const {
            reason, scheduleStartDateTime, scheduleEndDateTime, notes, primaryInsurance, secondaryInsurance,
            employment, autoAccident, otherAccident, appointmentType, facility, provider, patient,
          } = appointment || {}

          const { id: facilityId, name: facilityName } = facility || {};
          const { id: serviceId, name: serviceName } = appointmentType || {};
          const { id: patientId, firstName: patientFN, lastName: patientLN } = patient || {};
          const { id: providerId, firstName: providerFN, lastName: providerLN } = provider || {};

          notes && setValue('notes', notes)
          reason && setValue('reason', reason)
          employment && setValue('employment', employment)
          autoAccident && setValue('autoAccident', autoAccident)
          otherAccident && setValue('otherAccident', otherAccident)
          primaryInsurance && setValue('primaryInsurance', primaryInsurance)
          secondaryInsurance && setValue('secondaryInsurance', secondaryInsurance)
          serviceId && serviceName && setValue('serviceId', setRecord(serviceId, serviceName))
          facilityId && facilityName && setValue('facilityId', setRecord(facilityId, facilityName))
          patientId && setValue('patientId', setRecord(patientId, `${patientFN} ${patientLN}` || ''))
          providerId && setValue('providerId', setRecord(providerId, `${providerFN} ${providerLN}` || ''))
          scheduleEndDateTime && setValue('scheduleEndDateTime', getTimeFromTimestamps(scheduleEndDateTime))
          scheduleStartDateTime && setValue('scheduleStartDateTime', getTimeFromTimestamps(scheduleStartDateTime))

          setDate(new Date(getTimeFromTimestamps(scheduleStartDateTime || '')) as MaterialUiPickersDate)
          dispatch({ type: ActionType.SET_IS_EMPLOYMENT, isEmployment: employment as boolean })
          dispatch({ type: ActionType.SET_IS_AUTO_ACCIDENT, isAutoAccident: autoAccident as boolean })
          dispatch({ type: ActionType.SET_IS_OTHER_ACCIDENT, isOtherAccident: isOtherAccident as boolean })
        }
      }
    }
  });

  const [getDoctorSlots, { loading: getSlotsLoading }] = useGetDoctorSlotsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] })
    },

    onCompleted(data) {
      const { getDoctorSlots } = data || {}

      if (getDoctorSlots) {
        const { slots } = getDoctorSlots;
        if (slots) {
          dispatch({
            type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: slots as DoctorSlotsPayload['slots']
          });
        } else {
          dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] });
        }
      }
    }
  });

  const [createAppointment, { loading: CreateAppointmentLoading }] = useCreateAppointmentMutation({
    onError({ message }) {
      if (message === CONFLICT_EXCEPTION) {
        Alert.error(SLOT_ALREADY_BOOKED)
      } else
        Alert.error(message || CANT_BOOK_APPOINTMENT)
    },

    onCompleted(data) {
      const { createAppointment: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_BOOKED_SUCCESSFULLY);
          reset()
          history.push(VIEW_APPOINTMENTS_ROUTE)
        }
      }
    }
  });

  const [updateAppointment, { loading: updateAppointmentLoading }] = useUpdateAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { updateAppointment: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(APPOINTMENT_UPDATED_SUCCESSFULLY);
          reset()
          history.push(VIEW_APPOINTMENTS_ROUTE)
        }
      }
    }
  });

  useEffect(() => {
    if (isEdit) {
      if (id) {
        getAppointment({
          variables: { getAppointment: { id } }
        })
      } else Alert.error(APPOINTMENT_NOT_FOUND)
    } else {
      setValue('employment', false)
      setValue('autoAccident', false)
      setValue('otherAccident', false)
    }
  }, [getAppointment, id, isEdit, setValue])

  useEffect(() => {
    if (selectedFacility && selectedProvider && selectedService && date) {
      getDoctorSlots({
        variables: {
          getDoctorSlots: { id: selectedProvider, offset, currentDate: date.toString(), serviceId: selectedService }
        }
      })
    }
  }, [
    currentDate, getDoctorSlots, id, offset, selectedFacility, date, selectedProvider, selectedService,
    serviceId, watch
  ])

  const fetchList = useCallback((id: string, name: string) => {
    reset({
      serviceId: EMPTY_OPTION,
      patientId: EMPTY_OPTION,
      providerId: EMPTY_OPTION,
      facilityId: { id, name }
    });

    if (id) {
      fetchAllDoctorList(id);
      fetchAllPatientList(id);
      fetchAllServicesList(id);
    }
  }, [fetchAllDoctorList, fetchAllPatientList, fetchAllServicesList, reset]);

  useEffect(() => {
    selectedFacility && selectedFacilityName && fetchList(selectedFacility, selectedFacilityName);
  }, [fetchList, selectedFacility, selectedFacilityName, watch])

  const onSubmit: SubmitHandler<ExtendedAppointmentInputProps> = async (inputs) => {
    const {
      reason, scheduleStartDateTime, scheduleEndDateTime, notes, primaryInsurance, patientId,
      secondaryInsurance, employment, autoAccident, otherAccident, serviceId, facilityId, providerId,
    } = inputs;

    if (!scheduleStartDateTime || !scheduleEndDateTime) {
      Alert.error(APPOINTMENT_SLOT_ERROR_MESSAGE)
    } else {
      const { id: selectedService } = serviceId || {};
      const { id: selectedPatient } = patientId || {};
      const { id: selectedProvider } = providerId || {};
      const { id: selectedFacility } = facilityId || {};

      const appointmentInput = {
        reason: reason || '',
        scheduleStartDateTime: getTimestamps(scheduleStartDateTime),
        scheduleEndDateTime: getTimestamps(scheduleEndDateTime),
        autoAccident: autoAccident || false, otherAccident: otherAccident || false,
        primaryInsurance: primaryInsurance || '', secondaryInsurance: secondaryInsurance || '',
        notes: notes || '', facilityId: selectedFacility, patientId: selectedPatient,
        serviceId: selectedService, providerId: selectedProvider, employment: employment || false,
        paymentType: PaymentType.Self
      };

      if (isEdit) {
        if (id) {
          await updateAppointment({
            variables: { updateAppointmentInput: { id, ...appointmentInput } }
          })
        } else {
          Alert.error(CANT_UPDATE_APPOINTMENT)
        }
      } else {
        await createAppointment({
          variables: {
            createAppointmentInput: { ...appointmentInput }
          }
        })
      }
    }
  };

  const handleSlot = (slot: Slots) => {
    if (slot) {
      const { startTime, endTime } = slot;
      endTime && setValue('scheduleEndDateTime', endTime)
      startTime && setValue('scheduleStartDateTime', startTime)
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto">
          <Grid container spacing={3}>
            <Grid md={6} item>
              <CardComponent cardTitle={APPOINTMENT}>
                {getAppointmentLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      <Selector
                        isRequired
                        value={EMPTY_OPTION}
                        label={FACILITY}
                        name="facilityId"
                        options={renderFacilities(facilityList)}
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>

                      <Selector
                        isRequired
                        value={EMPTY_OPTION}
                        label={APPOINTMENT_TYPE}
                        name="serviceId"
                        options={renderServices(serviceList)}
                      />
                    </Grid>
                  </Grid>
                )}
              </CardComponent>

              <Box pb={3} />

              <CardComponent cardTitle={INFORMATION}>
                {getAppointmentLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={PROVIDER}
                          name="providerId"
                          options={renderDoctors(doctorList)}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={PATIENT}
                          name="patientId"
                          options={renderPatient(patientList)}
                        />
                      </Grid>
                    </Grid>

                    <InputController
                      fieldType="text"
                      controllerName="reason"
                      controllerLabel={REASON}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="notes"
                      controllerLabel={NOTES}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="primaryInsurance"
                      controllerLabel={PRIMARY_INSURANCE}
                    />

                    <InputController
                      fieldType="text"
                      controllerName="secondaryInsurance"
                      controllerLabel={SECONDARY_INSURANCE}
                    />
                  </>
                )}
              </CardComponent>
            </Grid>
            <Grid md={6} item>
              <Grid item md={12} sm={12} className="custom-calendar">
                <CardComponent cardTitle="Available Slots">
                  <Box display="flex" justifyContent="center">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        variant="static"
                        openTo="date"
                        value={date}
                        autoOk
                        disablePast
                        fullWidth
                        disableToolbar
                        onChange={currentDate => currentDate && setDate(currentDate)}
                      />
                    </MuiPickersUtilsProvider>
                  </Box>

                  {getSlotsLoading ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> : (
                    <ul className={classes.timeSlots}>
                      {!!availableSlots?.length ? availableSlots.map((slot: Slots, index: number) => {
                        const { startTime, endTime } = slot || {}

                        return (
                          <li onClick={() => handleSlot(slot)}>
                            <div>
                              <input type="radio" name="timeSlots" id={`timeSlot-${index}`} />
                              <label htmlFor={`timeSlot-${index}`}>
                                {getStandardTime(new Date(startTime || '').getTime().toString())} -
                                {getStandardTime(new Date(endTime || '').getTime().toString())}
                              </label>
                            </div>
                          </li>
                        )
                      }) : (
                        <Typography>{NO_SLOT_AVAILABLE}</Typography>
                      )}
                    </ul>
                  )}
                </CardComponent>
              </Grid>

              <Box pb={3} />

              <CardComponent cardTitle={PATIENT_CONDITION}>
                {getAppointmentLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                  <>
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Controller
                          name='employment'
                          control={control}
                          render={() => (
                            <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
                              <InputLabel shrink>{EMPLOYMENT}</InputLabel>

                              <label className="toggle-main">
                                <Box color={isEmployment ? WHITE : GRAY_TWO}>Yes</Box>
                                <AntSwitch checked={isEmployment} onChange={(event) => { handleChange(event) }} name='employment' />
                                <Box color={isEmployment ? GRAY_TWO : WHITE}>No</Box>
                              </label>
                            </FormControl>
                          )}
                        />
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <Controller
                          name='autoAccident'
                          control={control}
                          render={() => (
                            <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
                              <InputLabel shrink>{AUTO_ACCIDENT}</InputLabel>

                              <label className="toggle-main">
                                <Box color={isAutoAccident ? WHITE : GRAY_TWO}>Yes</Box>
                                <AntSwitch checked={isAutoAccident} onChange={(event) => { handleChange(event) }} name='autoAccident' />
                                <Box color={isAutoAccident ? GRAY_TWO : WHITE}>No</Box>
                              </label>
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        <Controller
                          name='otherAccident'
                          control={control}
                          render={() => (
                            <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
                              <InputLabel shrink>{OTHER_ACCIDENT}</InputLabel>

                              <label className="toggle-main">
                                <Box color={isOtherAccident ? WHITE : GRAY_TWO}>Yes</Box>
                                <AntSwitch checked={isOtherAccident} onChange={(event) => { handleChange(event) }} name='otherAccident' />
                                <Box color={isOtherAccident ? GRAY_TWO : WHITE}>No</Box>
                              </label>
                            </FormControl>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </CardComponent>
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button type="submit" variant="contained" color="primary"
            disabled={updateAppointmentLoading || CreateAppointmentLoading}
          >
            {isEdit ? UPDATE_APPOINTMENT : CREATE_APPOINTMENT}

            {(updateAppointmentLoading || CreateAppointmentLoading) &&
              <CircularProgress size={20} color="inherit" />
            }
          </Button>
        </Box>
      </form>
    </FormProvider>
  );
};

export default AppointmentForm;
