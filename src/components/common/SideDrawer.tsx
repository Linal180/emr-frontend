// packages block
import React from 'react'
import { Drawer } from '@material-ui/core';
import { SideDrawerProps } from '../../interfacesTypes';

const SideDrawer: React.FC<SideDrawerProps> = ({ drawerOpened, toggleSideDrawer, children }) => {
  const closeSideDrawer = () => toggleSideDrawer && toggleSideDrawer()
  return (
    <Drawer
      open={drawerOpened}
      onClose={closeSideDrawer}
      anchor="right"
    >
      {children}
    </Drawer>
  )
}

export default SideDrawer