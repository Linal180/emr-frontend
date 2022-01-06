import { makeStyles } from "@material-ui/core";

import { DRAWER_WIDTH } from "../constants";

export const useSidebarStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    ...theme.mixins.toolbar,
  },

  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    marginTop: "5.5rem",
    width: DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  drawerPaperClose: {
    overflowX: "hidden",
    minWidth:"78px",

    "& .MuiListItem-gutters": {
      paddingLeft: 22,
    },

    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
}));
