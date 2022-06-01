// packages block
import { FC, useCallback, useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { renderTests, requiredLabel } from "../../../utils";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { FacilitySelectorProps } from "../../../interfacesTypes";
import { LoincCodesPayload, useFindAllLoincCodesLazyQuery } from "../../../generated/graphql";

const TestsSelector: FC<FacilitySelectorProps> = ({ name, label, disabled, isRequired, addEmpty }): JSX.Element => {
  const { control } = useFormContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [loincCodes, setLoincCodes] = useState<LoincCodesPayload['loincCodes']>([])
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderTests(loincCodes ?? [])] : [...renderTests(loincCodes ?? [])]

  const [findAllLoincCodes] = useFindAllLoincCodesLazyQuery({
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
      const pageInputs = { paginationOptions: { page:1, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllLoincCodes({
        variables: { searchLoincCodesInput: { ...pageInputs, searchTerm: searchQuery} }
      })
    } catch (error) { }
  }, [findAllLoincCodes, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllLoincCodes()
    }
  }, [searchQuery, fetchAllLoincCodes]);

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
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>
                </Box>
                <TextField
                  {...params}
                  variant="outlined"
                  error={invalid}
                  className="selectorClass"
                  onChange={(event) => setSearchQuery(event.target.value)}
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

export default TestsSelector;
