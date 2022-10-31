import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_ONE, BLACK_THREE, BLUE_FOUR, BLUE_SEVEN, GRAY_THREE, GREEN, GREY_SEVEN, GREY_THREE, RED, RED_TWO, theme, WHITE, WHITE_SIX } from "../theme";

export const useProfileDetailsStyles = makeStyles(() =>
  createStyles({
    main: {
      padding: theme.spacing(3),
      borderRadius: theme.spacing(1),
      margin: theme.spacing(0.5),
      backgroundColor: WHITE,
      minHeight: 100,
      position: "sticky",
      top: 100,
      zIndex: 1,
    },

    changePasswordContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 130px)',
    },

    changePasswordCard: {
      background: WHITE,
      borderRadius: 8,
      padding: 30,
    },

    profileDetailsContainer: {
      maxHeight: 'calc(100vh - 175px)',
      [theme.breakpoints.down('xs')]: {
        "& .MuiBox-root-1825": {
          flexDirection: 'column'
        }
      }
    },

    profileCard: {
      marginTop: 10,
      padding: 20,
      background: WHITE,
      borderRadius: 12,

      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column'
      }
    },

    patientProfileCard: {
      padding: 50,
      background: WHITE,
      borderRadius: 12,
      display: 'flex',
      width: '60%',
      margin: 'auto',
      justifyContent: 'space-around'
    },

    profileImage: {
      height: 80,
      width: 80,
      borderRadius: 8,

      "& > img": {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
      }
    },

    profileImageNew: {
      "&.MuiAvatar-root": {
        height: 80,
        width: 80,
        borderRadius: 8,
      },

      "& > img": {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
      }
    },

    userName: {
      fontSize: 19,
      fontWeight: 700,
      color: BLACK_ONE,

      "& > svg": {
        marginLeft: 10,
      }
    },

    capitalize: {
      textTransform : 'capitalize'
    },

    profileInfoItem: {
      // minWidth: "20%",
      alignItems: 'center',
      color: GREY_THREE,
      marginBottom: 8,
      marginRight: 30,

      "& svg": {
        display: 'block',
        marginRight: 7,
        minWidth: 14
      }
    },

    profileAdditionalInfo: {
      width: '25%',
      fontSize: 14,
      color: GREY_SEVEN,

      [theme.breakpoints.down('md')]: {
        width: '50%',
      },

      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },

    profileInfoHeading: {
      fontSize: 15,
      fontWeight: 700,
      color: BLACK_ONE
    },

    profileTag: {
      lineHeight: '19px',
      padding: '6px 11px',
      marginRight: 16,
      fontSize: 12,
      fontWeight: 600,
      borderRadius: 6,
      background: WHITE_SIX,
      color: BLUE_SEVEN,
    },

    addSlot: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      background: 'transparent',
      cursor: 'pointer',
    },

    deleteWidget: {
      cursor: 'pointer'
    },

    dropdown: {
      "& .MuiMenu-paper": {
        padding: 20
      },

      "& .MuiPopover-paper": {
        minHeight: 300
      }
    },

    profileCardMasonry: {
      columnMinWidth: '30%',
      columnCount: 3,
      [theme.breakpoints.down('md')]: {
        columnCount: 2,
      },

      [theme.breakpoints.down('sm')]: {
        columnCount: 1,
      },
    },

    profileCardItemMasonry: {
      breakInside: 'avoid',
      margin: '24px 5px'
    },

    sidebarMenu: {
      "& .MuiListItem-root": {
        color: BLACK_THREE,
      },
    },

    noteDropdown: {
      "& .MuiMenu-paper": {
        padding: 10
      },
      "& .MuiPopover-paper": {
        [theme.breakpoints.up('sm')]: {
          minWidth: 300
        },
        [theme.breakpoints.only('sm')]: {
          minWidth: 150
        }
      }
    },

    profileNoteInfoItem: {
      minWidth: "20%",
      alignItems: 'center',
      color: GREY_THREE,
      marginBottom: 8,
      marginRight: 5,
      display: "flex",
      flexWrap: "wrap",

      "& svg": {
        display: 'block',
        marginRight: 7,
        minWidth: 14
      }
    },

    tab: {
      flexDirection: "row-reverse"
    },

    cardChart: {
      backgroundColor: WHITE,
      boxShadow: '0px 4px 30px rgba(56, 71, 109, 0.09)',
      borderRadius: 8,
      position: 'relative',
    },

    areaBloodPressureChart: {
      "& .highcharts-container": {
        transform: 'translate(-60px, 221px) scale(1.5)',
      },
    },

    areaChartContainer: {
      "& div": {
        "& div": {
          height: 300,
        }
      },

      "& svg": {
        height: 230,
        transform: 'scale(1.5)',
      }
    },

    bloodPressureMeasurement: {
      position: 'absolute',
      left: 30,
      top: 135,
      color: RED_TWO,
      zIndex: 1,

      "& .measure-unit": {
        fontSize: 14,
        color: GRAY_THREE,
      }
    },

    heartRateMeasurement: {
      position: 'absolute',
      left: 30,
      top: 135,
      color: BLUE_FOUR,
      zIndex: 1,

      "& .measure-unit": {
        fontSize: 14,
        color: GRAY_THREE,
        marginLeft: 10,
      }
    },

    measureFrequency: {
      fontStyle: 'normal',
      color: WHITE,
      padding: '4px 8px 4px 8px',
      borderRadius: 4,
    },

    primary: {
      backgroundColor: GREEN,
    },

    dangerBg: {
      backgroundColor: RED,
    },
    
  })
);
