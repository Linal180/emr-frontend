import { makeStyles, createStyles } from "@material-ui/core";
import { WHITE, ACTIVE_ICON_COLOR, ACTIVE_LINK_COLOR } from "../theme";

export const useAppMenuStyles = makeStyles((theme) =>
createStyles({
  menuItem: {
    "&.active": {
      background:ACTIVE_LINK_COLOR,
      "& .MuiListItemIcon-root": {
        color: WHITE,
      },
    },
  },
  menuItemIcon: {
    color: ACTIVE_ICON_COLOR,
  },
  leftNavBar: {
    paddingLeft:0
  }
})
);