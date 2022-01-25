import { FC, useState } from 'react';
import { Box, Button, Card, Grid } from '@material-ui/core';
import { WHITE_TWO } from '../../../../../theme';
import PatientInformationForm from './stepperForms/patientInformationForm';
import DocumentVerificationForm from './stepperForms/documentVerificationForm';
import { usePatientInformation } from '../../../../../styles/publicAppointment/patientInformation';
import ConsentAgreement from './stepperForms/consentAgreement';
import Stepper from './components/stepper';

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
      <Grid container spacing={3} className={classes.customGrid}>
        <Grid item className={classes.stepperGrid}>
          <Card className={classes.stepperContainer}>
            <Stepper activeStep={activeStep} />
          </Card>
        </Grid>

        <Grid item className={classes.mainGrid}>
          <Box className={classes.mainGridContainer}>
            {getPatientInformationStep(activeStep)}
          </Box>
        </Grid>

        <Grid item md={12}>
          <Box className={classes.buttonContainer}>
            <Button variant="contained" disabled={activeStep === 0} onClick={handleBackStep}>
              Cancel Booking
            </Button>

            <Button variant="contained" className="blue-button" disabled={activeStep === 2} onClick={handleNextStep}>
              Next
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box >
  );
};

export default Index;
