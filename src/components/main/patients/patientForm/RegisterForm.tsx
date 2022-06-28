// package block
import { FC } from 'react';
import { Box, Card } from '@material-ui/core';
// component block
import GuarantorCard from './GuarantorCard';
import EmploymentCard from './EmploymentCard';
import ContactInfoCard from './ContactInfoCard';
import IdentificationCard from './IdentificationCard';
import PatientNextKinCard from './PatientNextKinCard';
import PatientPrivacyCard from './PatientPrivacyCard';
import StepperCard from '../../../common/StepperCard';
import PatientGuardianCard from './PatientGuardianCard';
import PatientDemographicsCard from "./DemographicsCard";
import EmergencyContactCard from './EmergencyContactCard';
import RegistrationDatesCard from './RegistrationDatesCard';
// utils. interfaces, constants
import { RegisterPatientMenuNav } from '../../../../constants';
import { PatientCardsProps } from '../../../../interfacesTypes';
import { useExternalPatientStyles } from '../../../../styles/publicAppointmentStyles/externalPatientStyles';

const RegisterFormComponent: FC<PatientCardsProps> = ({
  getPatientLoading, dispatch, isEdit, state, shouldDisableEdit, disableSubmit
}) => {
  const classes = useExternalPatientStyles()
  const { activeStep } = state || {}

  const getActiveComponent = (step: number | undefined) => {
    switch (step) {
      case 0:
        return (<>
          <Box mb={3}>
            <IdentificationCard
              getPatientLoading={getPatientLoading}
              shouldDisableEdit={shouldDisableEdit}
              state={state}
              dispatch={dispatch}
              disableSubmit={disableSubmit}
              isEdit={isEdit}
            />
          </Box>

          <RegistrationDatesCard
            getPatientLoading={getPatientLoading}
            shouldDisableEdit={shouldDisableEdit}
          />
        </>)

      case 1:
        return (
          <PatientDemographicsCard
            getPatientLoading={getPatientLoading}
            state={state} dispatch={dispatch}
            shouldDisableEdit={shouldDisableEdit}
            disableSubmit={disableSubmit}
            isEdit={isEdit}
          />)

      case 2:
        return (
          <ContactInfoCard
            getPatientLoading={getPatientLoading}
            state={state} dispatch={dispatch}
            shouldDisableEdit={shouldDisableEdit}
            disableSubmit={disableSubmit}
            isEdit={isEdit}
          />)

      case 3:
        return (
          <PatientPrivacyCard
            getPatientLoading={getPatientLoading}
            state={state} dispatch={dispatch}
            shouldDisableEdit={shouldDisableEdit}
            disableSubmit={disableSubmit}
            isEdit={isEdit}
          />)
      default:
        return (
          <>
            <Box mb={3}>
              <EmergencyContactCard
                getPatientLoading={getPatientLoading}
                shouldDisableEdit={shouldDisableEdit}
                state={state} dispatch={dispatch}
                disableSubmit={disableSubmit}
                isEdit={isEdit}
              />
            </Box>

            <Box mb={3}>
              <PatientNextKinCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
            </Box>

            <Box mb={3}>
              <PatientGuardianCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
            </Box>

            <Box mb={3}>
              <GuarantorCard
                getPatientLoading={getPatientLoading}
                state={state} dispatch={dispatch}
                shouldDisableEdit={shouldDisableEdit}
                isEdit={isEdit}
              />
            </Box>

            <EmploymentCard getPatientLoading={getPatientLoading} shouldDisableEdit={shouldDisableEdit} />
          </>
        )
    }
  }

  return (
    <Box display="flex" flexWrap="wrap" gridGap={20}>
      <Box className={classes.stepperGrid}>
        <Card className={classes.stepperContainer}>
          <StepperCard stepperData={RegisterPatientMenuNav} activeStep={activeStep as number} dispatch={dispatch} />
        </Card>
      </Box>

      <Box flex={1}>
        {getActiveComponent(activeStep)}
      </Box>
    </Box>
  )
}

export default RegisterFormComponent;
