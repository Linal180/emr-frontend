import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_ONE, GREY_SEVEN, RED } from "../theme";

export const usePatientChartingStyles = makeStyles(() =>
  createStyles({
    cardContentHeading: {
      fontWeight: 400,
      fontSize: 16,
      color: BLACK_ONE,
      cursor: 'pointer'
    },

    cardContentDate: {
      fontWeight: 400,
      fontSize: 12,
      color: GREY_SEVEN
    },

    cardContentDateText: {
      fontWeight: 500,
      fontSize: 16,
      color: BLACK_ONE
    },

    cardContentDescription: {
      fontWeight: 500,
      fontSize: 14,
      color: GREY_SEVEN,
      marginLeft: 22
    },

    cardContentDescriptionError: {
      fontWeight: 500,
      fontSize: 14,
      color: RED,
      marginLeft: 22
    },

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
    }
  })
);