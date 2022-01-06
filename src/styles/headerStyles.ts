import { makeStyles } from "@material-ui/core";

import { DRAWER_WIDTH } from "../constants";
import { HEADER_COMPONENTS_BACKGROUND_COLOR, WHITE } from "../theme";

export const useHeaderStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24,
  },

  appBar: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100%)`,
    zIndex: theme.zIndex.drawer + 1,
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.3) 100%),url(/images/header.jpg) center no-repeat",
    backgroundSize: "cover",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  menuButton: {
    marginRight: 5,
    marginLeft: 5,
    backgroundColor:HEADER_COMPONENTS_BACKGROUND_COLOR,
    borderRadius:"25%"
  },

  goalButton: {
    padding: "12px 18px",
  },

  title: {
    flexGrow: 1,
    fontSize: 20,
    letterSpacing: 1
  },

  cursor: {
    cursor: 'pointer',
  },

  input: {
    '& input': {
      paddingTop:13,
      paddingBottom:13,
    color: WHITE,
    }
  }

}));
