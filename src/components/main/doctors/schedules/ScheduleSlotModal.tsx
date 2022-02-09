// packages block
import { FC, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Button, Dialog, DialogActions, Box, Grid, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import Selector from '../../../common/Selector';
import TimePicker from "../../../common/TimePicker";
// interfaces/types block, theme, svgs and constants
import { FacilityContext } from '../../../../context';
import { ActionType } from "../../../../reducers/doctorReducer";
import { doctorScheduleSchema } from "../../../../validationSchemas";
import { ScheduleInputProps, ParamsType, DoctorScheduleModalProps } from "../../../../interfacesTypes";
import {
  dateValidationMessage,
  getDayFromTimestamps, getISOTime, renderLocations, renderServices, requiredMessage, setRecord, setTimeDay
} from "../../../../utils";
import {
  useCreateScheduleMutation, useGetScheduleLazyQuery, useUpdateScheduleMutation
} from "../../../../generated/graphql";
import {
  CANCEL, EMPTY_OPTION, PICK_DAY_TEXT, WEEK_DAYS, APPOINTMENT_TYPE,
  LOCATIONS_TEXT, START_TIME, END_TIME, CANT_UPDATE_SCHEDULE, CANT_CREATE_SCHEDULE,
  SCHEDULE_CREATED_SUCCESSFULLY, SCHEDULE_UPDATED_SUCCESSFULLY, UPDATE_SCHEDULE,
  CREATE_SCHEDULE, SCHEDULE_NOT_FOUND, DOCTOR_SCHEDULE
} from "../../../../constants";
import ViewDataLoader from "../../../common/ViewDataLoader";
import CardComponent from "../../../common/CardComponent";

const DoctorScheduleModal: FC<DoctorScheduleModalProps> = ({
  id, isEdit, doctorDispatcher, isOpen, doctorFacilityId, reload
}): JSX.Element => {
  const { id: doctorId } = useParams<ParamsType>();
  const { serviceList, locationList, fetchAllServicesList, fetchAllLocationList } = useContext(FacilityContext)
  const methods = useForm<ScheduleInputProps>({
    mode: "all",
    resolver: yupResolver(doctorScheduleSchema)
  });
  const { reset, handleSubmit, setValue, formState: { errors } } = methods;

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

          const { startAt, endAt, location, scheduleServices } = schedule || {};
          const { id: locationId, name: locationName } = location || {}
          const { service } = (scheduleServices && scheduleServices[0]) || {}
          const { id: serviceId, name: serviceName } = (service && service) || {}

          endAt && setValue('endAt', getISOTime(endAt || ''))
          startAt && setValue('startAt', getISOTime(startAt || ''))
          serviceId && serviceName && setValue('servicesIds', setRecord(serviceId, serviceName || ''))
          setValue('day', setRecord(getDayFromTimestamps(startAt || ''), getDayFromTimestamps(startAt || '')))
          locationId && locationName && setValue('locationId', setRecord(locationId || '', locationName || ''))
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

  const handleClose = () => {
    reset();
    doctorDispatcher({ type: ActionType.SET_SCHEDULE_ID, scheduleId: '' })
    doctorDispatcher({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: false })
  }

  useEffect(() => {
    fetchAllServicesList(doctorFacilityId)
    fetchAllLocationList(doctorFacilityId)

    if (isEdit && id) {
      getSchedule({
        variables: { getSchedule: { id } }
      })
    }
  }, [doctorFacilityId, fetchAllLocationList, fetchAllServicesList, getSchedule, id, isEdit])

  const onSubmit: SubmitHandler<ScheduleInputProps> = async ({ endAt, locationId, servicesIds, startAt, day }) => {
    const { id: selectedLocation } = locationId || {}
    const { id: selectedService } = servicesIds || {}
    const { id: dayName } = day || {}

    const scheduleInput = {
      doctorId, locationId: selectedLocation || '', servicesIds: [selectedService] || [],
      startAt: setTimeDay(startAt, dayName), endAt: setTimeDay(endAt, dayName),
    };

    if (doctorId) {
      if (isEdit) {
        if (id) {
          await updateSchedule({
            variables: {
              updateScheduleInput: { id, ...scheduleInput }
            }
          })
        } else
          Alert.error(SCHEDULE_NOT_FOUND)
      } else {
        await createSchedule({
          variables: {
            createScheduleInput: { ...scheduleInput }
          }
        })
      }
    } else
      Alert.error(isEdit ? CANT_UPDATE_SCHEDULE : CANT_CREATE_SCHEDULE)
  };

  const {
    day: { id: dayError } = {},
    endAt: { message: endAtError } = {},
    servicesIds: { id: serviceError } = {},
    locationId: { id: locationError } = {},
    startAt: { message: startAtError } = {},
  } = errors;

  const disableSubmit = createScheduleLoading || updateScheduleLoading

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardComponent cardTitle={DOCTOR_SCHEDULE}>
            <Box ml={3} mr={3} pt={3}>
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
                          error={dayError?.message}
                          options={WEEK_DAYS}
                        />

                        <Grid container spacing={3}>
                          <Grid item md={6} sm={12} xs={12}>
                            <TimePicker
                              isRequired
                              label={START_TIME}
                              name="startAt"
                              error={(startAtError && requiredMessage(START_TIME)) || ''}
                            />
                          </Grid>

                          <Grid item md={6} sm={12} xs={12}>
                            <TimePicker
                              isRequired
                              label={END_TIME}
                              name="endAt"
                              error={(endAtError && dateValidationMessage(END_TIME, START_TIME)) || ''}
                            />
                          </Grid>
                        </Grid>

                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={LOCATIONS_TEXT}
                          name="locationId"
                          error={locationError?.message}
                          options={renderLocations(locationList)}
                        />

                        <Selector
                          isRequired
                          value={EMPTY_OPTION}
                          label={APPOINTMENT_TYPE}
                          name="servicesIds"
                          error={serviceError?.message}
                          options={renderServices(serviceList)}
                        />
                      </>
                    )}

                  <DialogActions>
                    <Box pr={1}>
                      <Button onClick={handleClose} color="default">
                        {CANCEL}
                      </Button>
                    </Box>

                    <Button type="submit" variant="contained" color="primary"
                      disabled={disableSubmit}
                    >
                      {isEdit ? UPDATE_SCHEDULE : CREATE_SCHEDULE}

                      {disableSubmit && <CircularProgress size={20} color="inherit" />}
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </Box>
          </CardComponent>
        </form >
      </FormProvider>
    </Dialog>
  );
};

export default DoctorScheduleModal;
