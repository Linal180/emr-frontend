// packages block
import { FC } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText } from "@material-ui/core";
// utils and interfaces/types block
import { CardSelectorProps } from "../../interfacesTypes";

const CardSelector: FC<CardSelectorProps> = ({
  name, error, options, disabled,
}): JSX.Element => {
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
            disabled={disabled}
            // multiple={isMultiple ? true : false}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(error)}>

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

export default CardSelector;
