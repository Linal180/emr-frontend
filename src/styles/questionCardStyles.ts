import { makeStyles } from "@material-ui/core";

export const questionCardStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
    },
    '& .MuiChip-root': {
      height: 'auto !important',
      borderRadius: '4px !important',
      '& .MuiAutocomplete-inputRoot, .MuiOutlinedInput-root': {
        height: '24px !important',
        marginTop: 9,
        backgroundColor: '#F3F4F6',
        borderRadius: '4px !important',
        paddingTop: '0px !important',
      },
    },
    "& .MuiChip-label": {
      whiteSpace: "normal",
      textOverflow: "clip",
      textAlign: "center",
      fontSize: 16,
      fontWeight: '500',
      display: "flex",
      alignItems: "center",
      padding: '0px 10px 0px 5px',
    },
    padding: '10 0',
  },
}));