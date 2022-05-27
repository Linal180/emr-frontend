import { makeStyles } from "@material-ui/core";
import { BLACK_TWO, GRAY_ONE, GREEN, WHITE, WHITE_FOUR } from "../theme";

export const useChartingStyles = makeStyles({
  cardBox: {
    boxShadow: `0px 4px 30px rgba(56, 71, 109, 0.09)`,
    borderRadius: 8,
  },

  tab: {
    "& .MuiTab-wrapper": {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      color: BLACK_TWO,

      "& svg": {
        marginRight: 10,
      },
    },
  },

  tabList: {
    "& .MuiTab-root.Mui-selected": {
      backgroundColor: GREEN,
      borderRadius: 4,
      borderBottom: 'none',

      "& .MuiTab-wrapper": {
        color: WHITE,

        "& svg": {
          "& path": {
            fill: WHITE,
          },
        },
      },
    },

    "& .MuiTab-labelIcon": {
      minHeight: 'auto',
      textAlign: 'left',
      marginBottom: 20,
    },
  },

  iconBox: {
    border:`1px solid ${GRAY_ONE}`,
    borderRadius: 6,
    width: 40,
    height: 40,
    display: 'flex',
   justifyContent: 'center',
   alignItems: 'center',

   "& .MuiIconButton-root": {
    borderRadius: 0, 
   },
  },

  unitsDropdown: {
    "& .MuiInputBase-root": {
      backgroundColor: WHITE,
      border: `1px solid ${WHITE_FOUR}`,
    },

    "& .MuiTextField-root": {
      margin: 1,
      border: 'none',
      borderRadius: 10,
      width: "15ch",
      height: 40,
      backgroundColor: WHITE,
    },
  },
});
