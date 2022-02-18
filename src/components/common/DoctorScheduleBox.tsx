// packages block
import { FC } from "react";
import { Box, Typography } from "@material-ui/core";
// utils, constants and graphql
import { EditIcon, TrashIcon } from "../../assets/svgs";
import { getStandardTime } from "../../utils";
import { ActionType } from "../../reducers/doctorReducer";
import { DoctorScheduleProps } from "../../interfacesTypes";
import { useDoctorScheduleStyles } from "../../styles/doctorSchedule";
import { TO_TEXT, LOCATION, APPOINTMENT_TYPE, FROM_TEXT } from "../../constants";

const DoctorScheduleBox: FC<DoctorScheduleProps> = ({ dispatcher, schedule: {
  id, startAt, endAt, location, scheduleServices
} }) => {
  const classes = useDoctorScheduleStyles();
  const { name } = location || {}

  const handleEdit = (id: string) => {
    if (id) {
      dispatcher({ type: ActionType.SET_IS_EDIT, isEdit: true })
      dispatcher({ type: ActionType.SET_SCHEDULE_ID, scheduleId: id })
      dispatcher({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: true })
    }
  };

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatcher({ type: ActionType.SET_DELETE_SCHEDULE_ID, deleteScheduleId: id })
      dispatcher({ type: ActionType.SET_OPEN_SCHEDULE_DELETE, openScheduleDelete: true })
    }
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between">
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
          <TrashIcon />
        </Box>

        <Box className={classes.iconsBackground} onClick={() => handleEdit(id)}>
          <EditIcon />
        </Box>
      </Box>

      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
          <Typography className={classes.subHeading}>
            {FROM_TEXT}
          </Typography>

          <Typography className={classes.heading}>
            {getStandardTime(startAt)}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
          <Typography className={classes.subHeading}>
            {TO_TEXT}
          </Typography>

          <Typography className={classes.heading}>
            {getStandardTime(endAt)}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
            <Typography className={classes.subHeading}>
              {LOCATION}:
            </Typography><Box pr={1} />

            <Typography className={classes.heading}>
              {name}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
            <Typography className={classes.subHeading}>
              {APPOINTMENT_TYPE}
            </Typography><Box pr={1} />

            <Typography className={classes.heading}>
              {scheduleServices?.map(scheduleService => {
                const { service } = scheduleService || {}
                const { name } = service || {};

                return <Typography className={classes.heading}>{name}</Typography>
              })}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box pb={3} />
    </Box>
  )
};

export default DoctorScheduleBox;
