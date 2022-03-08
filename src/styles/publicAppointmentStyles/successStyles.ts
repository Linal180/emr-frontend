import { makeStyles } from "@material-ui/core";
import { GRAY_TWO } from "../../theme";

export const successStyles = makeStyles((theme) => ({
  container: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 760,

    [theme.breakpoints.down("md")]: {
      padding: "30px 100px",
    },

    [theme.breakpoints.down("sm")]: {
      padding: "20px 20px",
    },

    "& h5": {
      color: GRAY_TWO,
    },
  },
}));