import { makeStyles, createStyles } from "@material-ui/core";
import BlueCard from "../assets/images/blueCard.svg";
import { GREY_ELEVEN, theme } from "../theme";

export const useDashboardStyles = makeStyles(() =>
  createStyles({
    blueCard: {
      backgroundImage: `url(${BlueCard})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: 300,
      padding: theme.spacing(3),
    },

    cardContainer: {
      marginTop: '-60px',
      marginBottom: theme.spacing(3),
    },

    cardBox: {
      backgroundColor: GREY_ELEVEN,
      borderRadius: 8,
      padding: theme.spacing(3,2),
      minWidth: 145,
      minHeight: 120,
      cursor: 'pointer',
    },
  })
  );