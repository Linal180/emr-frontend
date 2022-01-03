// packages block
import { FC } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Box, TextField } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { requiredLabel } from "../../utils";
import { SelectStateType } from "../../interfacesTypes";

const SelectState: FC<SelectStateType> = ({ name, loading, error, options, value }): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Box>
      <Controller
        rules={{ required: true }}
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { invalid } }) => {
          return (
            <Autocomplete
              options={options}
              disableClearable
              loading={loading}
              value={field.value}
              getOptionLabel={(option) => option || ""}
              renderOption={(option) => option}
              getOptionSelected={(option, value) => option === value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={invalid}
                  label={requiredLabel("State Name")}
                  variant="outlined"
                  helperText={error || ''}
                />
              )}
              onChange={(_, data) => {
                field.onChange(data);
              }}
            />
          );
        }}
      />
    </Box>
  );
};

export default SelectState;
