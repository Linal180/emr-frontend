import { makeStyles, StepConnector, withStyles, } from "@material-ui/core";
import { BLUE, WHITE } from "../theme";

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

export const useCheckInProfileStyles = makeStyles({
  checkInProfileBox: {
    boxShadow: `0px 4px 30px rgba(56, 71, 109, 0.09)`,
    borderRadius: 8,
    backgroundColor: WHITE,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
    minHeight: 100,
    display: 'flex',
    alignItems: 'center',

    "& .MuiStepper-root": {
      padding: 0,
    },

    "& .MuiStep-alternativeLabel": {
      position: 'inherit',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      flex: 'auto',
      marginBottom: 10,
    },

    "& .MuiStep-horizontal": {
      paddingLeft: 0,
    },

    "& .MuiStepper-alternativeLabel": {
      flexWrap: 'wrap',
    },
    
    "& .MuiStepLabel-root.MuiStepLabel-alternativeLabel": {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
      marginTop: 0,
      fontWeight: 500,
      fontSize: 16,
      margin: '0 5px',
    },

    "& .MuiStepLabel-iconContainer.MuiStepLabel-alternativeLabel": {
      display: 'none',
    },

    "& .MuiStepLabel-label.MuiStepLabel-active": {
      color: BLUE,
    },
  },
});

export const useInsurancesStyles = makeStyles({
  checkInProfileBox: {

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    "& .MuiStepper-root": {
      padding: 0,
    },

    "& .MuiStep-alternativeLabel": {
      position: 'inherit',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      flex: 'auto',
      marginBottom: 10,
    },

    "& .MuiStep-horizontal": {
      paddingLeft: 0,
    },

    "& .MuiStepper-alternativeLabel": {
      flexWrap: 'wrap',
    },
    
    "& .MuiStepLabel-root.MuiStepLabel-alternativeLabel": {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
    "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
      marginTop: 0,
      fontWeight: 500,
      fontSize: 16,
      margin: '0 5px',
    },

    "& .MuiStepLabel-iconContainer.MuiStepLabel-alternativeLabel": {
      display: 'none',
    },

    "& .MuiStepLabel-label.MuiStepLabel-active": {
      color: BLUE,
      fontWeight : 'bold'
    },

    "& .MuiStepConnector-alternativeLabel": {
      display : 'none'
    },
    
  },
});