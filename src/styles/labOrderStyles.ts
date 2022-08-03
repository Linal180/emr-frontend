import { makeStyles } from "@material-ui/core";
import { BLUE } from "../theme";

export const useLabOrderStyles = makeStyles({
   labOrderBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    "& .MuiStepper-root": {
      paddingBottom: 0,
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