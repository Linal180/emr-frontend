import { withStyles, Theme, Tooltip, makeStyles } from "@material-ui/core";
import { GRAY_FIVE, WHITE, WHITE_THREE } from "../theme";

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
    backgroundColor: GRAY_FIVE,
    borderRadius: 6,
    maxWidth: 265
  },

  mainTableContainer: {
    background: WHITE,
    borderRadius: 12,
    overflow: "auto"
  },

  searchContainer: {
    padding: "15px 30px",
    borderBottom: `1px solid ${WHITE_THREE}`
  },

  status: {
    fontWeight: 'bold',
    fontSize: '0.75rem',
    borderRadius: 8,
    padding: '8px 15px',
    display: 'inline-block',
  },

  iconsBackground: {
    background: WHITE_THREE,
    height:32,
    width:32,
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginLeft:6,
    cursor: 'pointer',
    
    "& svg": {
      maxWidth: 16
    }
  },
}))