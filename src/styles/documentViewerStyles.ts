import { makeStyles } from "@material-ui/core";
import { WHITE } from "../theme";

export const useDocumentViewerStyles = makeStyles((theme) => ({
  downloadBtn: {
    '& a': {
      color: `${WHITE} !important`
    }
  }
}))