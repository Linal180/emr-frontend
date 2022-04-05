import { makeStyles, StepConnector, withStyles, } from "@material-ui/core";

export const CheckInConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },

  active: {
    "& $line": {
      borderColor: "#3F95FF",
    },
  },

  completed: {
    "& $line": {
      borderColor: "#3F95FF",
    },
  },

  line: {
    borderColor: "#E5E7EB",
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

export const useCheckInStepIconStyles = makeStyles({
  root: {
    color: "#ffffff",
    display: "flex",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    border: '1px solid #E5E7EB',
    borderRadius: '100%',
  },

  active: {
    color: "#ffffff",
    backgroundColor: '#3F95FF',
  },

  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },

  completed: {
    color: '#3F95FF',
    zIndex: 1,
    border: '1px solid #3F95FF',
    borderRadius: 100,
  },
});
