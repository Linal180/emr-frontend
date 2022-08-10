// packages block
import DateFnsUtils from '@date-io/date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Button, CircularProgress, FormControl, Grid, InputLabel, Typography
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import moment from 'moment';
import {
  ChangeEvent, FC, Reducer, useCallback, useContext, useEffect, useReducer, useState
} from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
// components block
import InputController from '../../../../controller';
import Alert from "../../../common/Alert";
import BackButton from '../../../common/BackButton';
import CardComponent from "../../../common/CardComponent";
import NoSlotsComponent from '../../../common/NoSlotsComponent';
import PageHeader from '../../../common/PageHeader';
import DoctorSelector from '../../../common/Selector/DoctorSelector';
import FacilitySelector from '../../../common/Selector/FacilitySelector';
import PatientSelector from '../../../common/Selector/PatientSelector';
import ServiceSelector from '../../../common/Selector/ServiceSelector';
import ViewDataLoader from '../../../common/ViewDataLoader';
import AddPatientModal from './AddPatientModal';
// interfaces, graphql, constants block
import {
  ADD_APPOINTMENT, ADD_PATIENT_MODAL, APPOINTMENT, APPOINTMENT_BOOKED_SUCCESSFULLY,
  APPOINTMENT_EDIT_BREAD, APPOINTMENT_NEW_BREAD, APPOINTMENT_NOT_FOUND, APPOINTMENT_SLOT_ERROR_MESSAGE,
  APPOINTMENT_TYPE, APPOINTMENT_UPDATED_SUCCESSFULLY, AUTO_ACCIDENT, CANCELLED_APPOINTMENT_EDIT_MESSAGE,
  CANT_BOOK_APPOINTMENT, CANT_UPDATE_APPOINTMENT, CONFLICT_EXCEPTION, CREATE_APPOINTMENT, DASHBOARD_BREAD, DAYS,
  EDIT_APPOINTMENT, EMPLOYMENT, EMPTY_OPTION, FACILITY, INFORMATION, NO, NOTES, OTHER_ACCIDENT, PATIENT, PATIENT_CONDITION,
  PROVIDER, REASON, SLOT_ALREADY_BOOKED, TYPE, UPDATE_APPOINTMENT, VIEW_APPOINTMENTS_BREAD, VIEW_APPOINTMENTS_ROUTE, YES
} from '../../../../constants';
import { AuthContext, FacilityContext, ListContext } from '../../../../context';
import {
  AppointmentCreateType, AppointmentStatus, BillingStatus,
  PaymentType, Slots, useCreateAppointmentMutation,
  useGetAppointmentLazyQuery, useGetSlotsLazyQuery, useUpdateAppointmentMutation
} from "../../../../generated/graphql";
import history from "../../../../history";
import {
  ExtendedAppointmentInputProps, GeneralFormProps, multiOptionType
} from "../../../../interfacesTypes";
import {
  Action, ActionType, appointmentReducer, initialState, State
} from '../../../../reducers/appointmentReducer';
import {
  getScheduleStartTime, getStandardTime, getStandardTimeByMoment, getTimeFromTimestamps,
  isOnlyDoctor, isUserAdmin, renderItem, setRecord
} from "../../../../utils";
import { usePublicAppointmentStyles } from '../../../../styles/publicAppointmentStyles';
import { useTableStyles } from '../../../../styles/tableStyles';
import { appointmentSchema, providerAppointmentSchema } from '../../../../validationSchemas';
import { BLACK_FOUR, GRAY_ONE, GRAY_SIX, GREY_TWO, WHITE } from '../../../../theme';
import { AntSwitch } from '../../../../styles/publicAppointmentStyles/externalPatientStyles';

