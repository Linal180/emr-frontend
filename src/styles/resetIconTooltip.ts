import { Theme, Tooltip, withStyles } from "@material-ui/core";

export const ResetTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: 400,
  },
}))(Tooltip);
