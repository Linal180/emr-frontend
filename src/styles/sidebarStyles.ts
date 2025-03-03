import { makeStyles } from "@material-ui/core";
import { BLACK, WHITE_ONE } from "../theme";
import { DRAWER_WIDTH } from "../constants";

export const useSidebarStyles = makeStyles(() => ({
  drawerPaper: {
    backgroundColor: WHITE_ONE,
    width: DRAWER_WIDTH,
    borderRadius: 24,
    position: 'relative',
    height: 'calc(100vh - 120px)',
    borderRight: 'none',
    overflowY: 'hidden',

    "& .MuiButton-root": {
      minWidth: 40
    },

    "& .MuiButton-label": {
      color: BLACK,
      justifyContent: 'flex-start',
    }
  },

  appMenuContainer: {
    height: "calc(100% - 50px)",

    "& .MuiList-root": {
      height: '100%',
      overflowY: "auto",
    },

  }
}));
