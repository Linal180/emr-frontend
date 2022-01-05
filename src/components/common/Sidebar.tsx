// packages block
import { FC, useContext } from "react";
import clsx from "clsx";
import { Box, IconButton, Drawer, Typography } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import dotenv from "dotenv";
// components block
import ListItems from "./ListItems";
import { MainLogo } from "../../assets/svgs";
// styles and context block
import { useSidebarStyles } from "../../styles/sidebarStyles";
import { AppContext } from "../../context";
import { EMR_TEXT } from "../../constants";
dotenv.config();

const Sidebar: FC = (): JSX.Element => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);
  const classes = useSidebarStyles();

  const handleDrawerClose = () => setIsSidebarOpen(false);
  const version = isSidebarOpen
    ? `Version ${process.env.REACT_APP_VERSION}`
    : `${process.env.REACT_APP_VERSION}`;

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
          <ListItems />
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        pb={1.5}
      >
        <Typography variant="body2" align="center">
          {version}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
