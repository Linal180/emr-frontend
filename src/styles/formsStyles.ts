import { makeStyles, createStyles } from "@material-ui/core";
import { GRAY_TWO } from "../theme";

export const useFormStyles = makeStyles(() =>
  createStyles({
    controlLabel: {
     justifyContent: 'space-between',
     marginLeft: 0,
   },

   helperText: {
     color: GRAY_TWO,
   }
  })
);