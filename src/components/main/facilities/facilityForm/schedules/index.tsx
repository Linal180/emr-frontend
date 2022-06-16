// packages block
import { useParams } from "react-router";
import { Box, Grid, Typography } from "@material-ui/core";
import { FC, Reducer, useCallback, useEffect, useReducer } from "react";
// components block
import Alert from "../../../../common/Alert";
import CardComponent from "../../../../common/CardComponent";
import ViewDataLoader from "../../../../common/ViewDataLoader";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import FacilityScheduleBox from "../../../../common/FacilityScheduleBox";
// interfaces, graphql, constants block
import { getDaySchedules } from "../../../../../utils";
import { AddSlotIcon } from '../../../../../assets/svgs';
import { DaySchedule, ParamsType } from "../../../../../interfacesTypes";
import { useDoctorScheduleStyles } from '../../../../../styles/doctorSchedule';
import {
  facilityReducer, Action, initialState, State, ActionType
} from '../../../../../reducers/facilityReducer';
import {
  SchedulesPayload, useGetFacilityScheduleLazyQuery, useRemoveScheduleMutation
} from "../../../../../generated/graphql";
import {
  ADD_MORE_RECORDS_TEXT, AVAILABILITY_TEXT, CANT_DELETE_DOCTOR_SCHEDULE, DELETE_FACILITY_SCHEDULE_DESCRIPTION,
  DOCTOR_NOT_FOUND, FACILITY_SCHEDULE
} from "../../../../../constants";
import ScheduleModal from "../../../../common/ScheduleModal";

const FacilityScheduleForm: FC = () => {
  const classes = useDoctorScheduleStyles();
  const { id } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(facilityReducer, initialState)
  const { scheduleOpenModal, byDaySchedules, isEdit, scheduleId, deleteScheduleId, openScheduleDelete } = state;

  const [getFacilitySchedule, { loading: getSchedulesLoading }] = useGetFacilityScheduleLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_FACILITY_SCHEDULES, facilitySchedules: [] });
    },

    onCompleted(data) {
      const { getFacilitySchedule } = data || {};

      if (getFacilitySchedule) {
        const { schedules, response } = getFacilitySchedule

        if (schedules && response) {
          const { status } = response || {}
          if (status && status === 200 && schedules) {
            dispatch({
              type: ActionType.SET_FACILITY_SCHEDULES, facilitySchedules: schedules as SchedulesPayload['schedules']
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
          fetchFacilitySchedules()
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

  const fetchFacilitySchedules = useCallback(async () => {
    try {
      await getFacilitySchedule({
        variables: { getFacilitySchedule: { id } }
      })
    } catch (error) { }
  }, [getFacilitySchedule, id]);

  useEffect(() => {
    id ?
      fetchFacilitySchedules()
      :
      Alert.error(DOCTOR_NOT_FOUND)
  }, [fetchFacilitySchedules, id])

  return (
    <Grid container spacing={3}>
      <Grid item md={6}>
        <CardComponent cardTitle={AVAILABILITY_TEXT}>
          {getSchedulesLoading ?
            <ViewDataLoader rows={5} columns={12} hasMedia={false} /> : (
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <Box onClick={handleSlotCard} className={classes.addSlot} my={2}>
                    <AddSlotIcon />

                    <Typography>
                      {ADD_MORE_RECORDS_TEXT}
                    </Typography>
                  </Box>

                  <Box>
                    {byDaySchedules?.map((schedule: DaySchedule) => {
                      const { day, slots } = schedule || {}

                      return slots && slots.length > 0
                        && (
                          <Box key={day} className={classes.viewSlots} mb={3}>
                            <Typography className={classes.heading}>
                              {day}
                            </Typography>

                            {slots.map(slot => slot && <FacilityScheduleBox schedule={slot} dispatcher={dispatch} />)}
                          </Box>
                        )
                    })}
                  </Box>
                </Grid>
              </Grid>
            )}
        </CardComponent>
      </Grid>

      <ScheduleModal
        id={scheduleId}
        isEdit={isEdit}
        isOpen={scheduleOpenModal}
        facilityDispatcher={dispatch}
        reload={fetchFacilitySchedules}
      />

      <ConfirmationModal
        title={FACILITY_SCHEDULE}
        isOpen={openScheduleDelete}
        isLoading={deleteScheduleLoading}
        handleDelete={handleDeleteSchedule}
        description={DELETE_FACILITY_SCHEDULE_DESCRIPTION}
        setOpen={(open: boolean) => dispatch({
          type: ActionType.SET_OPEN_SCHEDULE_DELETE, openScheduleDelete: open
        })}
      />
    </Grid>
  );
};

export default FacilityScheduleForm;
