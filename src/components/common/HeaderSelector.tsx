// packages block
import { FC, useRef } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { SelectorProps } from "../../interfacesTypes";
import { FormControl, TextField, FormHelperText } from "@material-ui/core";
import { useHeaderSelectorStyles } from "../../styles/headerSelectorStyles";

const HeaderSelector: FC<SelectorProps> = ({
  name, label, options, disabled, isRequired, addEmpty, margin, onBlur, onSelect, value,
  loading, onOutsideClick, focus
}): JSX.Element => {
  const classes = useHeaderSelectorStyles()
  const { control } = useFormContext()
  const eleRef = useRef<any>();

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={value ? value : []}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            ref={eleRef}
            options={!!options?.length ? options : []}
            disableClearable
            value={field.value}
            disabled={disabled}
            getOptionSelected={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth error={Boolean(invalid)}>
                <TextField
                  {...params}
                  variant="outlined"
                  error={invalid}
                  placeholder={label}
                  className={`${classes.headerSelector} header-selector`}
                  autoFocus={!!focus}
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

export default HeaderSelector;
