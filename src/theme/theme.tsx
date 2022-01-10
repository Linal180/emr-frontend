// packages block
import { createTheme } from "@material-ui/core/styles";
import { colors } from "@material-ui/core";
// color-constants and font-family block
import { BLUE_TWO, WHITE, BLACK, GREEN, POPPINS, GRAY_ONE, GRAY_TWO, GRAY_THREE, BLUE_ONE, BLACK_ONE } from ".";

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
      fontWeight: 600,
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

          "& table": {
            '& tbody': {
              "& tr": {
                '&:nth-of-type(odd)': {
                  backgroundColor: WHITE,
                },

                '&:nth-of-type(even)': {
                  backgroundColor: '#f1f1f1',
                },
              }
            }
          },

          "& .MuiListItem-gutters": {
            transition: '.3s all ease-in'
          },

          "& .MuiDropzoneArea-root": {
            borderWidth: 2,
            borderColor: colors.grey[500],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 200,
            position: "relative",

            "& .MuiTypography-h5": {
              fontSize: 16,
              color: colors.grey[600],
            },

            "& .MuiDropzonePreviewList-root": {
              position: "absolute",
              margin: 0,
              width: "100%",

              "& .MuiDropzonePreviewList-imageContainer": {
                left: 0,
                top: 0,
                height: "100%",
                maxWidth: "100%",
                padding: 0,
                flexBasis: "100%",

                "& img": {
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                },

                "& .MuiDropzonePreviewList-removeButton": {
                  "& svg": {
                    color: colors.red[500],
                  },
                },
              },
            },

            "& .MuiDropzoneArea-textContainer": {
              "& svg": {
                fill: colors.grey[400],
                display: "block",
                margin: "auto",
              },
            },

            "& .MuiDropzoneArea-text": {
              margin: "0 0 5px",
            },
          },
        },
      },
    },

    MuiToolbar: {
      gutters: {
        padding: "15px 30px !important",
      }
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
    }
  },
});
