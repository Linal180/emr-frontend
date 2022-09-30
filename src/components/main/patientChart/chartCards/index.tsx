// packages block
import { Box, Button, Card, colors, Grid, Tab, Typography } from "@material-ui/core";
import { ChevronRight, PrintOutlined } from "@material-ui/icons";
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { ChangeEvent, FC, ReactElement, Reducer, useContext, useMemo, useReducer, useState } from 'react';
import { useParams } from "react-router";
// components block
import Alert from "../../../common/Alert";
import ConfirmationModal from "../../../common/ConfirmationModal";
import Loader from "../../../common/Loader";
import LabOrdersTable from "../../../common/patient/labOrders";
import LatestVitalCard from "../latestVitalCard";
import Vaccines from '../vaccines';
import ChartPrintModal from "./ChartModal/ChartPrintModal";
import ChartSelectionModal from './ChartModal/ChartSelectionModal';
import AllergyTab from './tabs/AllergyListing';
import HistoryTab from './tabs/HistoryTab';
import MedicationTab from './tabs/MedicationsListing';
import ProblemTab from './tabs/ProblemListing';
import TriageNoteTab from './tabs/TriageNotesListing';
import VitalTab from './tabs/VitalListing';
// interfaces, graphql, constants block /styles
import { DischargeIcon, HistoryIcon } from "../../../../assets/svgs";
import {
  ASSESSMENT_PLAN_OPTION,
  CHART_TEXT, CONFIRMATION_MODAL_TYPE, DISCHARGE, DISCHARGE_PATIENT_DESCRIPTION, DONE_INTAKE, PATIENT_CHARTING_MENU, PATIENT_CHARTING_TABS,
  PATIENT_DISCHARGED, PATIENT_DISCHARGED_SUCCESS, PRINT_CHART, REASON_FOR_VISIT_OPTION,
  REVIEW_OPTION,
  SIGN_OFF
} from "../../../../constants";
import { AuthContext, ChartContextProvider } from '../../../../context';
import { AppointmentStatus, useUpdateAppointmentStatusMutation } from "../../../../generated/graphql";
import { ChartComponentProps, ParamsType } from "../../../../interfacesTypes";
import { Action, ActionType, initialState, patientReducer, State } from "../../../../reducers/patientReducer";
import { useChartingStyles } from "../../../../styles/chartingStyles";
import { useExternalPatientStyles } from '../../../../styles/publicAppointmentStyles/externalPatientStyles';
import { BLUE, GRAY_SIMPLE, WHITE } from '../../../../theme';
import { isAdmin, isOnlyDoctor } from "../../../../utils";
import StepperCard from "../../../common/StepperCard";
import AppointmentReason from "./tabs/AppointmentReason";
import FamilyHistory from "./familyHistory";
import SurgicalHistoryTab from "./tabs/SurgicalHistoryListing";
import AssessmentPlanTab from "./AssessmentPlan/AssessmentPlanTab";
import ReviewTab from "./tabs/ReviewTab";

