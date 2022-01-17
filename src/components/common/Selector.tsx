// packages block
import { FC } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { Box, TextField, FormControl, InputLabel, FormHelperText } from "@material-ui/core";
// utils and interfaces/types block
import { SelectorProps } from "../../interfacesTypes";

const Selector: FC<SelectorProps> = ({ name, loading, label, error, options, value }): JSX.Element => {
  const { control} = useFormContext()

  return (
    <Box>
      <Controller
        rules={{ required: true }}
        name={name}
        control={control}
        defaultValue={value}
        render={({ field, fieldState: { invalid } }) => {
          return (
            <Autocomplete
              options={options}
              disableClearable
              loading={loading}
              // value={field.value}
              getOptionLabel={(option) => option.label || ""}
              renderOption={(option) => option.label}
              getOptionSelected={(option) => option.value === value}
              renderInput={(params) => (
                <FormControl fullWidth margin='normal' error={Boolean(error)}>
                  <InputLabel id="practiceType" shrink>{label}</InputLabel>

                  <TextField
                    {...params}
                    error={invalid}
                    value={value}
                    variant="outlined"
                  />

                  <FormHelperText>{error}</FormHelperText>
                </FormControl>
              )}
              onChange={(_, data) => {
                field.onChange(data.value);
              }}
            />
          );
        }}
      />
    </Box>
  );
};

export default Selector;
