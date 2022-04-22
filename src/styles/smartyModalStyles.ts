import { makeStyles } from "@material-ui/core";
import { BLACK_THREE, BLACK_ONE } from "../theme";

export const useSmartyModalStyles = makeStyles((theme) => ({
  formControl: {
    margin: '10px 0',
  },

  smartText: {
    marginTop: 20
  },

  yourAddress: {
    textTransform: 'uppercase',
    lineHeight: '22px',
    color: BLACK_ONE,
  },

  smallText: {
    margin: '10px 0px',
    fontSize: 14,
    lineHeight: '22px',
    color: BLACK_THREE,
  }
}));
