// packages block
import { FC } from 'react';
import { Box } from '@material-ui/core';
// component block
import BackButton from '../../../common/BackButton';
import PageHeader from '../../../common/PageHeader';
// constants block
import { RESULT_NEW_BREAD, ADD_RESULT, DASHBOARD_BREAD, LAB_RESULTS_BREAD, LAB_RESULTS_ROUTE } from '../../../../constants';

const AddResultComponent: FC = () => {
  return (
    <Box display='flex'>
      <BackButton to={`${LAB_RESULTS_ROUTE}`} />
    
      <Box ml={2}>
        <PageHeader title={ADD_RESULT} path={[DASHBOARD_BREAD, LAB_RESULTS_BREAD, RESULT_NEW_BREAD]} />
      </Box>
    </Box>
    
  )
};

export default AddResultComponent;
