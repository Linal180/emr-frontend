import { makeStyles, createStyles } from "@material-ui/core";
import { WHITE_SIX, BLUE_THREE } from "../theme";

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
    }
  })
);