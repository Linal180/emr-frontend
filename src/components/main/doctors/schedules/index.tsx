// packages block
import { FC, Reducer, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import { Box, Grid, Typography } from "@material-ui/core";
// components block
import Alert from "../../../common/Alert";
import DoctorScheduleModal from "./ScheduleSlotModal";
import CardComponent from "../../../common/CardComponent";
import ViewDataLoader from "../../../common/ViewDataLoader";
import DoctorScheduleBox from "../../../common/DoctorScheduleBox";
// interfaces, graphql, constants block
import { getDaySchedules } from "../../../../utils";
import { AddSlotIcon, EditIcon } from '../../../../assets/svgs';
import { useDoctorScheduleStyles } from '../../../../styles/doctorSchedule';
import { DaySchedule, DoctorScheduleSlotProps, ParamsType } from "../../../../interfacesTypes";
import {
  doctorReducer, Action, initialState, State, ActionType
} from '../../../../reducers/doctorReducer';
import {
  SchedulesPayload, useGetDoctorScheduleLazyQuery
} from "../../../../generated/graphql";
import {
  ADD_MORE_RECORDS_TEXT, AVAILABILITY_TEXT, DOCTOR_NOT_FOUND
} from "../../../../constants";

const DoctorScheduleForm: FC<DoctorScheduleSlotProps> = ({ doctorFacilityId }) => {
  const classes = useDoctorScheduleStyles();
  const { id } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { scheduleOpenModal, byDaySchedules, isEdit, scheduleId } = state;

  const [getDoctorSchedules, { loading: getSchedulesLoading }] = useGetDoctorScheduleLazyQuery({
    variables: {
      getDoctorSchedule: { id }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      dispatch({ type: ActionType.SET_DOCTOR_SCHEDULES, doctorSchedules: [] })
    },

    onCompleted(data) {
      const { getDoctorSchedules: { schedules } } = data || {};

      if (schedules && schedules.length > 0) {
        dispatch({
          type: ActionType.SET_DOCTOR_SCHEDULES, doctorSchedules: schedules as SchedulesPayload['schedules']
        });

        dispatch({
          type: ActionType.SET_BY_DAY_SCHEDULES,
          byDaySchedules: getDaySchedules(schedules as SchedulesPayload['schedules'])
        })
      }
    }
  });

  const handleSlotCard = () => {
    dispatch({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: true })
    dispatch({ type: ActionType.SET_SCHEDULE_ID, scheduleId: '' })
  };

  const handleEdit = (id: string) => {
    if (id) {
      dispatch({ type: ActionType.SET_IS_EDIT, isEdit: true })
      dispatch({ type: ActionType.SET_SCHEDULE_ID, scheduleId: id })
    }
  };

  useEffect(() => {
    if (id) {
      getDoctorSchedules()
    } else
      Alert.error(DOCTOR_NOT_FOUND)
  }, [getDoctorSchedules, id])

  return (
    <Grid container spacing={3}>
      <Grid item md={6}>
        <CardComponent cardTitle={AVAILABILITY_TEXT}>
          {getSchedulesLoading ?
            <ViewDataLoader rows={5} columns={12} hasMedia={false} /> : (
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <Box display="flex" flexDirection="column" justifyContent="space-between" pt={3}>
                    {byDaySchedules?.map((schedule: DaySchedule) => {
                      const { day, slots } = schedule || {}

                      return slots && slots.length > 0
                        && (
                          <Box className={classes.viewSlots} mb={3}>
                            <Box display="flex" flexDirection="row" justifyContent="space-between">
                              <Typography className={classes.heading}>
                                {day}
                              </Typography>

                              <Box className={classes.iconsBackground} onClick={() => handleEdit(id)}>
                                <EditIcon />
                              </Box>
                            </Box>

                            {slots.map(slot => slot && <DoctorScheduleBox schedule={slot} />)}
                          </Box>
                        )
                    })}
                  </Box>

                  <Box onClick={handleSlotCard} className={classes.addSlot} mb={2}>
                    <AddSlotIcon />

                    <Typography>
                      {ADD_MORE_RECORDS_TEXT}
                    </Typography>

                    <DoctorScheduleModal
                      id={scheduleId}
                      isEdit={isEdit}
                      isOpen={scheduleOpenModal}
                      doctorDispatcher={dispatch}
                      reload={getDoctorSchedules}
                      doctorFacilityId={doctorFacilityId}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
        </CardComponent>
      </Grid>
    </Grid>
  );
};

export default DoctorScheduleForm;
