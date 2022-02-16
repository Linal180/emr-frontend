import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_ONE, GRAY_TWO } from "../theme";

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
      color: GRAY_TWO
    },

    cardContentDescription: {
      fontWeight: 500,
      fontSize: 14,
      color: GRAY_TWO
    }
  })
);