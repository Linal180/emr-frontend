// packages block
import { FC } from "react";
import { Autocomplete, AutocompleteGetTagProps } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box, Chip } from "@material-ui/core";
// utils and interfaces/types block
import { requiredLabel } from "../../utils";
import { EMPTY_OPTION } from "../../constants";
import { SelectorOption, SelectorProps } from "../../interfacesTypes";

const Selector: FC<SelectorProps> = ({
  name, label, options, disabled, isRequired, addEmpty, margin, onBlur, onSelect, value, onOutsideClick, isMultiple
}): JSX.Element => {
  const { control } = useFormContext()
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...options || []] : [...options || []]

  const selectorMultiProps = isMultiple ? {
    multiple: true,
    renderTags: (value: SelectorOption[], getTagProps: AutocompleteGetTagProps) => {
      return (
        value.map((option: SelectorOption, index: number) => (
          <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
        ))
      )
    }
  } : {}

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={value ?? updatedOptions[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={options?.length ? updatedOptions : []}
            disableClearable
            {...(!isMultiple && { value: field.value })}
            disabled={disabled}
            filterSelectedOptions
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            {...selectorMultiProps}
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
              // return data
            }}
            onBlur={() => onOutsideClick && onOutsideClick()}
            onClick={() => onOutsideClick && onOutsideClick()}
          />
        );
      }}
    />
  );
};

export default Selector;
