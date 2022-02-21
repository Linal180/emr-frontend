import { makeStyles } from "@material-ui/core";
import { BLACK, BLACK_SEVEN, WHITE, WHITE_FIVE, WHITE_FOUR } from "../theme";

export const useHeaderStyles = makeStyles((theme) => ({
  
  menuButton: {
    borderRadius: 6,
    padding: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: 'all .3s ease-in',

    "&:hover": {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    }
  },

  appBar: {
    backgroundColor: WHITE,
    borderBottom: `1px solid ${WHITE_FOUR}`,
    boxShadow: 'none',
    padding: theme.spacing(0,4),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    }
  },

  toolBar: {
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  menuItem: {
    [theme.breakpoints.down("sm")]: {
      display: 'none',
    }
  },

  menuLink: {
    color: BLACK,
  },

  profileItem: {
    color: BLACK_SEVEN,
    textTransform: 'capitalize',
    minWidth:'auto'
  },

  profileItemName: {
    "& .MuiTypography-root": {
      minWidth: 30,
    }
  },

}));
