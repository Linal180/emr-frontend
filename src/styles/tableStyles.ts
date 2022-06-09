import { withStyles, Theme, Tooltip, makeStyles } from "@material-ui/core";
import {
  BLACK_ONE,
  BLACK_THREE,
  BLACK_TWO, BLUE_TWO, GRAY_ELEVEN, GREY_ELEVEN, GRAY_SIX, GREY, GREY_FOUR, theme, WHITE, WHITE_THREE
} from "../theme";

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
  searchBox: {
    backgroundColor: GREY,
    borderRadius: 4,
    border: `1px solid ${GREY_FOUR}`,
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    "&:hover": {
      borderColor: BLUE_TWO,
    },
  },

  searchInput: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      border: 'none',
      padding: 0,
    },
  },

  tablesSearchIcon: {
    backgroundColor: GREY_ELEVEN,
    borderRadius: 6,
    maxWidth: 265,
  },

  mainTableContainer: {
    background: WHITE,
    borderRadius: 12,
    overflow: "auto",
    padding: theme.spacing(2),
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

  selectorBox: {

    "& .MuiFormControl-fullWidth": {
      width: 120,
      borderRadius: 8,
    },

    "& .MuiOutlinedInput-root": {
      backgroundColor: 'WHITE',
      borderRadius: 8,
      padding: '0 5px',
      minHeight: 34,
    },
  },

  status: {
    minWidth: 120,
    fontWeight: 500,
    fontSize: '0.875rem',
    borderRadius: 8,
    padding: '0',
    display: 'inline-block',
    textAlign: 'left',
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

  iconsBackgroundDisabled: {
    background: GRAY_ELEVEN,
    height: 32,
    width: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginLeft: 6,
    opacity: 0.5,

    "& svg": {
      maxWidth: 16,
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

  tooltipContainer: {
    cursor: 'pointer'
  },

  rolesIconsBackground: {
    background: WHITE_THREE,
    height: 32,
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

  rolesIconsBackgroundDisabled: {
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginLeft: 6,
    opacity: 0.5,

    "& svg": {
      maxWidth: 16,
    }
  },

  dashboardTableContainer: {
    background: WHITE,
    borderRadius: 12,
    overflow: "auto",
    padding: theme.spacing(2),
    maxHeight: 500,
    overflowY: 'hidden',

    "& .MuiTableCell-head": {
      color: BLACK_THREE,
      fontSize: 12,
      fontWeight: 600,
    },

    "& .MuiTableCell-body": {
      color: BLACK_ONE,
      fontSize: 14,
      fontWeight: 500,
    },
  },
}))
