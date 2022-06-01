// packages block
import { useEffect, FC, useContext, Reducer, useReducer, useCallback, ChangeEvent, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, Typography } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import AddPatientModal from './AddPatientModal';
import BackButton from '../../../common/BackButton';
import PageHeader from '../../../common/PageHeader';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
import DoctorSelector from '../../../common/Selector/DoctorSelector';
import PatientSelector from '../../../common/Selector/PatientSelector';
import ServiceSelector from '../../../common/Selector/ServiceSelector';
import FacilitySelector from '../../../common/Selector/FacilitySelector';
// interfaces, graphql, constants block
import history from "../../../../history";
import { GREY_TWO, WHITE } from '../../../../theme';
import { appointmentSchema } from '../../../../validationSchemas';
import { FacilityContext, ListContext } from '../../../../context';
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles";
import { AntSwitch } from '../../../../styles/publicAppointmentStyles/externalPatientStyles';
import { ExtendedAppointmentInputProps, GeneralFormProps } from "../../../../interfacesTypes";
import {
  appointmentReducer, Action, initialState, State, ActionType
} from '../../../../reducers/appointmentReducer';
import {
  getTimeFromTimestamps, setRecord, getStandardTime, renderItem, getCurrentTimestamps, filterSlots
} from "../../../../utils";
import {
  PaymentType, Slots, useCreateAppointmentMutation, useGetAppointmentLazyQuery, useUpdateAppointmentMutation,
  useGetSlotsLazyQuery, Appointmentstatus, SlotsPayload, BillingStatus,
} from "../../../../generated/graphql";
import {
  FACILITY, PROVIDER, EMPTY_OPTION, UPDATE_APPOINTMENT, CREATE_APPOINTMENT, CANT_BOOK_APPOINTMENT,
  APPOINTMENT_BOOKED_SUCCESSFULLY, APPOINTMENT_UPDATED_SUCCESSFULLY, SLOT_ALREADY_BOOKED,
  APPOINTMENT_NOT_FOUND, CANT_UPDATE_APPOINTMENT, APPOINTMENT, APPOINTMENT_TYPE, INFORMATION,
  PATIENT, REASON, NOTES, PRIMARY_INSURANCE, SECONDARY_INSURANCE, PATIENT_CONDITION, EMPLOYMENT,
  AUTO_ACCIDENT, OTHER_ACCIDENT, VIEW_APPOINTMENTS_ROUTE, APPOINTMENT_SLOT_ERROR_MESSAGE, CONFLICT_EXCEPTION,
  CANCELLED_APPOINTMENT_EDIT_MESSAGE, DAYS, EDIT_APPOINTMENT, DASHBOARD_BREAD, VIEW_APPOINTMENTS_BREAD,
  APPOINTMENT_NEW_BREAD, NO_SLOT_AVAILABLE, APPOINTMENT_EDIT_BREAD, ADD_PATIENT_MODAL,
} from "../../../../constants";

