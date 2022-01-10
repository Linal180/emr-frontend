import { withStyles, Theme, Tooltip, makeStyles } from "@material-ui/core";
import { GRAY_FIVE } from "../theme";

export const DetailTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 13,
    minWidth: 'auto',
    padding: 20,
  },
}))(Tooltip);

export const useTableStyles = makeStyles(() => ({
  tablesSearchIcon: {
    backgroundColor:GRAY_FIVE,
    borderRadius:6,
    maxWidth: 265
  }       
}))
