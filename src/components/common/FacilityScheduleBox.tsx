// packages block
import { FC } from "react";
import { Box, Typography } from "@material-ui/core";
// utils, constants and graphql
import { getStandardTime } from "../../utils";
import { TO_TEXT, FROM_TEXT } from "../../constants";
import { EditIcon, TrashIcon } from "../../assets/svgs";
import { ActionType } from "../../reducers/facilityReducer";
import { FacilityScheduleProps } from "../../interfacesTypes";
import { useDoctorScheduleStyles } from "../../styles/doctorSchedule";

const FacilityScheduleBox: FC<FacilityScheduleProps> = ({ dispatcher, schedule: {
  id, startAt, endAt
} }) => {
  const classes = useDoctorScheduleStyles();

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
    <Box display="flex" pb={3} flexDirection="column" justifyContent="space-between">
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
          <Typography className={classes.subHeading}>{FROM_TEXT}</Typography>
          <Typography className={classes.heading}>{getStandardTime(startAt)}</Typography>
        </Box>

        <Box display="flex" flexDirection="row" justifyContent="space-between" width={'50%'} padding={2}>
          <Typography className={classes.subHeading}>{TO_TEXT}</Typography>
          <Typography className={classes.heading}>{getStandardTime(endAt)}</Typography>
        </Box>
      </Box>
    </Box>
  )
};

export default FacilityScheduleBox;
