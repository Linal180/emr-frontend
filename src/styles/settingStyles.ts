import { makeStyles, createStyles } from "@material-ui/core";
import { theme } from "../theme";

export const useSettingStyles = makeStyles(() =>
  createStyles({
    settingContainer: {
      display: "flex",
      alignItems: "center",

      [theme.breakpoints.down("sm")]: {
        flexDirection: 'column',
        alignItems: "flex-start",
        marginBottom : '10px'
      },

      '& .MuiListItem-gutters': {
        [theme.breakpoints.down("sm")]: {
          padding : 0,
        },
      }
    },

    inlineDashes: {
      [theme.breakpoints.down("sm")]: {
        display: 'none'
      },
    }
  })
);
