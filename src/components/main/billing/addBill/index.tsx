// packages block
import { FC } from 'react';
// component block
import PageHeader from '../../../common/PageHeader';
// constants block
import { BILLING_BREAD, CLAIM_FEED_BREAD, BILL_NEW_BREAD, ADD_BILL } from '../../../../constants';

const AddBillComponent: FC = () => {
  return <PageHeader title={ADD_BILL} path={[BILLING_BREAD, CLAIM_FEED_BREAD, BILL_NEW_BREAD]} />
};

export default AddBillComponent;
