// packages block
import { useParams } from "react-router";
import { Box, Grid, Typography } from "@material-ui/core";
import { FC, Reducer, useCallback, useContext, useEffect, useReducer } from "react";
// components block
import Alert from "../Alert";
import ScheduleBox from "./ScheduleBox";
import CardComponent from "../CardComponent";
import ViewDataLoader from "../ViewDataLoader";
import ScheduleModal from "../scheduling/FormModal";
import ConfirmationModal from "../ConfirmationModal";
// interfaces, graphql, constants block
import { getDaySchedules } from "../../../utils";
import { AddSlotIcon } from '../../../assets/svgs';
import { useDoctorScheduleStyles } from '../../../styles/doctorSchedule';
import { DaySchedule, ScheduleListingProps, ParamsType } from "../../../interfacesTypes";
import {
  scheduleReducer, Action, initialState, State, ActionType
} from '../../../reducers/scheduleReducer';
import {
  SchedulesPayload, useGetDoctorScheduleLazyQuery, useGetFacilityScheduleLazyQuery, useRemoveScheduleMutation
} from "../../../generated/graphql";
import {
  ADD_MORE_RECORDS_TEXT, AVAILABILITY_TEXT, CANT_DELETE_SCHEDULE, DELETE_DOCTOR_SCHEDULE_DESCRIPTION,
  DELETE_FACILITY_SCHEDULE_DESCRIPTION, DOCTOR_SCHEDULE, FACILITY_SCHEDULE, SOMETHING_WENT_WRONG,
} from "../../../constants";
import { AuthContext } from "../../../context";

const ScheduleListing: FC<ScheduleListingProps> = ({ isDoctor, doctorFacilityId, doctorId }) => {
  const { id } = useParams<ParamsType>();
  const classes = useDoctorScheduleStyles();
  const { user } = useContext(AuthContext)
  const { facility } = user || {}

  const { id: facilityId } = facility || {}
  const [state, dispatch] = useReducer<Reducer<State, Action>>(scheduleReducer, initialState)
  const { openModal, byDaySchedules, isEdit, scheduleId, openDelete } = state;

  const setSchedulesData = (schedules: SchedulesPayload['schedules']) => {
    dispatch({
      type: ActionType.SET_SCHEDULES, schedules: schedules as SchedulesPayload['schedules']
    });

    dispatch({
      type: ActionType.SET_BY_DAY_SCHEDULES,
      byDaySchedules: getDaySchedules(schedules as SchedulesPayload['schedules'])
    })
  }

  const emptySchedules = () =>
    dispatch({ type: ActionType.SET_SCHEDULES, schedules: [] });

  const [getFacilitySchedule, { loading: facilitySchedulesLoading }] = useGetFacilityScheduleLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      emptySchedules()
    },

    onCompleted(data) {
      const { getFacilitySchedule } = data || {};

      if (getFacilitySchedule) {
        const { schedules, response } = getFacilitySchedule

        if (schedules && response) {
          const { status } = response || {}
          status && status === 200 && setSchedulesData(schedules as SchedulesPayload['schedules'])
        }
      }
    }
  });

  const [getDoctorSchedule, { loading: doctorSchedulesLoading }] = useGetDoctorScheduleLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      emptySchedules()
    },

    onCompleted(data) {
      const { getDoctorSchedule } = data || {};

      if (getDoctorSchedule) {
        const { schedules, response } = getDoctorSchedule

        if (schedules && response) {
          const { status } = response || {}
          status && status === 200 && setSchedulesData(schedules as SchedulesPayload['schedules'])
        }
      }
    }
  });

  const [removeSchedule, { loading: deleteScheduleLoading }] = useRemoveScheduleMutation({
    onError() {
      Alert.error(CANT_DELETE_SCHEDULE)
      dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
    },

    onCompleted(data) {
      if (data) {
        const { removeSchedule: { response } } = data

        if (response) {
          const { message } = response
          message && Alert.success(message);
          fetchSchedules()
          dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: false })
        }
      }
    }
  });

  const handleDeleteSchedule = async () =>
    scheduleId && await removeSchedule({
      variables: { removeSchedule: { id: scheduleId } }
    });

  const handleSlotCard = () => {
    dispatch({ type: ActionType.SET_OPEN_MODAL, openModal: true })
    dispatch({ type: ActionType.SET_SCHEDULE_ID, scheduleId: '' })
    dispatch({ type: ActionType.SET_IS_EDIT, isEdit: false })
  };

  const fetchSchedules = useCallback(async () => {
    try {
      if (id || doctorId || facilityId) {
        isDoctor ?
          (id || doctorId) &&
          await getDoctorSchedule({
            variables: {
              getDoctorSchedule: { id: doctorId ? doctorId : id }
            }
          })
          : (id || facilityId) &&
          await getFacilitySchedule({
            variables: {
              getFacilitySchedule: { id: id ? id : facilityId || '' }
            }
          })
      } else Alert.error(SOMETHING_WENT_WRONG)
    } catch (error) { }
  }, [doctorId, facilityId, getDoctorSchedule, getFacilitySchedule, id, isDoctor]);

  useEffect(() => {
    fetchSchedules()
  }, [doctorId, fetchSchedules, id])

  const getLoading = facilitySchedulesLoading || doctorSchedulesLoading

  return (
    <>
      <CardComponent cardTitle={AVAILABILITY_TEXT}>
        <Grid container spacing={3}>
          <Grid item md={12} sm={12} xs={12}>
            <Box onClick={handleSlotCard} className={classes.addSlot} my={2}>
              <AddSlotIcon />

              <Typography>
                {ADD_MORE_RECORDS_TEXT}
              </Typography>
            </Box>

            {getLoading ?
              <ViewDataLoader rows={5} columns={12} hasMedia={false} /> : (
                <Box>
                  {byDaySchedules?.map((schedule: DaySchedule) => {
                    const { day, slots } = schedule || {}

                    return slots && slots.length > 0
                      && (
                        <Box key={day} className={classes.viewSlots} mb={3}>
                          <Typography className={classes.heading}>
                            {day}
                          </Typography>

                          {slots.map(slot => slot &&
                            <ScheduleBox schedule={slot} isDoctor={isDoctor} dispatcher={dispatch} />
                          )}
                        </Box>
                      )
                  })}
                </Box>
              )}
          </Grid>
        </Grid>
      </CardComponent>

      <ScheduleModal
        state={state}
        id={scheduleId}
        isEdit={isEdit}
        isOpen={openModal}
        isDoctor={isDoctor}
        scheduleDispatch={dispatch}
        doctorFacilityId={doctorFacilityId}
        reload={fetchSchedules}
      />

      <ConfirmationModal
        isOpen={openDelete}
        isLoading={deleteScheduleLoading}
        title={isDoctor ? DOCTOR_SCHEDULE : FACILITY_SCHEDULE}
        description={isDoctor ? DELETE_DOCTOR_SCHEDULE_DESCRIPTION : DELETE_FACILITY_SCHEDULE_DESCRIPTION}
        handleDelete={handleDeleteSchedule}
        setOpen={(open: boolean) => dispatch({
          type: ActionType.SET_OPEN_DELETE, openDelete: open
        })}
      />
    </>
  );
};

export default ScheduleListing;
