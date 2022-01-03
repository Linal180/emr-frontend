import { makeStyles } from "@material-ui/core/styles";

import { CENTURY, CENTURY_BOLD, PRIMARY_COLOR, SECONDARY_COLOR, WHITE } from "../theme";

export const useLoginStyles = makeStyles((theme) => ({
  root: {
    background:
      "linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.3) 100%),url(/images/cover.jpg) center no-repeat",
    backgroundSize: "cover",
    display: "flex",
    minHeight: "100vh",
    padding: "0 20px",
    alignItems: "center",
    justifyContent: "center",
  },

  loginFormContainer: {
    padding: 56,
    maxWidth: 650,
    width: '100%',
    background: WHITE,
    borderLeft: `8px solid ${SECONDARY_COLOR}`,

    [theme.breakpoints.down("md")]: {
      padding: "40px 20px",
    },
  },

  form: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },

  textFeild: {
    boxShadow: "0px 0px 24px rgba(0, 0, 0, 0.15)",
  },

  labelText: {
    fontSize: 16,
  },

  heading: {
    fontSize: 36,
    lineHeight: 1.167,
    fontWeight: "normal",
    fontFamily: CENTURY_BOLD,
  },

  body: {
    fontSize: 18,
    lineHeight: 1.43,
    fontFamily: CENTURY,
    fontWeight: "normal",
  },

  subHeading: {
    fontSize: 18,
    marginBottom: 10,
    color: PRIMARY_COLOR,
    textDecoration: "none",
  },

  title: {
    padding: "8px 0",
  },

  passwordIcon: {
    color: SECONDARY_COLOR
  },

  buttonText: {
    width: "100%",
    letterSpacing: 8,
    padding: "8px 20px",
    textTransform: "uppercase",
  },

  button: {
    minHeight: 50,
  },

  signinLink: {
    color: PRIMARY_COLOR,
    padding: "5px",
    textDecorationLine: 'none',
    fontSize: 18,
  },
}));
