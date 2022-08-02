// packages block
import { ChangeEvent, Reducer, useReducer } from "react";
import { Box, Grid, Tab, } from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
// components block
import DoctorProfileHero from "./profileHero";
import ScheduleListing from "../../../common/scheduling/Listing";
import AppointmentsTable from "../../../common/AppointmentsTable";
// constants, history, styling block
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

const DoctorDetailComponent = (): JSX.Element => {
  const classes = useProfileDetailsStyles()
  const [state, dispatch] = useReducer<Reducer<State, Action>>(doctorReducer, initialState)

  const { currentTab, doctor } = state;
  const { facilityId: doctorFacilityId } = doctor || {}
  const [, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

  const handleChange = (_: ChangeEvent<{}>, value: string) => dispatch({
    type: ActionType.SET_CURRENT_TAB, currentTab: value
  })

  return (
    <Box>
      <TabContext value={currentTab}>
        <Box width='100%'>
          <TabList onChange={handleChange} aria-label="Profile top tabs">
            {DOCTOR_TOP_TABS.map(item => (
              <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
            ))}
          </TabList>
        </Box>

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

              <Grid md={6}>
                <ScheduleListing isDoctor doctorFacilityId={doctorFacilityId || ''} />
              </Grid>

            </Grid>
          </TabPanel>

          <TabPanel value="3">
            <Grid>
              <AppointmentsTable />
            </Grid>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  )
}

export default DoctorDetailComponent;
