// packages block
import { FC, Reducer, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router";
import { Box, Grid, Typography } from "@material-ui/core";
// components block
import DoctorScheduleModal from "./ScheduleSlotModal";
import CardComponent from "../../../common/CardComponent";
// interfaces, graphql, constants block
import { AddSlotIcon, EditIcon } from '../../../../assets/svgs';
import { useDoctorScheduleStyles } from '../../../../styles/doctorSchedule';
import { DoctorScheduleSlotProps, ParamsType } from "../../../../interfacesTypes";
import {
  doctorReducer, Action, initialState, State, ActionType
} from '../../../../reducers/doctorReducer';
import {
  SchedulePayload, SchedulesPayload, useGetDoctorScheduleLazyQuery
} from "../../../../generated/graphql";
import {
  ADD_MORE_RECORDS_TEXT, APPOINTMENT_TYPE, AVAILABILITY_TEXT, FORM_TEXT, LOCATION, TO_TEXT
} from "../../../../constants";

const DoctorScheduleForm: FC<DoctorScheduleSlotProps> = ({ doctorFacilityId }) => {
  const classes = useDoctorScheduleStyles();
  const { id } = useParams<ParamsType>();
  const [{ scheduleOpenModal }, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const [schedules, setSchedules] = useState<SchedulesPayload['schedules']>([]);

  const [getDoctorSchedules,] = useGetDoctorScheduleLazyQuery({
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

  // const handleEdit = (id: string) => {
  //   if (id) {
  //     dispatch({ type: ActionType.SET_SERVICE_ID, serviceId: id })
  //     dispatch({ type: ActionType.SET_IS_EDIT, isEdit: true })
  //     dispatch({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: true })

  //   }
  // };

  useEffect(() => {
    getDoctorSchedules()
  }, [getDoctorSchedules])

  return (
    <Grid container spacing={3}>
      <Grid item md={6}>
        <CardComponent cardTitle={AVAILABILITY_TEXT}>
          <Grid container spacing={3}>
            <Grid item md={12} sm={12} xs={12}>
              <Box display="flex" flexDirection="column" justifyContent="space-between" pt={3}>
                {schedules?.map((record: SchedulePayload['schedule']) => {
                  const { startAt, location, scheduleServices, endAt } = record || {}
                  const { name } = location || {}


                  return (
                    <Box className={classes.viewSlots} mb={3}>
                      <Box display="flex" flexDirection="row" justifyContent="space-between">
                        <Typography className={classes.heading}>
                          Monday
                        </Typography>

                        <Box className={classes.iconsBackground} >
                          <EditIcon />
                        </Box>
                      </Box>

                      <Box display="flex" flexDirection="column" justifyContent="space-between">
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                          <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
                            <Typography className={classes.subHeading}>
                              {FORM_TEXT}
                            </Typography>

                            <Typography className={classes.heading}>
                              {startAt}
                            </Typography>
                          </Box>

                          <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
                            <Typography className={classes.subHeading}>
                              {TO_TEXT}
                            </Typography>

                            <Typography className={classes.heading}>
                              {endAt}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
                              <Typography className={classes.subHeading}>
                                {LOCATION}:
                              </Typography>

                              <Typography className={classes.heading}>
                                {name}
                              </Typography>
                            </Box>

                            <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
                              <Typography className={classes.subHeading}>
                                {APPOINTMENT_TYPE}
                              </Typography>

                              <Typography className={classes.heading}>
                                {scheduleServices?.map(scheduleService => {
                                  const { service } = scheduleService || {}
                                  const { name } = service || {};

                                  return (
                                    <Typography className={classes.heading}>{name}</Typography>
                                  )
                                })}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
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
                  isOpen={scheduleOpenModal}
                  doctorDispatcher={dispatch}
                  doctorFacilityId={doctorFacilityId}
                />
              </Box>
            </Grid>
          </Grid>
        </CardComponent>
      </Grid>
    </Grid>
  );
};

export default DoctorScheduleForm;
