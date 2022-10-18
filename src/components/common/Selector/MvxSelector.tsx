// packages block
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
// components block
import AutocompleteTextField from "../AutocompleteTextField";
// utils and interfaces/types block
import { renderMvxs, requiredLabel } from "../../../utils";
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { MvxSelectorProps, SelectorOption } from "../../../interfacesTypes";
import { FindAllMvxPayload, useFindAllMvxLazyQuery } from "../../../generated/graphql";

const MvxSelector: FC<MvxSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, onSelect, filteredOptions, placeHolder, mvxCode
}): JSX.Element => {

  const { control } = useFormContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mvxCodes, setMvxCodes] = useState<FindAllMvxPayload['mvxs']>([])
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderMvxs(mvxCodes ?? [])] : [...renderMvxs(mvxCodes ?? [])]

  const [findAllMvxCodes, { loading }] = useFindAllMvxLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setMvxCodes([])
    },

    onCompleted(data) {
      const { findAllMvx } = data || {};

      if (findAllMvx) {
        const { mvxs } = findAllMvx
        mvxs && setMvxCodes(mvxs as FindAllMvxPayload['mvxs'])
      }
    }
  });

  const fetchAllMvxCodes = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllMvxCodes({
        variables: { findAllMvxInput: { ...pageInputs, searchQuery, mvxCode: mvxCode } }
      })
    } catch (error) { }
  }, [findAllMvxCodes, searchQuery, mvxCode])

  useEffect(() => {
    if ((!searchQuery.length || searchQuery.length > 2) && mvxCode) {
      fetchAllMvxCodes()
    }
  }, [searchQuery, fetchAllMvxCodes, mvxCode]);

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

export default MvxSelector;
