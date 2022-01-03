import { makeStyles } from "@material-ui/core";
//theme
import { WHITE } from "../theme";

export const useBackdropStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: WHITE,
  },
}));