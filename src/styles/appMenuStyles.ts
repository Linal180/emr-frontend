import { makeStyles, createStyles } from "@material-ui/core";
import { WHITE, BLACK, BLUE_ONE } from "../theme";

export const useAppMenuStyles = makeStyles(() =>
  createStyles({
    menuItem: {
      padding: '8px 27px',

      "&.active": {
        background: BLACK,

        "& .MuiListItemIcon-root": {
          color: WHITE,
        },
      },
    },

    menuItemIcon: {
      color: BLUE_ONE,
    },

    leftNavBar: {
      paddingLeft: 0
    }
  })
);