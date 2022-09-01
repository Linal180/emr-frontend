// packages block
import { FC, useCallback, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  Box, Button, Checkbox, CircularProgress, Dialog, FormControl, FormControlLabel, FormGroup,
  Grid, InputLabel, Typography
} from "@material-ui/core";
// components block
import Alert from "../Alert";
import DatePicker from "../DatePicker";
import TimePicker from "../TimePicker";
import CardComponent from "../CardComponent";
import ServiceSelector from "../Selector/ServiceSelector";
// interfaces/types block, theme, svgs and constants
import { AuthContext } from '../../../context';
import { GREY_SEVEN, WHITE } from "../../../theme";
import { scheduleSchema } from "../../../validationSchemas";
import { ActionType } from "../../../reducers/scheduleReducer";
import { usePublicAppointmentStyles } from "../../../styles/publicAppointmentStyles";
import { AntSwitch } from "../../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  useCreateScheduleMutation, useGetScheduleLazyQuery, useUpdateScheduleMutation
} from "../../../generated/graphql";
import {
  multiOptionType, ParamsType, ScheduleFormProps, ScheduleInputProps
} from "../../../interfacesTypes";
import {
  checkPermission, getDayFromTimestamps, getTimeString, invalidMessage, renderItem,
  renderLoading, setTimeDay, timeValidation
} from "../../../utils";
import {
  APPOINTMENT_TYPE, CANCEL, CREATE_SCHEDULE, DAY, END_DATE, WEEK_DAYS, YES, END_TIME,
  SELECT_DAY_MESSAGE, CANT_UPDATE_SCHEDULE, CANT_CREATE_SCHEDULE, PICK_DAY_TEXT, NO,
  SCHEDULE_CREATED_SUCCESSFULLY, SCHEDULE_NOT_FOUND, SCHEDULE_UPDATED_SUCCESSFULLY,
  START_TIME, UPDATE_SCHEDULE, USER_PERMISSIONS, WANT_RECURRING, FACILITY_SCHEDULE,
  DOCTOR_SCHEDULE, PERMISSION_DENIED,
} from "../../../constants";

