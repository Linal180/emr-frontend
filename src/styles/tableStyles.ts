import { withStyles, Theme, Tooltip, makeStyles, colors } from "@material-ui/core";
import { PRIMARY_COLOR } from "../theme";

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

export const useUserTableStyles = makeStyles((theme: Theme) => ({
  active: {
    height: 19,
    width: 19,
    color: PRIMARY_COLOR
  },

  deActive: {
    height: 19,
    width: 19,
    color: colors.red["500"]
  },

  disable: {
    height: 19,
    width: 19,
    color: "rgba(0, 0, 0, 0.16)"
  },
}))
