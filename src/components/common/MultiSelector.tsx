//package block
import { FC } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField, Chip } from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";
//utils, interfaceTypes
import { requiredLabel } from "../../utils";
import { MultiSelectInterface } from "../../interfacesTypes";

const MultiSelector: FC<MultiSelectInterface> = ({ Options, label, name, placeHolder, errors }): JSX.Element => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { invalid } }) => {
        return (
          <Autocomplete
            multiple
            onChange={(_, data) => {
              field.onChange(data)
            }}
            value={field.value}
            id={`${name}${label}`}
            options={Options.map((option) => option.label)}
            freeSolo
            filterSelectedOptions
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  key={`${option}-${index}`}
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={requiredLabel(label)}
                placeholder={placeHolder}
                error={invalid}
                helperText={invalid && errors}
              />
            )}
          />
        );
      }}
    />
  )
}

export default MultiSelector
