import { makeStyles } from "@material-ui/core";
import { GRAY_TWO } from "../../theme";

export const confirmationStyles = makeStyles((theme) => ({
  container: {
    padding: "40px 250px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 1200,

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
  },
}));