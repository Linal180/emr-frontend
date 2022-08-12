  import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_FOUR, GRAY_ONE, GRAY_SIX, GREY_TWO, INTER, theme, WHITE } from "../../theme";

export const usePublicAppointmentStyles = makeStyles(() =>
  createStyles({
    main: {
      padding: theme.spacing(3),
      borderRadius: theme.spacing(1),
      margin: theme.spacing(0.5),
      backgroundColor: WHITE,
      minHeight: 100,
      // position: "sticky",
      // top: 100,
      zIndex: 1,
    },

    timeSlot: {
      cursor: "pointer"
    },
    
    timeSlots: {
      padding: 0,
      display: 'flex',
      flexWrap: "wrap",
      listStyle: 'none',
      overflowX: 'auto',
      margin: "10px 0 20px",
      maxHeight: "210px",
      overflowY: "auto",

      '& li': {
        width: 'calc(50% - 12px)',
        margin: "0 12px 15px 0",
      },

      "& input": {
        display: 'none',

        "& + label": {
          fontFamily: INTER,
          fontSize: 13,
          color: BLACK_FOUR,
          border: `1px solid ${GRAY_ONE}`,
          display: 'block',
          width: '100%',
          textAlign: 'center',
          padding: '11px 0',
          borderRadius: 6,
          cursor: 'pointer',
          transition: `all .3s ease-in`
        },

        "&:checked + label": {
          background: GREY_TWO,
          color: WHITE
        }
      }
    },

    toggleContainer: {
      "& .toggle-main": {
        display: 'flex',
        position: 'relative',
        border: `1px solid ${GRAY_SIX}`,
        fontWeight: 600,
        fontSize: 16,
        width: 145,
        height: 44,
        padding: 7,
        borderRadius: 6,

        "& > div": {
          position: 'relative',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 2,
          zIndex: 2,
          flex: 1,
        }
      },

      "& .MuiToggleButtonGroup-root": {
        marginTop: 10,
      },

      "& .MuiToggleButton-root.Mui-selected": {
        color: WHITE,
        backgroundColor: GREY_TWO,
        padding: "12px 20px",
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
    },
    toggleSmContainer: {
      "& .toggle-main": {
        display: 'flex',
        position: 'relative',
        border: `1px solid ${GRAY_SIX}`,
        fontWeight: 600,
        fontSize: 16,
        width: 145,
        height: 44,
        padding: 7,
        borderRadius: 6,

        "& > div": {
          position: 'relative',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 2,
          zIndex: 2,
          flex: 1,
        }
      },

      "& .MuiToggleButtonGroup-root": {
        marginTop: 10,
      },

      "& .MuiToggleButton-root.Mui-selected": {
        color: WHITE,
        backgroundColor: GREY_TWO,
        padding: "12px 20px",
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

      "& .MuiSwitch-thumb": {  
        backgroundColor: "#204ECF !important",
      }
      
    },
    agreement_box: {
      boxShadow: `0px -4px 10px rgba(0, 0, 0, 0.1)`,
      borderRadius: '0px 0px 8px 8px',

      "& .MuiIconButton-label:before": {
        border: `2px solid ${GREY_TWO}`
      },

      "& .MuiCheckbox-root.Mui-checked .MuiSvgIcon-root": {
        color: GREY_TWO,
      },

      "& .MuiFormControlLabel-label": {
        fontWeight: 600,
        fontSize: 16,
      }
    },

    daysBox: {
      "& .MuiTypography-body1": {
        fontSize: 14,
      },

      "& .MuiCheckbox-root .MuiIconButton-label:before": {
        width: 16,
        height: 16,
      }
    },

    billingCard: {
      [theme.breakpoints.up("md")]: {
        borderRight: `1px solid ${GRAY_SIX}`,
        minHeight: 354,
        paddingRight: theme.spacing(3),
      },
    }
  })
);
