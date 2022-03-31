import { makeStyles } from "@material-ui/core";
import { WHITE } from "../theme";

export const useFacilityStyles = makeStyles(() => ({
  navbar: {
    overflow: 'hidden',
    backgroundColor: WHITE,
    boxShadow: 'none',
    borderRadius: 12,
    height: 'fit-content',
    position: 'sticky',
    top: 120,
    maxWidth: 327,
    width: '100%'
  },
}));
