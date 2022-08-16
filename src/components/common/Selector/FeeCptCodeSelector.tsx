// packages block
import { Box, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// utils and interfaces/types block
import { DROPDOWN_PAGE_LIMIT, EMPTY_OPTION } from "../../../constants";
import { AllCptFeeSchedulesPayload, useFindAllCptFeeScheduleLazyQuery } from "../../../generated/graphql";
import { ItemSelectorOption, ItemSelectorProps } from "../../../interfacesTypes";
import { renderFeeCPTCodes, requiredLabel, sortingValue } from "../../../utils";
import AutocompleteTextField from "../AutocompleteTextField";

const FeeCPTCodesSelector: FC<ItemSelectorProps> = ({ name, label, disabled, isRequired, addEmpty, feeScheduleId, onSelect, filteredOptions }): JSX.Element => {
  const { control } = useFormContext()
  const [feeCptCodes, setFeeCptCodes] = useState<AllCptFeeSchedulesPayload['cptFeeSchedules']>()
  const [searchQuery, setSearchQuery] = useState('')
  const updatedOptions = addEmpty ? [EMPTY_OPTION, ...renderFeeCPTCodes(feeCptCodes ?? [])] : [...renderFeeCPTCodes(feeCptCodes ?? [])]

  const [findAllCptFeeSchedule, { loading }] = useFindAllCptFeeScheduleLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setFeeCptCodes([])
    },

    onCompleted(data) {

      const { findAllCptFeeSchedule } = data || {};
      const { cptFeeSchedules } = findAllCptFeeSchedule || {}

      cptFeeSchedules && setFeeCptCodes(cptFeeSchedules as AllCptFeeSchedulesPayload['cptFeeSchedules'])
    }
  });

  const fetchAllCptCodes = useCallback(async () => {
    try {
      const pageInputs = { paginationOptions: { page: 1, limit: DROPDOWN_PAGE_LIMIT } }
      feeScheduleId && await findAllCptFeeSchedule({
        variables: { findAllCptFeeScheduleInput: { ...pageInputs, searchString: searchQuery, feeScheduleId } }
      })
    } catch (error) { }
  }, [feeScheduleId, findAllCptFeeSchedule, searchQuery])

  useEffect(() => {
    if (!searchQuery.length || searchQuery.length > 2) {
      fetchAllCptCodes()
    }
  }, [searchQuery, fetchAllCptCodes]);

  const filterOptions = (options: ItemSelectorOption[]) => {
    if (filteredOptions) {
      return options.filter((value) => !filteredOptions.some(option => option.id === value.name?.split(" |")[0]))
    }

    return options
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: isRequired }}
      defaultValue={updatedOptions[0] ?? []}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            filterOptions={filterOptions}
            options={updatedOptions.length ? sortingValue(updatedOptions) : []}
            disableClearable
            disabled={disabled}
            value={field.value}
            renderOption={(option) => `${option.name || ""} ${option.description || ''}`}
            getOptionLabel={(option) => '--'}
            noOptionsText="CPT code is not in the fee schedule"
            renderInput={(params) => (
              <FormControl fullWidth margin='normal' error={Boolean(invalid)}>
                <Box position="relative">
                  <InputLabel id={`${name}-autocomplete`} shrink>
                    {isRequired ? requiredLabel(label) : label}
                  </InputLabel>
                </Box>
                <AutocompleteTextField
                  invalid={invalid}
                  onChange={({ target }) => setSearchQuery(target.value)}
                  params={params}
                  loading={loading}
                />

                <FormHelperText>{message}</FormHelperText>
              </FormControl>
            )}
            onChange={(_, data) => {
              onSelect && onSelect(data)
              field.onChange(data)
            }}
          />
        );
      }}
    />
  );
};

export default FeeCPTCodesSelector;
