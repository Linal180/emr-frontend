import { makeStyles } from "@material-ui/core";
import { WHITE } from "../../theme";

export const usePreviewModalStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: `${WHITE} !important`,
    border: "none !important",
    padding: '0 !important',
  },
  tableCell: {
    overflowX: "auto"
  }
}))