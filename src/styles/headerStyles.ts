import { makeStyles } from "@material-ui/core";
import { BLACK, BLACK_THREE, BLUE, GREY_ELEVEN, GREY_SEVEN, WHITE, WHITE_FOUR, GRAY_SIX,BLUE_ONE  } from "../theme";

export const useHeaderStyles = makeStyles((theme) => ({
  menuButton: {
    borderRadius: 6,
    padding: 9,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: "all .3s ease-in",

    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
  },

  appBar: {
    backgroundColor: WHITE,
    borderBottom: `1px solid ${WHITE_FOUR}`,
    boxShadow: "none",
    padding: theme.spacing(0, 4),
    height: 80,
    overflow: 'hidden',

    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },

  toolBar: {
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "& .active": {
      borderBottom: `2px solid ${BLUE}`,
    },

    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  menuItem: {
    paddingBottom: 5,
    minWidth: 80,
    textAlign: "center",
    color: BLACK,
    cursor: "pointer",
    textTransform: "capitalize",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 20px",

    "& .MuiIconButton-root": {
      padding: "0 5px",
    },
  },

  menuLink: {
    color: BLACK,
  },

  profileItem: {
    color: BLACK,
    textTransform: "capitalize",
    minWidth: "auto",
  },

  profileItemName: {
    "& .MuiTypography-root": {
      minWidth: 30,
      margin: 0,
      color: BLACK,
    },
  },

  roleName: {
    "& .MuiTypography-root": {
      color: GREY_SEVEN,
      textAlign: 'right',
    },
  },

  dropdownMenuBar: {
    backgroundColor: GREY_ELEVEN,
    borderRadius: 5,
  },

  sidebarMenu: {
    "& .MuiListItem-root": {
      color: BLACK_THREE,
    },
  },

  toggleContainer: {
    "& .toggle-main": {
      display: 'flex',
      position: 'relative',
      border: `1px solid ${GRAY_SIX}`,
      fontWeight: 500,
      fontSize: 14,
      width: 145,
      height: 44,
      padding: 5,
      borderRadius: 6,

      "& > div": {
        position: 'relative',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 2,
        zIndex: 2,
        flex: 1,
      }
    },

    "& .MuiToggleButtonGroup-root": {
      marginTop: 10,
    },

    "& .MuiToggleButton-root.Mui-selected": {
      color: WHITE,
      backgroundColor: BLUE_ONE,
      padding: "9px 30px",
      borderRadius: 6,
    },

    "& .MuiToggleButtonGroup-groupedHorizontal:not(:first-child)": {
      borderTopRightRadius: "6px",
      borderBottomRightRadius: "6px",
    },

    "& .MuiToggleButtonGroup-groupedHorizontal:not(:last-child)": {
      borderTopLeftRadius: "6px",
      borderBottomLeftRadius: "6px",
    }
  },

  resendBtn: {
    paddingBottom: 30,
    textDecoration: 'underline',
    color: BLUE,
    cursor: 'pointer'
  },

  otpDialogue: {

    "& .MuiDialog-paper": {
      overflowY: 'clip',
      borderRadius: 5,
      padding: 20
    }
  },

  iconPadding: {
    paddingRight: 10
  }
}));
