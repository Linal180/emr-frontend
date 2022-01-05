import { makeStyles } from "@material-ui/core";

import { DRAWER_WIDTH } from "../constants";

export const useHeaderStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24,
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.3) 100%),url(/images/header.jpg) center no-repeat",
    backgroundSize: "cover",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  appBarShift: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  menuButton: {
    marginRight: 36,
  },

  menuButtonHidden: {
    display: "none",
  },

  title: {
    flexGrow: 1,
    fontSize: 20,
    letterSpacing: 1
  },

  dropdown: {
    position: "relative",
    display: 'inline-block',
    "&:focus-within div": {
      display: 'block',
      transition: `all .3s ease-in`,
    }
  },

  dropdownContent: {
    display: "none",
    position: "absolute",
    right: 15,
    top: 33,
    backgroundColor: '#f9f9f9',
    minWidth: 350,
    maxHeight: 400,
    overflow: "auto",
    boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    fontSize: '.8125rem',
    cursor: 'pointer',

    "& a:last-child .MuiTypography-h6": {
      borderBottom: "none",
    },

    '& .MuiTypography-h6': {
      padding: 15,
      textTransform: "capitalize",
      borderBottom: "1px solid rgb(224, 224, 224)",
    },

    '& .MuiTypography-h6:hover': {
      backgroundColor: '#E3EEFA',
    },
  },

  link: {
    fontsize: 16,
    textAlign: 'left',
    color: "black",
    fontWeight: 'bold',
  },

  cursor: {
    cursor: 'pointer',
  }

}));
