import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_FOUR, BLACK_TWO, BLUE_EIGHT, RED_FOUR, WHITE, WHITE_FOUR } from "../theme";

export const useCalendarStyles = makeStyles(() =>
  createStyles({
    dropdown: {
      "& .MuiMenu-paper": {
        padding: 20,

        "& .MuiCardContent-root": {
          padding: 0,
        },
      },

      "& .MuiPopover-paper": {
        minHeight: 300,
      },
    },

    cardContainer: {
      minWidth: '520px',
      backgroundColor: WHITE,
      transform: "none",
      transition: `transform 400ms cubic-bezier(0, 0, 0.2, 1) 0ms`,
      height: "100%",
      position: "fixed",
      top: 0,
      right: 0,
      overflow: 'auto',
    },

    cardHeader: {
      padding: 8,
    },

    cardText: {
      "& .MuiTypography-body1": {
        color: BLACK_TWO,
        letterSpacing: 0.5,
      },

      "& .MuiTypography-body2": {
        color: BLACK_FOUR,
        letterSpacing: 0.5,
        fontSize: 14,
      },

      "& .MuiBox-root": {
        paddingBottom: 16,
      },
    },

    invoiceText: {
      "& .MuiTypography-body1": {
        color: BLUE_EIGHT,
        paddingLeft: 10,
        cursor: 'pointer',
      }
    },

    deleteButton: {
      "& .MuiButton-label": {
        color: RED_FOUR,
      },
    },

    statusDropdown: {
      "& .MuiTextField-root": {
        margin: 1,
        border: `1px solid ${WHITE_FOUR}`,
        borderRadius: 4,
        width: "12ch",
        paddingLeft: 8,
        paddingRight: 8,
      },

      "& .MuiSelect-selectMenu": {
        margin: 1,
        minHeight: "auto",
      },

      "& .MuiInput-underline:before, .MuiInput-underline:after": {
        borderBottom: "none",
      },

      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: "none",
      },

      "& .MuiSelect-select:focus": {
        backgroundColor: 'transparent',
      },
    },

    cursor: {
      cursor: 'pointer',

      "&:hover": {
        fontWeight: '700',
      }
    },

    notCursor: {
      cursor: 'not-allowed'
    },

    blur: {
      filter: 'blur(3px)'
    },

    loader: {
      display: 'flex',
      alignItems: 'center',
      maxWidth: 1750,
      width: "100%",
      minHeight: 700,
      height: "100%",
      justifyContent: 'center',
      bgcolor: 'transparent',
      position: 'absolute'
    },

    viewsDate: {
      height: '100%',
      width: '100%',
    }
  })
);
