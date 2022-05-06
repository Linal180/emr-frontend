// packages block
import { FC } from "react";
import AsyncSelect from 'react-select/async';
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { FormControl, FormHelperText, InputLabel } from "@material-ui/core";
// utils and interfaces/types block
import { renderOptionsForSelector, requiredLabel } from "../../utils";
import { EMPTY_OPTION } from "../../constants";
import { SelectorOption } from "../../interfacesTypes";

interface AsyncSelectorProps {
  name: string
  label: string
  error?: string
  disabled?: boolean
  addEmpty?: boolean
  isRequired?: boolean
  isMultiple?: boolean
  value?: SelectorOption
  options: SelectorOption[]
  fetchData: (input: string) => void;
}

const AsyncSelector: FC<AsyncSelectorProps> = ({ name, label, options, disabled, isRequired, addEmpty, fetchData }): JSX.Element => {
  const { control } = useFormContext()
  const formattedOptions = renderOptionsForSelector(options)
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...formattedOptions] : [...formattedOptions]

  const promiseOptions = (input: string, callback: (options: any) => void) => {
    const filteredInput = input.replace(/\W/g, '')
    filteredInput.length > 2 && fetchData(filteredInput)
  }

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
                <InputLabel id={`${name}-autocomplete`} shrink>
                  {isRequired ? requiredLabel(label) : label}
                </InputLabel>

                <AsyncSelect
                  isMulti
                  cacheOptions
                  defaultOptions={updatedOptions}
                  loadOptions={promiseOptions}
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

export default AsyncSelector;
