	// packages block
import { createTheme } from "@material-ui/core/styles";
import { colors } from "@material-ui/core";
// color-constants and font-family block
import { PRIMARY_COLOR, WHITE, BLACK, LATO, } from ".";

export const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
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
    fontFamily: LATO,

    h4: {
      fontSize: 24,
      fontWeight: 600
    },

    h5: {
      fontSize: 16,
      fontWeight: 600
    },

    h6: {
      fontSize: 14,
      fontWeight: 600
    },

    body2: {
      fontSize: 13
    }
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
                  backgroundColor: "#fff",
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

    MuiCheckbox: {
      root: {
        color: PRIMARY_COLOR
      }
    },
  },
});
