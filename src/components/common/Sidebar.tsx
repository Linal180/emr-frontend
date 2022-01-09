// packages block
import { FC } from "react";
import { Box, Drawer, ListItemText, ListItemIcon } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import dotenv from "dotenv";
// components block
import AppMenu from "./AppMenu";
// styles block
import { useSidebarStyles } from "../../styles/sidebarStyles";
//contants
import { LOGOUT_TEXT } from "../../constants"
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
        flexDirection="row"
        justifyContent="flex-start"
        alignItems="center"
        pt={15}
        pb={1.5}
        pl={2}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText>
          {LOGOUT_TEXT}
        </ListItemText>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
