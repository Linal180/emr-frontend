import { makeStyles, createStyles } from "@material-ui/core";
import { WHITE, BLACK, BLUE_ONE, BLACK_THREE } from "../theme";

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
      color: BLACK_THREE,
      width: 30,
      minWidth: 30,
      marginRight: 15,

      "&.active": {
        color: BLUE_ONE,
      }
    },

    leftNavBar: {
      paddingLeft: 0
    }
  })
);