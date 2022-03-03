import { makeStyles, createStyles } from "@material-ui/core";
import { RED_FOUR, WHITE_FOUR } from "../theme";

export const useCalendarStyles = makeStyles(() =>
  createStyles({
    dropdown: {
      "& .MuiMenu-paper": {
        padding: 20,

        "& .MuiCardContent-root": {
          padding: 0,
        }

      },

      "& .MuiPopover-paper": {
        minHeight: 300
      }
    },

    cardHeader: {
      padding: 8,
    },

    deleteButton: {
      "& .MuiButton-label": {
        color: RED_FOUR
      }
    },

    statusDropdown: {
      '& .MuiTextField-root': {
        margin: 1,
        border: `1px solid ${WHITE_FOUR}`,
        width: '12ch',
      },
      '& .MuiSelect-selectMenu': {
        margin: 1,
        minHeight: 'auto'
      },
      '& .MuiSelect-select': {
        padding: 0
      }
    },

    calendrAppointments: {
      padding: 2
    }
  })
);