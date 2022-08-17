// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { LoincCodesPayload, useFindAllLoincCodesLazyQuery } from "../../../generated/graphql";
import { FacilitySelectorProps, SelectorOption } from "../../../interfacesTypes";
import { renderTests, requiredLabel } from "../../../utils";
import AutocompleteTextField from "../AutocompleteTextField";

const TestsSelector: FC<FacilitySelectorProps> = ({ name, label, disabled, isRequired, addEmpty, onSelect, filteredOptions }): JSX.Element => {
  const { control } = useFormContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loincCodes, setLoincCodes] = useState<LoincCodesPayload['loincCodes']>([])
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderTests(loincCodes ?? [])] : [...renderTests(loincCodes ?? [])]

  const [findAllLoincCodes, { loading }] = useFindAllLoincCodesLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setLoincCodes([])
    },

    onCompleted(data) {
      const { findAllLoincCodes } = data || {};

      if (findAllLoincCodes) {
        const { loincCodes } = findAllLoincCodes
        loincCodes && setLoincCodes(loincCodes as LoincCodesPayload['loincCodes'])
      }
    }
  });

  const fetchAllLoincCodes = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllLoincCodes({
        variables: { searchLoincCodesInput: { ...pageInputs, searchTerm: searchQuery } }
      })
    } catch (error) { }
  }, [findAllLoincCodes, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllLoincCodes()
    }
  }, [searchQuery, fetchAllLoincCodes]);

  const filterOptions = (options: SelectorOption[]) => {
    if (filteredOptions) {
      return options.filter((value) => !filteredOptions.some(option => option.id === value.id))
    }

    return options
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
            options={updatedOptions ?? []}
            value={field.value}
            disabled={disabled}
            disableClearable
            filterOptions={filterOptions}
            getOptionLabel={(option) => option.name || ""}
            getOptionSelected={(option, value) => option.id === value.id}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>
                </Box>

                <AutocompleteTextField
                  invalid={invalid}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  params={params}
                  loading={loading}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => {
              field.onChange(data)
              onSelect && onSelect(data)
              return
            }}
          />
        );
      }}
    />
  );
};

export default TestsSelector;
