import { makeStyles } from "@material-ui/core";
import { BLACK_THREE, BLACK_ONE,} from "../theme";

export const useSmartyModalStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: 20,
  },

  yourAddress: {
    textTransform: 'uppercase',
    lineHeight: '22px',
    fontSize:14,
    color: BLACK_ONE,
  },

  smallText: {
    marginBottom: 20,
    fontSize: 14,
    color: BLACK_THREE,
  },

  smallTextTwo: {
    marginBottom: 20,
    marginTop: 20,
    fontSize: 14,
    color: BLACK_THREE,
  }
}));
