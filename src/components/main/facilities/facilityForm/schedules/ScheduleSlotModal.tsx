// packages block
import { FC, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Button, Dialog, DialogActions, Box, Grid, CircularProgress } from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import Selector from '../../../../common/Selector';
import TimePicker from "../../../../common/TimePicker";
import CardComponent from "../../../../common/CardComponent";
import ViewDataLoader from "../../../../common/ViewDataLoader";
// interfaces/types block, theme, svgs and constants
import { ActionType } from "../../../../../reducers/facilityReducer";
import { facilityScheduleSchema } from "../../../../../validationSchemas";
import { FacilityScheduleInputProps, FacilityScheduleModalProps } from "../../../../../interfacesTypes";
import { getDayFromTimestamps, getTimeString, setRecord, setTimeDay } from "../../../../../utils";
import { useCreateScheduleMutation, useGetScheduleLazyQuery, useUpdateScheduleMutation } from "../../../../../generated/graphql";
import {
  CANCEL, EMPTY_OPTION, PICK_DAY_TEXT, WEEK_DAYS, START_TIME, END_TIME, CANT_UPDATE_SCHEDULE, CANT_CREATE_SCHEDULE, CREATE_SCHEDULE,
  SCHEDULE_CREATED_SUCCESSFULLY, SCHEDULE_UPDATED_SUCCESSFULLY, UPDATE_SCHEDULE, SCHEDULE_NOT_FOUND, FACILITY_SCHEDULE,
} from "../../../../../constants";

const FacilityScheduleModal: FC<FacilityScheduleModalProps> = ({
  id, isEdit, facilityDispatcher, isOpen, facilityId, reload
}): JSX.Element => {
  const methods = useForm<FacilityScheduleInputProps>({
    mode: "all",
    resolver: yupResolver(facilityScheduleSchema)
  });
  const { reset, handleSubmit, setValue } = methods;

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
          const { startAt, endAt } = schedule || {};

          endAt && setValue('endAt', getTimeString(endAt))
          startAt && setValue('startAt', getTimeString(startAt))
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

  const handleClose = () => {
    reset();
    facilityDispatcher({ type: ActionType.SET_SCHEDULE_ID, scheduleId: '' })
    facilityDispatcher({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: false })
  }

  useEffect(() => {
    reset()

    if (isEdit && id) {
      getSchedule({
        variables: { getSchedule: { id } }
      })
    }
  }, [facilityId, getSchedule, id, isEdit, reset])

  const onSubmit: SubmitHandler<FacilityScheduleInputProps> = async ({ endAt, startAt, day }) => {
    const { id: dayName } = day || {}

    const scheduleInput = {
      facilityId, servicesIds: [],
      startAt: setTimeDay(startAt, dayName), endAt: setTimeDay(endAt, dayName),
    };
    if (facilityId) {
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
          <CardComponent cardTitle={FACILITY_SCHEDULE}>
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
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default FacilityScheduleModal;
