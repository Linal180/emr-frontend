// packages block
import { FC } from "react";
import { AccountCircle } from "@material-ui/icons";
import { Box, Drawer, Button } from "@material-ui/core";
import dotenv from "dotenv";
// components block
import AppMenu from "./AppMenu";
// utils, styles  block
import { handleLogout } from "../../utils";
import { useSidebarStyles } from "../../styles/sidebarStyles";
dotenv.config();

const Sidebar: FC = (): JSX.Element => {
  const classes = useSidebarStyles();

  return (
    <Drawer variant="permanent" classes={{ paper: classes.drawerPaper }} open={true}>
      <Box minHeight="calc(100vh - 300px)" pt={2}>
        <AppMenu />
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" pt={15} pb={1.5}>
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <AccountCircle />

          <Button onClick={handleLogout}>logout</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
