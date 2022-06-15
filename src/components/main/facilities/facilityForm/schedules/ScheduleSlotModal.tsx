// packages block
import { FC, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Button, Dialog, DialogActions, Box, Grid, CircularProgress, DialogTitle, DialogContent, FormControl,
  InputLabel, Typography, FormGroup, FormControlLabel, Checkbox
} from "@material-ui/core";
// components block
import Alert from "../../../../common/Alert";
import TimePicker from "../../../../common/TimePicker";
import DatePicker from "../../../../common/DatePicker";
import ViewDataLoader from "../../../../common/ViewDataLoader";
// interfaces/types block, theme, svgs and constants
import { GREY_SEVEN, WHITE } from "../../../../../theme";
import { ActionType } from "../../../../../reducers/facilityReducer";
import { facilityScheduleSchema } from "../../../../../validationSchemas";
import { usePublicAppointmentStyles } from "../../../../../styles/publicAppointmentStyles";
import { AntSwitch } from "../../../../../styles/publicAppointmentStyles/externalPatientStyles";
import { getDayFromTimestamps, getTimeString, renderItem, setTimeDay } from "../../../../../utils";
import {
  FacilityScheduleInputProps, FacilityScheduleModalProps
} from "../../../../../interfacesTypes";
import {
  useCreateScheduleMutation, useGetScheduleLazyQuery, useUpdateScheduleMutation
} from "../../../../../generated/graphql";
import {
  CANCEL, PICK_DAY_TEXT, WEEK_DAYS, START_TIME, END_TIME, CANT_UPDATE_SCHEDULE, CANT_CREATE_SCHEDULE,
  SCHEDULE_CREATED_SUCCESSFULLY, SCHEDULE_UPDATED_SUCCESSFULLY, UPDATE_SCHEDULE, SCHEDULE_NOT_FOUND,
  FACILITY_SCHEDULE, RECURRING_DATE, CREATE_SCHEDULE, YES, NO, DAY, SELECT_DAY_MESSAGE,
} from "../../../../../constants";

const FacilityScheduleModal: FC<FacilityScheduleModalProps> = ({
  id, isEdit, facilityDispatcher, isOpen, facilityId, reload
}): JSX.Element => {
  const classesToggle = usePublicAppointmentStyles();
  const [ids, setIds] = useState<string[]>([])
  const methods = useForm<FacilityScheduleInputProps>({
    mode: "all",
    resolver: yupResolver(facilityScheduleSchema)
  });
  const { reset, handleSubmit, setValue, control } = methods;

  const [shouldHaveRecursion, setShouldHaveRecursion] = useState<boolean>(false)

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
          const { startAt, endAt, recurringEndDate } = schedule || {};

          endAt && setValue('endAt', getTimeString(endAt))
          startAt && setValue('startAt', getTimeString(startAt))
          recurringEndDate && setValue('recurringEndDate', recurringEndDate)
          recurringEndDate && setShouldHaveRecursion(true)
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
    setIds([])
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

  const onSubmit: SubmitHandler<FacilityScheduleInputProps> = async ({ endAt, startAt, recurringEndDate }) => {
    if (!!!ids.length) return Alert.error(SELECT_DAY_MESSAGE)

    const scheduleInput = ids.map((dayValue) => {
      return {
        facilityId, servicesIds: [], day: dayValue,
        startAt: setTimeDay(startAt, dayValue), endAt: setTimeDay(endAt, dayValue),
        recurringEndDate: shouldHaveRecursion ? recurringEndDate : null
      }
    })

    if (facilityId) {
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
    } else
      Alert.error(isEdit ? CANT_UPDATE_SCHEDULE : CANT_CREATE_SCHEDULE)
  };

  const handleChangeForCheckBox = (id: string) => {
    if (id) {
      if (ids.includes(id)) {
        setIds(ids.filter(permission => permission !== id))
      } else {
        setIds([...ids, id])
      }
    }
  };

  const disableSubmit = createScheduleLoading || updateScheduleLoading

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        {FACILITY_SCHEDULE}
      </DialogTitle>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box className="dialogBg pt-0">
              {getScheduleLoading ?
                <ViewDataLoader rows={4} columns={6} hasMedia={false} /> : (
                  <Grid container spacing={3}>
                    <Grid item md={12} sm={12} xs={12}>
                      {isEdit ? (
                        ids.map(day => renderItem(DAY, day))
                      ) : (
                        <>
                          <Typography>{PICK_DAY_TEXT}</Typography>
                          <FormGroup>
                            <Box my={1.5} display="flex" alignItems="center" flexWrap="wrap">
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
                  </Grid>
                )}
            </Box>
          </DialogContent>

          <DialogActions>
            <Box pr={2} display="flex">
              <Button onClick={handleClose} color="default">{CANCEL}</Button>

              <Box p={1} />

              <Button type="submit" variant="contained" color="primary" disabled={disableSubmit}>
                {isEdit ? UPDATE_SCHEDULE : CREATE_SCHEDULE}

                {disableSubmit && <CircularProgress size={20} color="inherit" />}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog >
  );
};

export default FacilityScheduleModal;
