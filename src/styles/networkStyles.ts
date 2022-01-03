// packages block
import { makeStyles } from "@material-ui/core/styles";

export const useNetworkStyles = makeStyles((theme) => ({
  root: {
    background: 'rgba(0,86,177,0.3)',
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
  },

  pageNotFoundText: {
    fontSize: 382,
    opacity: 0.1,
    fontFamily: 'Arial Black, Gadget, sans- serif',
    fontWeight: 900,
    lineHeight: '186px'
  },

  link: {
    textDecoration: 'none'
  }
}));
