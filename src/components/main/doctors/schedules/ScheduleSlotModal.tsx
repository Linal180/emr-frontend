// packages block
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, Dialog, FormControl, Grid, InputLabel } from "@material-ui/core";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { APPOINTMENT_TYPE, CANCEL, CANT_CREATE_SCHEDULE, CANT_UPDATE_SCHEDULE, CREATE_SCHEDULE, DOCTOR_SCHEDULE, END_TIME, NO, PERMISSION_DENIED, PICK_DAY_TEXT, RECURRING_DATE, SCHEDULE_CREATED_SUCCESSFULLY, SCHEDULE_NOT_FOUND, SCHEDULE_UPDATED_SUCCESSFULLY, START_TIME, UPDATE_SCHEDULE, USER_PERMISSIONS, WEEK_DAYS, YES } from "../../../../constants";
// interfaces/types block, theme, svgs and constants
import { AuthContext } from '../../../../context';
import {
  useCreateScheduleMutation, useGetScheduleLazyQuery, useUpdateScheduleMutation
} from "../../../../generated/graphql";
import { DoctorScheduleModalProps, multiOptionType, ParamsType, ScheduleInputProps, SelectorOption } from "../../../../interfacesTypes";
import { ActionType } from "../../../../reducers/doctorReducer";
import { usePublicAppointmentStyles } from "../../../../styles/publicAppointmentStyles";
import { AntSwitch } from "../../../../styles/publicAppointmentStyles/externalPatientStyles";
import { GREY_SEVEN, WHITE } from "../../../../theme";
import {
  checkPermission, getDayFromTimestamps, getTimeString, setRecord, setTimeDay
} from "../../../../utils";
import { doctorEditScheduleSchema, doctorScheduleSchema } from "../../../../validationSchemas";
// components block
import Alert from "../../../common/Alert";
import CardComponent from "../../../common/CardComponent";
import DatePicker from "../../../common/DatePicker";
import Selector from '../../../common/Selector';
import ServiceSelector from "../../../common/Selector/ServiceSelector";
import TimePicker from "../../../common/TimePicker";
import ViewDataLoader from "../../../common/ViewDataLoader";

const DoctorScheduleModal: FC<DoctorScheduleModalProps> = ({
  id, isEdit, doctorDispatcher, isOpen, doctorFacilityId, reload
}): JSX.Element => {
  const classesToggle = usePublicAppointmentStyles();
  const { id: doctorId } = useParams<ParamsType>();
  const { userPermissions } = useContext(AuthContext)
  const methods = useForm<ScheduleInputProps>({
    mode: "all",
    resolver: yupResolver(isEdit ? doctorEditScheduleSchema : doctorScheduleSchema)
  });
  const { reset, handleSubmit, setValue, control } = methods;
  const [serviceIds, setServiceIds] = useState<multiOptionType[]>([])
  const [shouldHaveRecursion, setShouldHaveRecursion] = useState<boolean>(false)

  const handleClose = useCallback(() => {
    reset();
    doctorDispatcher({ type: ActionType.SET_SCHEDULE_ID, scheduleId: '' })
    doctorDispatcher({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: false })
  }, [doctorDispatcher, reset])

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
          const transformedScheduleServices = scheduleServices?.map(scheduleService => {
            const { service } = scheduleService ?? {}
            const { id: serviceId, name: serviceName, duration } = service ?? {}
            return {
              value: serviceId || '',
              label: `${serviceName} (duration: ${duration} minutes)`
            }
          }) ?? []

          endAt && setValue('endAt', getTimeString(endAt))
          startAt && setValue('startAt', getTimeString(startAt))
          recurringEndDate && setValue('recurringEndDate', recurringEndDate)
          recurringEndDate && setShouldHaveRecursion(true)
          setValue('serviceId', transformedScheduleServices)
          setServiceIds(transformedScheduleServices)
          startAt && setValue('day', setRecord(getDayFromTimestamps(startAt), getDayFromTimestamps(startAt)))
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
          reload()
          handleClose()
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
          reload();
          handleClose()
        }
      }
    }
  });

  useEffect(() => {
    reset()

    if (isEdit && id) {
      getSchedule({
        variables: { getSchedule: { id } }
      })
    }
  }, [doctorFacilityId, getSchedule, id, isEdit, reset])

  const onSubmit: SubmitHandler<ScheduleInputProps> = async ({ endAt, serviceId, startAt, day, recurringEndDate }) => {
    let scheduleInput
    if (isEdit) {
      const { id: dayName } = day as SelectorOption
      const selectedServices = (serviceId as multiOptionType[]).map(service => service.value)
      scheduleInput = {
        doctorId, servicesIds: selectedServices || [], day: dayName,
        startAt: setTimeDay(startAt, dayName), endAt: setTimeDay(endAt, dayName),
        recurringEndDate: shouldHaveRecursion ? recurringEndDate : null
      }
    } else {
      scheduleInput = (day as SelectorOption[]).map((dayValues) => {
        const { id: dayName } = dayValues || {}
        const selectedServices = (serviceId as multiOptionType[]).map(service => service.value)
        return {
          doctorId, servicesIds: selectedServices || [], day: dayName,
          startAt: setTimeDay(startAt, dayName), endAt: setTimeDay(endAt, dayName),
          recurringEndDate: shouldHaveRecursion ? recurringEndDate : null
        }
      })
    }

    if (doctorId) {
      if (isEdit) {
        id ?
          await updateSchedule({
            variables: {
              updateScheduleInput: { id, ...scheduleInput }
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

  const disableSubmit = createScheduleLoading || updateScheduleLoading

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle={DOCTOR_SCHEDULE}>
            <Box px={1}>
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  {getScheduleLoading ?
                    <ViewDataLoader rows={4} columns={6} hasMedia={false} /> : (
                      <>
                        <Selector
                          isRequired
                          label={PICK_DAY_TEXT}
                          name="day"
                          options={WEEK_DAYS}
                          isMultiple={!isEdit}
                        />

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
                                  <InputLabel shrink>Should Have Recurring Date</InputLabel>

                                  <label className="toggle-main">
                                    <Box color={shouldHaveRecursion ? WHITE : GREY_SEVEN}>{YES}</Box>
                                    <AntSwitch checked={shouldHaveRecursion} onChange={({ target: { checked } }) => setShouldHaveRecursion(checked)} name='shouldHaveRecursion' />
                                    <Box color={shouldHaveRecursion ? GREY_SEVEN : WHITE}>{NO}</Box>
                                  </label>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          {shouldHaveRecursion && <Grid item md={6} sm={12} xs={12}>
                            <DatePicker
                              name="recurringEndDate"
                              label={RECURRING_DATE}
                              disableFuture={false}
                            />
                          </Grid>}
                        </Grid>

                        <ServiceSelector
                          isRequired
                          name="serviceId"
                          label={APPOINTMENT_TYPE}
                          facilityId={doctorFacilityId}
                          isEdit={isEdit}
                          defaultValues={serviceIds}
                          isMulti={true}
                        />
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
};

export default DoctorScheduleModal;
