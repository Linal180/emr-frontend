// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select from 'react-select';
// utils and interfaces/types block
import { multiOptionType, ServiceSelectorInterface } from "../../../interfacesTypes";
import { renderLoading, requiredLabel } from "../../../utils";

const MultiSelector: FC<ServiceSelectorInterface> = ({
  name, label, isRequired, loading, onSelect, userOptions
}): JSX.Element => {
  const { control, setValue } = useFormContext();

  const inputLabel = isRequired ? requiredLabel(label) : label

  const updateValues = (newValues: multiOptionType[]) => {
    setValue(name, newValues)
  }

  return (
    <>
      {
        loading ? renderLoading(inputLabel || '') :
          <Controller
            name={name}
            control={control}
            // defaultValue={userOptions}
            render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
              return (
                <FormControl fullWidth margin={'normal'} error={Boolean(invalid)}>
                  <Box position="relative">
                    <InputLabel id={`${name}-autocomplete`} shrink>
                      {isRequired ? requiredLabel(label) : label}
                    </InputLabel>
                  </Box>

                  <Select
                    {...field}
                    isClearable
                    isMulti
                    options={userOptions}
                    name={name}
                    // defaultValue={options}
                    // value={values}
                    onChange={(newValue) => {
                      updateValues(newValue as multiOptionType[])
                      onSelect && onSelect(newValue)
                      return field.onChange(newValue)
                    }}
                    className={message ? `selectorClassTwoError diagnosesSelectorClass` : `selectorClassTwo diagnosesSelectorClass`}
                  />

                  <FormHelperText>{invalid && message}</FormHelperText>
                </FormControl>
              )
            }}
          />
      }
    </>
  )
}

export default MultiSelector;
