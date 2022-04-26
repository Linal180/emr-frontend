// packages block
import { FC } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box, Typography } from "@material-ui/core";
// utils and interfaces/types block
import { requiredLabel } from "../../utils";
import { ADD_PATIENT_MODAL, EMPTY_OPTION } from "../../constants";
import { SelectorProps } from "../../interfacesTypes";
import { useFormStyles } from "../../styles/formsStyles";

const Selector: FC<SelectorProps> = ({ name, label, options, disabled, isRequired, addEmpty, isModal, handlePatientModal }): JSX.Element => {
  const { control } = useFormContext()
  const classes = useFormStyles()
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
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>

                  {isModal &&
                    <Box onClick={() => handlePatientModal && handlePatientModal()}>
                      <Typography className={classes.addModal}>
                        {ADD_PATIENT_MODAL}
                      </Typography>
                    </Box>
                  }
                </Box>

                <TextField
                  {...params}
                  variant="outlined"
                  error={invalid}
                  className="selectorClass"
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
