// packages block
import { createTheme } from "@material-ui/core/styles";
// color-constants and font-family block
import {
  PINK, WHITE, BLACK, GREEN, POPPINS, GRAY_ONE, GRAY_TWO, GRAY_THREE, BLUE_ONE, BLACK_ONE, WHITE_THREE, BLACK_TWO, BLUE_THREE, GRAY_SIX, ORANGE, BLACK_THREE,
  GRAY_SEVEN, ORANGE_ONE, BLACK_SIX, BLUE_SEVEN,
} from ".";

const customTheme = createTheme()
export const theme = createTheme({
  palette: {
    primary: {
      main: GREEN,
      contrastText: WHITE,
    },

    secondary: {
      main: PINK,
      contrastText: WHITE,
    },

    info: {
      main: BLUE_ONE,
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
      fontSize: 12,
      color: BLACK_THREE
    },
  },

  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          WebkitFontSmoothing: "auto",

          "& body": {
            "& strong": {
              fontWeight: "700 !important"
            },
          },

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
          },
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
      },

      paperWidthMd: {
        borderRadius: 10,
        maxWidth: 910,
        minHeight: 265
      }
    },

    MuiDialogTitle: {
      root: {
        padding: "18px 30px",
        borderBottom: `1px solid ${GRAY_SIX}`,

        "& h2": {
          fontSize: 20,
          color: BLACK_ONE,
        }
      }
    },

    MuiDialogActions: {
      root: {
        padding: "18px 30px",
        borderTop: `1px solid ${GRAY_SIX}`,
      }
    },

    MuiDialogContent: {
      root: {
        padding: 30,

        "& > div": {
          background: ORANGE,
          border: `1px dashed ${ORANGE_ONE}`,
          borderRadius: 6,
          padding: 20,
        },

        "& .MuiCardContent-root": {
          padding: '0 0 0 15px'
        },

        "& h4": {
          fontWeight: 'bold',
          marginBottom: 2,
        },

        "& p": {
          color: BLACK_TWO,
          lineHeight: '22px',
          fontWeight: 500,
          maxWidth: '80%'
        }
      }
    },

    MuiCheckbox: {
      root: {
        color: WHITE_THREE,

        "& .MuiIconButton-label": {
          position: 'relative',
          marginRight: 0,

          "&:before": {
            content: `""`,
            height: 24,
            width: 24,
            position: "absolute",
            background: WHITE_THREE,
            zIndex: 9,
            borderRadius: 6,
          },
        },


        "& .MuiSvgIcon-root": {
          height: 32,
          width: 32,
          borderRadius: 6,
        },

        "&[class*=PrivateSwitchBase-checked]": {
          "& .MuiIconButton-label": {
            "&:before": {
              display: 'none',
            }
          },

          "& .MuiSvgIcon-root": {
            color: BLUE_THREE
          }
        }
      }
    },

    MuiButton: {
      contained: {
        borderRadius: 6,
        maxHeight: 42,
        padding: '9px 20px',
        boxShadow: 'none',
        color: BLACK_TWO,

        "&.blue-button": {
          backgroundColor: BLUE_ONE,
          color: WHITE,

          "&:hover": {
            backgroundColor: BLUE_THREE,
          }
        }
      },

      outlined: {
        borderRadius: 6,
        maxHeight: 42,
        padding: '9px 20px',
        boxShadow: 'none',

        "&.blue-button": {
          borderColor: BLUE_ONE,
          color: BLUE_ONE,
          borderStyle: 'dashed',

          "&:hover": {
            borderColor: BLUE_THREE,
            color: BLUE_THREE,
          }
        }
      },

      label: {
        fontSize: 14,
        fontWeight: 600,
      },

      text: {
        "& .MuiButton-label": {
          color: GRAY_TWO
        }
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
      },

      root: {
        "& .MuiAutocomplete-input": {
          height: 'auto',
          padding: '3.7px 0px 0 4px !important'
        },

        "& .MuiAutocomplete-inputRoot": {
          minHeight: 42,
        }
      }
    },

    MuiFormHelperText: {
      contained: {
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
        padding: "0px 30px",

        "&:last-child": {
          paddingBottom: 0
        }
      }
    },

    MuiListItemText: {
      root: {
        marginTop: 0,
        marginBottom: 0,

        "&.child-item": {
          display: 'flex',
          alignItems: 'center',

          "&:before": {
            content: `""`,
            display: "block",
            height: 4,
            width: 4,
            backgroundColor: GRAY_SEVEN,
            borderRadius: 4,
            marginRight: 8,
          },

          "&.active-child": {
            "&:before": {
              backgroundColor: BLUE_ONE,
            }
          }
        },

        "&.active > span": {
          fontWeight: 'bold'
        },

        "&.active-child > span": {
          color: BLUE_ONE
        }
      },

      primary: {
        fontSize: 13,
      }
    },

    MuiAccordion: {
      root: {
        background: 'transparent',

        "&:before": {
          display: 'none'
        },

        "&.Mui-expanded": {
          margin: 0,
        }
      }
    },

    MuiAccordionSummary: {
      root: {
        minHeight: 0,
        padding: 0,

        "&.Mui-expanded": {
          minHeight: 0,
        }
      },

      content: {
        margin: 0,

        "&.Mui-expanded": {
          margin: 0,

          "& .MuiListItemIcon-root, & .MuiTypography-root": {
            color: BLUE_ONE,
            fontWeight: 'bold'
          }
        }
      }
    },

    MuiAccordionDetails: {
      root: {
        padding: 0,
        flex: 1,

        "& .MuiList-root": {
          width: "100%",

          "& .MuiListItem-root": {
            paddingLeft: 72,
            display: 'flex',
            alignItems: 'center',
          }
        }
      }
    },

    MuiFormControlLabel: {
      label: {
        fontWeight: 500,
        color: BLACK_ONE
      }
    },

    MuiSelect: {
      select: {
        paddingTop: 13,
      },

      selectMenu: {
        minHeight: 42,
      }
    },

    MuiTabs: {
      indicator: {
        display: 'none'
      },
    },

    MuiTab: {
      root: {
        minWidth: '0 !important',
        lineHeight: '19px',
        padding: '8px 15px',
        fontSize: 13,
        fontWeight: 500,
        minHeight: 0,
        borderRadius: 4,

        "&.Mui-selected": {
          background: `rgba(0, 158, 247, 0.1)`,
          color: BLUE_SEVEN,
        }
      },

      textColorInherit: {
        color: BLACK_SIX,
        opacity: 1,
      }
    },
  },
});
