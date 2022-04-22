import { makeStyles } from "@material-ui/core";
import { GREY_SEVEN } from "../../theme";

export const consentAgreementStyles = makeStyles({
  agreementContainer: {
    "& h3": {
      fontSize: 26,
    },

    "& li": {
      padding: "12px 5px",
      color: GREY_SEVEN,
    },

    "& .MuiCheckbox-root .MuiSvgIcon-root": {
      width: 24,
      height: 24,
    }
  },

  agreementPointsContainer: {
    maxHeight: "calc(100vh - 344px)",
    overflowY: "auto",
  },
});


