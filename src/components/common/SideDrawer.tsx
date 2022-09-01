// packages block
import React from 'react'
import { Drawer } from '@material-ui/core';
import { SideDrawerCloseReason, SideDrawerProps } from '../../interfacesTypes';

const SideDrawer: React.FC<SideDrawerProps> = ({ drawerOpened, toggleSideDrawer, children, sideClickClose = false }) => {
  const closeSideDrawer = (reason: SideDrawerCloseReason) => {
    if (sideClickClose && reason === 'backdropClick') {
      return;
    }
    toggleSideDrawer && toggleSideDrawer()
  }
  return (
    <Drawer
      open={drawerOpened}
      onClose={(_, reason) => closeSideDrawer(reason)}
      anchor="right"
    >
      {children}
    </Drawer>
  )
}

export default SideDrawer