const ScheduleModal: FC<ScheduleFormProps> = ({
  isDoctor, id, scheduleDispatch, doctorFacilityId, isOpen, reload, isEdit, state
}) => {
  const classesToggle = usePublicAppointmentStyles();
  const { id: typeId } = useParams<ParamsType>();
  const { currentUser, user } = useContext(AuthContext)
  const { facility } = user || {}
  const { scheduleIds, scheduleRecursion, serviceIds } = state || {}

  const { id: currentDoctor } = currentUser || {}
  const { id: facilityId } = facility || {}
  const { userPermissions } = useContext(AuthContext)

  const methods = useForm<ScheduleInputProps>({
    mode: "all",
    resolver: yupResolver(scheduleSchema(isDoctor || false, scheduleRecursion))
  });
  const { reset, handleSubmit, setValue, control, watch, setError, clearErrors } = methods;
  const { startAt, endAt } = watch()

  const handleClose = useCallback(() => {
    reset();
    scheduleDispatch && scheduleDispatch({ type: ActionType.SET_SCHEDULES_IDS, scheduleIds: [] })

    if (scheduleDispatch) {
      scheduleDispatch({ type: ActionType.SET_SCHEDULE_ID, scheduleId: '' })
      scheduleDispatch({ type: ActionType.SET_OPEN_MODAL, openModal: false })
    }
  }, [scheduleDispatch, reset])

  useEffect(() => {
    if (!checkPermission(userPermissions, USER_PERMISSIONS.createSchedule)) {
      Alert.error(PERMISSION_DENIED)
      handleClose();
    }
  }, [handleClose, userPermissions]);

  const [getSchedule, { loading: getScheduleLoading }] = useGetScheduleLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted(data) {
      const { getSchedule: { response, schedule } } = data;

      if (response) {
        const { status } = response

        if (schedule && status && status === 200) {
          const { startAt, endAt, scheduleServices, recurringEndDate } = schedule || {};

          if (isDoctor) {
            const transformedScheduleServices = scheduleServices?.map(scheduleService => {
              const { service } = scheduleService || {}
              const { id: serviceId, name: serviceName, duration } = service || {}

              return {
                value: serviceId || '',
                label: `${serviceName} (duration: ${duration} minutes)`
              }
            }) || []

            scheduleDispatch && scheduleDispatch({
              type: ActionType.SET_SERVICE_IDS,
              serviceIds: transformedScheduleServices
            })
            setValue('serviceId', transformedScheduleServices)
          }

          endAt && setValue('endAt', getTimeString(endAt))
          startAt && setValue('startAt', getTimeString(startAt))
          recurringEndDate && setValue('recurringEndDate', recurringEndDate)

          scheduleDispatch && scheduleDispatch({
            type: ActionType.SET_SCHEDULE_RECURSION,
            scheduleRecursion: !!!recurringEndDate
          })

          scheduleDispatch && scheduleDispatch({
            type: ActionType.SET_SCHEDULES_IDS,
            scheduleIds: [...scheduleIds, getDayFromTimestamps(startAt)]
          })
        }
      }
    }
  });

  const [createSchedule, { loading: createScheduleLoading }] = useCreateScheduleMutation({
    onError({ message }) {
      Alert.error(message)
      handleClose()
    },

    onCompleted(data) {
      const { createSchedule: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(SCHEDULE_CREATED_SUCCESSFULLY);
          handleClose()
          reload()
        }
      }
    }
  });

  const [updateSchedule, { loading: updateScheduleLoading }] = useUpdateScheduleMutation({
    onError({ message }) {
      Alert.error(message)
      handleClose()
    },

    onCompleted(data) {
      const { updateSchedule: { response } } = data;

      if (response) {
        const { status } = response

        if (status && status === 200) {
          Alert.success(SCHEDULE_UPDATED_SUCCESSFULLY);
          handleClose()
          reload();
        }
      }
    }
  });

  const fetchSchedule = useCallback(async () => {
    try {
      isEdit && id &&
        await getSchedule({ variables: { getSchedule: { id } } })
    } catch (error) { }
  }, [getSchedule, id, isEdit])

  useEffect(() => {
    reset()
    fetchSchedule()
  }, [doctorFacilityId, fetchSchedule, getSchedule, id, isEdit, reset])

  const onSubmit: SubmitHandler<ScheduleInputProps> = async ({
    endAt, serviceId, startAt, recurringEndDate
  }) => {
    if (!!!scheduleIds.length) return Alert.error(SELECT_DAY_MESSAGE)

    const scheduleInput = scheduleIds.map((dayValue) => {
      const selectedServices = isDoctor ?
        (serviceId as multiOptionType[]).map(service => service.value) : []

      const recordId = isDoctor ? { doctorId: typeId || currentDoctor }
        : { facilityId: !!typeId ? typeId : facilityId }

      return {
        ...recordId, servicesIds: isDoctor ? selectedServices : [], day: dayValue,
        startAt: setTimeDay(startAt, dayValue), endAt: setTimeDay(endAt, dayValue),
        recurringEndDate: !scheduleRecursion ? recurringEndDate : null
      }
    })

    if (typeId || (!typeId && facilityId) || (isDoctor && currentDoctor)) {
      if (isEdit) {
        id ?
          await updateSchedule({
            variables: {
              updateScheduleInput: { id, ...scheduleInput[0] }
            }
          }) : Alert.error(SCHEDULE_NOT_FOUND)
      } else {
        await createSchedule({
          variables: {
            createScheduleInput: scheduleInput
          }
        })
      }
    } else Alert.error(isEdit ? CANT_UPDATE_SCHEDULE : CANT_CREATE_SCHEDULE)
  };

  const handleChangeForCheckBox = (id: string) => {
    if (id) {
      if (scheduleIds.includes(id)) {
        scheduleDispatch &&
          scheduleDispatch({
            type: ActionType.SET_SCHEDULES_IDS,
            scheduleIds: scheduleIds.filter(permission => permission !== id)
          })
      }
      else {
        scheduleDispatch && scheduleDispatch({
          type: ActionType.SET_SCHEDULES_IDS,
          scheduleIds: [...scheduleIds, id]
        })
      }
    }
  };

  useEffect(() => {
    if (!!startAt) {
      timeValidation(endAt, startAt) ?
        clearErrors("endAt")
        : setError("endAt", { message: invalidMessage(END_TIME) })
    }
  }, [clearErrors, endAt, setError, startAt])

  const disableSubmit = createScheduleLoading || updateScheduleLoading

  return (
    <Dialog className="schedule-modal" open={isOpen} onClose={handleClose}
      aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
      maxWidth="sm" fullWidth
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle={isDoctor ? DOCTOR_SCHEDULE : FACILITY_SCHEDULE}>
            <Box px={1}>
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <Grid container spacing={3}>
                    <Grid item md={12} sm={12} xs={12}>
                      {isEdit ?
                        getScheduleLoading ? renderLoading(DAY)
                          : scheduleIds.map(day => renderItem(DAY, day))
                        : <>
                          <Typography variant="h6">{PICK_DAY_TEXT}</Typography>

                          <FormGroup>
                            <Box mt={1} mb={2} className={classesToggle.daysBox}
                              display="flex" alignItems="center" flexWrap="wrap"
                            >
                              {WEEK_DAYS.map(({ id, name }) => <FormControlLabel
                                control={
                                  <Checkbox disabled={isEdit} color="primary" checked={scheduleIds.includes(id || '')}
                                    onChange={() => handleChangeForCheckBox(id || '')} className={classesToggle.checkBox}
                                  />
                                }
                                label={name}
                              />
                              )}
                            </Box>
                          </FormGroup>
                        </>}
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={6} xs={12}>
                      <TimePicker
                        isRequired
                        name="startAt"
                        label={START_TIME}
                        loading={getScheduleLoading}
                      />
                    </Grid>

                    <Grid item md={6} sm={6} xs={12}>
                      <TimePicker
                        isRequired
                        name="endAt"
                        label={END_TIME}
                        loading={getScheduleLoading}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item md={6} sm={12} xs={12}>
                      {getScheduleLoading ? renderLoading(WANT_RECURRING) :
                        <Controller
                          name='shouldHaveRecursion'
                          control={control}
                          render={() => (
                            <FormControl fullWidth margin="normal" className={classesToggle.toggleContainer}>
                              <InputLabel shrink>{WANT_RECURRING}</InputLabel>

                              <label className="toggle-main">
                                <Box color={scheduleRecursion ? WHITE : GREY_SEVEN}>{YES}</Box>
                                <AntSwitch checked={scheduleRecursion}
                                  name='shouldHaveRecursion'
                                  onChange={({ target: { checked } }) =>
                                    scheduleDispatch && scheduleDispatch({
                                      type: ActionType.SET_SCHEDULE_RECURSION,
                                      scheduleRecursion: checked
                                    })}
                                />
                                <Box color={scheduleRecursion ? GREY_SEVEN : WHITE}>{NO}</Box>
                              </label>
                            </FormControl>
                          )}
                        />
                      }
                    </Grid>

                    {!scheduleRecursion && <Grid item md={6} sm={12} xs={12}>
                      <DatePicker
                        disablePast
                        label={END_DATE}
                        disableFuture={false}
                        name="recurringEndDate"
                        loading={getScheduleLoading}
                        isRequired={!scheduleRecursion}
                      />
                    </Grid>}
                  </Grid>

                  {isDoctor &&
                    <ServiceSelector
                      isMulti
                      isRequired
                      isEdit={isEdit}
                      name="serviceId"
                      label={APPOINTMENT_TYPE}
                      defaultValues={serviceIds}
                      loading={getScheduleLoading}
                      facilityId={doctorFacilityId}
                    />
                  }

                  <Box pb={2} display='flex' justifyContent='flex-end' alignItems='center'>
                    <Button onClick={handleClose} color="default">
                      {CANCEL}
                    </Button>

                    <Box p={1} />

                    <Button type="submit" variant="contained" color="primary"
                      disabled={disableSubmit}
                    >
                      {isEdit ? UPDATE_SCHEDULE : CREATE_SCHEDULE}

                      {disableSubmit && <CircularProgress size={20} color="inherit" />}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardComponent>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default ScheduleModal;
