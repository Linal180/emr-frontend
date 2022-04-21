// packages block
import { FC } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
// utils and interfaces/types block
import { requiredLabel } from "../../utils";
import { EMPTY_OPTION } from "../../constants";
import { SelectorProps } from "../../interfacesTypes";

const Selector: FC<SelectorProps> = ({ name, label, options, disabled, isRequired, addEmpty }): JSX.Element => {
  const { control } = useFormContext()
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...options] : [...options]

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={updatedOptions[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={options.length ? updatedOptions : []}
            disableClearable
            value={field.value}
            disabled={disabled}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
                <InputLabel id={`${name}-autocomplete`} shrink>
                  {isRequired ? requiredLabel(label) : label}
                </InputLabel>

                <TextField
                  {...params}
                  variant="outlined"
                  error={invalid}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => field.onChange(data)}
          />
        );
      }}
    />
  );
};

export default Selector;
