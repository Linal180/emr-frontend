import { makeStyles } from "@material-ui/core";
import { GRAY_TWO } from "../../../theme";

export const consentAgreement = makeStyles({
  container: {
    "& .MuiCard-root": {
      height: "calc(100vh - 130px)"
    },
  },

  agreementContainer: {
    "& h3": {
      fontSize: 26,
    },

    "& li": {
      padding: "12px 5px",
      color: GRAY_TWO,
    },

    "& .MuiCheckbox-root .MuiSvgIcon-root": {
      width: 24,
      height: 24,
    }
  },

  agreementPointsContainer: {
    maxHeight: "68%",
    overflow: "auto",
  },
});


