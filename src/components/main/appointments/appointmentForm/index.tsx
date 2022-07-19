// packages block
import {
  ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer, useState
} from 'react';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Box, Button, Card, CircularProgress, colors, FormControl, Grid, InputLabel, Typography
} from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import AddPatientModal from './AddPatientModal';
import PageHeader from '../../../common/PageHeader';
import BackButton from '../../../common/BackButton';
import InputController from '../../../../controller';
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from '../../../common/ViewDataLoader';
import NoSlotsComponent from '../../../common/NoSlotsComponent';
import DoctorSelector from '../../../common/Selector/DoctorSelector';
import PatientSelector from '../../../common/Selector/PatientSelector';
import ServiceSelector from '../../../common/Selector/ServiceSelector';
import FacilitySelector from '../../../common/Selector/FacilitySelector';
// interfaces, graphql, constants block
import history from "../../../../history";
import { useChartingStyles } from '../../../../styles/chartingStyles';
import { AuthContext, FacilityContext, ListContext } from '../../../../context';
import { BLACK_FOUR, GRAY_ONE, GRAY_SIX, GREY_TWO, WHITE } from '../../../../theme';
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles";
import { AntSwitch } from '../../../../styles/publicAppointmentStyles/externalPatientStyles';
import { appointmentSchema, providerAppointmentSchema } from '../../../../validationSchemas';
import {
  ExtendedAppointmentInputProps, GeneralFormProps, multiOptionType
} from "../../../../interfacesTypes";
import {
  Action, ActionType, appointmentReducer, initialState, State
} from '../../../../reducers/appointmentReducer';
import {
  filterSlots, getScheduleStartTime, getStandardTime, getStandardTimeByMoment, getTimeFromTimestamps,
  isOnlyDoctor, isUserAdmin, renderItem, setRecord
} from "../../../../utils";
import {
  AppointmentCreateType, AppointmentStatus, BillingStatus,
  PaymentType, Slots, SlotsPayload, useCreateAppointmentMutation,
  useGetAppointmentLazyQuery, useGetSlotsLazyQuery, useUpdateAppointmentMutation
} from "../../../../generated/graphql";
import {
  CONFLICT_EXCEPTION, SLOT_ALREADY_BOOKED, CANT_BOOK_APPOINTMENT, OTHER_ACCIDENT, PATIENT, REASON,
  APPOINTMENT_BOOKED_SUCCESSFULLY, VIEW_APPOINTMENTS_ROUTE, APPOINTMENT_UPDATED_SUCCESSFULLY,
  APPOINTMENT_NOT_FOUND, DAYS, EMPTY_OPTION, APPOINTMENT_SLOT_ERROR_MESSAGE, AUTO_ACCIDENT,
  CANT_UPDATE_APPOINTMENT, ADD_PATIENT_MODAL, EDIT_APPOINTMENT, DASHBOARD_BREAD, NOTES, PROVIDER,
  APPOINTMENT_EDIT_BREAD, APPOINTMENT_NEW_BREAD, UPDATE_APPOINTMENT, CREATE_APPOINTMENT, TYPE,
  FACILITY, APPOINTMENT_TYPE, INFORMATION, CANCELLED_APPOINTMENT_EDIT_MESSAGE,
  PATIENT_CONDITION, EMPLOYMENT, APPOINTMENT, VIEW_APPOINTMENTS_BREAD, ADD_APPOINTMENT, YES, NO,
} from '../../../../constants';

