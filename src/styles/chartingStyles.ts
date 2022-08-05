import { makeStyles, } from "@material-ui/core";
import { BLACK, BLACK_THREE, BLACK_TWO, BLUE, GRAY_ONE, GRAY_SIX, GREEN, GREEN_TWO, GREY, GREY_FOUR, WHITE, WHITE_FOUR } from "../theme";

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
        textTransform: 'uppercase',
      },

      "& .MuiTableCell-body": {
        paddingTop: 10,
        paddingBottom: 10,
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
      marginTop: 8,
      paddingBottom: 0,

      "& .MuiOutlinedInput-input": {
        height: 40,
      },

      "& .MuiAutocomplete-inputRoot": {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },

    "& .MuiBox-root": {
      border: 'none',
      padding: 0,
      backgroundColor: 'transparent',
      borderRadius: 0,
    },
  },

  toggleProblem: {
    marginTop: 10,

    "& .MuiBox-root": {
      border: `1px solid ${GRAY_SIX}`,
      borderRadius: 6,
      display: 'flex',
      alignItems: 'center',
      width: 'fit-content',
      padding: '5px 10px',

      "& .selectedBox": {
        backgroundColor: BLUE,
        color: WHITE,
        border: 'none',
      },

      "& .selectBox": {
        border: 'none',
        cursor: 'pointer',
      },
    },
  },

  toggleAllergy: {
    marginTop: 0,

    "& .MuiBox-root": {
      padding: '7px 20px',
    },
  },

  searchBox: {
    backgroundColor: GREY,
    
    "& .MuiBox-root": {
      backgroundColor: GREY,
      borderRadius: 4,
      border: `1px solid ${GREY_FOUR}`,
    },

    "& .MuiIconButton-root": {
      backgroundColor: GREY,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },

    "& .MuiInputBase-root": {
      width: '100%',
      backgroundColor: GREY,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
      border: `1px solid ${GREY_FOUR}`,
      paddingLeft: 10,
    },
  },

  problemGrid: {
    border: 'none !important',
    padding: '20px 0 !important',
    backgroundColor: `${WHITE} !important`,
    borderRadius: 0,
    "& .MuiDialogContent-root": {
    },
  },

  activeBox: {
    borderRadius: 6,
    width: 'fit-content',
    height : '100%',
    minHeight: 30,
    padding: '2px 10px',
    color: WHITE,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign : 'center'
  },

  textOverflow: {
    maxWidth: 300,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  toggleBox: {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    marginLeft: 15,
    padding: '0px 6px',
    marginTop: 1,
  },

  accordion: {
    backgroundColor: WHITE,
    borderRadius: 8,
    boxShadow: 'none',
    padding: 10,

    "& .MuiAccordionSummary-content.Mui-expanded .MuiTypography-root": {
      color: BLACK,
    },

    "& .MuiAccordionDetails-root": {
      display: 'block',
    },
  },

  hoverClass: {
    padding: '5px 10px !important',
    borderRadius: 4,

    "&:hover": {
      backgroundColor: GREY,
    }
  }
});