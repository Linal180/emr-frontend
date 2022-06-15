// packages block
import { Box, FormControl, FormHelperText, InputLabel, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { EMPTY_OPTION } from "../../constants";
import { SelectorProps } from "../../interfacesTypes";
import { requiredLabel } from "../../utils";

const Selector: FC<SelectorProps> = ({
  name, label, options, disabled, isRequired, addEmpty, margin, onBlur, onSelect, value, onOutsideClick
}): JSX.Element => {
  const { control } = useFormContext()
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...options || []] : [...options || []]
  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={value ?? updatedOptions[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={!!updatedOptions?.length ? updatedOptions : []}
            disableClearable
            value= {field.value}
            disabled={disabled}
            // filterSelectedOptions
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin={margin || 'normal'} error={Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>
                </Box>

                <TextField
                  {...params}
                  variant="outlined"
                  error={invalid}
                  className="selectorClass"
                  onBlur={() => onBlur && onBlur()}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => {
              field.onChange(data)
              onSelect && onSelect(data)
              return data
            }}
            onBlur={() => onOutsideClick && onOutsideClick()}
          />
        );
      }}
    />
  );
};

export default Selector;
