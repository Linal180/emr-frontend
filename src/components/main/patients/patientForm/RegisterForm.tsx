// package block
import { FC } from 'react';
import { Box, Card } from '@material-ui/core';
// component block
import GuarantorCard from './Guarantor';
import EmploymentCard from './Employment';
import ContactInfoCard from './ContactInfo';
import IdentificationCard from './Identification';
import PatientNextKinCard from './NextKin';
import PatientPrivacyCard from './Privacy';
import StepperCard from '../../../common/StepperCard';
import PatientGuardianCard from './Guardian';
import PatientDemographicsCard from "./Demographics";
import EmergencyContactCard from './EmergencyContact';
import RegistrationDatesCard from './RegistrationDates';
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
            isEdit={isEdit}
            disableSubmit={disableSubmit}
            state={state} dispatch={dispatch}
            getPatientLoading={getPatientLoading}
            shouldDisableEdit={shouldDisableEdit}
          />)

      case 2:
        return (
          <ContactInfoCard
            isEdit={isEdit}
            disableSubmit={disableSubmit}
            state={state} dispatch={dispatch}
            shouldDisableEdit={shouldDisableEdit}
            getPatientLoading={getPatientLoading}
          />)

      case 3:
        return (
          <PatientPrivacyCard
            isEdit={isEdit}
            disableSubmit={disableSubmit}
            state={state} dispatch={dispatch}
            getPatientLoading={getPatientLoading}
            shouldDisableEdit={shouldDisableEdit}
          />)
      default:
        return (
          <>
            <Box mb={3}>
              <EmergencyContactCard
                isEdit={isEdit}
                disableSubmit={disableSubmit}
                state={state} dispatch={dispatch}
                getPatientLoading={getPatientLoading}
                shouldDisableEdit={shouldDisableEdit}
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
                isEdit={isEdit}
                state={state} dispatch={dispatch}
                shouldDisableEdit={shouldDisableEdit}
                getPatientLoading={getPatientLoading}
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
          <StepperCard
            stepperData={RegisterPatientMenuNav}
            activeStep={activeStep as number}
            dispatch={dispatch}
          />
        </Card>
      </Box>

      <Box flex={1}>
        {getActiveComponent(activeStep)}
      </Box>
    </Box>
  )
}

export default RegisterFormComponent;
