import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_ONE, BLUE_SEVEN, GRAY_TWO, WHITE, WHITE_SIX } from "../theme";

export const useProfileDetailsStyles = makeStyles(() =>
  createStyles({
    profileDetailsContainer: {
      maxHeight: 'calc(100vh - 175px)',
      overflowY: 'auto',
    },

    profileCard: {
      marginTop: 10,
      padding: 30,
      background: WHITE,
      borderRadius: 12,
      display: 'flex'
    },

    profileImage: {
      height: 160,
      width: 160,
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
      paddingBottom: 5,

      "& > svg": {
        marginLeft: 10,
      }
    },

    profileInfoItem: {
      width: "33.3333%",
      alignItems: 'center',
      color: GRAY_TWO,
      marginBottom: 8,

      "& svg": {
        display: 'block',
        marginRight: 7,
        minWidth: 14
      }
    },

    profileAdditionalInfo: {
      width: '25%',
      fontSize: 14,
      color: GRAY_TWO,
    },

    profileInfoHeading: {
      fontSize: 15,
      fontWeight: 600,
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
    }
  })
);