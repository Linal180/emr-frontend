import { withStyles, Theme, Tooltip, makeStyles } from "@material-ui/core";
import { BLACK_EIGHT, BLACK_TWO, GRAY_FIVE, GRAY_SIX, WHITE, WHITE_THREE } from "../theme";

export const DetailTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: WHITE_THREE,
    color: BLACK_TWO,
    boxShadow: theme.shadows[1],
    fontSize: 13,
    minWidth: 'auto',
    padding: 20,
    borderRadius: 5,
  }
}))(Tooltip);

export const useTableStyles = makeStyles(() => ({
  tableSearchBox: {
    backgroundColor: WHITE,
    borderRadius: 4,
    border: `1px solid ${BLACK_EIGHT}`,
    display: 'flex',
    alignItems: 'center',
    maxWidth: 400,
    margin: 36,
  },

  tableSearchInput: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      border: 'none',
      padding: 0,
    },
  },

  tablesSearchIcon: {
    backgroundColor: GRAY_FIVE,
    borderRadius: 6,
    maxWidth: 265
  },

  mainTableContainer: {
    background: WHITE,
    borderRadius: 12,
    overflow: "auto",
    maxHeight: "calc(100vh - 248px)",
  },

  searchContainer: {
    padding: "15px 30px",
    borderBottom: `1px solid ${WHITE_THREE}`,
    display: 'flex',
    justifyContent: 'space-between',
  },

  searchOuterContainer: {
    "& .MuiBox-root": {
      borderBottom: 'none'
    }
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
    height: 32,
    width: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginLeft: 6,
    cursor: 'pointer',

    "& svg": {
      maxWidth: 16
    }
  },

  RadioButtonsStroke: {
    border: `1px solid ${GRAY_SIX}`,
    borderRadius: 6,
    padding: 4,
    alignSelf: 'center',
},

  practiceIconsBackground: {
    height: 32,
    width: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    cursor: 'pointer',

    "&:hover": {
      background: WHITE_THREE,
      borderRadius: 6,
    },

    "& svg": {
      maxWidth: 20
    }
  },
}))