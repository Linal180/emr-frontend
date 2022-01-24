import { makeStyles } from "@material-ui/core";
import { BLACK_ONE, BLACK_TWO, BLUE_FIVE, GRAY_TWO, WHITE_FIVE } from "../../../theme";

export const documentVerificationForm = makeStyles({
  dropZoneContainer: {
    marginTop: 24,
    padding: 30,
    border: `1px dashed ${BLUE_FIVE}`,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
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
      opacity: 0
    }
  },
});


