// packages block
import { createTheme } from "@material-ui/core/styles";
// color-constants and font-family block
import { BLUE_TWO, WHITE, BLACK, GREEN, POPPINS, GRAY_ONE, GRAY_TWO, GRAY_THREE, BLUE_ONE, BLACK_ONE, WHITE_THREE, BLACK_TWO, BLUE_THREE, GRAY_SIX } from ".";

const customTheme = createTheme()
export const theme = createTheme({
  palette: {
    primary: {
      main: BLUE_TWO,
      contrastText: WHITE,
    },

    secondary: {
      main: GREEN,
      contrastText: WHITE,
    },

    text: {
      secondary: BLACK,
    },
  },

  shape: {
    borderRadius: 0,
  },

  typography: {
    fontFamily: POPPINS,

    h3: {
      fontSize: 30,
      fontWeight: 600
    },

    h4: {
      fontSize: 20,
      fontWeight: 600
    },

    h5: {
      fontSize: 16,
      fontWeight: 500,
      color: BLACK_ONE,
    },

    h6: {
      fontSize: 14,
      fontWeight: 600
    },

    body1: {
      fontSize: 14,
    },

    body2: {
      fontSize: 12
    },
  },

  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          WebkitFontSmoothing: "auto",

          "& .MuiListItem-gutters": {
            transition: '.3s all ease-in'
          },

          "& .MuiPagination-ul": {
            "& li": {
              "& button": {
                height: 28,
                minWidth: 28,
                borderRadius: 6,
                color: BLACK_TWO,
                fontSize: 14,
                fontWeight: 500,
              },

              "& .Mui-selected": {
                backgroundColor: BLUE_THREE,
                color: WHITE,
              }
            },

            "& li:first-child, & li:last-child": {
              "& button": {
                backgroundColor: WHITE,
              }
            }
          }
        },
      },
    },

    MuiToolbar: {
      gutters: {
        padding: "15px 30px !important",
      }
    },

    MuiDialog: {
      paperWidthSm: {
        borderRadius: 10,
        maxWidth: 810,
        minHeight: 265
      }
    },

    MuiDialogContent: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }
    },

    MuiDialogTitle: {
      root: {
        "&.MuiPaper-root": {
        background: '#FFF9F4',
        border: '1px dashed #F89C47',
        borderRadius: 6,
        minHeight: 103,
        padding: 30
    },
      },
    },

    MuiCheckbox: {
      root: {
        color: BLUE_TWO
      }
    },

    MuiButton: {
      contained: {
        borderRadius: 6,
        maxHeight: 42,
        padding: '9px 20px',
        boxShadow: 'none'
      },

      label: {
        fontSize: 14,
        fontWeight: 600,
      }
    },

    MuiOutlinedInput: {
      root: {
        "& $notchedOutline": {
          borderRadius: 4,
          border: `1px solid ${GRAY_ONE}`,
          fontFamily: POPPINS,
        },

        "&.Mui-focused $notchedOutline, &:hover $notchedOutline": {
          border: `1px solid ${BLUE_ONE}`,
        },
      },

      input: {
        height: 42,
        padding: '11px 14px',
        boxSizing: 'border-box'
      }
    },

    MuiInputLabel: {
      shrink: {
        transform: 'scale(1)',
        color: GRAY_THREE
      },

      formControl: {
        top: -20
      }
    },

    MuiFormControl: {
      marginNormal: {
        position: 'relative',
        paddingBottom: customTheme.spacing(3)
      }
    },

    MuiFormHelperText: {
      contained: {
        position: 'absolute',
        bottom: -20,
        marginLeft: 0,
        marginRight: 0,
        fontSize: 12,
        opacity: 0.8,
        color: GRAY_TWO,
        fontWeight: 500,
      }
    },

    MuiTableRow: {
      root: {
        "& th:first-child, & td:first-child": {
          paddingLeft: 30
        }
      }
    },

    MuiTableCell: {
      root: {
        borderBottom: `1px solid ${WHITE_THREE}`,
        padding: "14px 11px",
      },

      head: {
        backgroundColor: 'rgba(245, 248, 250, 0.3)'
      },

      body: {
        fontSize: 14,
        color: BLACK_TWO,
      }
    },

    MuiCard: {
      root: {
        background: WHITE,
        borderRadius: 12,
        boxShadow: 'none'
      }
    },

    MuiCardHeader: {
      root: {
        padding: "18px 30px",
        borderBottom: `1px solid ${GRAY_SIX}`,
        marginBottom: 30,
      },

      content: {
        "& .MuiTypography-h5": {
          fontSize: 20,
          fontWeight: 600
        }
      }
    },

    MuiCardContent: {
      root: {
        padding: "0 27px",

        "&:last-child": {
          paddingBottom: 0
        }
      }
    }
  },
});
