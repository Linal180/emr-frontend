import { makeStyles } from "@material-ui/core";
import { WHITE, } from "../theme";

export const useHeaderSelectorStyles = makeStyles(() => ({
  headerSelector: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: WHITE,
      border: `1px solid rgb(209, 213, 219)`,
      borderRadius: 4,
      height: 40,
      padding: 12,
    },

    "& .MuiFormControl-marginNormal": {
        marginTop: 0,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      border: 'none',
    },

    "& .MuiInputBase-input::placeholder": {
      color: '#000000 !important',
    }
  },
}));
