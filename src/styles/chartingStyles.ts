import { createStyles, makeStyles, Switch, withStyles } from "@material-ui/core";
import { BLACK_ONE, BLACK_THREE, BLACK_TWO, BLUE, GRAY_ONE, GREEN, GREEN_TWO, GREY_TWO, WHITE, WHITE_FOUR } from "../theme";

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

  tableHeaderDropdown: {
    "& .MuiInputBase-root": {
      backgroundColor: WHITE,
      border: `1px solid ${WHITE_FOUR}`,
      borderRadius: 4,
      minWidth: 160,
      height: 40,
      padding: 10,
    },
    
  },

  tableBox: {
    overflowX: 'auto',

    "& .MuiTable-root": {
      "& .MuiTableHead-root": {
        backgroundColor: GREEN_TWO,
      },

      "& .MuiTableCell-head .MuiTypography-root": {
        color: BLACK_THREE,
        fontWeight: 600,
        fontSize: 12,
        textTransform: 'uppercase',
      },

      "& .MuiTableCell-body .MuiTypography-root": {
        color: BLACK_ONE,
        fontWeight: 500,
        fontSize: 14,
      },

      "& .MuiTableCell-body": {
        paddingTop: 7,
        paddingBottom: 7,
      },

      "& .MuiIconButton-root": {
        padding: 7,
      },
    }
  },

  chartModalBox: {
    paddingTop: 15,
    paddingBottom: 15,

    "& .MuiFormControl-marginNormal": {
      marginTop: 10,
      paddingBottom: 0,
    },
  },

  activeBox: {
    borderRadius: 6,
    width: 'fit-content',
    height: 30,
    padding: '0 10px',
    color: WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textOverflow: {
    maxWidth: 300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  toggleMain: {
    // border: '1px solid red',
    marginLeft: 15,

    // "&.WithStyles\(ForwardRef\(Switch\)\)-thumb-271": {
    "& .MuiSwitch-thumb": {
      backgroundColor: BLUE,
    }
  },

});


export const AntSwitch = withStyles(() =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
      padding: 5,
      display: "flex",
      position: "absolute",
      left: 0,
      top: 0,
    },

    thumb: {
      width: 70,
      height: 34,
      opacity: 0.8,
      borderRadius: 6,
      backgroundColor: GREY_TWO,
      boxShadow: "none",
      transform: "translateX(93%)",
      transition: "all .3s ease-in",
    },

    switchBase: {
      padding: 4,
      transform: "none !important",

      "&$checked": {
        "& + $track": {
          opacity: 0.8,
          backgroundColor: "transparent",
          borderColor: "none",
        },

        "& .MuiSwitch-thumb": {
          backgroundColor: BLUE,
          transform: "translateX(0)",
        },
      },

      "&:hover": {
        backgroundColor: 'transparent'
      }
    },

    track: {
      border: `none`,
      backgroundColor: WHITE,
    },

    checked: {},
  })
)(Switch);