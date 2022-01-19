// packages block
import { FC } from 'react';
// component block
import PageHeader from '../../../common/PageHeader';
// constants block
import { RESULT_NEW_BREAD, ADD_RESULT, REPORTS_BREAD, LAB_RESULTS_BREAD } from '../../../../constants';

const AddResultComponent: FC = () => {
  return <PageHeader title={ADD_RESULT} path={[REPORTS_BREAD, LAB_RESULTS_BREAD, RESULT_NEW_BREAD]} />
};

export default AddResultComponent;
