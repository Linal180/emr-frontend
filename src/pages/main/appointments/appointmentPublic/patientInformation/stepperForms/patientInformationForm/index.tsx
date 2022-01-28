import { Box } from '@material-ui/core';
import { usePatientInformation } from '../../../../../../../styles/publicAppointment/patientInformation';
import DocumentVerification from './forms/DocumentVerification';
import EmergencyContact from './forms/EmergencyContact';
import YourContactInfo from './forms/YourContactInfo';

const Index = () => {
  const classes = usePatientInformation()

  return (
    <Box className={classes.mainGridContainer}>
      <DocumentVerification />
      <EmergencyContact />
      <YourContactInfo />
    </Box>
  );
};

export default Index;
