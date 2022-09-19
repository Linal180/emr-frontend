// packages block
import { Box, Button, Card, Grid, Tab, } from "@material-ui/core";
import { PrintOutlined } from "@material-ui/icons";
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { ChangeEvent, FC, ReactElement, Reducer, useContext, useReducer, useState } from 'react';
// components block
import ChartPrintModal from "./ChartModal/ChartPrintModal";
import ChartSelectionModal from './ChartModal/ChartSelectionModal';
import AllergyTab from './tabs/AllergyListing';
import HistoryTab from './tabs/HistoryTab';
import MedicationTab from './tabs/MedicationsListing';
import ProblemTab from './tabs/ProblemListing';
import TriageNoteTab from './tabs/TriageNotesListing';
import Alert from "../../../common/Alert";
import Loader from "../../../common/Loader";
import VitalTab from './tabs/VitalListing';
// interfaces, graphql, constants block /styles
import { useParams } from "react-router";
import { DISCHARGE, PATIENT_CHARTING_TABS, PATIENT_DISCHARGED_SUCCESS, PRINT_CHART } from "../../../../constants";
import { AuthContext, ChartContextProvider } from '../../../../context';
import { AppointmentStatus, useUpdateAppointmentStatusMutation } from "../../../../generated/graphql";
import { ChartComponentProps, ParamsType } from "../../../../interfacesTypes";
import { Action, ActionType, initialState, patientReducer, State } from "../../../../reducers/patientReducer";
import { useChartingStyles } from "../../../../styles/chartingStyles";
import { BLUE, GRAY_SIMPLE, WHITE } from '../../../../theme';
import { isAdmin, isOnlyDoctor } from "../../../../utils";
import { DischargeIcon } from "../../../../assets/svgs";

const ChartCards: FC<ChartComponentProps> = ({ shouldDisableEdit, status }): JSX.Element => {
  const classes = useChartingStyles()
  const { user } = useContext(AuthContext);
  const { roles } = user || {}
  const isAdminUser = isAdmin(roles)
  const isDoctorUser = isOnlyDoctor(roles)
  const { appointmentId } = useParams<ParamsType>()
  const [isChartingModalOpen, setIsChartingModalOpen] = useState(false)
  const [modulesToPrint, setModulesToPrint] = useState<string[]>([])
  const [isChartPdfModalOpen, setIsChartPdfModalOpen] = useState<boolean>(false)
  const [{ tabValue }, dispatch] =
    useReducer<Reducer<State, Action>>(patientReducer, initialState)

  const handleChange = (_: ChangeEvent<{}>, newValue: string) =>
    dispatch({ type: ActionType.SET_TAB_VALUE, tabValue: newValue })

  const [updateAppointmentStatus, { loading: updateAppointmentStatusLoading }] = useUpdateAppointmentStatusMutation({
    onError({ message }) {
      Alert.error(message)
    },

    async onCompleted(data) {
      if (data) {
        const { updateAppointmentStatus } = data;
        const { response } = updateAppointmentStatus || {}

        if (response) {
          const { status } = response
          if (status === 200) {

            Alert.success(PATIENT_DISCHARGED_SUCCESS)
          }
        }
      }
    }
  });

  const updateAppointment = async () => {
    try {
      await updateAppointmentStatus({
        variables: {
          appointmentStatusInput: {
            id: appointmentId || '',
            status: AppointmentStatus.Discharged
          }
        }
      })
    } catch (error) { }
  }

  if (updateAppointmentStatusLoading) {
    return <Loader loading loaderText="Discharging Patient..." />
  }

  const isPatientDischarged = status === AppointmentStatus.Checkout || status === AppointmentStatus.Discharged

  return (
    <Box mt={3}>
      <Box mb={2} px={2} display='flex' justifyContent='flex-end'>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          startIcon={
            <Box width={20} color={WHITE}><PrintOutlined /></Box>
          }
          onClick={() => setIsChartingModalOpen(true)}
        >
          {PRINT_CHART}
        </Button>
      </Box>

      <TabContext value={tabValue}>
        <Grid container spacing={3}>
          <Grid item lg={2} md={3} sm={12} xs={12}>
            <Card>
              <Box p={3} className={classes.cardBox} minHeight={250}>
                <TabList className={classes.tabList}
                  orientation='vertical'
                  onChange={handleChange}
                  aria-label="communication tabs"
                >
                  {PATIENT_CHARTING_TABS.map(item => {
                    const { icon: Icon, title, value } = item

                    return <Tab className={classes.tab}
                      key={`${title}-${value}`} label={title}
                      value={value} icon={<Icon /> as unknown as ReactElement}
                    />
                  })}
                </TabList>

                {appointmentId && (isAdminUser || isDoctorUser) &&
                  <Box pl={2} mt={1} display="flex" justifyContent="flex-start" alignItems="center" width={230}
                    minHeight={52} bgcolor={isPatientDischarged ? GRAY_SIMPLE : BLUE} borderRadius={4}

                  >
                    <Button
                      variant="text"
                      size="small"
                      color={"inherit"}
                      startIcon={<DischargeIcon color={isPatientDischarged ? "black" : 'white'} />}
                      onClick={updateAppointment}
                      disabled={isPatientDischarged}
                    >
                      <Box component="span" color={isPatientDischarged ? "black" : "white"} >
                        {isPatientDischarged ? AppointmentStatus.Discharged : DISCHARGE}
                      </Box>
                    </Button>
                  </Box>
                }
              </Box>
            </Card>
          </Grid>

          <Grid item lg={10} md={9} sm={12} xs={12}>
            <Box className={classes.tabPanelPadding}>
              <Box pt={0} borderRadius={8}>
                <TabPanel value="1">
                  <TriageNoteTab shouldDisableEdit={shouldDisableEdit} />
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="2">
                  <VitalTab shouldDisableEdit={shouldDisableEdit} />
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="3">
                  <ProblemTab shouldDisableEdit={shouldDisableEdit} />
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="4">
                  <ChartContextProvider>
                    <AllergyTab shouldDisableEdit={shouldDisableEdit} />
                  </ChartContextProvider>
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="5">
                  <ChartContextProvider>
                    <MedicationTab shouldDisableEdit={shouldDisableEdit} />
                  </ChartContextProvider>
                </TabPanel>
              </Box>

              <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                <TabPanel value="6">
                  <ChartContextProvider>
                    <HistoryTab shouldDisableEdit={shouldDisableEdit} />
                  </ChartContextProvider>
                </TabPanel>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </TabContext>
      {isChartingModalOpen && <ChartSelectionModal
        isOpen={isChartingModalOpen}
        handleClose={() => setIsChartingModalOpen(false)}
        setIsChartPdfModalOpen={setIsChartPdfModalOpen}
        modulesToPrint={modulesToPrint}
        setModulesToPrint={setModulesToPrint}
      />}

      {isChartPdfModalOpen && <ChartPrintModal
        modulesToPrint={modulesToPrint}
        isOpen={isChartPdfModalOpen}
        handleClose={() => setIsChartPdfModalOpen(false)}
      />}
    </Box>
  )
};

export default ChartCards;
