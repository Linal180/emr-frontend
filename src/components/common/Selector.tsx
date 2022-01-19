// packages block
import { FC } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
// utils and interfaces/types block
import { SelectorProps } from "../../interfacesTypes";

const Selector: FC<SelectorProps> = ({ name, label, error, options, value }): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={options && options[0]}
      render={({ field, fieldState: { invalid } }) => {
        return (
          <Autocomplete
            options={options.length ? options : []}
            disableClearable
            value={field.value}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(error)}>
                <InputLabel id={`${name}-autocomplete`} shrink>{label}</InputLabel>

                <TextField
                  {...params}
                  variant="outlined"
                  error={invalid}
                />

                <FormHelperText>{error}</FormHelperText>
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
