// packages block
import { FC, useContext } from "react";
import clsx from "clsx";
import { Box, Drawer } from "@material-ui/core";
import dotenv from "dotenv";
import AppMenu from "./AppMenu";
import { useSidebarStyles } from "../../styles/sidebarStyles";
import { AppContext } from "../../context";
import { EMR } from "../../constants";
dotenv.config();

const Sidebar: FC = (): JSX.Element => {
  const { isSidebarOpen } = useContext(AppContext);
  const classes = useSidebarStyles();


  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(
          classes.drawerPaper,
          !isSidebarOpen && classes.drawerPaperClose
        ),
      }}
      open={isSidebarOpen}
    >
        <Box className={classes.toolbarIcon}>
          <Box flex={1}>
            <h1>{EMR}</h1>
          </Box>
        </Box>

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
