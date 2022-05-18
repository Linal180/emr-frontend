import { makeStyles } from "@material-ui/core";
import { GREY_ELEVEN, WHITE } from "../theme";

export const useDocumentModalStyles = makeStyles((theme) => ({
  modalContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: `${WHITE}`,
    border: `2px dashed rgba(38, 45, 61, 0.3)`,
    borderRadius: 6,
    margin: theme.spacing(5),
  },

  modalActions: {
    backgroundColor: `${GREY_ELEVEN}`,
  },
}));
