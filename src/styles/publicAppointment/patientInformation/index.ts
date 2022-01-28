import { WHITE_FOUR, BLUE_ONE, BLACK_TWO, BLUE_THREE, WHITE, WHITE_FIVE, BLACK_ONE, WHITE_SIX } from './../../../theme/colors';
import { makeStyles, StepConnector, withStyles } from "@material-ui/core";

export const CustomConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },

  active: {
    '& $line': {
      border: `1px dashed ${WHITE_FOUR}`,
    },
  },

  completed: {
    '& $line': {
      border: `1px dashed ${WHITE_FOUR}`,
    },
  },

  line: {
    marginTop: 8,
    flexDirection: 'column',
    height: 50,
    border: `1px dashed ${WHITE_FOUR}`,
    width: 2,
    marginLeft: 8,
  },
})(StepConnector);


export const useColorLibStepIconStyles = makeStyles({
  root: {
    backgroundColor: WHITE_SIX,
    zIndex: 1,
    width: 40,
    height: 40,
    color: BLACK_TWO,
    display: 'flex',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    fontWeight: 600,
    fontFamily: "Poppins, sans-serif",
  },

  active: {
    backgroundColor: BLUE_THREE,
    width: 40,
    height: 40,
    zIndex: 1,
    fontSize: 18,
    borderRadius: 9,
    fontWeight: 600,
    color: WHITE,
  },

  completed: {
    backgroundColor: WHITE_SIX,
    zIndex: 1,
    fontSize: 18,
    color: BLUE_THREE,

    "& .MuiSvgIcon-root": {
      padding: 5,
    }
  },
});

export const usePatientInformation = makeStyles({
  customGrid: {
    display: "flex",
  },

  stepperGrid: {
    minWidth: 320,
  },

  mainGrid: {
    flex: 1,

    '@media (max-width:960px)': {
      flex: "auto",
    },
  },

  mainGridContainer: {
    maxHeight: "calc(100vh - 130px)",
    overflowY: "auto",
  },

  stepperContainer: {
    height: "calc(100vh - 130px)",

    '@media (max-width:960px)': {
      height: "auto",
    },

    "& .MuiStepper-root": {
      marginTop: 40,
      padding: 30,

      '@media (max-width:960px)': {
        marginTop: 0,
      },
    }
  },

  customStepper: {
    "& .MuiStepLabel-label.MuiStepLabel-active": {
      '& h5': {
        color: BLACK_ONE,
      },
    },

    '& h5': {
      color: BLACK_TWO,
    },

    '& p': {
      color: WHITE_FIVE,
      fontWeight: 500,
    },
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
  }
});

export const toggleButtonComponent = makeStyles({
  toggleContainer: {
    "& .MuiToggleButtonGroup-root": {
      marginTop: 10,
    },

    "& .MuiToggleButton-root.Mui-selected": {
      color: WHITE,
      backgroundColor: BLUE_ONE,
      padding: "9px 30px",
      borderRadius: 6,
    },

    "& .MuiToggleButtonGroup-groupedHorizontal:not(:first-child)": {
      borderTopRightRadius: "6px",
      borderBottomRightRadius: "6px",
    },

    "& .MuiToggleButtonGroup-groupedHorizontal:not(:last-child)": {
      borderTopLeftRadius: "6px",
      borderBottomLeftRadius: "6px",
    }
  }
})

export const verificationFormStyles = makeStyles({
  verticalContainer: {
    "& .MuiCard-root": {
      height: "calc(100vh - 130px)"
    },
  }
})
