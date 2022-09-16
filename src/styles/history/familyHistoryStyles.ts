import { createStyles, makeStyles } from "@material-ui/core";

export const useFamilyHistoryStyles = makeStyles(() =>
  createStyles({
    modalContentBox: {
      paddingTop: 15,
      paddingBottom: 15,

      "& .MuiFormControl-marginNormal": {
        marginTop: 8,
        paddingBottom: 0,

        "& .MuiOutlinedInput-input": {
          minHeight: 48,
        },

        "& .MuiAutocomplete-inputRoot": {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },

      "& .MuiBox-root": {
        border: 'none',
        padding: 0,
        backgroundColor: 'transparent',
        borderRadius: 0,
      },
    },
  })
)