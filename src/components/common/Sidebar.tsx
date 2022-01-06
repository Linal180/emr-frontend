// packages block
import { FC, useContext } from "react";
import clsx from "clsx";
import { Box, IconButton, Drawer, Typography } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import dotenv from 'dotenv';
// components block
import ListItems from "./ListItems";
import { MainLogo } from "../../assets/svgs";
// styles and context block
import { useSidebarStyles } from "../../styles/sidebarStyles";
import { AppContext } from "../../context";
dotenv.config()

const Sidebar: FC = (): JSX.Element => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(AppContext)
  const classes = useSidebarStyles();

  const handleDrawerClose = () => setIsSidebarOpen(false);

  return (
    <Drawer variant="permanent" classes={{ paper: clsx(classes.drawerPaper, !isSidebarOpen && classes.drawerPaperClose) }}>
      <Box minHeight="calc(100vh - 55px)">
        <Box className={classes.toolbarIcon}>
          <Box flex={1}>
            <MainLogo />
          </Box>
        </Box>

        <Box className="sideBarNav">
          <ListItems />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
