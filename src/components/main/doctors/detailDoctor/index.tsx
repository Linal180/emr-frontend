// packages block
import { ChangeEvent, Reducer, useReducer } from "react";
import { useParams } from "react-router";
import { Box, Grid, Tab, } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
// components block
import DoctorScheduleForm from "../schedules";
import AppointmentsTable from "../../../common/AppointmentsTable";
// constants, history, styling block
import { ParamsType } from "../../../../interfacesTypes";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { AttachmentsPayload, DoctorPayload, } from "../../../../generated/graphql";
import { DOCTOR_TOP_TABS, } from "../../../../constants";
import {
  doctorReducer, Action, initialState, State, ActionType
} from '../../../../reducers/doctorReducer';
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";
import DoctorProfileHero from "./profileHero";

const DoctorDetailComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const { id } = useParams<ParamsType>();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)
  const { doctorFacilityId, currentTab, } = state;
  const [, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

  const handleChange = (_: ChangeEvent<{}>, value: string) => dispatch({
    type: ActionType.SET_CURRENT_TAB, currentTab: value
  })

  return (
    <Box>
      <TabContext value={currentTab}>
        <TabList onChange={handleChange} aria-label="Profile top tabs">
          {DOCTOR_TOP_TABS.map(item => (
            <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
          ))}
        </TabList>

        <Box className={classes.profileDetailsContainer}>
          <DoctorProfileHero
            setDoctor={(doctor: DoctorPayload['doctor']) =>
              dispatch({ type: ActionType.SET_DOCTOR, doctor: doctor })
            }
            setAttachmentsData={(attachments: AttachmentsPayload['attachments']) =>
              mediaDispatcher({ type: mediaActionType.SET_ATTACHMENTS_DATA, attachmentsData: attachments })
            }
          />

          <TabPanel value="1" />
          <TabPanel value="2">
            <Grid spacing={3}>
              <DoctorScheduleForm doctorFacilityId={doctorFacilityId} />
            </Grid>
          </TabPanel>

          <TabPanel value="3">
            <Grid>
              <AppointmentsTable doctorId={id} />
            </Grid>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  )
}

export default DoctorDetailComponent;
