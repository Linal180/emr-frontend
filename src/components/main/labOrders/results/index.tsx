// packages block
import { Box } from '@material-ui/core';
import { FC } from 'react';
import { useParams } from 'react-router';
import { DASHBOARD_BREAD, EDIT_LAB_RESULTS_BREAD, LAB_ORDER, PATIENTS_BREAD } from '../../../../constants';
import { ParamsType } from '../../../../interfacesTypes';
import BackButton from '../../../common/BackButton';
import PageHeader from '../../../common/PageHeader';
import LabOrdersResultForm from './LabOrdersResultForm';
// components block

const ResultsLabOrdersComponent: FC = (): JSX.Element => {
  const { orderNum, patientId } = useParams<ParamsType>()
  return (
    <>
      <Box display="flex">
        <BackButton to={`/patients/${patientId}/details/10`} />

        <Box ml={2}>
          <PageHeader
            title={`${LAB_ORDER}: ${orderNum}`}
            path={[DASHBOARD_BREAD, PATIENTS_BREAD, EDIT_LAB_RESULTS_BREAD]}
          />
        </Box>
      </Box>
      <LabOrdersResultForm />
    </>
  )
}

export default ResultsLabOrdersComponent;
