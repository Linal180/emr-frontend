// packages block
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormHelperText, InputLabel, Box, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
// utils and interfaces/types block
import { requiredLabel } from "../utils";
import { SelectorProps } from "../interfacesTypes";

const RadioController: FC<SelectorProps> = ({
  name, label, options, isRequired, margin, value
}): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={value ?? ''}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        const { value, onChange, ref } = field
        return (

          <FormControl fullWidth margin={margin || 'normal'} error={Boolean(invalid)} innerRef={ref}>
            <Box position="relative">
              <InputLabel id={`${name}-autocomplete`} shrink>
                {isRequired ? requiredLabel(label) : label}
              </InputLabel>
            </Box>

            <RadioGroup name="relation" value={value} onChange={onChange}>
              {options?.map((item, index) => {
                const { id, name } = item || {}
                return <FormControlLabel key={`${index}-${id}`} value={id} control={<Radio />} label={name} />
              })}
            </RadioGroup>

            <FormHelperText>{message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default RadioController;
