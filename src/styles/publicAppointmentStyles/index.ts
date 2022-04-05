  import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_FOUR, BLUE_EIGHT, BLUE_ONE, GRAY_ONE, GRAY_SIX, POPPINS, WHITE } from "../../theme";

export const usePublicAppointmentStyles = makeStyles(() =>
  createStyles({
    timeSlots: {
      padding: 0,
      display: 'flex',
      flexWrap: "wrap",
      listStyle: 'none',
      overflowX: 'auto',
      margin: "10px 0 20px",
      maxHeight: "470px",
      overflowY: "auto",

      '& li': {
        width: 'calc(50% - 12px)',
        margin: "0 12px 12px 0",
      },

      "& input": {
        display: 'none',

        "& + label": {
          fontFamily: POPPINS,
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
          background: BLUE_EIGHT,
          color: WHITE
        }
      }
    },

    toggleContainer: {
      "& .toggle-main": {
        display: 'flex',
        position: 'relative',
        border: `1px solid ${GRAY_SIX}`,
        fontWeight: 500,
        fontSize: 14,
        width: 145,
        height: 44,
        padding: 5,
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
    },

    agreement_box: {
      boxShadow: `0px -4px 10px rgba(0, 0, 0, 0.1)`,
      borderRadius: '0px 0px 8px 8px',

      "& .MuiIconButton-label:before": {
        border: `2px solid ${BLUE_EIGHT}`
      },

      "& .MuiCheckbox-root.Mui-checked .MuiSvgIcon-root": {
        color: BLUE_EIGHT,
      },

      "& .MuiFormControlLabel-label": {
        fontWeight: 600,
        fontSize: 16,
      }
    }
  })
);