const AppointmentForm: FC<GeneralFormProps> = ({ isEdit, id }) => {
  const { user, currentUser } = useContext(AuthContext)
  const chartingClasses = useChartingStyles()
  const classes = usePublicAppointmentStyles();

  const { facilityList } = useContext(ListContext)
  const params = new URLSearchParams(window.location.search);

  const { roles, facility, } = user || {}
  const { id: currentDoctor } = currentUser || {}
  const { id: userFacilityId, practiceId: userPracticeId } = facility || {}

  const isHigherAdmin = isUserAdmin(roles)
  const onlyDoctor = isOnlyDoctor(roles)
  const [appStartDate, setAppStartDate] = useState<string>(params.get('startDate') || '')

  const [appEndDate] = useState<string>(params.get('endDate') || '')
  const [pId] = useState<string>(params.get('patientId') || '')
  const [pName] = useState<string>(params.get('patientName') || '')
  const [serviceIds, setServiceId] = useState<multiOptionType[]>([])

  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState)
  const {
    fetchAllDoctorList, fetchAllServicesList, fetchAllPatientList
  } = useContext(FacilityContext)

  const appointmentTypes = [AppointmentCreateType.Appointment, AppointmentCreateType.Telehealth]
  const [appointmentType, setAppointmentType] = useState<string>(appointmentTypes[0])

  const {
    date, availableSlots, serviceId, offset, currentDate, isEmployment, isAutoAccident, isOtherAccident,
    facilityName, cancelAppStatus, patientName, openPatientModal, providerName, serviceName
  } = state

  const methods = useForm<ExtendedAppointmentInputProps>({
    mode: "all",
    resolver: yupResolver(appointmentType === AppointmentCreateType.Telehealth ?
      providerAppointmentSchema(onlyDoctor) : appointmentSchema(isUserAdmin(roles)))
  });

  const { reset, setValue, handleSubmit, watch, control } = methods;
  const {
    serviceId: selectedServiceId,
    providerId: { id: selectedProvider } = {},
    facilityId: { id: selectedFacility, name: selectedFacilityName } = {},
    patientId: selectedPatient, scheduleStartDateTime
  } = watch();
  const { value: selectedService } = selectedServiceId ?? {}
  const scheduleStartTime = getScheduleStartTime(scheduleStartDateTime)

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
            employment, autoAccident, otherAccident, appointmentType, facility, provider, patient, status,
            appointmentCreateType
          } = appointment || {}

          if (status === AppointmentStatus.Cancelled) {
            dispatch({ type: ActionType.SET_CANCEL_APP_STATUS, cancelAppStatus: true })
          }

          const { id: facilityId, name: facilityName } = facility || {};
          const { id: serviceId, name: serviceName } = appointmentType || {};
          const { id: patientId, firstName: patientFN, lastName: patientLN } = patient || {};
          const { id: providerId, firstName: providerFN, lastName: providerLN } = provider || {};

          if (facilityId && facilityName) {
            setValue('facilityId', setRecord(facilityId, facilityName))
            dispatch({ type: ActionType.SET_FACILITY_NAME, facilityName })
          }

          if (serviceId && serviceName) {
            dispatch({ type: ActionType.SET_SERVICE_NAME, serviceName })
            setValue('serviceId', {
              value: serviceId,
              label: serviceName
            })

            setServiceId([{
              value: serviceId,
              label: serviceName
            }])
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
          scheduleStartDateTime && setValue('scheduleEndDateTime', getStandardTimeByMoment(scheduleStartDateTime))
          scheduleEndDateTime && setValue('scheduleStartDateTime', getStandardTimeByMoment(scheduleEndDateTime))
          appointmentCreateType && setAppointmentType(appointmentCreateType)

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
      message === CONFLICT_EXCEPTION ?
        Alert.error(SLOT_ALREADY_BOOKED)
        : Alert.error(message || CANT_BOOK_APPOINTMENT)
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
          getSlots: selectedProvider || onlyDoctor ?
            { providerId: onlyDoctor ? currentDoctor : selectedProvider, ...slotsInput }
            : { facilityId: selectedFacility, ...slotsInput }
        }
      })
    }
  }, [
    currentDate, offset, selectedFacility, date, selectedProvider, selectedService, serviceId, watch,
    getSlots, appStartDate, setValue, appEndDate, onlyDoctor, currentDoctor
  ])

  const fetchList = useCallback((id: string, name: string) => {
    reset({
      serviceId: { value: '', label: '' },
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

    const durationOfDays = moment(date).diff(moment(scheduleStartDateTime), 'days')
    const scStartTimeStamps = moment(scheduleStartDateTime).add(durationOfDays, 'day').format().toString()
    const scEndTimeStamps = moment(scheduleEndDateTime).add(durationOfDays, 'day').format().toString()

    if (!scheduleStartDateTime || !scheduleEndDateTime) {
      Alert.error(APPOINTMENT_SLOT_ERROR_MESSAGE)
    } else {
      const { id: selectedPatient } = patientId || {};
      const { id: selectedProvider } = providerId || {};
      const { id: selectedFacility } = facilityId || {};
      const { value: selectedService } = serviceId || {};

      let practiceId = userPracticeId || '';
      if (selectedFacility) {
        const facility = facilityList?.filter(f => f?.id === selectedFacility)[0];
        const { practiceId: pId } = facility || {};

        practiceId = pId || ''
      }

      const appointmentInput = {
        reason, scheduleStartDateTime: scStartTimeStamps, practiceId,
        scheduleEndDateTime: scEndTimeStamps, autoAccident: autoAccident || false,
        otherAccident: otherAccident || false, primaryInsurance, secondaryInsurance,
        notes, facilityId: isHigherAdmin ? selectedFacility : userFacilityId, patientId: selectedPatient,
        appointmentTypeId: selectedService, employment: employment || false, paymentType: PaymentType.Self,
        billingStatus: BillingStatus.Due, appointmentCreateType: appointmentType as AppointmentCreateType
      };

      const payload = onlyDoctor ? { ...appointmentInput, providerId: currentDoctor } : selectedProvider ?
        { ...appointmentInput, providerId: selectedProvider } : { ...appointmentInput }

      if (isEdit) {
        id ?
          cancelAppStatus ?
            Alert.info(CANCELLED_APPOINTMENT_EDIT_MESSAGE)
            : await updateAppointment({
              variables: { updateAppointmentInput: { id, ...payload } }
            }) : Alert.error(CANT_UPDATE_APPOINTMENT)
      } else {
        await createAppointment({
          variables: { createAppointmentInput: { ...payload } }
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

  useEffect(() => {
    setValue('scheduleEndDateTime', '')
    setValue('scheduleStartDateTime', '')
  }, [date, selectedService, selectedFacility, setValue, selectedProvider])

  useEffect(() => { }, [date, appStartDate])

  const handleAppointmentType = (type: string) => setAppointmentType(type)

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" alignItems="flex-start">
            <Box display="flex">
              <BackButton to={`${VIEW_APPOINTMENTS_ROUTE}`} />

              <Box ml={2}>
                <PageHeader
                  title={isEdit ? EDIT_APPOINTMENT : ADD_APPOINTMENT}
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
                <Card className='overflowVisible'>
                  <Box p={3}>
                    <Box py={2} mb={4} display='flex' justifyContent='space-between'
                      alignItems='center' borderBottom={`1px solid ${colors.grey[300]}`}
                    >
                      <Typography variant='h4'>{APPOINTMENT}</Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item md={12} sm={12} xs={12}>
                        <Typography variant='body1'>{TYPE}</Typography>

                        <Box className={chartingClasses.toggleProblem}>
                          <Box p={1} mb={3} display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                            {appointmentTypes.map(type =>
                              <Box onClick={() => handleAppointmentType(type)}
                                className={type === appointmentType ? 'selectedBox selectBox' : 'selectBox'}
                              >
                                <Typography variant='h6'>{type}</Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Grid>

                      {!onlyDoctor && <Grid item md={6} sm={12} xs={12}>
                        {isEdit ? renderItem(FACILITY, facilityName, false, getAppointmentLoading)
                          : <FacilitySelector
                            isRequired
                            label={FACILITY}
                            name="facilityId"
                          />
                        }
                      </Grid>}

                      <Grid item md={6} sm={12} xs={12}>
                        {isEdit ? renderItem(APPOINTMENT_TYPE, serviceName, false, getAppointmentLoading) :
                          <ServiceSelector
                            isRequired
                            name="serviceId"
                            isEdit={isEdit}
                            label={APPOINTMENT_TYPE}
                            defaultValues={serviceIds}
                            loading={getAppointmentLoading}
                            facilityId={isHigherAdmin ? selectedFacility : userFacilityId || ''}
                          />
                        }
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
                <Box pb={3} />

                <CardComponent cardTitle={INFORMATION}>
                  <>
                    <Grid container spacing={3}>
                      {!onlyDoctor &&
                        <Grid item md={6} sm={12} xs={12}>
                          {isEdit ? renderItem(PROVIDER, providerName, false, getAppointmentLoading) :
                            <DoctorSelector
                              addEmpty
                              label={PROVIDER}
                              name="providerId"
                              facilityId={selectedFacility}
                              loading={getAppointmentLoading}
                            />
                          }
                        </Grid>
                      }

                      <Grid item md={6} sm={12} xs={12}>
                        {isEdit ? renderItem(PATIENT, patientName, false, getAppointmentLoading) :
                          <PatientSelector
                            isModal
                            isRequired
                            label={PATIENT}
                            name="patientId"
                            styles='log-class'
                            setValue={setValue}
                            isOpen={openPatientModal}
                            handlePatientModal={handlePatientModal}
                          />
                        }
                      </Grid>
                    </Grid>

                    <InputController
                      fieldType="text"
                      controllerName="reason"
                      controllerLabel={REASON}
                      loading={getAppointmentLoading}
                    />

                    {/* <Grid container spacing={3}>
                        <Grid item md={6} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="primaryInsurance"
                            controllerLabel={PRIMARY_INSURANCE}
                          />
                        </Grid>

                        <Grid item md={6} sm={12} xs={12}>
                          <InputController
                            fieldType="text"
                            controllerName="secondaryInsurance"
                            controllerLabel={SECONDARY_INSURANCE}
                          />
                        </Grid>
                      </Grid> */}

                    <InputController
                      multiline
                      fieldType="text"
                      controllerName="notes"
                      controllerLabel={NOTES}
                      loading={getAppointmentLoading}
                    />
                  </>
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
                          const startDateTime = getStandardTime(new Date(startTime || '').getTime().toString())

                          return (
                            <li key={index}>
                              <Box py={1.375} textAlign={'center'} border={`1px solid ${GRAY_ONE}`} borderRadius={6}
                                bgcolor={startDateTime === scheduleStartTime ? GREY_TWO : WHITE}
                                color={startDateTime === scheduleStartTime ? WHITE : BLACK_FOUR}
                                className={classes.timeSlot}
                                onClick={() => handleSlot(slot)}>
                                {getStandardTime(new Date(startTime || '').getTime().toString())} -{' '}
                                {getStandardTime(new Date(endTime || '').getTime().toString())}
                              </Box>
                            </li>
                          )
                        }) : (
                          <NoSlotsComponent />
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
                        <Grid item lg={6} md={12} sm={12} xs={12}>
                          <Controller
                            name='employment'
                            control={control}
                            render={() => (
                              <FormControl fullWidth margin="normal" className={classes.toggleContainer}>
                                <InputLabel shrink>{EMPLOYMENT}</InputLabel>

                                <label className="toggle-main">
                                  <Box color={isEmployment ? WHITE : GREY_TWO}>{YES}</Box>
                                  <AntSwitch
                                    name='employment'
                                    checked={isEmployment}
                                    onChange={(event) => { handleChange(event) }}
                                  />

                                  <Box color={isEmployment ? GREY_TWO : WHITE}>{NO}</Box>
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
                                  <Box color={isAutoAccident ? WHITE : GREY_TWO}>{YES}</Box>
                                  <AntSwitch
                                    name='autoAccident'
                                    checked={isAutoAccident}
                                    onChange={(event) => { handleChange(event) }}
                                  />

                                  <Box color={isAutoAccident ? GREY_TWO : WHITE}>{NO}</Box>
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
                                  <AntSwitch checked={isOtherAccident}
                                    onChange={(event) => { handleChange(event) }} name='otherAccident'
                                  />

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
        setIsOpen={(open: boolean) =>
          dispatch({ type: ActionType.SET_OPEN_PATIENT_MODAL, openPatientModal: open })}
      />
    </>
  );
};

export default AppointmentForm;
