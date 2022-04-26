import { makeStyles } from "@material-ui/core";
import { GREY_SEVEN, WHITE, } from "../../theme";

export const documentVerificationFormStyles = makeStyles({
  dropZoneContainer: {
    marginTop: 24,
    padding: 30,
    border: `2px dashed rgba(38, 45, 61, 0.3)`,
    backgroundColor: WHITE,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    cursor: 'pointer',
    position: "relative",

    "& h4": {
      fontSize: 18,
    },

    "& h6": {
      color: GREY_SEVEN,
      marginTop: 5,
      fontWeight: 500,
    },

    "& p": {
      fontSize: 10,
      color: GREY_SEVEN,
      fontWeight: 500,
    },

    "& .MuiDropzoneArea-root": {
      position: "absolute",
      inset: 0,
      minHeight: 0,
      opacity: 0,
    }
  },

  cameraIcon: {
    cursor: "pointer",
    top: 10,
    right: 40,
    position: "absolute"
  }
});


