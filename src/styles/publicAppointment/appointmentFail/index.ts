import { makeStyles } from "@material-ui/core";
import { GRAY_TWO } from "../../../theme";

export const appointmentFailStyles = makeStyles((theme) => ({
  container: {
    padding: "40px 250px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    maxWidth: 1170,

    [theme.breakpoints.down("md")]: {
      padding: "30px 100px",
    },

    [theme.breakpoints.down("sm")]: {
      padding: "20px 80px",
    },

    "& h3": {
      fontSize: 26,
    },

    "& h5": {
      color: GRAY_TWO,
    },

    "& ul * + *": {
      marginTop: 15
    },

    "& li::marker": {
      color: GRAY_TWO,
    }
  },
}));