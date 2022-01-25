import { Box } from '@material-ui/core';
import DocumentVerification from './forms/DocumentVerification';
import EmergencyContact from './forms/EmergencyContact';
import YourContactInfo from './forms/YourContactInfo';

const Index = () => {

  return (
    <Box>
      <DocumentVerification />
      <EmergencyContact />
      <YourContactInfo />
    </Box>
  );
};

export default Index;
