// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// components block
import AutocompleteTextField from "../AutocompleteTextField";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { FindAllNdcPayload, useFindAllNdcLazyQuery } from "../../../generated/graphql";
import { NdcSelectorProps, SelectorOption } from "../../../interfacesTypes";
import { renderNdcs, requiredLabel } from "../../../utils";

const NdcSelector: FC<NdcSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, onSelect, filteredOptions, placeHolder
}): JSX.Element => {

  const { control } = useFormContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [ndcCodes, setNdcCodes] = useState<FindAllNdcPayload['ndcs']>([])
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderNdcs(ndcCodes ?? [])] : [...renderNdcs(ndcCodes ?? [])]

  const [findAllNdcCodes, { loading }] = useFindAllNdcLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setNdcCodes([])
    },

    onCompleted(data) {
      const { findAllNdc } = data || {};

      if (findAllNdc) {
        const { ndcs } = findAllNdc
        ndcs && setNdcCodes(ndcs as FindAllNdcPayload['ndcs'])
      }
    }
  });

  const fetchAllNdcCodes = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllNdcCodes({
        variables: { findAllNdcInput: { ...pageInputs, searchQuery } }
      })
    } catch (error) { }
  }, [findAllNdcCodes, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllNdcCodes()
    }
  }, [searchQuery, fetchAllNdcCodes]);

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
                  placeHolder={placeHolder}
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

export default NdcSelector;
