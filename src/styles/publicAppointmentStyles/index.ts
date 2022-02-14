import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_FOUR, BLUE_ONE, GRAY_ONE, POPPINS, WHITE } from "../../theme";

export const usePublicAppointmentStyles = makeStyles(() =>
  createStyles({
    timeSlots: {
      display: 'flex',
      flexWrap: "wrap",
      listStyle: 'none',
      margin: "10px 0 20px",
      overflowX: 'auto',
      padding: 0,
      maxHeight: 185,

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
          background: BLUE_ONE,
          color: WHITE
        }
      }
    },
  })
);
