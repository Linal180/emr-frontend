import { makeStyles } from "@material-ui/core";
import { GREY_SEVEN } from "../../theme";

export const failStyles = makeStyles((theme) => ({
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
      color: GREY_SEVEN,
    },

    "& ul * + *": {
      marginTop: 15
    },

    "& li::marker": {
      color: GREY_SEVEN,
    }
  },
}));