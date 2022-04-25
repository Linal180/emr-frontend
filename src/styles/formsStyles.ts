import { makeStyles } from "@material-ui/core";
import { WHITE, GRAY_ONE, BLUE_NINE } from "../theme";

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
    width: 100,
    top: '-25px',
    color: BLUE_NINE,
    cursor: 'pointer',

    "&:hover": {
      textDecoration: 'underline',
    }
  },

  formSearchBox: {
    backgroundColor: WHITE,
    border: `1px solid ${GRAY_ONE}`,
    borderRadius: 4,
    height: 42,
    display: 'flex',
    alignItems: 'center',
  },

  formSearchInput: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      border: 'none',
      padding: 0,
    },
  }
}));
