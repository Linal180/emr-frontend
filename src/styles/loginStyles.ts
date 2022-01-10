import { makeStyles } from "@material-ui/core/styles";
import { BLUE_ONE, WHITE } from "../theme";

export const useLoginStyles = makeStyles((theme) => ({
  root: {
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.3) 100%),url(/images/cover.jpg) center no-repeat",
    backgroundSize: "cover",
    display: "flex",
    minHeight: "100vh",
    padding: "0 20px",
    alignItems: "center",
    justifyContent: "center",
  },

  loginFormContainer: {
    width: '100%',
    background: WHITE,
    padding: 45,
    maxWidth: 650,
    borderRadius: 12,

    [theme.breakpoints.down("md")]: {
      padding: "35px 20px 56px",
    },
  },

  passwordIcon: {
    color: BLUE_ONE
  },
}));
