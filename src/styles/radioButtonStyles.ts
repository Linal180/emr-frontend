import { makeStyles } from "@material-ui/core";
import { BLUE, BLUE_ONE, GREY_ONE, WHITE } from "../theme";

export const useRadioStyles = makeStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },

  icon: {
    borderRadius: "50%",
    width: 16,
    height: 16,
    backgroundColor: WHITE,
    border: `1px solid ${GREY_ONE}`,

    "input:hover ~ &": {
      borderColor: BLUE_ONE,
    },

    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },

  checkedIcon: {
    backgroundColor: BLUE,

    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage: "radial-gradient(#fff,#fff 20%,transparent 32%)",
      content: '""',
    },

    "input ~ &": {
      backgroundColor: BLUE,
      border: "none",
    },
    
    "input:hover ~ &": {
      backgroundColor: BLUE,
      border: "none",
    },
  },
});
