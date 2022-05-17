// packages block
import { FC } from 'react';
import LabOrderListingTable from '../orderListing/labOrderListingTable';
// components block
import LabOrdersEditForm from './LabOrdersEditForm';

const EditLabOrdersComponent: FC = (): JSX.Element => {
    return (
       <>
        <LabOrderListingTable />
        <LabOrdersEditForm />
       </>
    )
}

export default EditLabOrdersComponent;
