// packages block
import { FC } from 'react';
import { Box, colors } from '@material-ui/core';
// component block
import AddLabOrdersComponent from '../addOrder';
import LabOrdersComponent from '../orderListing';
import PageHeader from '../../../common/PageHeader';
// constants block
import { LAB_ORDER } from '../../../../constants';

const ViewLabOrdersComponent: FC = () => {
  return (
    <>
      <PageHeader title={LAB_ORDER} />

      <Box maxHeight="calc(100vh - 180px)" className="overflowY-auto">
        <LabOrdersComponent />

        <Box mt={2} mb={5} borderBottom={`1px solid ${colors.grey[300]}`} />

        <AddLabOrdersComponent />
      </Box>
    </>
  )
};

export default ViewLabOrdersComponent;
