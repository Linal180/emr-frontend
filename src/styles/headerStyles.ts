import { makeStyles } from "@material-ui/core";
import { DRAWER_WIDTH } from "../constants";
import { WHITE } from "../theme";

export const useHeaderStyles = makeStyles((theme) => ({
  appBar: {
    marginLeft: DRAWER_WIDTH,
    width: "100%",
    zIndex: theme.zIndex.drawer + 1,
    background: "linear-gradient(180deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.3) 100%),url(/images/header.jpg) center no-repeat",
    backgroundSize: "cover",

    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),

    "& input": {
      color: WHITE,
    },

    "& .MuiFormControl-root.MuiTextField-root": {
      minWidth: 240,
    }
  },

  menuButton: {
    borderRadius: 6,
    padding: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: 'all .3s ease-in',

    "&:hover": {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    }
  },

  // New-Appbar-Styling
  
  newAppBar: {
    backgroundColor: WHITE,
    borderBottom: '1px solid #E4E6EF',
    boxShadow: 'none',
    width: '100%',
    height: '80px',
    padding: '0.5rem 2rem',
  },

  newMenuBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  newMenuItem: {
    minWidth: 120,
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'center',
    color: '#262D3D',
    cursor: 'pointer',
    textTransform: 'capitalize',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 10px',
    [theme.breakpoints.down("sm")]: {
      display: 'none',

      "&:hover": {
        textDecoration: 'underline'
      }
    },
  },

  newMenuItem1: {
    fontSize: 14,
    fontWeight: 400,
    color: '#262D3D',
    textTransform: 'capitalize',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'right',
  },

  downArrowIcon: {
    display: 'inline-block',
    paddingLeft: '10px',
    marginTop: '-5px',
  },

}));
