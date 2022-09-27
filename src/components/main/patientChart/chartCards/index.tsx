// packages block
import { useParams } from "react-router";
import { ChevronRight, PrintOutlined } from "@material-ui/icons";
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Box, Button, Card, colors, Grid, Tab, Typography } from "@material-ui/core";
import { ChangeEvent, FC, ReactElement, Reducer, useContext, useReducer, useState } from 'react';
// components block
import Vaccines from '../vaccines';
import Alert from "../../../common/Alert";
import HistoryTab from './tabs/HistoryTab';
import VitalTab from './tabs/VitalListing';
import Loader from "../../../common/Loader";
import AllergyTab from './tabs/AllergyListing';
import ProblemTab from './tabs/ProblemListing';
import LatestVitalCard from "../latestVitalCard";
import MedicationTab from './tabs/MedicationsListing';
import TriageNoteTab from './tabs/TriageNotesListing';
import ChartPrintModal from "./ChartModal/ChartPrintModal";
import LabOrdersTable from "../../../common/patient/labOrders";
import ConfirmationModal from "../../../common/ConfirmationModal";
import ChartSelectionModal from './ChartModal/ChartSelectionModal';
// interfaces, graphql, constants block /styles
import { DischargeIcon } from "../../../../assets/svgs";
import {
  CHART_TEXT, CONFIRMATION_MODAL_TYPE, DISCHARGE, DISCHARGE_PATIENT_DESCRIPTION, PATIENT_CHARTING_TABS, PATIENT_DISCHARGED, PATIENT_DISCHARGED_SUCCESS,
  PRINT_CHART,
  TO_BILLING
} from "../../../../constants";
import { AuthContext, ChartContextProvider } from '../../../../context';
import { AppointmentStatus, useUpdateAppointmentStatusMutation } from "../../../../generated/graphql";
import { ChartComponentProps, ParamsType } from "../../../../interfacesTypes";
import { Action, ActionType, initialState, patientReducer, State } from "../../../../reducers/patientReducer";
import { useChartingStyles } from "../../../../styles/chartingStyles";
import { BLUE, GRAY_SIMPLE, WHITE } from '../../../../theme';
import { isAdmin, isOnlyDoctor } from "../../../../utils";

const ChartCards: FC<ChartComponentProps> = ({ shouldDisableEdit, status, appointmentInfo, fetchAppointment, labOrderHandler }): JSX.Element => {
  const classes = useChartingStyles()
  const { user } = useContext(AuthContext);
  const { roles } = user || {}
  const isAdminUser = isAdmin(roles)
  const isDoctorUser = isOnlyDoctor(roles)
  const { appointmentId, id } = useParams<ParamsType>()
  const [isChartingModalOpen, setIsChartingModalOpen] = useState(false)
  const [modulesToPrint, setModulesToPrint] = useState<string[]>([])
  const [isChartPdfModalOpen, setIsChartPdfModalOpen] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
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
            fetchAppointment && await fetchAppointment()
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
    <>
      <Box className="card-box-shadow" mb={3}>
        <LatestVitalCard patientId={id} />
      </Box>

      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{CHART_TEXT}</Typography>

          <Box display="flex" alignItems="center">
            <Box m={0.5}>
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

            {appointmentId && <Box m={0.5}>
              {/* <Button variant="contained" color="primary" onClick={() => handleStep(3)}> */}
              <Button variant="contained" color="primary" onClick={() => {
                labOrderHandler && labOrderHandler()
              }}>
                {TO_BILLING}
                <ChevronRight />
              </Button>
            </Box>}
          </Box>
        </Box>

        <Box mt={3}>
          <TabContext value={tabValue}>
            <Grid container spacing={2}>
              <Grid item lg={2} md={12} sm={12} xs={12}>
                <Card>
                  <Box px={3} py={1} className={classes.cardBox}>
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
                      <Box component="button" border="none" width="100%" mb={1}
                        minHeight={52} bgcolor={isPatientDischarged ? GRAY_SIMPLE : BLUE} borderRadius={4}
                      >
                        <Button
                          variant="text"
                          size="small"
                          color={"inherit"}
                          startIcon={<DischargeIcon color={isPatientDischarged ? "black" : 'white'} />}
                          onClick={() => setOpenDelete(true)}
                          disabled={isPatientDischarged}
                          fullWidth
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

              <Grid item lg={10} md={12} sm={12} xs={12}>
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

                  <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value="7">
                      <ChartContextProvider>
                        <LabOrdersTable appointmentInfo={appointmentInfo} shouldDisableEdit={shouldDisableEdit} />
                      </ChartContextProvider>
                    </TabPanel>
                  </Box>

                  <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value="8">
                      <ChartContextProvider>
                        <Vaccines shouldDisableEdit={shouldDisableEdit} />
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

          <ConfirmationModal
            title={PATIENT_DISCHARGED}
            isOpen={openDelete}
            isLoading={updateAppointmentStatusLoading}
            description={DISCHARGE_PATIENT_DESCRIPTION}
            handleDelete={updateAppointment}
            actionText={DISCHARGE}
            modalType={CONFIRMATION_MODAL_TYPE.DISCHARGE}
            setOpen={(open: boolean) => setOpenDelete(open)}
          />
        </Box>
      </Card>
    </>
  )
};

export default ChartCards;
