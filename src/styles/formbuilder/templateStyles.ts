import { makeStyles } from "@material-ui/core";
import { GRAY_ONE, GREY_NINE } from "../../theme";

export const useFormTemplateStyles = makeStyles((theme) => ({
  dragContainer: {
    display: "flex",
    padding: theme.spacing(2),
    margin: theme.spacing(0, 0, 2, 0),
    justifyContent: "flex-start",
    alignItems: "center",
    lineHeight: 1.5,
    border: `1px solid ${GRAY_ONE}`,
    borderRadius: 3,
    backgroundColor: GREY_NINE,
    textAlign: "start",
    cursor: "pointer"
  },
  
}));