const AppointmentForm: FC<GeneralFormProps> = ({ isEdit, id }) => {
  const classes = usePublicAppointmentStyles();
  const { facilityList } = useContext(ListContext)
  const params = new URLSearchParams(window.location.search);
  const [appStartDate, setAppStartDate] = useState<string>(params.get('startDate') || '')
  const [appEndDate] = useState<string>(params.get('endDate') || '')
  const [pId] = useState<string>(params.get('patientId') || '')
  const [pName] = useState<string>(params.get('patientName') || '')
  const {
    fetchAllDoctorList, fetchAllServicesList, fetchAllPatientList
  } = useContext(FacilityContext)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const {
    date, availableSlots, serviceId, offset, currentDate, isEmployment, isAutoAccident, isOtherAccident,
    facilityName, cancelAppStatus, patientName, openPatientModal
  } = state

  const methods = useForm<ExtendedAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(appointmentSchema)
  });
  const { reset, setValue, handleSubmit, watch, control } = methods;
  const {
    serviceId: { id: selectedService } = {},
    providerId: { id: selectedProvider } = {},
    facilityId: { id: selectedFacility, name: selectedFacilityName } = {},
    patientId: selectedPatient
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

    async onCompleted(data) {
      const { getAppointment: { response, appointment } } = data;

      if (response) {
        const { status } = response

        if (appointment && status && status === 200) {
          const {
            reason, scheduleStartDateTime, scheduleEndDateTime, notes, primaryInsurance, secondaryInsurance,
            employment, autoAccident, otherAccident, appointmentType, facility, provider, patient, status
          } = appointment || {}

          if (status === Appointmentstatus.Cancelled) {
            dispatch({ type: ActionType.SET_CANCEL_APP_STATUS, cancelAppStatus: true })
          }

          const { id: facilityId, name: facilityName } = facility || {};
          const { id: serviceId, name: serviceName } = appointmentType || {};
          const { id: patientId, firstName: patientFN, lastName: patientLN } = patient || {};
          const { id: providerId, firstName: providerFN, lastName: providerLN } = provider || {};


          scheduleEndDateTime && setValue('scheduleEndDateTime', getTimeFromTimestamps(scheduleEndDateTime))
          scheduleStartDateTime && setValue('scheduleStartDateTime', getTimeFromTimestamps(scheduleStartDateTime))


          if (facilityId && facilityName) {
            setValue('facilityId', setRecord(facilityId, facilityName))
            dispatch({ type: ActionType.SET_FACILITY_NAME, facilityName })
          }

          if (serviceId && serviceName) {
            dispatch({ type: ActionType.SET_SERVICE_NAME, serviceName })
            setValue('serviceId', setRecord(serviceId, serviceName))
          }

          if (providerId) {
            setValue('providerId', setRecord(providerId, `${providerFN} ${providerLN}`))
            dispatch({ type: ActionType.SET_PROVIDER_NAME, providerName: `${providerFN} ${providerLN}` })
          }

          if (patientId) {
            setValue('patientId', setRecord(patientId, `${patientFN} ${patientLN}`))
            dispatch({ type: ActionType.SET_PATIENT_NAME, patientName: `${patientFN} ${patientLN}` })
          }

          notes && setValue('notes', notes)
          reason && setValue('reason', reason)
          setValue('employment', Boolean(employment))
          setValue('autoAccident', Boolean(autoAccident))
          setValue('otherAccident', Boolean(otherAccident))
          primaryInsurance && setValue('primaryInsurance', primaryInsurance)
          secondaryInsurance && setValue('secondaryInsurance', secondaryInsurance)

          dispatch({ type: ActionType.SET_IS_EMPLOYMENT, isEmployment: employment as boolean })
          dispatch({ type: ActionType.SET_IS_AUTO_ACCIDENT, isAutoAccident: autoAccident as boolean })
          dispatch({ type: ActionType.SET_IS_OTHER_ACCIDENT, isOtherAccident: otherAccident as boolean })
          dispatch({
            type: ActionType.SET_DATE,
            date: new Date(getTimeFromTimestamps(scheduleStartDateTime || '')) as MaterialUiPickersDate
          });
        }
      }
    }
  });

  const [getSlots, { loading: getSlotsLoading }] = useGetSlotsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] })
    },

    onCompleted(data) {
      const { getSlots } = data || {}

      if (getSlots) {
        const { slots } = getSlots;

        if (slots) {
          dispatch({
            type: ActionType.SET_AVAILABLE_SLOTS,
            availableSlots: filterSlots(slots, appStartDate ? appStartDate : date) as SlotsPayload['slots']
          })

        } else { dispatch({ type: ActionType.SET_AVAILABLE_SLOTS, availableSlots: [] }); }
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

  const fetchAppointment = useCallback(async () => {
    id && await getAppointment({
      variables: { getAppointment: { id } }
    })
  }, [getAppointment, id])

  useEffect(() => {
    if (isEdit) {
      id ? fetchAppointment() : Alert.error(APPOINTMENT_NOT_FOUND)
    } else {
      setValue('employment', false)
      setValue('autoAccident', false)
      setValue('otherAccident', false)
    }
  }, [fetchAppointment, id, isEdit, setValue])

  useEffect(() => {
    if (selectedService && date) {
      const days = [DAYS.Sunday, DAYS.Monday, DAYS.Tuesday, DAYS.Wednesday, DAYS.Thursday, DAYS.Friday, DAYS.Saturday];
      const currentDay = appStartDate ? new Date(appStartDate).getDay() : new Date(date).getDay()
      const slotsInput = {
        offset, currentDate: appStartDate ? new Date(appStartDate).toString() : date.toString(),
        serviceId: selectedService, day: days[currentDay]
      };

      getSlots({
        variables: {
          getSlots: selectedProvider ? { providerId: selectedProvider, ...slotsInput } : { facilityId: selectedFacility, ...slotsInput }
        }
      })
    }
  }, [
    currentDate, offset, selectedFacility, date, selectedProvider, selectedService, serviceId, watch,
    getSlots, appStartDate, setValue, appEndDate
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

      let practiceId = '';
      if (selectedFacility) {
        const facility = facilityList?.filter(f => f?.id === selectedFacility)[0];
        const { practiceId: pId } = facility || {};

        practiceId = pId || ''
      }

      const appointmentInput = {
        reason, scheduleStartDateTime: getCurrentTimestamps(scheduleStartDateTime,
          appStartDate ? new Date(appStartDate).toString() : date?.toString()), practiceId,
        scheduleEndDateTime: getCurrentTimestamps(scheduleEndDateTime,
          appStartDate ? new Date(appStartDate).toString() : date?.toString()), autoAccident: autoAccident || false,
        otherAccident: otherAccident || false, primaryInsurance, secondaryInsurance,
        notes, facilityId: selectedFacility, patientId: selectedPatient, appointmentTypeId: selectedService,
        employment: employment || false, paymentType: PaymentType.Self, billingStatus: BillingStatus.Due
      };

      const payload = selectedProvider ?
        { ...appointmentInput, providerId: selectedProvider } : { ...appointmentInput }

      if (isEdit) {
        id ?
          cancelAppStatus ?
            Alert.info(CANCELLED_APPOINTMENT_EDIT_MESSAGE)
            :
            await updateAppointment({
              variables: { updateAppointmentInput: { id, ...payload } }
            })
          : Alert.error(CANT_UPDATE_APPOINTMENT)
      } else {
        await createAppointment({
          variables: { createAppointmentInput: { ...payload, isExternal: true } }
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

  const handlePatientModal = () => {
    dispatch({ type: ActionType.SET_OPEN_PATIENT_MODAL, openPatientModal: true })
  }

  useEffect(() => {
    const { id } = selectedPatient ?? {}

    id === ADD_PATIENT_MODAL && handlePatientModal()
  }, [selectedPatient])

  const dateHandler = (currentDate: MaterialUiPickersDate) => {
    setAppStartDate('')
    dispatch({ type: ActionType.SET_DATE, date: currentDate })
  }

  useEffect(() => {
    setValue('patientId', setRecord(pId, pName))
  }, [pId, pName, setValue])

  useEffect(() => { }, [date, appStartDate])

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box display="flex">
              <BackButton to={`${VIEW_APPOINTMENTS_ROUTE}`} />

              <Box ml={2}>
                <PageHeader
                  title={EDIT_APPOINTMENT}
                  path={[DASHBOARD_BREAD, VIEW_APPOINTMENTS_BREAD,
                    isEdit ? APPOINTMENT_EDIT_BREAD : APPOINTMENT_NEW_BREAD
                  ]}
                />
              </Box>
            </Box>

            <Button type="submit" variant="contained" color="primary"
              disabled={updateAppointmentLoading || CreateAppointmentLoading}
            >
              {isEdit ? UPDATE_APPOINTMENT : CREATE_APPOINTMENT}

              {(updateAppointmentLoading || CreateAppointmentLoading) &&
                <CircularProgress size={20} color="inherit" />
              }
            </Button>
          </Box>

          <Box maxHeight="calc(100vh - 190px)" className="overflowY-auto">
            <Grid container spacing={3}>
              <Grid md={8} item>
                <CardComponent cardTitle={APPOINTMENT}>
                  {getAppointmentLoading ? <ViewDataLoader rows={5} columns={6} hasMedia={false} /> : (
                    <Grid container spacing={3}>
                      <Grid item md={6} sm={12} xs={12}>
                        {isEdit ? renderItem(FACILITY, facilityName) :
                          <FacilitySelector
                            isRequired
                            label={FACILITY}
                            name="facilityId"
                          />
                        }
                      </Grid>

                      <Grid item md={6} sm={12} xs={12}>
                        <ServiceSelector
                          isRequired
                          label={APPOINTMENT_TYPE}
                          name="serviceId"
                          facilityId={selectedFacility}
                          addEmpty
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
                          <DoctorSelector
                            label={PROVIDER}
                            name="providerId"
                            facilityId={selectedFacility}
                            addEmpty
                          />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          {isEdit ? renderItem(PATIENT, patientName) :
                            <PatientSelector
                              handlePatientModal={handlePatientModal}
                              isModal
                              isRequired
                              label={PATIENT}
                              name="patientId"
                              setValue={setValue}
                              isOpen={openPatientModal}
                            />}
                        </Grid>
                      </Grid>

                      <InputController
                        fieldType="text"
                        controllerName="reason"
                        controllerLabel={REASON}
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

                      <InputController
                        multiline
                        fieldType="text"
                        controllerName="notes"
                        controllerLabel={NOTES}
                      />
                    </>
                  )}
                </CardComponent>
              </Grid>

              <Grid md={4} item>
                <Grid item md={12} sm={12} className="custom-calendar">
                  <CardComponent cardTitle="Available Slots">
                    <Box display="flex" justifyContent="center">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                          variant="static"
                          openTo="date"
                          value={appStartDate ? appStartDate : date}
                          autoOk
                          disablePast
                          fullWidth
                          disableToolbar
                          onChange={(currentDate) => { dateHandler(currentDate) }}
                        />

                      </MuiPickersUtilsProvider>
                    </Box>

                    {getSlotsLoading ? <ViewDataLoader rows={3} columns={6} hasMedia={false} /> : (
                      <ul className={classes.timeSlots}>
                        {!!availableSlots?.length ? availableSlots.map((slot: Slots, index: number) => {
                          const { startTime, endTime } = slot || {}

                          return (
                            <li onClick={() => handleSlot(slot)} key={index}>
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
                                  <Box color={isEmployment ? WHITE : GREY_TWO}>Yes</Box>
                                  <AntSwitch checked={isEmployment} onChange={(event) => { handleChange(event) }} name='employment' />
                                  <Box color={isEmployment ? GREY_TWO : WHITE}>No</Box>
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
                                  <Box color={isAutoAccident ? WHITE : GREY_TWO}>Yes</Box>
                                  <AntSwitch checked={isAutoAccident} onChange={(event) => { handleChange(event) }} name='autoAccident' />
                                  <Box color={isAutoAccident ? GREY_TWO : WHITE}>No</Box>
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
                                  <Box color={isOtherAccident ? WHITE : GREY_TWO}>Yes</Box>
                                  <AntSwitch checked={isOtherAccident} onChange={(event) => { handleChange(event) }} name='otherAccident' />
                                  <Box color={isOtherAccident ? GREY_TWO : WHITE}>No</Box>
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
        </form>
      </FormProvider>

      <AddPatientModal
        facilityId={selectedFacility}
        isOpen={openPatientModal}
        setIsOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_PATIENT_MODAL, openPatientModal: open })}
      />
    </>
  );
};

export default AppointmentForm;
