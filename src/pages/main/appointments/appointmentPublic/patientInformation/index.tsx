// packages block
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card } from '@material-ui/core';
// components
import Stepper from './components/stepper';
import ConsentAgreement from './stepperForms/consentAgreement';
import PatientInformationForm from './stepperForms/patientInformationForm';
import DocumentVerificationForm from './stepperForms/documentVerificationForm';

// themes / constants / utils
import { WHITE_TWO } from '../../../../../theme';
import { PATIENT_APPOINTMENT_SUCCESS } from '../../../../../constants';
import { usePatientInformation } from '../../../../../styles/publicAppointment/patientInformation';

const Index: FC = (): JSX.Element => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const classes = usePatientInformation();

  const getPatientInformationStep = (step: number): JSX.Element => {
    switch (step) {
      case 0:
        return <PatientInformationForm />
      case 1:
        return <DocumentVerificationForm />
      case 2:
        return <ConsentAgreement />
      default:
        return <> </>;
    }
  };

  const handleNextStep = () => {
    setActiveStep(activeStep + 1)
  };

  const handleBackStep = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Box bgcolor={WHITE_TWO} minHeight="100vh" p={3.75}>
      <Box display="flex" flexWrap="wrap" gridGap={20}>
        <Box className={classes.stepperGrid}>
          <Card className={classes.stepperContainer}>
            <Stepper activeStep={activeStep} />
          </Card>
        </Box>

        <Box flex={1}>
          {getPatientInformationStep(activeStep)}
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" gridGap={20} mt={3}>
        <Button variant="contained" disabled={activeStep === 0} onClick={handleBackStep}>
          Back
        </Button>

        {activeStep < 2 ?
          <Button variant="contained" className="blue-button" onClick={handleNextStep}>
            Next
          </Button>
          :
          <Link to={PATIENT_APPOINTMENT_SUCCESS}>
            <Button variant="contained" className="blue-button">Finish</Button>
          </Link>
        }
      </Box>
    </Box>
  );
};

export default Index;