const ChartCards: FC<ChartComponentProps> = ({ shouldDisableEdit, status, appointmentInfo, fetchAppointment, labOrderHandler, isInTake }): JSX.Element => {
  const classes = useChartingStyles();
  const patientClasses = useExternalPatientStyles();
  const { user } = useContext(AuthContext);
  const { roles } = user || {}
  const isAdminUser = isAdmin(roles)
  const isDoctorUser = isOnlyDoctor(roles)
  const { appointmentId, id } = useParams<ParamsType>()
  const [isChartingModalOpen, setIsChartingModalOpen] = useState(false)
  const [modulesToPrint, setModulesToPrint] = useState<string[]>([])
  const [isChartPdfModalOpen, setIsChartPdfModalOpen] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [stepArray, setStepArray] = useState<number[]>([])
  const [{ activeStep, tabValue }, dispatch] =
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

  const stepperDataWithIndicator = useMemo(() => {
    return PATIENT_CHARTING_MENU.map((menu, index) => {
      if (stepArray.includes(index)) {
        return {
          ...menu,
          completed: true
        }
      }
      return {
        ...menu,
        completed: false
      }
    })
  }, [stepArray])

  if (updateAppointmentStatusLoading) {
    return <Loader loading loaderText="Discharging Patient..." />
  }

  const isPatientDischarged = status === AppointmentStatus.Checkout || status === AppointmentStatus.Discharged

  const getActiveComponent = (step: number | undefined) => {
    switch (step) {
      case 0:
        return <AppointmentReason />
      case 1:
        return <TriageNoteTab shouldDisableEdit={shouldDisableEdit} />

      case 2:
        return <VitalTab shouldDisableEdit={shouldDisableEdit} />

      case 3:
        return <ProblemTab shouldDisableEdit={shouldDisableEdit} />

      case 4:
        return <ChartContextProvider>
          <AllergyTab shouldDisableEdit={shouldDisableEdit} />
        </ChartContextProvider>

      case 5:
        return <MedicationTab shouldDisableEdit={shouldDisableEdit} />

      case 6:
        return <FamilyHistory shouldDisableEdit={shouldDisableEdit} />

      case 7:
        return <SurgicalHistoryTab shouldDisableEdit={shouldDisableEdit} />

      case 8:
        return <LabOrdersTable appointmentInfo={appointmentInfo} shouldDisableEdit={shouldDisableEdit} />

      case 9:
        return <Vaccines shouldDisableEdit={shouldDisableEdit} />

      case 10:
        return <AssessmentPlanTab />
      default:
        return (
          <></>
        )
    }
  }

  const transformedPatientChartingSteps = PATIENT_CHARTING_TABS.reduce((acc, stepData) => {
    if (stepData.value === '6') {
      acc.push(...[
        {
          icon: HistoryIcon,
          title: "Family History",
          value: "6",
        },
        {
          icon: HistoryIcon,
          title: "Surgical History",
          value: "7",
        },
      ])

      return acc
    }
    if (Number(stepData.value) > 6) {
      acc.push({
        ...stepData,
        value: String(Number(stepData.value) + 1)
      })

      return acc
    }

    acc.push(stepData)
    return acc
  }, [] as {
    icon: () => JSX.Element;
    title: string;
    value: string;
  }[])

  const handleStep = (index: number) => {
    dispatch && dispatch({
      type: ActionType.SET_ACTIVE_STEP, activeStep: index
    })

    if (stepArray.includes(index)) {
      return
    } else {
      setStepArray((prev => [...prev, index]))
    }
  }


  const chartingStepsToMap = appointmentId ? isInTake ?
    [REASON_FOR_VISIT_OPTION, ...transformedPatientChartingSteps.map(stepData => {
      return { ...stepData, value: String(Number(stepData.value) + 1) }
    }), ASSESSMENT_PLAN_OPTION] :
    [REVIEW_OPTION, ...PATIENT_CHARTING_TABS.map(stepData => {
      return { ...stepData, value: String(Number(stepData.value) + 1) }
    }), ASSESSMENT_PLAN_OPTION] : PATIENT_CHARTING_TABS

  return (
    <>
      <Box className="card-box-shadow" mb={3}>
        <LatestVitalCard patientId={id} />
        <Box mt={3} />
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
                {isInTake ? DONE_INTAKE : SIGN_OFF}
                <ChevronRight />
              </Button>
            </Box>}
          </Box>
        </Box>

        <Box mt={3}>
          <TabContext value={tabValue}>
            <Grid container spacing={2}>
              <Grid item lg={2} md={12} sm={12} xs={12}>
                {!isInTake && <Card>
                  <Box px={3} py={1} className={classes.cardBox}>
                    <TabList className={classes.tabList}
                      orientation='vertical'
                      onChange={handleChange}
                      aria-label="communication tabs"
                    >
                      {chartingStepsToMap.map(item => {
                        const { icon: Icon, title, value } = item

                        return <Tab className={classes.tab}
                          key={`${title}-${value}`} label={title}
                          value={value} icon={<Icon /> as unknown as ReactElement}
                        />
                      })}
                    </TabList>

                    {!isInTake && appointmentId && (isAdminUser || isDoctorUser) &&
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
                </Card>}

                {isInTake && <Card className={patientClasses.stepperContainer}>
                  <Box className={classes.cardBox}>
                    <StepperCard
                      stepperData={stepperDataWithIndicator}
                      activeStep={activeStep as number}
                      handleStep={(index: number) => handleStep(index)}
                    />
                  </Box>
                </Card>}
              </Grid>

              <Grid item lg={10} md={12} sm={12} xs={12}>
                {!isInTake ? <Box className={classes.tabPanelPadding}>
                  {appointmentId &&
                    <Box pt={0} borderRadius={8}>
                      <TabPanel value={"1"}>
                        {isInTake ? <AppointmentReason /> : <ReviewTab />}
                      </TabPanel>
                    </Box>}

                  <Box pt={0} borderRadius={8}>
                    <TabPanel value={appointmentId ? "2" : "1"}>
                      <TriageNoteTab shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box>

                  <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? "3" : "2"}>
                      <VitalTab shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box>

                  <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? "4" : "3"}>
                      <ProblemTab shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box>

                  <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? "5" : "4"}>
                      <ChartContextProvider>
                        <AllergyTab shouldDisableEdit={shouldDisableEdit} />
                      </ChartContextProvider>
                    </TabPanel>
                  </Box>

                  <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? "6" : "5"}>
                      <MedicationTab shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box>

                  {!isInTake ? <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? "7" : "6"}>
                      <HistoryTab shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box> : <>
                    <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                      <TabPanel value="7">
                        <FamilyHistory shouldDisableEdit={shouldDisableEdit} />
                      </TabPanel>
                    </Box>

                    <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                      <TabPanel value="8">
                        <SurgicalHistoryTab shouldDisableEdit={shouldDisableEdit} />
                      </TabPanel>
                    </Box>
                  </>}

                  <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? isInTake ? "9" : "8" : "7"}>
                      <LabOrdersTable appointmentInfo={appointmentInfo} shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box>

                  <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? isInTake ? "10" : "9" : "8"}>
                      <Vaccines shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box>

                  {appointmentId && <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? isInTake ? "11" : "10" : "9"}>
                      <AssessmentPlanTab />
                    </TabPanel>
                  </Box>}
                </Box> : getActiveComponent(activeStep)}
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
