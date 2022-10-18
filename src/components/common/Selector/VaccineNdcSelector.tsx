// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// components block
import AutocompleteTextField from "../AutocompleteTextField";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { FindAllNdcVaccineProductsPayload, useFindAllVaccineProductNdcLazyQuery } from "../../../generated/graphql";
import { VaccineProductNdcSelectorProps, SelectorOption } from "../../../interfacesTypes";
import { renderVaccineProductNdcs, requiredLabel } from "../../../utils";

const VaccineProductNdcSelector: FC<VaccineProductNdcSelectorProps> = ({
  name, label, disabled, isRequired, addEmpty, onSelect, filteredOptions, placeHolder, vaccineProductId
}): JSX.Element => {

  const { control } = useFormContext()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [ndcCodes, setNdcCodes] = useState<FindAllNdcVaccineProductsPayload['ndcVaccineProducts']>([])
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderVaccineProductNdcs(ndcCodes ?? [])] : [...renderVaccineProductNdcs(ndcCodes ?? [])]

  const [findAllNdcCodes, { loading }] = useFindAllVaccineProductNdcLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setNdcCodes([])
    },

    onCompleted(data) {
      const { findAllNdcVaccineProducts } = data || {};

      if (findAllNdcVaccineProducts) {
        const { ndcVaccineProducts } = findAllNdcVaccineProducts
        ndcVaccineProducts && setNdcCodes(ndcVaccineProducts as FindAllNdcVaccineProductsPayload['ndcVaccineProducts'])
      }
    }
  });

  const fetchAllNdcCodes = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      await findAllNdcCodes({
        variables: { findAllNdcVaccineProductsInput: { ...pageInputs, searchQuery, vaccineProductId: vaccineProductId } }
      })
    } catch (error) { }
  }, [findAllNdcCodes, searchQuery, vaccineProductId])

  useEffect(() => {
    if ((!searchQuery.length || searchQuery.length > 2) && vaccineProductId) {
      fetchAllNdcCodes()
    }
  }, [searchQuery, fetchAllNdcCodes, vaccineProductId]);

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

export default VaccineProductNdcSelector;
