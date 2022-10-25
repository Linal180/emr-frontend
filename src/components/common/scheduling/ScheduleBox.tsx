// packages block
import { FC } from "react";
import { Box, Typography } from "@material-ui/core";
// utils, constants and graphql
import { getStandardTime } from "../../../utils";
import { ScheduleBoxProps } from "../../../interfacesTypes";
import { ActionType } from "../../../reducers/scheduleReducer";
import { EditNewIcon, TrashNewIcon } from "../../../assets/svgs";
import { useDoctorScheduleStyles } from "../../../styles/doctorSchedule";
import { TO_TEXT, APPOINTMENT_TYPE, FROM_TEXT } from "../../../constants";

const ScheduleBox: FC<ScheduleBoxProps> = ({
  dispatcher, isDoctor, schedule: { id, startAt, endAt, scheduleServices }
}) => {
  const classes = useDoctorScheduleStyles();

  const handleEdit = (id: string) => {
    if (id) {
      dispatcher({ type: ActionType.SET_IS_EDIT, isEdit: true })
      dispatcher({ type: ActionType.SET_SCHEDULE_ID, scheduleId: id })
      dispatcher({ type: ActionType.SET_BULK_EDIT, bulkEdit: false })
      dispatcher({ type: ActionType.SET_OPEN_MODAL, openModal: true })
    }
  };

  const onDeleteClick = (id: string) => {
    if (id) {
      dispatcher({ type: ActionType.SET_SCHEDULE_ID, scheduleId: id })
      dispatcher({ type: ActionType.SET_OPEN_DELETE, openDelete: true })
    }
  };

  return (
    <Box display="flex" pb={3} flexDirection="column" justifyContent="space-between">
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Box className={classes.iconsBackground} onClick={() => onDeleteClick(id || '')}>
          <TrashNewIcon />
        </Box>

        <Box className={classes.iconsBackground} onClick={() => handleEdit(id)}>
          <EditNewIcon />
        </Box>
      </Box>

      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
          <Typography className={classes.subHeading}>{FROM_TEXT}</Typography>
          <Typography className={classes.heading}>{getStandardTime(startAt)}</Typography>
        </Box>

        <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
          <Typography className={classes.subHeading}>{TO_TEXT}</Typography>
          <Typography className={classes.heading}>{getStandardTime(endAt)}</Typography>
        </Box>
      </Box>

      {isDoctor &&
        <Box>
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
              <Typography className={classes.subHeading}>
                {APPOINTMENT_TYPE}
              </Typography>

              <Box pr={1} />

              <Typography className={classes.heading}>
                {scheduleServices?.map(scheduleService => {
                  const { service } = scheduleService || {}
                  const { name } = service || {};

                  return <Typography className={classes.heading}>{name}</Typography>
                })}
              </Typography>
            </Box>
          </Box>
        </Box>}
    </Box>
  )
};

export default ScheduleBox;
