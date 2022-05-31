// packages block
import React from 'react';
import { Drawer } from '@material-ui/core';
//components block
import CreateTeamForm from '../careTeamForm';

const CareTeamProvider = ({ drawerOpened, toggleSideDrawer }: any) => {
  return (
    <Drawer
      open={drawerOpened}
      onClose={toggleSideDrawer}
      anchor="right"
    >
      <CreateTeamForm toggleSideDrawer={toggleSideDrawer} />
    </Drawer>
  )
}

export default CareTeamProvider;