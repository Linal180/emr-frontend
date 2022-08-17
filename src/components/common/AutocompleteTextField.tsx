import { CircularProgress, TextField } from "@material-ui/core";
import { FC } from "react";
import { AutocompleteTextFieldProps } from "../../interfacesTypes";

const AutocompleteTextField: FC<AutocompleteTextFieldProps> = ({ onChange, params, invalid, loading }) => {
  return (
    <TextField
      {...params}
      variant="outlined"
      error={invalid}
      className="selectorClass"
      onChange={onChange}
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )
}

export default AutocompleteTextField