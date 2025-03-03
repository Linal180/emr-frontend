// packages block
import clsx from 'clsx';
import { useParams } from "react-router";
import { FormProvider, useForm } from 'react-hook-form';
import { Check, ChevronRight } from '@material-ui/icons';
import { Reducer, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import {
  Box, Button, CircularProgress, colors, Step, StepIconProps, StepLabel, Stepper, Typography
} from "@material-ui/core";
// component block
import CheckIn from "./CheckIn";
import SignOff from "./SignOff";
import Alert from "../../common/Alert";
import AppointmentRoom from './appointmentRoom';
import PatientForm from "../patients/patientForm";
import ChartCards from "../patientChart/chartCards";
import PatientProfileHero from "../../common/patient/profileHero";
import BillingComponent from "../billing/addBill/BillingComponent";
import ChartPrintModal from "../patientChart/chartCards/ChartModal/ChartPrintModal";
import ChartSelectionModal from "../patientChart/chartCards/ChartModal/ChartSelectionModal";
// constants, interfaces, utils block
import { AuthContext } from "../../../context";
import { ChevronRightIcon } from "../../../assets/svgs";
import { FormForwardRef, ParamsType } from "../../../interfacesTypes";
import { convertDateFromUnix, getFormattedDate, isBiller, isFrontDesk, isStaff } from "../../../utils";
import { CHECK_IN_STEPS, DONE_CHECK_IN, EMPTY_OPTION, PATIENT_INFO } from "../../../constants";
import { Action, ActionType, appointmentReducer, initialState, State } from "../../../reducers/appointmentReducer";
import { CheckInConnector, useCheckInProfileStyles, useCheckInStepIconStyles } from '../../../styles/checkInStyles';
import {
  AppointmentPayload, AppointmentStatus, AttachmentsPayload, OrderOfBenefitType, PatientPayload,
  useFetchPatientInsurancesLazyQuery, useGetAppointmentLazyQuery, useUpdateAppointmentMutation
} from "../../../generated/graphql";
import {
  Action as mediaAction, ActionType as mediaActionType, initialState as mediaInitialState, mediaReducer,
  State as mediaState
} from "../../../reducers/mediaReducer";
import {
  Action as PatientAction, ActionType as PatientActionType, initialState as patientInitialState,
  patientReducer, State as PatientState
} from "../../../reducers/patientReducer";


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
  const isStaffUser = isStaff(roles);
  const isBillerUser = isBiller(roles);
  const isFrontDeskUser = isFrontDesk(roles);
  const checkInClasses = useCheckInProfileStyles();
  const [modulesToPrint, setModulesToPrint] = useState<string[]>([])
  const [shouldProceed, setShouldProceed] = useState<boolean>(false)
  const [isChartingModalOpen, setIsChartingModalOpen] = useState(false)
  const [isChartPdfModalOpen, setIsChartPdfModalOpen] = useState<boolean>(false)
  const methods = useForm({
    defaultValues: { room: EMPTY_OPTION }
  })
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState);
  const [, mediaDispatcher] = useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)
  const [, patientDispatcher] = useReducer<Reducer<PatientState, PatientAction>>(patientReducer, patientInitialState)
  const { appointment, activeStep } = state
  const { appointmentType, scheduleStartDateTime, checkInActiveStep, status, facility } = appointment ?? {}
  const { id: facilityId } = facility || {}

  const { setValue } = methods

  const appointmentTime = scheduleStartDateTime ? getFormattedDate(scheduleStartDateTime) : ''
  const { appointmentId, id: patientId, shouldProceed: shouldProceedFromParams } = useParams<ParamsType>()
  const patientRef = useRef<FormForwardRef>();

  const appointmentInfo = {
    name: `${appointmentType?.name ?? ''}  ${appointmentTime}`,
    id: appointmentId ?? ''
  }

  const shouldDisableChartingEdit = status === AppointmentStatus.Discharged || status === AppointmentStatus.Checkout
  const shouldDisableBillingEdit = status === AppointmentStatus.Checkout

  useEffect(() => {
    dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: Number(checkInActiveStep) ?? 0 })
  }, [checkInActiveStep])

  useEffect(() => {
    setShouldProceed(shouldProceedFromParams === '1')
  }, [shouldProceedFromParams])

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
          const { room } = appointment;
          const { id, name, number } = room || {}
          id && name && setValue('room', { id, name: number ? `${number}: ${name}` : name })
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
          dispatch({ type: ActionType.SET_PRIMARY_INSURANCE, primaryInsurance: primaryInsurance?.insurance?.payerName ?? '' })
          return
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
        const { status: aptStatus } = appointment || {}
        if (aptStatus === AppointmentStatus.Arrived) {
          // await fetchPatientInsurances()
        }

        // await fetchAppointment()
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

  const handleStep = (step: number, patientInfo?: boolean) => {
    if (isBillerUser) {
      if (![0, 4].includes(step)) {
        return
      }
    }

    if (isFrontDeskUser) {
      if (![0].includes(step)) {
        return
      }
    }

    if (isStaffUser && !isBillerUser) {
      if (![0, 1].includes(step)) {
        return
      }
    }
    let stepToChange
    switch (step) {
      case 0:
        stepToChange = patientInfo ? 1 : 0;
        break

      case 1:
        stepToChange = 2;
        break

      case 2:
        stepToChange = 3;
        break

      case 3:
        stepToChange = 4;
        break

      case 4:
        stepToChange = 5;
        break
      default:
        stepToChange = step
        break
    }


    updateAppointment({
      variables: {
        updateAppointmentInput: {
          id: appointmentId ?? '',
          checkInActiveStep: String(stepToChange)
        }
      }
    })

    dispatch({ type: ActionType.SET_ACTIVE_STEP, activeStep: stepToChange })
  };

  const getStepContent = (step: number) => {
    if (!shouldProceed && step !== 1) {
      return <ChecKInStep isCheckIn={false} />
    }

    if (isBillerUser) {
      if (![0, 5].includes(step)) {
        return
      }
    }

    if (isFrontDeskUser) {
      if (![0, 1].includes(step)) {
        return
      }
    }

    if (isStaffUser && !isBillerUser) {
      if (![0, 1, 2].includes(step)) {
        return
      }
    }

    switch (step) {
      case 0:
        return <ChecKInStep isCheckIn={false} />
      case 1:
        return <ChecKInStep isCheckIn={true} />
      case 2:
        return <Chart />
      case 3:
        return <Exam />
      case 4:
        return <SignOff handleStepChange={handleStep} appointmentInfo={appointment} />
      case 5:
        return <BillingComponent shouldDisableEdit={shouldDisableBillingEdit} refetch={fetchPatientInsurances} />
      default:
        return <CircularProgress />;
    }
  }

  const handlePatientUpdate = () => {
    !shouldDisableChartingEdit && patientRef.current?.submit()
    isFrontDeskUser ? handleStep(4) : handleStep(1)
  }

  // 1- PATIENT-INFO
  const ChecKInStep = ({ isCheckIn = false }) => {

    if (isCheckIn) {
      return (<>
        <Box px={2} pt={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{PATIENT_INFO}</Typography>

          <Box my={2}>
            <Button variant="contained" color="primary" onClick={handlePatientUpdate} endIcon={<ChevronRight />}>
              {DONE_CHECK_IN}
            </Button>
          </Box>
        </Box>

        <Box p={3}>
          <PatientForm
            id={patientId}
            isEdit
            isAppointment
            shouldShowBread={false}
            ref={patientRef}
            refetch={fetchPatientInsurances}
            shouldDisableEdit={shouldDisableChartingEdit}
          />
        </Box>
      </>)
    }

    return (
      <CheckIn
        handleStep={handleStep}
        activeStep={activeStep}
        shouldDisableEdit={shouldDisableChartingEdit}
        handleProceed={activeStep > 0 ? () => setShouldProceed(true) : undefined}
      />
    )
  }

  // 3- CHART
  const Chart = () =>
    <>
      <ChartCards
        status={status}
        appointmentState={state}
        labOrderHandler={() => handleStep(2)}
        appointmentInfo={appointmentInfo}
        fetchAppointment={fetchAppointment}
        shouldDisableEdit={shouldDisableChartingEdit}
        isInTake={true}
      />
    </>

  // 3- CHART
  const Exam = () =>
    <>
      <ChartCards
        status={status}
        appointmentState={state}
        labOrderHandler={() => handleStep(3)}
        appointmentInfo={appointmentInfo}
        fetchAppointment={fetchAppointment}
        shouldDisableEdit={shouldDisableChartingEdit}
        isInTake={false}
      />
    </>

  const handleStepChange = (index: number) => {
    if (isBillerUser) {
      if ([0, 4].includes(index)) {
        handleStep(index)
      }
    }

    if (isFrontDeskUser) {
      if ([0].includes(index)) {
        handleStep(index)
      }
    }

    if (isStaffUser) {
      if ([0, 1].includes(index)) {
        handleStep(index)
      }
    }
  }

  const getActiveStep = () => {
    switch (activeStep) {
      case 0:
      case 1:
        return 0;

      case 2:
        return 1

      case 3:
        return 2

      case 4:
        return 3

      case 5:
        return 4

      default:
        return activeStep
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
          <Box>
            <Typography variant="h5" color="textPrimary">{`Encounter On`}</Typography>
            <Typography variant="body1">{appointmentTime}</Typography>
          </Box>
        </Box>

        <Box p={1} />

        <Box className={checkInClasses.checkInProfileBox}>
          <Stepper alternativeLabel activeStep={getActiveStep()} connector={<CheckInConnector />}>
            {CHECK_IN_STEPS.map((label, index) => (
              <Step key={label}>
                <StepLabel onClick={() => (isBillerUser || isFrontDeskUser || isStaffUser) ? handleStepChange(index) : handleStep(index)} StepIconComponent={CheckInStepIcon}>
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

        <Box p={1} />

        <Box className={checkInClasses.checkInProfileBox}>
          <FormProvider {...methods}>
            <AppointmentRoom appointmentId={appointmentId || ''} facilityId={facilityId || ''} />
          </FormProvider>
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
