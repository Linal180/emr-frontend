// packages block
import { FC, Reducer, useReducer } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
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
import { DoctorScheduleSlotProps } from "../../../../interfacesTypes";

const DoctorScheduleForm: FC<DoctorScheduleSlotProps> = ({ doctorFacilityId }) => {
  const classes = useDoctorScheduleStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { scheduleOpenModal } = state;

  const handleSlotCard = () => {
    dispatch({ type: ActionType.SET_SCHEDULE_OPEN_MODAL, scheduleOpenModal: true })
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <CardComponent cardTitle={AVAILABILITY_TEXT}>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
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
