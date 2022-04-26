// packages block
import { createTheme } from "@material-ui/core/styles";
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
// constants block
import {
  GREEN, BLUE, WHITE, BLACK, GRAY_THREE, BLUE_ONE, BLACK_ONE, WHITE_THREE, BLACK_TWO, GRAY_SIX, ORANGE, GRAY_FIVE, BLACK_THREE, GRAY_SEVEN, 
  ORANGE_ONE, BLACK_SIX, RED_THREE, RED, INTER, GREY_ONE, GREY_TWO, GREY_THREE, GREY_FOUR, GREY, BLUE_TWO,
} from ".";

const breakpoints = createBreakpoints({})
const customTheme = createTheme()

export const theme = createTheme({
  palette: {
    primary: {
      main: GREEN,
      contrastText: WHITE,
    },

    secondary: {
      main: BLUE,
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
    fontFamily: INTER,

    h1: {
      fontSize: 36,
      fontWeight: 700
    },

    h2: {
      fontSize: 28,
      fontWeight: 600
    },

    h3: {
      fontSize: 20,
      fontWeight: 600
    },

    h4: {
      fontSize: 18,
      fontWeight: 700
    },

    h5: {
      fontSize: 16,
      fontWeight: 600,
    },

    h6: {
      fontSize: 14,
      fontWeight: 600
    },

    body1: {
      fontSize: 16,
    },

    body2: {
      fontSize: 14,
      color: GREY_THREE,
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
                height: 40,
                minWidth: 40,
                borderRadius: 0,
                color: BLACK_TWO,
                fontSize: 14,
                margin: 0,
              },

              "& .Mui-selected": {
                backgroundColor: BLUE,
                color: WHITE,
              },

              "& .Mui-selected:hover": {
                backgroundColor: BLUE,
                color: WHITE,
              }
            },

            "& li:first-child": {
              "& button": {
                color: BLACK_TWO,
                borderRadius: '8px 0 0 8px',
              }
            },

            "& li:last-child": {
              "& button": {
                color: BLACK_TWO,
                borderRadius: "0 8px 8px 0",
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
        padding: "22px 32px",
        borderBottom: `1px solid ${GRAY_SIX}`,

        "& h2": {
          fontSize: 20,
          fontWeight: 700,
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

        "&:first-child": {
          paddingTop: 'auto',
        },

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
            height: 20,
            width: 20,
            position: "absolute",
            background: WHITE,
            zIndex: 9,
            borderRadius: 4,
            border: `1px solid ${GREY_ONE}`,
          },
        },

        "& .MuiIconButton-label:hover": {
          "&:before": {
            border: `1px solid ${BLUE_ONE}`,
          }
        },

        "& .MuiSvgIcon-root": {
          height: 20,
          width: 20,
          borderRadius: 4,
        },

        "&[class*=PrivateSwitchBase-checked]": {
          "& .MuiIconButton-label": {
            "&:before": {
              display: 'none',
            }
          },

          "& .MuiSvgIcon-root": {
            color: BLUE,
          }
        }
      }
    },

    MuiButton: {
      contained: {
        borderRadius: 6,
        maxHeight: 40,
        padding: '12px 20px',
        boxShadow: 'none',
        color: BLACK,

        "&.danger": {
          backgroundColor: RED,
          color: WHITE,
        },

        "&.muted": {
          backgroundColor: GREY_TWO,
          color: WHITE,
        },
      },

      outlined: {
        borderRadius: 6,
        maxHeight: 40,
        padding: '12px 20px',
        boxShadow: 'none',
        color: BLACK,

        "&.danger": {
          backgroundColor: WHITE,
          borderColor: RED,
          color: RED,
        },

        "&.muted": {
          backgroundColor: WHITE,
          borderColor: GREY_TWO,
          color: GREY_TWO,
        },
      },

      label: {
        fontSize: 16,
        fontWeight: 600,
      },

      text: {
        "& .MuiButton-label": {
          color: BLACK
        },

        "&.danger": {
          paddingLeft: 0,

          "& .MuiButton-label": {
            color: RED
          }
        },

        "&.muted": {
          "& .MuiButton-label": {
            color: GREY_TWO,
          }
        },
      }
    },

    MuiOutlinedInput: {
      root: {
        backgroundColor: GREY,
        borderRadius: 4,

        "& $notchedOutline": {
          borderRadius: 4,
          border: `1px solid ${GREY_FOUR}`,
          fontFamily: INTER,
        },

        "&.Mui-focused $notchedOutline, &:hover $notchedOutline": {
          border: `1px solid ${BLUE_TWO}`,
        },

        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
          border: `1px solid ${GRAY_FIVE}`,
        },
      },

      input: {
        height: 48,
        padding: '12px 16px',
        boxSizing: 'border-box',
      },
    },

    MuiInputLabel: {
      shrink: {
        transform: 'scale(1)',
        color: BLACK_TWO,
        fontWeight: 500,
        fontSize: 14,
      },

      formControl: {
        top: -24,

        [breakpoints.between(1280, 1441)]: {
          top: -30,
        },
      }
    },

    MuiFormControl: {
      marginNormal: {
        position: 'relative',
        paddingBottom: customTheme.spacing(2),
      },

      root: {
        "& .MuiAutocomplete-input": {
          height: 'auto',
          padding: '3.7px 0px 0 4px !important'
        },

        "& .MuiAutocomplete-inputRoot": {
          minHeight: 48,
        }
      }
    },

    MuiFormHelperText: {
      contained: {
        bottom: -20,
        marginLeft: 0,
        marginRight: 0,
        fontSize: 12,
        fontWeight: 500,
        color: BLACK_THREE,
      },

      root: {
        color: RED_THREE,
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
        fontWeight: 500,
        minHeight: 0,

        "&.Mui-selected": {
          borderBottom: `2px solid ${BLUE}`,
          color: BLUE,
        }
      },

      textColorInherit: {
        color: BLACK_SIX,
        opacity: 1,
      }
    },

    MuiFormLabel: {
      root: {
        "&.Mui-focused": {
          color: GRAY_THREE
        }
      }
    },
  },
});
