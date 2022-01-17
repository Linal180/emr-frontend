import { makeStyles } from "@material-ui/core";
import { WHITE_ONE } from "../theme";

import { DRAWER_WIDTH } from "../constants";

export const useSidebarStyles = makeStyles(() => ({
  drawerPaper: {
    backgroundColor: WHITE_ONE,
    width: DRAWER_WIDTH,
    borderRadius: 24,
    position: 'relative',
    maxHeight: 'calc(100vh - 120px)',
    borderRight: 'none'
  },

  appMenuContainer: {
    overflowY: 'auto',
  }
}));
