import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_ONE, BLACK_THREE, BLUE_SEVEN, GREY_SEVEN, GREY_THREE, theme, WHITE, WHITE_SIX } from "../theme";

export const useProfileDetailsStyles = makeStyles(() =>
  createStyles({
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
    },

    profileCard: {
      marginTop: 10,
      padding: 30,
      background: WHITE,
      borderRadius: 12,
      display: 'flex',
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
      height: 120,
      width: 120,
      borderRadius: 12,
      
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
      textTransform: 'capitalize',

      "& > svg": {
        marginLeft: 10,
      }
    },

    profileInfoItem: {
      minWidth: "20%",
      alignItems: 'center',
      color: GREY_THREE,
      marginBottom: 8,
      marginRight: 5,

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
  })
);