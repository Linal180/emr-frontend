// packages block
import { FC } from "react";
import { Box, Drawer } from "@material-ui/core";
import dotenv from "dotenv";
// components block
import AppMenu from "./AppMenu";
// styles block
import { useSidebarStyles } from "../../styles/sidebarStyles";
dotenv.config();

const Sidebar: FC = (): JSX.Element => {
  const classes = useSidebarStyles();

  return (
    <Drawer
      variant="permanent"
      classes={{ paper: classes.drawerPaper, }}
      open={true}
    >
      <Box className={classes.toolbarIcon} />
      <Box className="sideBarNav">
        <AppMenu />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        pb={1.5}
      >
      </Box>
    </Drawer>
  );
};

export default Sidebar;
