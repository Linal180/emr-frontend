// packages block
import { useParams } from "react-router";
import { Box, Grid, Typography } from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
// components block
import Alert from "../../../common/Alert";
import DoctorScheduleModal from "./ScheduleSlotModal";
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from "../../../common/ViewDataLoader";
import ConfirmationModal from "../../../common/ConfirmationModal";
import DoctorScheduleBox from "../../../common/DoctorScheduleBox";
// interfaces, graphql, constants block
import { AddSlotIcon } from '../../../../assets/svgs';
import {  getDaySchedules } from "../../../../utils";
import { useDoctorScheduleStyles } from '../../../../styles/doctorSchedule';
import { DaySchedule, DoctorScheduleSlotProps, ParamsType } from "../../../../interfacesTypes";
import {
  doctorReducer, Action, initialState, State, ActionType
} from '../../../../reducers/doctorReducer';
import {
  SchedulesPayload, useGetDoctorScheduleLazyQuery, useRemoveScheduleMutation
} from "../../../../generated/graphql";
import {
  ADD_MORE_RECORDS_TEXT, AVAILABILITY_TEXT, CANT_DELETE_DOCTOR_SCHEDULE, DELETE_DOCTOR_SCHEDULE_DESCRIPTION,
  DOCTOR_NOT_FOUND, DOCTOR_SCHEDULE,
} from "../../../../constants";

const DoctorScheduleForm: FC<DoctorScheduleSlotProps> = ({ doctorFacilityId }) => {
  const classes = useDoctorScheduleStyles();
  const { id } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { scheduleOpenModal, byDaySchedules, isEdit, scheduleId, deleteScheduleId, openScheduleDelete } = state;

  const [getDoctorSchedule, { loading: getSchedulesLoading }] = useGetDoctorScheduleLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_DOCTOR_SCHEDULES, doctorSchedules: [] });
      dispatch({ type: ActionType.SET_DOCTOR_SCHEDULES, doctorSchedules: [] })
    },

    onCompleted(data) {
      const { getDoctorSchedule } = data || {};

      if (getDoctorSchedule) {
        const { schedules, response } = getDoctorSchedule

        if (schedules && response) {
          const { status } = response || {}
          if (status && status === 200 && schedules) {
            dispatch({
              type: ActionType.SET_DOCTOR_SCHEDULES, doctorSchedules: schedules as SchedulesPayload['schedules']
            });

            dispatch({
              type: ActionType.SET_BY_DAY_SCHEDULES,
              byDaySchedules: getDaySchedules(schedules as SchedulesPayload['schedules'])
            })
          }
        }
      }
    }
  });

  const [removeSchedule, { loading: deleteScheduleLoading }] = useRemoveScheduleMutation({
    onError() {
      Alert.error(CANT_DELETE_DOCTOR_SCHEDULE)
      dispatch({ type: ActionType.SET_OPEN_SCHEDULE_DELETE, openScheduleDelete: false })
    },

    onCompleted(data) {
      if (data) {
        const { removeSchedule: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          fetchDoctorSchedules()
          dispatch({ type: ActionType.SET_OPEN_SCHEDULE_DELETE, openScheduleDelete: false })
        }
      }
    }
  });

  const handleDeleteSchedule = async () => {
    if (deleteScheduleId) {
      await removeSchedule({
        variables: {
          removeSchedule: { id: deleteScheduleId }
        }
      })
    }
  };

  const handleSlotCard = () => {
    dispatch({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: true })
    dispatch({ type: ActionType.SET_SCHEDULE_ID, scheduleId: '' })
    dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
  };

  const fetchDoctorSchedules = useCallback(async () => {
    try {
      await getDoctorSchedule({
        variables: { getDoctorSchedule: { id } }
      })
    } catch (error) { }
  }, [getDoctorSchedule, id]);

  useEffect(() => {
    id ?
      fetchDoctorSchedules()
      :
      Alert.error(DOCTOR_NOT_FOUND)
  }, [fetchDoctorSchedules, id])

  return (
    <Grid container spacing={3}>
      <Grid item md={6}>
        <CardComponent cardTitle={AVAILABILITY_TEXT}>
          {getSchedulesLoading ?
            <ViewDataLoader rows={5} columns={12} hasMedia={false} /> : (
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <Box maxHeight="calc(100vh - 248px)" className="overflowY-auto" pt={3}>
                    {byDaySchedules?.map((schedule: DaySchedule) => {
                      const { day, slots } = schedule || {}

                      return slots && slots.length > 0
                        && (
                          <Box key={day} className={classes.viewSlots} mb={3}>
                            <Typography className={classes.heading}>
                              {day}
                            </Typography>

                            {slots.map(slot => slot && <DoctorScheduleBox schedule={slot} dispatcher={dispatch} />)}
                          </Box>
                        )
                    })}
                  </Box>

                  <Box onClick={handleSlotCard} className={classes.addSlot} my={2}>
                    <AddSlotIcon />

                    <Typography>
                      {ADD_MORE_RECORDS_TEXT}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
        </CardComponent>
      </Grid>

      <DoctorScheduleModal
        id={scheduleId}
        isEdit={isEdit}
        isOpen={scheduleOpenModal}
        doctorDispatcher={dispatch}
        reload={fetchDoctorSchedules}
        doctorFacilityId={doctorFacilityId}
      />

      <ConfirmationModal
        title={DOCTOR_SCHEDULE}
        isOpen={openScheduleDelete}
        isLoading={deleteScheduleLoading}
        handleDelete={handleDeleteSchedule}
        description={DELETE_DOCTOR_SCHEDULE_DESCRIPTION}
        setOpen={(open: boolean) => dispatch({
          type: ActionType.SET_OPEN_SCHEDULE_DELETE, openScheduleDelete: open
        })}
      />
    </Grid>
  );
};

export default DoctorScheduleForm;
