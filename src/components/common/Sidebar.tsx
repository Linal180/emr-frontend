// packages block
import { FC } from "react";
import dotenv from "dotenv";
import { Box, Drawer } from "@material-ui/core";
// components block
import AppMenu from "./AppMenu";
// styles and context block
import { EMR_TEXT } from "../../constants";
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
      <Box
        minHeight="calc(100vh - 55px)"
        style={{ backgroundColor: "#F2F3F5" }}
      >
        <Box className={classes.toolbarIcon}>
          <Box flex={1}>
            <h1>{EMR_TEXT}</h1>
          </Box>
        </Box>

        <Box className="sideBarNav">
          <AppMenu />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
