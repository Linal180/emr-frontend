// packages block
import { ChangeEvent, Reducer, useReducer, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useParams } from 'react-router';
import { Box, Button, Tab } from "@material-ui/core";
// import { SubmitHandler, useForm } from "react-hook-form";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
//components block
import Insurance from './Insurance';
// import Selector from "../../../common/Selector";
import PortalTable from '../../../common/patient/portal';
import LabOrdersTable from '../../../common/patient/labOrders';
import DocumentsTable from '../../../common/patient/documents';
import ConfirmationModal from "../../../common/ConfirmationModal";
import PatientProfileHero from '../../../common/patient/profileHero';
// constants, history, styling block
import { ParamsType } from "../../../../interfacesTypes";
import { useProfileDetailsStyles } from "../../../../styles/profileDetails";
import { AttachmentsPayload, PatientPayload } from '../../../../generated/graphql';
import { patientReducer, Action, initialState, State, ActionType } from "../../../../reducers/patientReducer";
import {
  mediaReducer, Action as mediaAction, initialState as mediaInitialState, State as mediaState,
  ActionType as mediaActionType
} from "../../../../reducers/mediaReducer";
import {
  DELETE_WIDGET_DESCRIPTION, DELETE_WIDGET_TEXT, VIEW_CHART_TEXT, CHART_ROUTE, PATIENTS_ROUTE,
  PROFILE_TOP_TABS, UPCOMING_APPOINTMENTS, PAST_APPOINTMENTS, areaChartOne, areaChartTwo,
} from "../../../../constants";
import BarChart2Component from '../../../common/charts/barChart2';
import AppointmentsComponent from './appointmentsComponent';
import CareTeamComponent from './careTeam';
import AreaChartComponent from './charts';

const PatientDetailsComponent = (): JSX.Element => {
  // const widgetId = "widget-menu";
  const { id, tabValue: routeParamValue } = useParams<ParamsType>();
  const classes = useProfileDetailsStyles();
  const [{ openDelete, tabValue, patientData }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const [, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const handleDeleteWidget = () => { };

  useEffect(() => {
    if (routeParamValue) {
      dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: routeParamValue })
    }
  }, [routeParamValue])

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Box display="flex" flexWrap="wrap">
            <TabList onChange={handleChange} aria-label="Profile top tabs">
              {PROFILE_TOP_TABS.map(item => (
                <Tab key={`${item.title}-${item.value}`} label={item.title} value={item.value} />
              ))}
            </TabList>
          </Box>

          <Box pr={2}>
            <Link to={`${PATIENTS_ROUTE}/${id}${CHART_ROUTE}`}>
              <Button color="primary" variant="contained">{VIEW_CHART_TEXT}</Button>
            </Link>
          </Box>
        </Box>

        <Box className={classes.profileDetailsContainer}>
          <PatientProfileHero
            setPatient={(patient: PatientPayload['patient']) =>
              dispatch({ type: ActionType.SET_PATIENT_DATA, patientData: patient })
            }
            setAttachmentsData={(attachments: AttachmentsPayload['attachments']) =>
              mediaDispatcher({ type: mediaActionType.SET_ATTACHMENTS_DATA, attachmentsData: attachments })
            }
          />

          <TabPanel value="1">
            <Box display="flex">
              <AreaChartComponent data={areaChartOne} />
              <AreaChartComponent data={areaChartTwo} />
              <BarChart2Component />
            </Box>

            <AppointmentsComponent title={UPCOMING_APPOINTMENTS} />

            <Box display="flex">
              <CareTeamComponent />
              <AppointmentsComponent title={PAST_APPOINTMENTS} isMinWidth={true}/>
            </Box>


          </TabPanel>

          <TabPanel value="2">
            <Insurance />
          </TabPanel>

          <TabPanel value="8">
            <DocumentsTable />
          </TabPanel>

          <TabPanel value="9">
            <PortalTable inviteAccepted={Boolean(patientData?.inviteAccepted)} />
          </TabPanel>

          <TabPanel value="10">
            <LabOrdersTable />
          </TabPanel>
        </Box>
      </TabContext>

      <ConfirmationModal
        title={DELETE_WIDGET_TEXT}
        isOpen={openDelete}
        description={DELETE_WIDGET_DESCRIPTION}
        handleDelete={handleDeleteWidget}
        setOpen={(open: boolean) => dispatch({ type: ActionType.SET_OPEN_DELETE, openDelete: open })}
      />
    </Box>
  )
}

export default PatientDetailsComponent;
