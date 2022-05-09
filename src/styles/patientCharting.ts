import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_ONE, GREY_SEVEN } from "../theme";

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

    cardContentDescription: {
      fontWeight: 500,
      fontSize: 14,
      color: GREY_SEVEN
    },

    dropdown: {
      "& .MuiMenu-paper": {
        padding: 20,

        "& .MuiCardContent-root": {
            padding:0,
        }

      },

      "& .MuiPopover-paper": {
        minHeight: 300
      }
    }
  })
);