// packages block
import { FC, useCallback, useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, FormControl, FormHelperText, InputLabel, Box } from "@material-ui/core";
// utils and interfaces/types block
import { requiredLabel, renderListOptions } from "../../utils";
import { INITIAL_PAGE_LIMIT, ITEM_MODULE } from '../../constants'
import { ItemSelectorProps, SelectorOption } from "../../interfacesTypes";
import { SnoMedCodesPayload, useSearchSnoMedCodesLazyQuery } from "../../generated/graphql";

const ItemSelector: FC<ItemSelectorProps> = ({ 
  name, label, disabled, isRequired, margin, modalName, searchQuery
}): JSX.Element => {
  const { control } = useFormContext()
  const [options, setOptions] = useState<SelectorOption[]>([])
  const [query, setQuery] = useState<string>('')

  const [getSnoMedCodes] = useSearchSnoMedCodesLazyQuery({
    variables: {
      searchSnoMedCodesInput: {
        paginationOptions: { page: 1, limit: searchQuery ? 10 : INITIAL_PAGE_LIMIT },
        searchTerm: query ? query : searchQuery ? searchQuery : ''
      }
    },

    onError() {
      return null;
    },

    onCompleted(data) {
      if (data) {
        const { searchSnoMedCodeByIcdCodes } = data

        if (searchSnoMedCodeByIcdCodes) {
          const { snoMedCodes } = searchSnoMedCodeByIcdCodes

          !!snoMedCodes && setOptions(renderListOptions(snoMedCodes as SnoMedCodesPayload['snoMedCodes']))
        }
      }
    },
  })

  const fetchList = useCallback(async () => {
    try {
      if (modalName === ITEM_MODULE.snoMedCode) await getSnoMedCodes();
    } catch (error) { }
  }, [getSnoMedCodes, modalName])

  useEffect(() => {
    fetchList()
  }, [fetchList, searchQuery, query])
  
  return (
    <Controller
      rules={{ required: true }}
      name={name}
      control={control}
      defaultValue={options[0]}
      render={({ field, fieldState: { invalid, error: { message } = {} } }) => {
        return (
          <Autocomplete
            options={options.length ? options : []}
            disableClearable
            value={field.value}
            disabled={disabled}
            getOptionLabel={(option) => option.name || ""}
            renderOption={(option) => option.name}
            renderInput={(params) => (
              <FormControl fullWidth margin={margin || 'normal'} error={Boolean(invalid)}>
                {JSON.stringify(options)}
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
                  onChange={({ target: { value }}) => value.length > 2 && setQuery(value) }
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

export default ItemSelector;
