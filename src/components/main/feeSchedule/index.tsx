// packages block
import { useState } from 'react';
import { Box, Button, Typography } from '@material-ui/core';
// component block
import FeeTable from './feeScheduleTable';
import FeeScheduleForm from './feeScheduleForm';
import SideDrawer from '../../common/SideDrawer';
// constants, history, styling block
import { AddWhiteIcon } from '../../../assets/svgs';
import { ADD_NEW_TEXT, FEE_SCHEDULE, } from '../../../constants';

const FeeScheduleComponent = (): JSX.Element => {
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

  const toggleSideDrawer = () => setDrawerOpened(!drawerOpened)
  return (
    <>
      <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4" color="textPrimary">{FEE_SCHEDULE}</Typography>
        <Button variant="contained" startIcon={<AddWhiteIcon />} color="primary"
          onClick={toggleSideDrawer}
        >
          {ADD_NEW_TEXT}
        </Button>
      </Box>

      <FeeTable />

      <SideDrawer drawerOpened={drawerOpened} toggleSideDrawer={toggleSideDrawer}>
        <FeeScheduleForm />
      </SideDrawer>
    </>
  )
}
export default FeeScheduleComponent;
