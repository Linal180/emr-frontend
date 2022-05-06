import {Tooltip, withStyles } from "@material-ui/core";
import { BLACK_TWO, WHITE_THREE } from "../theme";

export const SearchTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: WHITE_THREE,
    color: BLACK_TWO,
    border: '1px solid #dadde9',
    minWidth: 210,
    width:"100%",
    padding: 10,
    borderRadius: 8
  },
}))(Tooltip);
