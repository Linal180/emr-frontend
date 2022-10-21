// packages block
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
// components block
import AutocompleteTextField from "../AutocompleteTextField";
// utils and interfaces/types block
import { renderCvxs, requiredLabel } from "../../../utils";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { CvxSelectorProps, SelectorOption } from "../../../interfacesTypes";
import { FindAllCvxPayload, useFindAllCvxLazyQuery } from "../../../generated/graphql";

const CvxSelector: FC<CvxSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, onSelect, filteredOptions, placeHolder
}): JSX.Element => {

  const { control } = useFormContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [cvxCodes, setCvxCodes] = useState<FindAllCvxPayload['cvxs']>([])
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderCvxs(cvxCodes ?? [])] : [...renderCvxs(cvxCodes ?? [])]

  const [findAllCvxCodes, { loading }] = useFindAllCvxLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setCvxCodes([])
    },

    onCompleted(data) {
      const { findAllCvx } = data || {};

      if (findAllCvx) {
        const { cvxs } = findAllCvx
        cvxs && setCvxCodes(cvxs as FindAllCvxPayload['cvxs'])
      }
    }
  });

  const fetchAllCvxCodes = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllCvxCodes({
        variables: { findAllCvxInput: { ...pageInputs, searchQuery } }
      })
    } catch (error) { }
  }, [findAllCvxCodes, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllCvxCodes()
    }
  }, [searchQuery, fetchAllCvxCodes]);

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

export default CvxSelector;
