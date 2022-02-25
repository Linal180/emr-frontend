import { makeStyles, createStyles } from "@material-ui/core";
import { RED_FOUR } from "../theme";

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
    }
  })
);