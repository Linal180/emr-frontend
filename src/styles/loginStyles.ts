import { makeStyles } from "@material-ui/core/styles";
import { BLUE_ONE, BLUE_SEVEN, WHITE } from "../theme";

export const useLoginStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    [theme.breakpoints.down("md")]: {
      flexDirection: 'column',
    },
  },

  loginFormImageContainer: {
    // minWidth: 600,
    minWidth: '30%',
    alignItems: "center",
    display: "flex",
    flexDirection: 'column',
    justifyContent: "space-between",
    textAlign: 'center',
    paddingBottom: 40,
  },

  loginDescription: {
    color: "#7E8299",
    fontSize: 18,
    fontWeight: 600,
    maxWidth:380,
    margin: '16px auto 0',
  },

  sideLoginImage: {

    [theme.breakpoints.down("md")]: {
      display: 'none',
    },
  },

  loginFormLoginContainer: {
    background: '#F3F5F9',
    display: "flex",
    flexDirection: 'column',
    alignItems: "center",
    flex: 1,
    justifyContent: "center",

    "& .MuiOutlinedInput-root": {
      backgroundColor: WHITE,
      minHeight: 48,
    },

    "& .MuiOutlinedInput-input": {
      minHeight: 48,
    },

    "& .MuiButton-contained": {
      backgroundColor: BLUE_SEVEN,
      color: WHITE,
      minHeight:48,
    },

  },

  loginFormContainer: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 12,

    [theme.breakpoints.down("md")]: {
      padding: "35px 20px 56px",
    },
  },

  passwordIcon: {
    color: BLUE_ONE
  },

  forgotPassword: {
    position:'absolute',
    right: 0,
    width: 140,
    top: '-25px',
  }
}));
