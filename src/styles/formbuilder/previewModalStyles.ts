import { makeStyles } from "@material-ui/core";
import { WHITE } from "../../theme";

export const usePreviewModalStyles = makeStyles((theme) => ({
  externalMain: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),

    [theme.breakpoints.down("md")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },

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
