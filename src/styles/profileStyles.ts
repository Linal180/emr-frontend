import { makeStyles, createStyles } from "@material-ui/core";
import { BLACK_THREE, WHITE } from "../theme";
export const useProfileStyles = makeStyles(() =>
  createStyles({
    profileContainer: {
      padding: 50,
      background: WHITE,
      borderRadius: 12,
      display: "flex",
      justifyContent: "space-around",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },

    profileImage: {
      height: 160,
      width: 160,

      borderRadius: 12,
      "& > img": {
        height: "100%",
        width: "100%",
        objectFit: "contain",
      },
    },

    sidebarMenu: {
      "& .MuiListItem-root": {
        color: BLACK_THREE,
        whiteSpace : 'normal'
      },
    },
  })
);
