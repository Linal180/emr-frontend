import { makeStyles, createStyles } from "@material-ui/core";
import BlueCard from "../assets/images/blueCard.svg";
import { BLACK, GREY_ELEVEN, GREY_THIRTEEN, GREY_TWELVE, theme, WHITE, WHITE_FOUR } from "../theme";

export const useDashboardStyles = makeStyles(() =>
  createStyles({
    blueCard: {
      backgroundImage: `url(${BlueCard})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: 300,
      padding: theme.spacing(3),
    },

    cardContainer: {
      marginTop: '-60px',
      marginBottom: theme.spacing(3),
    },

    cardBox: {
      backgroundColor: GREY_ELEVEN,
      borderRadius: 8,
      padding: theme.spacing(3,2),
      minWidth: 145,
      minHeight: 141,
      cursor: 'pointer',

      "&  .MuiTypography-root": {
        color: BLACK,
      },
    },

    facilitiesDropdown: {
      "& .MuiTextField-root": {
        margin: 1,
        border: `1px solid ${WHITE_FOUR}`,
        borderRadius: 4,
        width: "18ch",
        height: 52,
        paddingLeft: 12,
        paddingRight: 12,
      },

      "& .MuiSelect-selectMenu": {
        margin: 1,
        minHeight: "auto",
      },

      "& .MuiInputBase-input": {
        color: WHITE,
      },

      "& svg": {
        color: WHITE,
      },

      "& .MuiInput-underline:before, .MuiInput-underline:after": {
        borderBottom: "none",
      },

      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: "none",
      },

      "& .MuiSelect-select:focus": {
        backgroundColor: 'transparent',
      },
    },

    yearDropdown: {
      "& .MuiTextField-root": {
        margin: 1,
        border: 'none',
        borderRadius: 10,
        backgroundColor: GREY_TWELVE,
        width: "12ch",
        height: 45,
        paddingLeft: 8,
        paddingRight: 8,
      },

      "& .MuiSelect-selectMenu": {
        margin: 1,
        minHeight: "auto",
      },

      "& .MuiInputBase-input": {
        color: GREY_THIRTEEN,
      },

      "& svg": {
        color: GREY_THIRTEEN,
      },

      "& .MuiInput-underline:before, .MuiInput-underline:after": {
        borderBottom: "none",
      },

      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: "none",
      },

      "& .MuiSelect-select:focus": {
        backgroundColor: 'transparent',
      },
    },

    searchContainer: {
      "& .MuiBox-root": {
        border: 'none',
        backgroundColor: WHITE,
      },

      "& .MuiOutlinedInput-root": {
        backgroundColor: WHITE,
        borderRadius: 0,
        border: 'none',
      }
    },

  })
  );