import { makeStyles } from "@material-ui/core";
import { GRAY_ONE, GRAY_THIRTEEN, WHITE } from "../../theme";

export const useFormBuilderSidebarStyles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0.5),
    backgroundColor: WHITE,
    minHeight: 100,
  },
  dragContainer: {
    display: "flex",
    padding: theme.spacing(2),
    margin: theme.spacing(0, 0, 2, 0),
    justifyContent: "flex-start",
    alignItems: "center",
    lineHeight: 1.5,
    border: `1px solid ${GRAY_ONE}`,
    borderRadius: 3,
    backgroundColor: GRAY_THIRTEEN,
    textAlign: "start",
  },
  isDragging: {
    padding: theme.spacing(1),
    margin: theme.spacing(0, 0, 1, 0),
    alignItems: "flex-start",
    alignContent: "flex-start",
    lineHeight: 1.5,
    borderRadius: theme.spacing(1),
    bgcolor: WHITE,
    display: "none",
    userSelect: "none",
  },
}));
