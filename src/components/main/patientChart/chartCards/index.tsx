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
import StepperCard from "../../../common/StepperCard";
import LatestVitalCard from "../latestVitalCard";
import Vaccines from '../vaccines';
import AssessmentPlanTab from "./AssessmentPlan/AssessmentPlanTab";
import ChartPrintModal from "./ChartModal/ChartPrintModal";
import ChartSelectionModal from './ChartModal/ChartSelectionModal';
import FamilyHistory from "./familyHistory";
import SurgicalHistoryTab from "./surgicalHistory/SurgicalHistoryListing";
import AllergyTab from './tabs/AllergyListing';
import AppointmentReason from "./tabs/AppointmentReason";
import HistoryTab from './tabs/HistoryTab';
import MedicationTab from './tabs/MedicationsListing';
import ProblemTab from './tabs/ProblemListing';
import TriageNoteTab from './tabs/TriageNotesListing';
import VitalTab from './tabs/VitalListing';
import PatientHistory from "./patientHistoryIllness";
import ReviewOfSystem from "./reviewOfSystem";
import SocialHistory from "./socialHistory";
import ExamTab from "./tabs/ExamTab";
// interfaces, graphql, constants block /styles
import { HistoryIcon } from "../../../../assets/svgs";
import {
  CHART_TEXT, CONFIRMATION_MODAL_TYPE, DISCHARGE, DISCHARGE_PATIENT_DESCRIPTION, DONE_INTAKE, EXAM_OPTION,
  PATIENT_CHARTING_MENU, PATIENT_CHARTING_TABS, PATIENT_DISCHARGED, PATIENT_DISCHARGED_SUCCESS, TRIAGE_NOTE_OPTION,
  PRINT_CHART, REASON_FOR_VISIT_OPTION, SIGN_OFF, VISIT_OPTION,
} from "../../../../constants";
import { AuthContext, ChartContextProvider } from '../../../../context';
import { AppointmentStatus, useUpdateAppointmentStatusMutation } from "../../../../generated/graphql";
import { ChartComponentProps, ParamsType } from "../../../../interfacesTypes";
import { Action, ActionType, initialState, patientReducer, State } from "../../../../reducers/patientReducer";
import { useChartingStyles } from "../../../../styles/chartingStyles";
import { useExternalPatientStyles } from '../../../../styles/publicAppointmentStyles/externalPatientStyles';
import { WHITE } from '../../../../theme';
import { isAdmin, isOnlyDoctor } from "../../../../utils";
import VisitsTab from "./Visits";

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
  const [stepArray, setStepArray] = useState<number[]>([0])
  const [{ activeStep, tabValue, shouldRefetchLatestVitals }, dispatch] =
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

      labOrderHandler && labOrderHandler()
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

  const getActiveComponent = (step: number | undefined) => {
    switch (step) {
      case 0:
        return <AppointmentReason shouldShowAdd isInTake={true} handleStep={() => handleStep(1)} shouldDisableEdit={shouldDisableEdit} />
      // case 1:
      //   return <TriageNoteTab shouldDisableEdit={shouldDisableEdit} handleStep={handleStep} />

      case 1:
        return <VitalTab shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(2)}
          setShouldRefetch={() => dispatch({ type: ActionType.SET_SHOULD_REFETCH_LATEST_VITALS, shouldRefetchLatestVitals: true })} />

      case 2:
        return <ProblemTab shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(3)} />

      case 3:
        return <ChartContextProvider>
          <AllergyTab shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(4)} />
        </ChartContextProvider>

      case 4:
        return <MedicationTab shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(5)} />

      case 5:
        return <FamilyHistory shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(6)} />

      case 6:
        return <SurgicalHistoryTab shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(7)} />

      case 7:
        return <SocialHistory shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(8)} />

      case 8:
        return <LabOrdersTable appointmentInfo={appointmentInfo} shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(9)} />

      case 9:
        return <Vaccines shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(10)} />

      case 10:
        return <PatientHistory shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(11)} />

      case 11:
        return <ReviewOfSystem shouldDisableEdit={shouldDisableEdit} handleStep={() => handleStep(12)} />

      case 12:
        return <AssessmentPlanTab shouldDisableEdit={shouldDisableEdit} />
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

  const chartingStepsToMap = appointmentId ? isInTake ?
    [REASON_FOR_VISIT_OPTION, ...transformedPatientChartingSteps.map(stepData => {
      return { ...stepData, value: String(Number(stepData.value) + 1) }
    })] :
    [EXAM_OPTION, ...PATIENT_CHARTING_TABS.map(stepData => {
      return { ...stepData, value: String(Number(stepData.value) + 1) }
    })] : [TRIAGE_NOTE_OPTION, ...[...PATIENT_CHARTING_TABS, VISIT_OPTION]]

  const handleDischarge = () => {
    if (isInTake) {
      labOrderHandler && labOrderHandler()
    } else {
      if (isAdminUser || isDoctorUser) {
        setOpenDelete(true)
      }
    }
  }

  return (
    <>
      <Box className="card-box-shadow" mb={3}>
        <LatestVitalCard
          patientId={id}
          setShouldRefetch={() => dispatch({ type: ActionType.SET_SHOULD_REFETCH_LATEST_VITALS, shouldRefetchLatestVitals: false })}
          shouldRefetch={shouldRefetchLatestVitals}
        />
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
              <Button variant="contained" color="primary" onClick={() => {
                handleDischarge()
              }}>
                {isInTake ? DONE_INTAKE :
                  isPatientDischarged ? AppointmentStatus.Discharged : SIGN_OFF}
                < ChevronRight />
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

                    {/* {!isInTake && appointmentId && (isAdminUser || isDoctorUser) &&
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
                    } */}
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
                        {/* {isInTake ? <AppointmentReason isInTake={false} /> : <ReviewTab shouldShowAdd shouldDisableEdit={shouldDisableEdit} />} */}
                        <ExamTab />
                      </TabPanel>
                    </Box>}

                  {!appointmentId && <Box pt={0} borderRadius={8}>
                    <TabPanel value={appointmentId ? "2" : "1"}>
                      <TriageNoteTab shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box>}

                  <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? "3" : "2"}>
                      <VitalTab shouldDisableEdit={shouldDisableEdit}
                        setShouldRefetch={() => dispatch({ type: ActionType.SET_SHOULD_REFETCH_LATEST_VITALS, shouldRefetchLatestVitals: true })} />
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

                  {!appointmentId && <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? isInTake ? "11" : "10" : "9"}>
                      <VisitsTab />
                    </TabPanel>
                  </Box>}

                  {appointmentId && <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? isInTake ? "11" : "10" : "9"}>
                      <AssessmentPlanTab shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box>}

                  {appointmentId && <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? isInTake ? "12" : "11" : "10"}>
                      <PatientHistory shouldDisableEdit={shouldDisableEdit} />
                    </TabPanel>
                  </Box>}

                  {appointmentId && <Box pt={0} bgcolor={WHITE} borderRadius={8}>
                    <TabPanel value={appointmentId ? isInTake ? "13" : "12" : "11"}>
                      <ReviewOfSystem shouldDisableEdit={shouldDisableEdit} />
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
