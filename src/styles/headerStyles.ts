import { makeStyles } from "@material-ui/core";
import { BLACK, BLACK_THREE, BLUE, GRAY_FIVE, GREY_SEVEN, WHITE, WHITE_FOUR, } from "../theme";

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
    },
  },

  dropdownMenuBar: {
    backgroundColor: GRAY_FIVE,
    borderRadius: 5,
  },

  sidebarMenu: {
    "& .MuiListItem-root": {
      color: BLACK_THREE,
    },
  },
}));
