import { makeStyles } from "@material-ui/core";
import {
  BLACK, BLACK_THREE, BLUE, GREY_ELEVEN, GREY_SEVEN, WHITE, WHITE_FOUR, GRAY_SIX, BLUE_ONE
} from "../theme";

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
    backgroundColor: '#ffffff !important',
    borderBottom: `1px solid ${WHITE_FOUR}`,
    boxShadow: "none",
    padding: theme.spacing(0),
    height: 80,
    overflow: 'hidden',

    [theme.breakpoints.down("md")]: {
      padding: 0,
    },
  },

  toolBar: {
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuBar: {
    "& .active": {
      borderBottom: `2px solid ${BLUE}`,
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
    [theme.breakpoints.up('md')]: {
      margin: "0 20px",
    },

    "& .MuiIconButton-root": {
      padding: "0 5px",
    },
  },

  menuLink: {
    color: BLACK,
  },

  mobileMenuBar: {
    minHeight: 300,
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
  },

  mobileMenuItem: {
    display: 'block',
    textAlign: 'start',
    paddingBottom: 10,
    marginBottom: 10,
    color: BLACK,
    cursor: "pointer",
    textTransform: "capitalize",

    "& .MuiTypography-root": {
      justifyContent: 'flex-start !important',
      textAlign: 'start !important',
      margin: '0px !important',
    },

    "& .MuiIconButton-root": {
      padding: "0 5px",
    },

    "& .active": {
      borderBottom: `2px solid ${BLUE} !important`,
    },
  },

  grow: {
    flexGrow: 1,
  },

  logo: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },

  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },

  sectionMobile: {
    position: 'absolute',
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },

    "& .MuiSvgIcon-root": {
      fill: BLACK,
    },
  },

  profileItem: {
    color: BLACK,
    textTransform: "capitalize",
    minWidth: "auto",
  },

  profileItemName: {
    "& .MuiTypography-root": {
      minWidth: 30,
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
      whiteSpace : 'normal'
    },
  },

  toggleContainer: {
    "& .toggle-main": {
      cursor: 'pointer',
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
  },

  cursor: {
    cursor: 'pointer',

    "&:hover": {
      textDecoration: 'underline',
      color: BLUE,
    }
  },

  factorAuthHeader: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: 'column'
    },
    "& h4": {
      marginTop: '10px'
    }
  }
}));