const AppointmentForm: FC<GeneralFormProps> = ({ isEdit, id }) => {
  const { user, currentUser } = useContext(AuthContext)
  const tableClasses = useTableStyles();
  const classes = usePublicAppointmentStyles();

  const { facilityList } = useContext(ListContext)
  const params = new URLSearchParams(window.location.search);

  const { roles, facility, } = user || {}
  const { id: currentDoctor } = currentUser || {}
  const { id: userFacilityId, name: userFacilityName, practiceId: userPracticeId } = facility || {}

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
          appointmentCreateType && setAppointmentType(appointmentCreateType)

          dispatch({ type: ActionType.SET_IS_EMPLOYMENT, isEmployment: employment as boolean })
          dispatch({ type: ActionType.SET_IS_AUTO_ACCIDENT, isAutoAccident: autoAccident as boolean })
          dispatch({ type: ActionType.SET_IS_OTHER_ACCIDENT, isOtherAccident: otherAccident as boolean })
          dispatch({
            type: ActionType.SET_DATE,
            date: new Date(getTimeFromTimestamps(scheduleStartDateTime || '')) as MaterialUiPickersDate
          });

          scheduleEndDateTime && setValue('scheduleEndDateTime', getStandardTimeByMoment(scheduleEndDateTime))
          scheduleStartDateTime && setValue('scheduleStartDateTime', getStandardTimeByMoment(scheduleStartDateTime))
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
            availableSlots: slots
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
            : { facilityId: isHigherAdmin ? selectedFacility : userFacilityId || '', ...slotsInput }
        }
      })
    }
  }, [currentDate, offset, selectedFacility, date, selectedProvider, selectedService, serviceId, watch, getSlots, appStartDate, setValue, appEndDate, onlyDoctor, currentDoctor, isHigherAdmin, userFacilityId])

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

    const dateToFormat = appStartDate ? appStartDate : date
    const transformedStartTime = moment(`${moment(dateToFormat)
      .format("MM-DD-YYYY")} ${moment(scheduleStartDateTime).format("HH:mm:ss a")}`, 'MM-DD-YYYY HH:mm:ss a').toISOString()

    const transformedEndTime = moment(`${moment(dateToFormat)
      .format("MM-DD-YYYY")} ${moment(scheduleEndDateTime).format("HH:mm:ss a")}`, 'MM-DD-YYYY HH:mm:ss a').toISOString()

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
        reason, scheduleStartDateTime: transformedStartTime, practiceId, patientId: selectedPatient,
        scheduleEndDateTime: transformedEndTime, autoAccident: autoAccident || false, notes,
        otherAccident: otherAccident || false, primaryInsurance, secondaryInsurance,
        facilityId: isHigherAdmin ? selectedFacility : userFacilityId, billingStatus: BillingStatus.Due,
        appointmentTypeId: selectedService, employment: employment || false, paymentType: PaymentType.Self,
        appointmentCreateType: appointmentType as AppointmentCreateType
      };

      const payload = onlyDoctor ? { ...appointmentInput, providerId: currentDoctor } : selectedProvider ?
        { ...appointmentInput, providerId: selectedProvider } : { ...appointmentInput }

      if (isEdit) {
        id ?
          cancelAppStatus ?
            Alert.info(CANCELLED_APPOINTMENT_EDIT_MESSAGE)
            : await updateAppointment({
              variables: { updateAppointmentInput: { id, ...payload, status: AppointmentStatus.Scheduled } }
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

  const setScheduleEmpty = useCallback(() => {
    setValue('scheduleEndDateTime', '')
    setValue('scheduleStartDateTime', '')
  }, [setValue])

  useEffect(() => {
    setScheduleEmpty()
  }, [date, selectedService, selectedFacility, selectedProvider, setScheduleEmpty])

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
              <Grid item md={8} sm={12} xs={12}>
                <CardComponent cardTitle={APPOINTMENT}>
                  <Grid container spacing={3}>
                    <Grid item md={12} sm={12} xs={12}>
                      <Typography variant='body1'>{TYPE}</Typography>

                      <Box px={1} py={0.8} mt={1} mb={2} width='fit-content' display='flex' border={`1px solid ${GRAY_SIX}`} borderRadius={6}>
                        {appointmentTypes.map(type =>
                          <Box onClick={() => handleAppointmentType(type)}
                            className={type === appointmentType ? `${tableClasses.selectedBox} ${tableClasses.selectBox}` : tableClasses.selectBox}
                          >
                            <Typography variant='h6'>{type}</Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      {isHigherAdmin ?
                        isEdit ? renderItem(FACILITY, facilityName, false, getAppointmentLoading)
                          : <FacilitySelector
                            isRequired
                            label={FACILITY}
                            name="facilityId"
                          />
                        : renderItem(FACILITY, userFacilityName, false, getAppointmentLoading)}
                    </Grid>

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
                </CardComponent>

                <Box p={2} />

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
                              isRequired={appointmentType === AppointmentCreateType.Telehealth}
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

              <Grid item md={4} sm={12} xs={12}>
                <CardComponent cardTitle="Available Slots">
                  <Box display="flex" justifyContent="center">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        variant="static"
                        openTo="date"
                        value={appStartDate ? appStartDate : date}
                        autoOk
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
                        const isSelected = startDateTime === scheduleStartTime

                        return (
                          <li key={index}>
                            <Box py={1.375} textAlign={'center'} border={`1px solid ${GRAY_ONE}`} borderRadius={6}
                              bgcolor={isSelected ? GREY_TWO : WHITE}
                              color={isSelected ? WHITE : BLACK_FOUR}
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
