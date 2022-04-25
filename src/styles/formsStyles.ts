import { makeStyles } from "@material-ui/core";
import { BLUE_NINE } from "../theme";

export const useFormStyles = makeStyles(() => ({
  detailTooltipBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },

  addModal: {
    position: 'absolute',
    right: 0,
    width: 90,
    top: '-25px',
    color: BLUE_NINE,
    cursor: 'pointer',

    "&:hover": {
      textDecoration: 'underline',
    }
  }
}));
