// packages block
import { FC, Reducer, useEffect, useReducer, useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { useParams } from "react-router";
// components block
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block
import { ADD_MORE_RECORDS_TEXT, AVAILABILITY_TEXT } from "../../../../constants";
import { useDoctorScheduleStyles } from '../../../../styles/doctorSchedule';
import { AddSlotIcon } from '../../../../assets/svgs';
import DoctorScheduleModal from "./ScheduleSlotModal";
import {
  doctorReducer, Action, initialState, State, ActionType
} from '../../../../reducers/doctorReducer';
import { DoctorScheduleSlotProps, ParamsType } from "../../../../interfacesTypes";
import { SchedulePayload, SchedulesPayload, useGetDoctorScheduleLazyQuery } from "../../../../generated/graphql";

const DoctorScheduleForm: FC<DoctorScheduleSlotProps> = ({ doctorFacilityId }) => {
  const classes = useDoctorScheduleStyles();
  const { id } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { scheduleOpenModal } = state;
  const [schedules, setSchedules] = useState<SchedulesPayload['schedules']>([]);

  const [getDoctorSchedules, { loading: allDoctorSlotsLoading }] = useGetDoctorScheduleLazyQuery({
    variables: {
      getDoctorSchedule: {
        id: id
      }
    },

    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setSchedules([]);
    },

    onCompleted(data) {
      const { getDoctorSchedules } = data || {};

      if (getDoctorSchedules) {
        const { schedules } = getDoctorSchedules
        schedules && setSchedules(schedules as SchedulesPayload['schedules'])
      }
    }
  });

  const handleSlotCard = () => {
    dispatch({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: true })
  };

  useEffect(() => {
    getDoctorSchedules()
  }, [getDoctorSchedules])

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <CardComponent cardTitle={AVAILABILITY_TEXT}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                {schedules?.map((record: SchedulePayload['schedule']) => {
                  const { startAt, location, scheduleServices, endAt } = record || {}
                  return (
                    <Box>
                      <Box>
                        {startAt}
                      </Box>
                      <Box>
                        {endAt}
                      </Box>
                      <Box>
                        {location}
                      </Box>
                      <Box>
                        {scheduleServices}
                      </Box>
                    </Box>
                  )
                })}
                <Box onClick={handleSlotCard} className={classes.addSlot} mb={2}>
                  <AddSlotIcon />
                  <Typography>
                    {ADD_MORE_RECORDS_TEXT}
                  </Typography>

                  <DoctorScheduleModal
                    isOpen={scheduleOpenModal}
                    doctorDispatcher={dispatch}
                    doctorFacilityId={doctorFacilityId}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardComponent>
        </Grid>
      </Grid >
    </>
  );
};

export default DoctorScheduleForm;
