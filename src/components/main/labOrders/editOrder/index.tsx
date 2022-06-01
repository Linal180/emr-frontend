// packages block
import { Box } from '@material-ui/core';
import { FC } from 'react';
import { useParams } from 'react-router';
import { ParamsType } from '../../../../interfacesTypes';
import LabOrderListingTable from '../orderListing/labOrderListingTable';
import { DASHBOARD_BREAD, LAB_ORDER, LAB_ORDER_BREAD, PATIENTS_BREAD } from '../../../../constants';
// components block
import BackButton from '../../../common/BackButton';
import PageHeader from '../../../common/PageHeader';
import LabOrdersEditForm from './LabOrdersEditForm';

const EditLabOrdersComponent: FC = (): JSX.Element => {
  const { orderNum, patientId } = useParams<ParamsType>()
  return (
    <>
      <Box display="flex">
        <BackButton to={`/patients/${patientId}/details/10`} />

        <Box ml={2}>
          <PageHeader
            title={`${LAB_ORDER}: ${orderNum}`}
            path={[DASHBOARD_BREAD, PATIENTS_BREAD, LAB_ORDER_BREAD]}
          />
        </Box>
      </Box>
      <LabOrderListingTable />
      <LabOrdersEditForm />
    </>
  )
}

export default EditLabOrdersComponent;
