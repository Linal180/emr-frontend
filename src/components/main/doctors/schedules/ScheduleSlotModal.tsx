// packages block
import { useParams } from "react-router";
import { FC, useCallback, useContext, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Button, Dialog, Box, Grid, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import TimePicker from "../../../common/TimePicker";
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from "../../../common/ViewDataLoader";
// interfaces/types block, theme, svgs and constants
import { ActionType } from "../../../../reducers/doctorReducer";
import { AuthContext, FacilityContext } from '../../../../context';
import { doctorScheduleSchema } from "../../../../validationSchemas";
import { ScheduleInputProps, ParamsType, DoctorScheduleModalProps } from "../../../../interfacesTypes";
import {
  checkPermission, getDayFromTimestamps, getTimeString, renderServices, setRecord, setTimeDay
} from "../../../../utils";
import {
  useCreateScheduleMutation, useGetScheduleLazyQuery, useUpdateScheduleMutation
} from "../../../../generated/graphql";
import {
  CANCEL, EMPTY_OPTION, PICK_DAY_TEXT, WEEK_DAYS, APPOINTMENT_TYPE, DOCTOR_SCHEDULE,
  START_TIME, END_TIME, CANT_UPDATE_SCHEDULE, CANT_CREATE_SCHEDULE, CREATE_SCHEDULE,
  SCHEDULE_CREATED_SUCCESSFULLY, SCHEDULE_UPDATED_SUCCESSFULLY, UPDATE_SCHEDULE, SCHEDULE_NOT_FOUND,
  PERMISSION_DENIED, USER_PERMISSIONS,
} from "../../../../constants";

const DoctorScheduleModal: FC<DoctorScheduleModalProps> = ({
  id, isEdit, doctorDispatcher, isOpen, doctorFacilityId, reload
}): JSX.Element => {
  const { id: doctorId } = useParams<ParamsType>();
  const { userPermissions } = useContext(AuthContext)
  const { serviceList, fetchAllServicesList } = useContext(FacilityContext)
  const methods = useForm<ScheduleInputProps>({
    mode: "all",
    resolver: yupResolver(doctorScheduleSchema)
  });
  const { reset, handleSubmit, setValue } = methods;

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
          const { startAt, endAt, scheduleServices } = schedule || {};
          const { service } = (scheduleServices && scheduleServices[0]) || {}
          const { id: serviceId, name: serviceName } = (service && service) || {}

          endAt && setValue('endAt', getTimeString(endAt))
          startAt && setValue('startAt', getTimeString(startAt))
          serviceId && serviceName && setValue('serviceId', setRecord(serviceId, serviceName))
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
    fetchAllServicesList(doctorFacilityId)
    reset()

    if (isEdit && id) {
      getSchedule({
        variables: { getSchedule: { id } }
      })
    }
  }, [doctorFacilityId, fetchAllServicesList, getSchedule, id, isEdit, reset])

  const onSubmit: SubmitHandler<ScheduleInputProps> = async ({ endAt, serviceId, startAt, day }) => {
    const { id: selectedService } = serviceId || {}
    const { id: dayName } = day || {}

    const scheduleInput = {
      doctorId, servicesIds: [selectedService] || [],
      startAt: setTimeDay(startAt, dayName), endAt: setTimeDay(endAt, dayName),
    };
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
            createScheduleInput: [{ ...scheduleInput }]
          }
        })
      }
    } else
      Alert.error(isEdit ? CANT_UPDATE_SCHEDULE : CANT_CREATE_SCHEDULE)
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
                          value={EMPTY_OPTION}
                          label={PICK_DAY_TEXT}
                          name="day"
                          options={WEEK_DAYS}
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

                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={APPOINTMENT_TYPE}
                          name="serviceId"
                          options={renderServices(serviceList)}
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
