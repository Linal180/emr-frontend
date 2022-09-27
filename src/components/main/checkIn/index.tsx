// packages block
import {
  Box, Button, CircularProgress, colors, Step, StepIconProps, StepLabel, Stepper, Typography
} from "@material-ui/core";
import { Check, ChevronRight } from '@material-ui/icons';
import clsx from 'clsx';
import { Reducer, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useParams } from "react-router";
// component block
import Alert from "../../common/Alert";
import PatientProfileHero from "../../common/patient/profileHero";
import BillingComponent from "../billing/addBill/BillingComponent";
import PatientForm from "../patients/patientForm";
import CheckIn from "./CheckIn";
// constants, interfaces, utils block
import { ChevronRightIcon } from "../../../assets/svgs";
import { CHECK_IN_STEPS, PATIENT_INFO, TO_CHART, TO_LAB_ORDERS } from "../../../constants";
import { AuthContext } from "../../../context";
import {
  AppointmentPayload, AppointmentStatus, AttachmentsPayload, OrderOfBenefitType, PatientPayload,
  useFetchPatientInsurancesLazyQuery, useGetAppointmentLazyQuery, useUpdateAppointmentMutation
} from "../../../generated/graphql";
import { FormForwardRef, ParamsType } from "../../../interfacesTypes";
import { Action, ActionType, appointmentReducer, initialState, State } from "../../../reducers/appointmentReducer";
import {
  Action as mediaAction, ActionType as mediaActionType, initialState as mediaInitialState, mediaReducer,
  State as mediaState
} from "../../../reducers/mediaReducer";
import {
  Action as PatientAction, ActionType as PatientActionType, initialState as patientInitialState,
  patientReducer, State as PatientState
} from "../../../reducers/patientReducer";
import { CheckInConnector, useCheckInProfileStyles, useCheckInStepIconStyles } from '../../../styles/checkInStyles';
import { convertDateFromUnix, getFormattedDate, isBiller, isFrontDesk } from "../../../utils";
import ChartCards from "../patientChart/chartCards";
import ChartPrintModal from "../patientChart/chartCards/ChartModal/ChartPrintModal";
import ChartSelectionModal from "../patientChart/chartCards/ChartModal/ChartSelectionModal";

