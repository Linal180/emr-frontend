import { makeStyles, createStyles } from "@material-ui/core";
import { WHITE_SIX, BLUE_THREE, WHITE_FOUR, BLACK_ONE, GREY_SEVEN, WHITE_THREE } from "../theme";

export const useDoctorScheduleStyles = makeStyles(() =>
  createStyles({
    addSlot: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: `1px dashed ${BLUE_THREE}`,
      padding: 20,
      background: WHITE_SIX,
      borderRadius: 6,
      cursor: 'pointer',

      "& .MuiTypography-body1": {
        marginLeft: 5,
      }
    },

    viewSlots: {
      width: '100%',
      border: `1px dashed ${WHITE_FOUR}`,
      padding: 10,
      borderRadius: 6,
      minHeight: 116
    },

    heading: {
      fontSize: 14,
      color: BLACK_ONE,
      fontWeight: 700,
    },

    subHeading: {
      fontSize: 13,
      color: GREY_SEVEN,
    },

    iconsBackground: {
      background: WHITE_THREE,
      height: 32,
      width: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      marginLeft: 6,
      cursor: 'pointer',

      "& svg": {
        maxWidth: 16
      }
    },

    addProvider: {
      border: `1px dashed ${BLUE_THREE}`,
      padding: 20,
      background: WHITE_SIX,
      borderRadius: 6,
      cursor: 'pointer',
    },

    status: {
      fontWeight: 'bold',
      fontSize: '0.75rem',
      borderRadius: 8,
      padding: '8px 15px',
      display: 'inline-block',
    }
  })
);
