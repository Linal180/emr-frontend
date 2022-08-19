import { makeStyles, Theme, Tooltip, withStyles } from "@material-ui/core";
import {
  BLACK_TWO, BLUE, BLUE_TWO, GRAY_ELEVEN, GRAY_SIX, GREEN_TWO, GREY, GREY_EIGHTEEN, GREY_ELEVEN,
  GREY_FOUR, theme, WHITE, WHITE_THREE
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
  table: {
    minWidth: 1200
  },

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
    padding: theme.spacing(2.5),
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
    // maxWidth: 120,

    "& .MuiFormControl-fullWidth": {
      // width: 120,
      borderRadius: 8,
    },

    "& .MuiOutlinedInput-root": {
      backgroundColor: 'WHITE',
      borderRadius: 8,
      padding: '0 5px',
      minHeight: 34,
    },
    "& .MuiAutocomplete-option": {
      backgroundColor: WHITE,
      border: '1px solid red',
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
    },

    "& .MuiButton-root": {
      minWidth: 'auto',
    },

    "& .MuiButton-root:hover": {
      backgroundColor: 'transparent',
    },
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

  fullFlex: {
    flex: 1
  },

  firstRowBg: {
    backgroundColor: GREEN_TWO,
  },

  tableRowRoot: {
    "&:nth-of-type(odd)": {
      backgroundColor: GREY_EIGHTEEN,
    },
  },

  btnWrap: {
    whiteSpace: 'nowrap',
  },

  claimTableHead: {
    backgroundColor: GREY_ELEVEN,
  },

  selectBox: {
    color: BLUE,
    padding: '5px 10px',
    borderRadius: 6,
    cursor: 'pointer',
  },

  selectedBox: {
    backgroundColor: BLUE,
    color: WHITE,
  },

  modifiers: {
    '& .MuiFormControl-marginNormal': {
      marginBottom: 0,
      paddingBottom: 0
    }
  },

  tab: {
    flexDirection: "row-reverse"
  },

  tabWrapper: {
    '& .MuiTab-root': {
      maxWidth: '100%',
      fontSize: '0.875rem',

      '&.Mui-selected': {
        borderBottom: '2px solid #204ECF'
      }
    },
  }
}))
