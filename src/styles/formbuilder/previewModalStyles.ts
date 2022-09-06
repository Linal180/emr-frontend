import { makeStyles } from "@material-ui/core";
import { WHITE } from "../../theme";

export const usePreviewModalStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: `${WHITE} !important`,
    border: "none !important",
    padding: '0 !important',
  },
  tableCell: {
    overflowX: "auto"
  },

  //vertical-stepper-style

  stepperVertical: {    
    "& .MuiStepper-vertical" :{
      [theme.breakpoints.down("md")]: {
        flexDirection: 'row',
        overflowX: 'auto',
        paddingLeft: 10,
        paddingRight: 10,
      },
    },

    "& .MuiStepConnector-line": {
      visibility: 'hidden',
    },

    "& .MuiStepLabel-label": {
      whiteSpace: 'nowrap',
    }
  }
}))
