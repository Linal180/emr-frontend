// packages block
import { Box, Button, Card, CircularProgress, colors, Step, StepIconProps, StepLabel, Stepper, Typography } from "@material-ui/core";
import { Check, ChevronRight } from '@material-ui/icons';
import clsx from 'clsx';
import { Reducer, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useParams } from "react-router";
// component block
import Alert from "../../common/Alert";
import PatientForm from "../patients/patientForm";
import BillingComponent from "./BillingComponent";
import PatientProfileHero from "../../common/patient/profileHero";
import InsuranceComponent from "../patients/patientDetail/insurance";
// constants, interfaces, utils block
import CheckIn from "./CheckIn";
import LabOrders from "./LabOrders";
// constants, interfaces, utils block
import {
  CHART_TEXT, CHECK_IN_STEPS, INSURANCE, PATIENT_INFO, TO_CHART, TO_LAB_ORDERS,
} from "../../../constants";
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
import { CheckInConnector, useCheckInStepIconStyles, useCheckInProfileStyles } from '../../../styles/checkInStyles';
import { convertDateFromUnix, getFormattedDate } from "../../../utils";
import { ChevronRightIcon } from "../../../assets/svgs";
import ChartCards from "../patientChart/chartCards";

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
  const checkInClasses = useCheckInProfileStyles();
  const [state, dispatch] = useReducer<Reducer<State, Action>>(appointmentReducer, initialState);
  const [, patientDispatcher] =
    useReducer<Reducer<PatientState, PatientAction>>(patientReducer, patientInitialState)

  const [, mediaDispatcher] =
    useReducer<Reducer<mediaState, mediaAction>>(mediaReducer, mediaInitialState)
  const { appointment } = state
  const { appointmentType, scheduleStartDateTime, checkInActiveStep, status } = appointment ?? {}

  const appointmentTime = scheduleStartDateTime ? getFormattedDate(scheduleStartDateTime) : ''
  const { appointmentId, id: patientId } = useParams<ParamsType>()
  const patientRef = useRef<FormForwardRef>();
  const [activeStep, setActiveStep] = useState<number>(0);

  const appointmentInfo = {
    name: `${appointmentType?.name ?? ''}  ${appointmentTime}`,
    id: appointmentId ?? ''
  }

  const shouldDisableEdit = status === AppointmentStatus.Discharged

  useEffect(() => {
    setActiveStep(Number(checkInActiveStep) ?? 0)
  }, [checkInActiveStep])

  const [getAppointment] = useGetAppointmentLazyQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,

    onError({ message }) {
      Alert.error(message);
    },

    async onCompleted(data) {
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
          const { insurance } = policies[0] ?? {}
          dispatch({ type: ActionType.SET_PRIMARY_INSURANCE, primaryInsurance: insurance?.payerName ?? '' })
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
  });

  const handleCheckIn = useCallback(async (id: string, patientId: string) => {
    const { data } = await updateAppointment({
      variables: {
        updateAppointmentInput: {
          id, status: AppointmentStatus.Arrived,
          checkedInAt: convertDateFromUnix(Date.now().toString(), 'MM-DD-YYYY hh:mm a')
        }
      }
    })

    const { updateAppointment: updateAppointmentResponse } = data ?? {}
    const { response } = updateAppointmentResponse ?? {}
    if (response) {
      const { status } = response

      if (patientId && status && status === 200) {
        fetchAppointment()
      }
    }
  }, [fetchAppointment, updateAppointment])

  useEffect(() => {
    if (status === AppointmentStatus.Scheduled) {
      handleCheckIn(appointmentId || '', patientId || '')
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

    setActiveStep(step);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CheckIn appointmentState={state} appointmentDispatcher={dispatch} handleStep={handleStep} />
      case 1:
        return <PatientInfo />
      case 2:
        return <Insurance />
      case 3:
        return <Chart />
      case 4:
        return <LabOrders appointmentInfo={appointmentInfo} handleStep={handleStep} />
      case 5:
        return <BillingComponent shouldDisableEdit={shouldDisableEdit} />
      default:
        return <CircularProgress />;
    }
  }

  const handlePatientUpdate = () => {
    !shouldDisableEdit && patientRef.current?.submit()
    handleStep(2)
  }

  // 1- PATIENT-INFO
  const PatientInfo = () =>
    <>
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{PATIENT_INFO}</Typography>

          <Button variant="contained" color="primary" onClick={handlePatientUpdate}>
            {INSURANCE}
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
      </Card>
    </>

  // 2- INSURANCE
  const Insurance = () =>
    <>
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{INSURANCE}</Typography>

          <Button variant="contained" color="primary" onClick={() => handleStep(3)}>
            {TO_CHART}
            <ChevronRight />
          </Button>
        </Box>
        <InsuranceComponent shouldDisableEdit={shouldDisableEdit} />
        <Box p={2}></Box>
      </Card>
    </>

  // 3- CHART
  const Chart = () =>
    <>
      <Card>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`1px solid ${colors.grey[300]}`}>
          <Typography variant="h4">{CHART_TEXT}</Typography>

          <Button variant="contained" color="primary" onClick={() => handleStep(4)}>
            {TO_LAB_ORDERS}
            <ChevronRight />
          </Button>
        </Box>

        <ChartCards shouldDisableEdit={shouldDisableEdit} />
      </Card>
    </>

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

        <Box p={2} />

        <Box className={checkInClasses.checkInProfileBox}>
          <Typography variant="h6" color="textPrimary">{`Encounter on ${appointmentTime}`}</Typography>
        </Box>

        <Box p={2} />

        <Box className={checkInClasses.checkInProfileBox}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<CheckInConnector />}>
            {CHECK_IN_STEPS.map((label, index) => (
              <Step key={label}>
                <StepLabel onClick={() => handleStep(index)} StepIconComponent={CheckInStepIcon}>
                  <Box ml={0} display='flex' alignItems='center' className='pointer-cursor'>
                    {label}
                    <Box p={0.5} />
                    
                    {!(CHECK_IN_STEPS.length - 1 === index) ?  <ChevronRightIcon /> : '' }
                   
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>

      <Box mt={2}>
        <Typography>{getStepContent(activeStep)}</Typography>
      </Box>
    </>
  )
};

export default CheckInComponent;
