import { makeStyles } from "@material-ui/core";
import { BLUE_SIX, GRAY_TWO, } from "../../../theme";

export const documentVerificationForm = makeStyles({
  dropZoneContainer: {
    marginTop: 24,
    padding: 30,
    borderRadius: 8,
    border: `3px dashed ${BLUE_SIX}`,
    display: "flex",
    alignItems: "center",
    cursor: 'pointer',
    position: "relative",

    "& h4": {
      fontSize: 18,
    },

    "& h6": {
      color: GRAY_TWO,
      marginTop: 5,
      fontWeight: 500,
    },

    "& p": {
      fontSize: 10,
      color: GRAY_TWO,
      fontWeight: 500,
    },

    "& .MuiDropzoneArea-root": {
      position: "absolute",
      inset: 0,
      minHeight: 0,
      opacity: 0,
    }
  },
});


