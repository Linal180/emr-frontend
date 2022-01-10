import { makeStyles } from "@material-ui/core";
import { WHITE_ONE } from "../theme";

import { DRAWER_WIDTH } from "../constants";

export const useSidebarStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    minHeight: "calc(100vh - 55px)",
    marginTop: "5.5rem",
    marginLeft: "30px",
    backgroundColor: WHITE_ONE,
    width: DRAWER_WIDTH,
    borderRadius: 24,

    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));
