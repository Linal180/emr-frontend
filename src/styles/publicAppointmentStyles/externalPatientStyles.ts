import {
  WHITE_FOUR,
  BLUE_ONE,
  BLACK_TWO,
  WHITE,
  WHITE_FIVE,
  BLACK_ONE,
  WHITE_SIX,
  GRAY_SIX,
  GRAY_TWO,
  BLUE_SIX,
  BLACK_SEVEN,
  BLUE_EIGHT,
} from "../../theme/colors";
import {
  createStyles,
  makeStyles,
  StepConnector,
  Switch,
  withStyles,
} from "@material-ui/core";
import { theme } from "../../theme";

export const CustomConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },

  active: {
    "& $line": {
      border: `1px solid ${BLUE_EIGHT}`,
    },
  },

  completed: {
    "& $line": {
      border: `1px solid ${BLUE_EIGHT}`,
    },
  },

  line: {
    marginTop: 0,
    flexDirection: "column",
    height: 50,
    border: `1px solid ${WHITE_FOUR}`,
    width: 2,
    marginLeft: 8,
  },
})(StepConnector);

export const useColorLibStepIconStyles = makeStyles({
  root: {
    border: `1px solid ${WHITE_FOUR}`,
    zIndex: 1,
    width: 24,
    height: 24,
    color: BLACK_TWO,
    display: "flex",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Poppins, sans-serif",
  },

  active: {
    backgroundColor: BLUE_EIGHT,
    width: 24,
    height: 24,
    zIndex: 1,
    fontSize: 12,
    borderRadius: 100,
    fontWeight: 600,
    color: WHITE,
  },

  completed: {
    zIndex: 1,
    fontSize: 18,
    color: BLUE_EIGHT,
    border: `2px solid ${BLUE_EIGHT}`,

    "& .MuiSvgIcon-root": {
      padding: 2,
      color: BLUE_EIGHT,
    },
  },
});

export const useExternalPatientStyles = makeStyles({
  stepperGrid: {
    minWidth: 320,
  },

  mainGridContainer: {
    maxHeight: "calc(100vh - 130px)",
    overflowY: "auto",
    borderRadius: 12,
  },

  stepperContainer: {
    height: "calc(100vh - 130px)",

    "@media (max-width:960px)": {
      height: "auto",
    },

    "& .MuiStepper-root": {
      marginTop: 40,
      padding: 30,

      "& .MuiStepConnector-vertical": {
        marginLeft: 2.5,
        padding: 0,
      },

      "& .MuiStepLabel-iconContainer": {
        paddingRight: 0,
      },

      "@media (max-width:960px)": {
        marginTop: 0,
      },
    },
  },

  customStepper: {
    "& .MuiStepLabel-label.MuiStepLabel-active": {
      "& h5": {
        color: BLACK_ONE,
      },
    },

    "& h5": {
      color: BLACK_TWO,
    },

    "& p": {
      color: WHITE_FIVE,
      fontWeight: 500,
    },
  },

  agreementContainer: {
    "& h3": {
      fontSize: 26,
    },

    "& li": {
      padding: "12px 5px",
      color: GRAY_TWO,
    },

    "& .MuiCheckbox-root .MuiSvgIcon-root": {
      width: 24,
      height: 24,
    },
  },

  AGREEMENT_POINTSContainer: {
    maxHeight: "calc(100vh - 344px)",
    overflowY: "auto",
  },

  paymentAccordion: {
    marginBottom: 20,
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: theme.spacing(2, 4),

    "& .MuiPaper-elevation1": {
      boxShadow: "none",
    },

    "& .MuiTypography-h4": {
      fontWeight: 500,
      color: BLACK_SEVEN,
    },

    "& .MuiAccordionSummary-content.Mui-expanded .MuiTypography-root": {
      fontWeight: 500,
      color: BLACK_SEVEN,
    },
  },

  paymentAccordionDetail: {
    margin: "20px auto",
    width: "100%",
    textAlign: "center",
  },
});

export const toggleButtonComponent = makeStyles({
  toggleContainer: {
    "& .toggle-main": {
      display: "flex",
      position: "relative",
      border: `1px solid ${GRAY_SIX}`,
      fontWeight: 500,
      fontSize: 14,
      width: 145,
      height: 44,
      padding: 5,
      borderRadius: 6,

      "& > div": {
        position: "relative",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 2,
        zIndex: 2,
        flex: 1,
      },
    },

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
    },
  },

  buttonToggleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",

    "& .MuiFormLabel-root": {
      color: GRAY_TWO,
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
    },
  },
});

export const verificationFormStyles = makeStyles({
  verticalContainer: {
    "& .MuiCard-root": {
      height: "calc(100vh - 130px)",
      overflowY: "auto",
    },
  },
});

export const AntSwitch = withStyles(() =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      padding: 5,
      display: "flex",
      position: "absolute",
      left: 0,
      top: 0,
    },

    thumb: {
      width: 70,
      height: 34,
      opacity: 0.8,
      borderRadius: 6,
      backgroundColor: WHITE_FIVE,
      boxShadow: "none",
      transform: "translateX(93%)",
      transition: "all .3s ease-in",
    },

    switchBase: {
      padding: 4,
      transform: "none !important",

      "&$checked": {
        "& + $track": {
          opacity: 0.8,
          backgroundColor: "transparent",
          borderColor: "none",
        },

        "& .MuiSwitch-thumb": {
          backgroundColor: BLUE_SIX,
          transform: "translateX(0)",
        },
      },
    },

    track: {
      border: `none`,
      backgroundColor: WHITE,
    },

    checked: {},
  })
)(Switch);