const CheckInStepIcon = (props: StepIconProps) => {
  const classes = useCheckInStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

const CheckInComponent = (): JSX.Element => {
  const { user } = useContext(AuthContext)
  const { roles } = user || {}
  const isBillerUser = isBiller(roles);
  const isFrontDeskUser = isFrontDesk(roles);
  const checkInClasses = useCheckInProfileStyles();
  const [modulesToPrint, setModulesToPrint] = useState<string[]>([])
  const [isChartingModalOpen, setIsChartingModalOpen] = useState(false)
  const [isChartPdfModalOpen, setIsChartPdfModalOpen] = useState<boolean>(false)
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState);
  const [, patientDispatcher] =
    useReducer<Reducer<PatientState, PatientAction>>(patientReducer, patientInitialState)

  const [, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)
  const { appointment, activeStep } = state
  const { appointmentType, scheduleStartDateTime, checkInActiveStep, status } = appointment ?? {}

  const appointmentTime = scheduleStartDateTime ? getFormattedDate(scheduleStartDateTime) : ''
  const { appointmentId, id: patientId } = useParams<ParamsType>()
  const patientRef = useRef<FormForwardRef>();

  const appointmentInfo = {
    name: `${appointmentType?.name ?? ''}  ${appointmentTime}`,
    id: appointmentId ?? ''
  }

  const shouldDisableEdit = status === AppointmentStatus.Checkout || status === AppointmentStatus.Discharged

  useEffect(() => {
    dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: Number(checkInActiveStep) ?? 0 })
  }, [checkInActiveStep])

  const [getAppointment] = useGetAppointmentLazyQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message);
    },

    onCompleted(data) {
      const { getAppointment } = data;
      const { appointment, response } = getAppointment ?? {}

      if (response) {
        const { status } = response;
        if (appointment && status && status === 200) {

          dispatch({ type: ActionType.SET_APPOINTMENT, appointment: appointment as AppointmentPayload['appointment'] })
        }
      }
    },
  });

  const [fetchPatientInsurances] = useFetchPatientInsurancesLazyQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: ({
      id: patientId ?? ''
    }),

    onCompleted(data) {
      const { fetchPatientInsurances } = data || {}

      if (fetchPatientInsurances) {
        const { policies, response } = fetchPatientInsurances
        if (response && response.status === 200) {
          const primaryInsurance = policies?.find((policy) => policy.orderOfBenefit === OrderOfBenefitType.Primary)
          if (!!primaryInsurance) {
            dispatch({ type: ActionType.SET_PRIMARY_INSURANCE, primaryInsurance: primaryInsurance?.insurance?.payerName ?? '' })
            return
          }
        }
      }
    }
  });

  useEffect(() => {
    fetchPatientInsurances()
  }, [fetchPatientInsurances])

  const fetchAppointment = useCallback(async () => {
    appointmentId && await getAppointment({
      variables: { getAppointment: { id: appointmentId?.toString() ?? '' } },
    });
  }, [getAppointment, appointmentId]);

  useEffect(() => {
    appointmentId && fetchAppointment()
  }, [appointmentId, fetchAppointment]);

  const [updateAppointment] = useUpdateAppointmentMutation({
    fetchPolicy: "network-only",

    onError({ message }) {
      Alert.error(message)
    },

    onCompleted: async (data) => {
      const { updateAppointment: updateAppointmentResponse } = data ?? {}
      const { response, appointment } = updateAppointmentResponse ?? {}
      if (response) {
        const { status } = response
        const { status: aptStatus } = appointment || {}
        if (aptStatus === AppointmentStatus.Arrived) {
          await fetchPatientInsurances()
        }

        if (patientId && status && status === 200) {
          await fetchAppointment()
        }
      }
    }
  });

  const handleCheckIn = useCallback(async (id: string) => {
    await updateAppointment({
      variables: {
        updateAppointmentInput: {
          id, status: AppointmentStatus.Arrived,
          checkedInAt: convertDateFromUnix(Date.now().toString(), 'MM-DD-YYYY hh:mm a')
        }
      }
    })
  }, [updateAppointment])

  useEffect(() => {
    if (status === AppointmentStatus.Scheduled) {
      handleCheckIn(appointmentId || '')
    }
  }, [appointmentId, handleCheckIn, patientId, status])

  const handleStep = (step: number) => {
    updateAppointment({
      variables: {
        updateAppointmentInput: {
          id: appointmentId ?? '',
          checkInActiveStep: String(step)
        }
      }
    })

    dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: step })
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CheckIn appointmentState={state} appointmentDispatcher={dispatch} handleStep={handleStep} shouldDisableEdit={shouldDisableEdit}/>
      case 1:
        return <PatientInfo />
      // case 2:
      //   return <Insurance />
      case 2:
        return <Chart />
      // case 3:
      //   return <LabOrders appointmentInfo={appointmentInfo} handleStep={() => handleStep(4)} shouldDisableEdit={shouldDisableEdit} />
      case 3:
      case 4:
        return <BillingComponent shouldDisableEdit={shouldDisableEdit} />
      default:
        return <CircularProgress />;
    }
  }

  const handlePatientUpdate = () => {
    !shouldDisableEdit && patientRef.current?.submit()
    isFrontDeskUser ? handleStep(3) : handleStep(2)
  }

  // 1- PATIENT-INFO
  const PatientInfo = () =>
    <>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
        <Typography variant="h4">{PATIENT_INFO}</Typography>

        <Button variant="contained" color="primary" onClick={handlePatientUpdate}>
          {isFrontDeskUser ? TO_LAB_ORDERS : TO_CHART}
          <ChevronRight />
        </Button>
      </Box>

      <Box p={3}>
        <PatientForm
          id={patientId}
          isEdit
          shouldShowBread={false}
          ref={patientRef}
          shouldDisableEdit={shouldDisableEdit}
        />
      </Box>
    </>

  // 3- CHART
  const Chart = () =>
    <>
      <ChartCards
        status={status}
        labOrderHandler={() => handleStep(3)}
        appointmentInfo={appointmentInfo}
        fetchAppointment={fetchAppointment}
        shouldDisableEdit={shouldDisableEdit}
      />
    </>

  const handleStepChange = (index: number) => {
    if (isBillerUser) {
      if ([0, 4].includes(index)) {
        handleStep(index)
      }
    }

    if (isFrontDeskUser) {
      if (index !== 2) {
        handleStep(index)
      }
    }
  }

  return (
    <>
      <Box display='flex' alignItems='center' flexWrap='wrap'>
        <Box className={checkInClasses.checkInProfileBox}>
          <PatientProfileHero
            isCheckIn
            setPatient={(patient: PatientPayload['patient']) =>
              patientDispatcher({ type: PatientActionType.SET_PATIENT_DATA, patientData: patient })
            }
            setAttachmentsData={(attachments: AttachmentsPayload['attachments']) =>
              mediaDispatcher({ type: mediaActionType.SET_ATTACHMENTS_DATA, attachmentsData: attachments })
            }
          />
        </Box>

        <Box p={1} />

        <Box className={checkInClasses.checkInProfileBox}>
          <Typography variant="h6" color="textPrimary">{`Encounter on ${appointmentTime}`}</Typography>
        </Box>

        <Box p={1} />

        <Box className={checkInClasses.checkInProfileBox}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<CheckInConnector />}>
            {CHECK_IN_STEPS.map((label, index) => (
              <Step key={label}>
                <StepLabel onClick={() => (isBillerUser || isFrontDeskUser) ? handleStepChange(index) : handleStep(index)} StepIconComponent={CheckInStepIcon}>
                  <Box ml={0} display='flex' alignItems='center' className='pointer-cursor'>
                    {label}
                    <Box p={0.5} />
                    {!(CHECK_IN_STEPS.length - 1 === index) ? <ChevronRightIcon /> : ''}
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>

      <Box mt={1}>
        <Typography>{getStepContent(activeStep)}</Typography>
      </Box>

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
    </>
  )
};

export default CheckInComponent;
