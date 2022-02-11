// packages block
import { makeStyles } from "@material-ui/core/styles";
import { BLUE_THREE, GRAY_EIGHT, POPPINS, WHITE } from "../theme";

export const useNetworkStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 20px",
  },

  textContainer: {
    width: '100%',
    padding: 40,
    position: "relative",

    [theme.breakpoints.down("md")]: {
      padding: "40px 20px",
    },

    "& .MuiButton-contained": {
      backgroundColor: BLUE_THREE,
      color: WHITE
    },

    "& .MuiTypography-body2": {
      color: GRAY_EIGHT,
      fontSize: 22,
      fontWeight: 500
    }
  },

  pageNotFoundText: {
    fontSize: 600,
    opacity: 0.03,
    fontFamily: POPPINS,
    fontWeight: 100,
    lineHeight: '186px'
  },

  link: {
    textDecoration: 'none'
  }
}));
