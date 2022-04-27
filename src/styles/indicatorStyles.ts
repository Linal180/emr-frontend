import { makeStyles } from "@material-ui/core";

export const useIndicatorStyles = makeStyles(theme => ({
  line: {
    height: "2px",
    width: "100%",
    transform: "translate(0, -1px)"
  },
  circle: {
    width: theme.spacing(1.5),
    height: theme.spacing(1.5),
    borderRadius: "50%",
    transform: "translate(-50%, -50%)"
  },
  nowIndicator: {
    position: "absolute",
    left: 0,
    top: ({ top }: any) => top,
    background: theme.palette.secondary.main,
    zIndex: 1
  }
}));