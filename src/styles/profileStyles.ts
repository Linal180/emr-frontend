import { makeStyles, createStyles } from "@material-ui/core";
import { WHITE } from "../theme";
export const useProfileStyles = makeStyles(() =>
  createStyles({
    profileContainer: {
      marginTop: 20,
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
        objectFit: "cover",
      },
    },
  })
);
