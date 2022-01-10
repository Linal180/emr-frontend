import { makeStyles } from "@material-ui/core";
import { DRAWER_WIDTH } from "../constants";
import { WHITE } from "../theme";

export const useHeaderStyles = makeStyles((theme) => ({
  appBar: {
    marginLeft: DRAWER_WIDTH,
    width: "100%",
    zIndex: theme.zIndex.drawer + 1,
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.3) 100%),url(/images/header.jpg) center no-repeat",
    backgroundSize: "cover",

    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    "& input": {
      color: WHITE,
    },

    "& .MuiFormControl-root.MuiTextField-root": {
      minWidth: 240,
    }
  },

  menuButton: {
    borderRadius: 6,
    padding: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: 'all .3s ease-in',

    "&:hover": {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    }
  },
}));
