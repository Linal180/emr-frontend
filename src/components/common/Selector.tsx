// packages block
import { FC, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Box, TextField, FormControl, InputLabel, FormHelperText } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { SelectorProps } from "../../interfacesTypes";

const Selector: FC<SelectorProps> = ({ name, loading, label, error, options, value }): JSX.Element => {
  const { control, setValue } = useFormContext()

  // useEffect(() => {
  //   setValue(name, value)
  // }, [name, setValue, value]);

  console.log("value::",value)
  return (
    <Box>
      <Controller
        rules={{ required: true }}
        name={name}
        control={control}
        defaultValue={value}
        render={({ field, fieldState: { invalid } }) => {
          console.log("field.value.value:::",field)
          return (
            <Autocomplete
              options={options}
              disableClearable
              loading={loading}
              value={field.value.value}
              getOptionLabel={(option) => option.label || ""}
              renderOption={(option) => option.label}
              getOptionSelected={(option) => option.value === value}
              renderInput={(params) => (
                <FormControl fullWidth margin='normal' error={Boolean(error)}>
                  <InputLabel id="practiceType" shrink>{label}</InputLabel>

                  <TextField
                    {...params}
                    error={invalid}
                    variant="outlined"
                  />

                  <FormHelperText>{error}</FormHelperText>
                </FormControl>
              )}
              onChange={(_, data) => {
                console.log("data::",data)
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
