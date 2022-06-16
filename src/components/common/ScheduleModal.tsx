// packages block
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
// components block
import Alert from "./Alert";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import CardComponent from "./CardComponent";
import ViewDataLoader from "./ViewDataLoader";
import ServiceSelector from "./Selector/ServiceSelector";
// interfaces/types block, theme, svgs and constants
import { AuthContext } from './../../context';
import { GREY_SEVEN, WHITE } from "./../../theme";
import { ActionType } from "./../../reducers/doctorReducer";
import { ActionType as FacilityActionType } from "./../../reducers/facilityReducer";
import { scheduleSchema } from "./../../validationSchemas";
import { usePublicAppointmentStyles } from "./../../styles/publicAppointmentStyles";
import { AntSwitch } from "./../../styles/publicAppointmentStyles/externalPatientStyles";
import {
  useCreateScheduleMutation, useGetScheduleLazyQuery, useUpdateScheduleMutation
} from "./../../generated/graphql";
import {
  multiOptionType, ParamsType, ScheduleFormProps, ScheduleInputProps
} from "./../../interfacesTypes";
import {
  checkPermission, getDayFromTimestamps, getTimeString, renderItem, setTimeDay
} from "./../../utils";
import {
  Box, Button, Checkbox, CircularProgress, Dialog, FormControl, FormControlLabel, FormGroup, Grid,
  InputLabel, Typography
} from "@material-ui/core";
import {
  APPOINTMENT_TYPE, CANCEL, CANT_CREATE_SCHEDULE, CANT_UPDATE_SCHEDULE, CREATE_SCHEDULE, DAY,
  DOCTOR_SCHEDULE, END_TIME, NO, PERMISSION_DENIED, PICK_DAY_TEXT, END_DATE, WEEK_DAYS, YES,
  SCHEDULE_CREATED_SUCCESSFULLY, SCHEDULE_NOT_FOUND, SCHEDULE_UPDATED_SUCCESSFULLY, SELECT_DAY_MESSAGE,
  START_TIME, UPDATE_SCHEDULE, USER_PERMISSIONS, WANT_RECURRING, FACILITY_SCHEDULE,
} from "./../../constants";

const ScheduleModal: FC<ScheduleFormProps> = ({
  isDoctor, id, doctorDispatcher, doctorFacilityId, isOpen, reload, isEdit,
  facilityDispatcher
}) => {
  const classesToggle = usePublicAppointmentStyles();
  const { id: typeId } = useParams<ParamsType>();
  const [ids, setIds] = useState<string[]>([])
  const { userPermissions } = useContext(AuthContext)
  const methods = useForm<ScheduleInputProps>({
    mode: "all",
    resolver: yupResolver(scheduleSchema(isDoctor || false))
  });
  const { reset, handleSubmit, setValue, control } = methods;
  const [serviceIds, setServiceIds] = useState<multiOptionType[]>([])
  const [shouldHaveRecursion, setShouldHaveRecursion] = useState<boolean>(true)

  const handleClose = useCallback(() => {
    reset();
    setIds([])

    if (isDoctor) {
      if (doctorDispatcher) {
        doctorDispatcher({ type: ActionType.SET_SCHEDULE_ID, scheduleId: '' })
        doctorDispatcher({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: false })
      }
    } else {
      if (facilityDispatcher) {
        facilityDispatcher({ type: FacilityActionType.SET_SCHEDULE_ID, scheduleId: '' })
        facilityDispatcher({ type: FacilityActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: false })
      }
    }
  }, [doctorDispatcher, facilityDispatcher, isDoctor, reset])

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

            setServiceIds(transformedScheduleServices)
            setValue('serviceId', transformedScheduleServices)
          }

          endAt && setValue('endAt', getTimeString(endAt))
          startAt && setValue('startAt', getTimeString(startAt))
          recurringEndDate && setValue('recurringEndDate', recurringEndDate)

          setShouldHaveRecursion(!!!recurringEndDate)
          setIds([...ids, getDayFromTimestamps(startAt)])
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
    if (!!!ids.length) return Alert.error(SELECT_DAY_MESSAGE)

    const scheduleInput = ids.map((dayValue) => {
      const selectedServices = isDoctor ?
        (serviceId as multiOptionType[]).map(service => service.value) : []

      const recordId = isDoctor ? { doctorId: typeId } : { facilityId: typeId }

      return {
        ...recordId, servicesIds: isDoctor ? selectedServices : [], day: dayValue,
        startAt: setTimeDay(startAt, dayValue), endAt: setTimeDay(endAt, dayValue),
        recurringEndDate: !shouldHaveRecursion ? recurringEndDate : null
      }
    })

    if (typeId) {
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
      if (ids.includes(id)) setIds(ids.filter(permission => permission !== id))
      else setIds([...ids, id])
    }
  };

  const disableSubmit = createScheduleLoading || updateScheduleLoading

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle={isDoctor ? DOCTOR_SCHEDULE : FACILITY_SCHEDULE}>
            <Box px={1}>
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  {getScheduleLoading ?
                    <ViewDataLoader rows={4} columns={6} hasMedia={false} /> : (
                      <>
                        <Grid container spacing={3}>
                          <Grid item md={12} sm={12} xs={12}>
                            {isEdit ? (
                              ids.map(day => renderItem(DAY, day))
                            ) : (
                              <>
                                <Typography variant="h6">{PICK_DAY_TEXT}</Typography>
                                <FormGroup>
                                  <Box mt={1} mb={2} className={classesToggle.daysBox} display="flex" alignItems="center" flexWrap="wrap">
                                    {WEEK_DAYS.map(day => {
                                      const { id, name } = day
                                      return <FormControlLabel
                                        control={
                                          <Checkbox disabled={isEdit} color="primary" checked={ids.includes(id || '')}
                                            onChange={() => handleChangeForCheckBox(id || '')} />
                                        }
                                        label={name}
                                      />
                                    })}
                                  </Box>
                                </FormGroup>
                              </>
                            )}
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <TimePicker
                              isRequired
                              label={START_TIME}
                              name="startAt"
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <TimePicker
                              isRequired
                              label={END_TIME}
                              name="endAt"
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <Controller
                              name='shouldHaveRecursion'
                              control={control}
                              render={() => (
                                <FormControl fullWidth margin="normal" className={classesToggle.toggleContainer}>
                                  <InputLabel shrink>{WANT_RECURRING}</InputLabel>

                                  <label className="toggle-main">
                                    <Box color={shouldHaveRecursion ? WHITE : GREY_SEVEN}>{YES}</Box>
                                    <AntSwitch checked={shouldHaveRecursion}
                                      onChange={({ target: { checked } }) =>
                                        setShouldHaveRecursion(checked)} name='shouldHaveRecursion'
                                    />
                                    <Box color={shouldHaveRecursion ? GREY_SEVEN : WHITE}>{NO}</Box>
                                  </label>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          {!shouldHaveRecursion && <Grid item md={6} sm={12} xs={12}>
                            <DatePicker
                              name="recurringEndDate"
                              label={END_DATE}
                              disableFuture={false}
                            />
                          </Grid>}
                        </Grid>

                        {isDoctor &&
                          <ServiceSelector
                            isRequired
                            name="serviceId"
                            label={APPOINTMENT_TYPE}
                            facilityId={doctorFacilityId}
                            isEdit={isEdit}
                            defaultValues={serviceIds}
                            isMulti={true}
                          />
                        }
                      </>
                    )}

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
