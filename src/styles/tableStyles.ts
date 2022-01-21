import { withStyles, Theme, Tooltip, makeStyles } from "@material-ui/core";
import { BLUE_FIVE, BLUE_FOUR, GRAY_FIVE, WHITE, WHITE_THREE } from "../theme";

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
    color: BLUE_FOUR,
    backgroundColor: BLUE_FIVE,
    borderRadius: 8,
    padding: '10px 15px',
    display: 'inline-block',
    marginTop: '1rem'
}

}))