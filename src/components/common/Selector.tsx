// packages block
import { FC } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
// utils and interfaces/types block
import { SelectorProps } from "../../interfacesTypes";
import { requiredLabel } from "../../utils";

const Selector: FC<SelectorProps> = ({ name, label, options, disabled, isRequired, isMultiple }): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={options && options[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            multiple={isMultiple}
            options={options.length ? options : []}
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
